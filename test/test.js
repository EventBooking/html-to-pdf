var htmlToPdf = require('../index.js'),
    fs = require("fs"),
    Stopwatch = require("timer-stopwatch");

function convertHtml(name, cb) {
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
            cb();
        });
    });
}

var timer = new Stopwatch();
timer.start();
convertHtml('test', function () {
    timer.stop();
    console.log(timer.ms + 'ms');
});
