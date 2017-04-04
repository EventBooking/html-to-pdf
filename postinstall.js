const fs = require('fs'),
    path = require('path')
    exec = require('child_process').exec;

var wkhtmltopdf = path.join(__dirname, "./bin/wkhtmltopdf");
//fs.chownSync(wkhtmltopdf, 0111, 0000);
exec(`chmod +x ${wkhtmltopdf}`);