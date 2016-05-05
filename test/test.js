var htmlToPdf = require('../index.js'),
    fs = require("fs");



function convertHtml(name) {
    fs.readFile('./test/' + name + '.html', 'utf8', function (err, data) {
        if (err) {
            console.log(err);
            return;
        }
        htmlToPdf.convert({
            html: data
        }, null, function (err, result) {
            if (err) {
                console.log(err);
                return;
            }
            
            var buffer = new Buffer(result.data, 'base64');
            fs.writeFileSync('./test/' + name + '.pdf', buffer);
        });
    });
}

convertHtml('test');