var conversion = require("phantom-html-to-pdf")(),
    phantomjs = require("phantomjs-prebuilt"),
    cheerio = require('cheerio'),
    fs = require("fs");

function getHtml($, $styles, section) {
    var $view = $('<div class="fr-view"></div>');
    var $section = $(section);
    $view.append($styles);
    $view.append($section);
    return $.html($view);
}

function convert(html, cb) {
    var $ = cheerio.load(html);

    fs.readFile('./bower_components/froala-wysiwyg-editor/css/froala_style.css', 'utf8', function (err, css) {
        var $styles = $('<style type="text/css"></style>').text(css);

        var options = {
            header: getHtml($, $styles, 'header'),
            html: getHtml($, $styles, 'content'),
            footer: getHtml($, $styles, 'footer'),
            phantomPath: phantomjs.path
        }

        conversion(options, function (err, pdf) {
            if (cb) {
                cb(err, pdf);
            }
            conversion.kill();

        });
    });
}

module.exports = convert;