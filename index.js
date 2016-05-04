var conversion = require("phantom-html-to-pdf")(),
    phantomjs = require("phantomjs-prebuilt"),
    cheerio = require('cheerio');

function convert(html, cb) {
    var $ = cheerio.load(html);

    var options = {
        header: $('header').html(),
        html: $('content').html(),
        footer: $('footer').html(),
        phantomPath: phantomjs.path
    }

    conversion(options, function (err, pdf) {
        if (cb) {
            cb(err, pdf);
        }
        conversion.kill();
    });
}

module.exports = convert;