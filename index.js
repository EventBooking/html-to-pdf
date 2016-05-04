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

function convert(event, context, callback) {
    var $ = cheerio.load(event.html);

    fs.readFile('./bower_components/froala-wysiwyg-editor/css/froala_style.css', 'utf8', function (err, css) {
        var $styles = $('<style type="text/css"></style>').text(css);

        var options = {
            header: getHtml($, $styles, 'header'),
            html: getHtml($, $styles, 'content'),
            footer: getHtml($, $styles, 'footer'),
            phantomPath: phantomjs.path
        }

        conversion(options, function (err, pdf) {
            if (callback) {
                callback(err, pdf);
            }
            conversion.kill();
        });
    });
}

module.exports = convert;