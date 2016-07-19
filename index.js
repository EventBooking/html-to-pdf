var conversion = require("phantom-html-to-pdf")(),
    phantomjs = require("phantomjs-prebuilt"),
    cheerio = require('cheerio'),
    fs = require("fs");

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

    var options = {
        header: $('header').html(),
        html: $('content').html(),
        footer: $('footer').html(),
        phantomPath: phantomjs.path,
        paperSize: event.paperSize
    };

    // console.log(options);

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