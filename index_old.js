var conversion = require("phantom-html-to-pdf")(),
    phantomjs = require("phantomjs-prebuilt"),
    cheerio = require('cheerio'),
    fs = require("fs"),
    minify = require("html-minifier").minify,
    strip = require("strip-comment");

function getBuffer(stream, callback) {
    var buffer;
    stream.on('data', function (data) {
        buffer = data;
    });
    stream.on('end', function () {
        callback(buffer);
    });
}

function fixImport(html) {
    
    html = html.replace('url("//', 'url("');
    return html;
}

function sanitize(html) {
    if (html == null)
        return null;

    html = fixImport(html);

    var $ = cheerio.load(html);
    
    var $head = $('head');
    $head.prepend('<style type="text/css">html{zoom: 0.53;}</style>');
    
    return $.html();
}

exports.convert = function (event, context, callback) {

    event.header = sanitize(event.header);
    event.html = sanitize(event.html);
    event.footer = sanitize(event.footer);
    event.phantomPath = phantomjs.path;

    conversion(event, function (err, pdf) {
        if (err) {
            console.log(err);
            callback(err);
            return;
        }

        getBuffer(pdf.stream, function (buffer) {
            if (callback) {
                var base64 = buffer.toString('base64');
                callback(err, {
                    data: base64
                });
            }
        })

        conversion.kill();
    });
}
