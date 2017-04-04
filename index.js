var wkhtmltopdf = require("wkhtmltopdf"),
    cheerio = require('cheerio'),
    fs = require("fs");

var port = process.argv.length > 2 ? parseInt(process.argv[2]) : 80;
wkhtmltopdf.command = "./bin/wkhtmltopdf";

function readFile(name, type) {
    return new Promise((resolve, reject) => {
        fs.readFile(name, type, (error, content) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(content);
        });
    });
}

function render(content, args) {
    var options = {
        orientation: args.orientation || "landscape",
        pageSize: args.pageSize || 'Letter'
    };

    return new Promise((resolve, reject) => {
        var stream = wkhtmltopdf(content, options);

        var chunks = [];
        stream.on('data', data => {
            chunks.push(data);
        });

        stream.on('end', () => {
            var buffer = Buffer.concat(chunks);
            resolve(buffer);
        });
    });
}

function fixImport(html) {
    html = html.replace('url("//', 'url("http://');
    return html;
}

function decodeHtml(base64) {
    var buffer = new Buffer(base64, 'base64');
    var utf8 = buffer.toString('utf8');
    //console.log(`${utf8.substr(0, 100)}...${utf8.substr(utf8.length - 100, 100)}`);
    return utf8;
}

function convert(encodedHtml, options) {
    var $styles;
    return new Promise((resolve, reject) => {
        Promise.all([
            readFile('./styles.css', 'utf-8')
        ]).then(styles => {
            // ToDo: do something with the styles
            var html = decodeHtml(encodedHtml);
            var $ = cheerio.load(html);
            var $styles = $('<style type="text/css"></style>').text(styles.join(';'));
            $("head").append($styles);
            var htmlStr = $.html();
            return render(fixImport(htmlStr), options);
        }).then(buffer => {
            var base64 = buffer.toString('base64');
            resolve(base64);
        }).catch(error => {
            reject(error);
        });
    });
}

exports.convert = convert;