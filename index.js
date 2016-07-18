var conversion = require("phantom-html-to-pdf")(),
    phantomjs = require("phantomjs-prebuilt"),
    cheerio = require('cheerio'),
    fs = require("fs");

function getHtml($, $styles, section) {
    var $view = $('<div></div>');
    var $section = $(section);
    $view.append($styles);
    $view.append($section);
    return $.html($view);
}

function getBuffer(stream, callback) {
    var buffer;
    stream.on('data', function (data) {
        buffer = data;
    });
    stream.on('end', function () {
        callback(buffer);
    });
}

exports.convert = function (event, context, callback) {
    var $ = cheerio.load(event.html);
    var $styles = $('<style type="text/css"></style>').text(event.css);

    var options = {
        header: $('header').html(),
        html: $('content').html(),
        footer: $('footer').html(),
        phantomPath: phantomjs.path,
        paperSize: event.paperSize
    };

    conversion(options, function (err, pdf) {
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