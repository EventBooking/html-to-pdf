var converter = require('../converter.js'),
    fs = require("fs"),
    Stopwatch = require("timer-stopwatch");

function convertHtml(name) {
    return new Promise((resolve, reject) => {
        fs.readFile('./test/' + name + '.html', 'utf8', function (err, data) {
            if (err) {
                console.log(err);
                return;
            }

            var buffer = new Buffer(data, 'utf8');
            var encodedHtml = buffer.toString('base64');

            var options = {
                orientation: 'landscape'
            };

            converter.convert(encodedHtml, options).then(result => {
                var buffer = new Buffer(result, 'base64');
                fs.writeFileSync('./test/' + name + '.pdf', buffer);
                resolve();
            }).catch(err => {
                console.log(err);
                reject(err);
            });
        });
    });
}

var timer = new Stopwatch();
timer.start();
convertHtml('test').then(() => {
    timer.stop();
    console.log(timer.ms + 'ms');
});;