var conversion = require("phantom-html-to-pdf")(),
    phantomjs = require("phantomjs-prebuilt"),
    cheerio = require('cheerio'),
    fs = require("fs"),
    froala_css = './bower_components/froala-wysiwyg-editor/css/froala_style.css';

function getHtml($, $styles, section) {
    var $view = $('<div class="fr-view"></div>');
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

    fs.readFile(froala_css, 'utf8', function (err, css) {
        var $styles = $('<style type="text/css"></style>').text(css);

        var options = {
            header: getHtml($, $styles, 'header'),
            html: getHtml($, $styles, 'content'),
            footer: getHtml($, $styles, 'footer'),
            phantomPath: phantomjs.path
        }

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
    });
}