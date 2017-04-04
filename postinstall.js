const fs = require('fs'),
    path = require('path');

fs.chownSync(path.join(__dirname, "./bin/wkhtmltopdf"), 0111);