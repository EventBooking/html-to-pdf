var cheerio = require('cheerio'),
    path = require('path'),
    utils = require("./utils.js");

async function convert(encodedHtml, options) {
    var html = utils.decodeHtml(encodedHtml);
    var $ = cheerio.load(html);

    var styles = await utils.readFile(path.join(__dirname, 'styles.css'), 'utf-8');
    var $styles = $('<style type="text/css"></style>').text(styles);
    $("head").append($styles);

    var content = utils.fixImport($.html());
    var buffer = await utils.render(content, options);

    var base64 = buffer.toString('base64');
    return base64;
}

exports.convert = convert;