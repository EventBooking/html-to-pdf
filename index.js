var wkhtmltopdf = require("wkhtmltopdf"),
    cheerio = require('cheerio'),
    fs = require("fs");

wkhtmltopdf.command = "./bin/wkhtmltopdf";

function getBuffer(stream) {
    return new Promise((resolve, reject) => {
        fs.writeFile(name, content, error => {
            if (error) {
                reject(error);
                return;
            }
            resolve(name);
        });
    });
}

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

function writeFile(name, content) {
    return new Promise((resolve, reject) => {
        fs.writeFile(name, content, error => {
            if (error) {
                reject(error);
                return;
            }
            resolve(name);
        });
    });
}

function render(content, options) {
    return new Promise((resolve, reject) => {
        wkhtmltopdf(content, options, (error, stream) => {
            if (error) {
                reject(error);
                return;
            }

            var chunks = [];
            stream.on('data', data => {
                chunks.push(data);
            });

            stream.on('end', () => {
                var buffer = Buffer.concat(chunks);
                resolve(buffer);
            });

        });
    });
}

function fixImport(html) {
    
    html = html.replace('url("//', 'url("http://');
    return html;
}

exports.convert = function (event, context, callback) {
    // ToDo: header/footer

    // backward compat with original phantom render engine
    var paperSize = event.paperSize || {};

    var options = {
        marginLeft: "10mm",
        marginRight: "10mm",
        orientation: paperSize.orientation
    };

    var $styles;

    Promise.all([
        readFile('styles.css', 'utf-8')
    ]).then( styles => {
        // ToDo: do something with the styles
        var $ = cheerio.load(event.html);
        var $styles = $('<style type="text/css"></style>').text(styles.join(';'));
        $("head").append($styles);
        var html = $.html();
        return render(fixImport(html), options);
    }).then(buffer => {
        var base64 = buffer.toString('base64');
        callback(null, { data: base64 });
    }).catch(error => {
        callback(error);
    });
}