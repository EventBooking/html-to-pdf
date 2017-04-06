var wkhtmltopdf = require("wkhtmltopdf"),
    fs = require("fs"),
    path = require('path'),
    Stream = require('stream');

wkhtmltopdf.command = path.join(__dirname, "./bin/wkhtmltopdf");

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
        pageSize: args.pageSize || 'Letter',
        debug: args.debug
    };

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

            stream.on('error', err => {
                console.error('failed: ', err);
                reject(err);
            });

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

module.exports = {
    readFile: readFile,
    render: render,
    fixImport: fixImport,
    decodeHtml: decodeHtml
};