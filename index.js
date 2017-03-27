var express = require("express"),
    bodyParser = require("body-parser"),
    wkhtmltopdf = require("wkhtmltopdf"),
    cheerio = require('cheerio'),
    fs = require("fs");

var port = process.argv.length > 2 ? parseInt(process.argv[2]) : 80;
wkhtmltopdf.command = "./bin/wkhtmltopdf";

var app = express();
app.use(bodyParser.urlencoded({ limit: "50mb", extended: false }));
app.use(bodyParser.json({ limit: "50mb" }));

app.post('/', function(req, res) {
    res.setTimeout(0);

    convert(req.body.html, req.body.args).then(result => {
        res.send({ data: result });
    }).catch(result => {
        res.status(500);
        res.send();
    });
});

var server = app.listen(port);

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

function convert(html, args) {
    // ToDo: header/footer

    // backward compat with original phantom render engine
    var $styles;

    return new Promise((resolve, reject) => {        
        Promise.all([
            readFile('styles.css', 'utf-8')
        ]).then(styles => {
            // ToDo: do something with the styles
            var $ = cheerio.load(html);
            var $styles = $('<style type="text/css"></style>').text(styles.join(';'));
            $("head").append($styles);
            var htmlStr = $.html();
            return render(fixImport(htmlStr), args);
        }).then(buffer => {
            var base64 = buffer.toString('base64');
            resolve(base64);
        }).catch(error => {
            reject(error);
        });
    });
}