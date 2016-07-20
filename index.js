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

function getHtml($, name) {
    var $section = $(name);
    if($section.length == 0)
        return null;
    return $.html($section);
}

function fixImport(html) {
    html = html.replace('url("//', 'url("');
    return html;
}

exports.convert = function (event, context, callback) {
    var html = fixImport(event.html);
    var $ = cheerio.load(html);

    var options = {
        header: getHtml($,'header'),
        html: getHtml($,'content'),
        footer: getHtml($,'footer'),
        phantomPath: phantomjs.path,
        paperSize: event.paperSize
    };

    conversion(options, function (err, pdf) {
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
