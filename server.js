var express = require("express"),
    bodyParser = require("body-parser"),
    converter = require("./index")

var app = express();
app.use(bodyParser.urlencoded({ limit: "50mb", extended: false }));
app.use(bodyParser.json({ limit: "50mb" }));

app.post('/', function (req, res) {
    res.setTimeout(0);

    var model = req.body;
    converter.convert(model.html, model.options).then(result => {
        res.send({ data: result });
    }).catch(error => {
        console.error(error);
        res.status(500);
        res.send();
    });
});

var server = app.listen(port);