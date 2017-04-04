const path = require('path')
    exec = require('child_process').exec;

var wkhtmltopdf = path.join(__dirname, "./bin/wkhtmltopdf");
exec(`chmod +x ${wkhtmltopdf}`);