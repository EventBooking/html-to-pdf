const converter = require('../index.js'),
    fs = require("fs"),
    Stopwatch = require("timer-stopwatch"),
    path = require('path');

async function convertHtml(name) {
    try {
        var data = fs.readFileSync(path.join(__dirname, `${name}.html`), 'utf8')
        var encodedHtml = Buffer.from(data).toString('base64');

        var options = {
            orientation: 'landscape'
        };

        var result = await converter.convert(encodedHtml, options);
        var buffer = new Buffer(result, 'base64');
        fs.writeFileSync(path.join(__dirname, `${name}.pdf`), buffer);

        return buffer;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

var fileName = process.argv.length > 2 ? process.argv[2] : 'test';

var timer = new Stopwatch();
timer.start();

convertHtml(fileName).then(() => {
    timer.stop();
    console.log(timer.ms + 'ms');
    process.exit(0);
}).catch(err => {
    timer.stop();
    console.error(err);
    process.exit(1);
});