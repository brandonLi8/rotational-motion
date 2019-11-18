var express = require('express');
var app = express();
var path = require('path');

app.use(express.static(path.join(__dirname)));
app.use("/styles", express.static(__dirname));
app.use("/images", express.static(__dirname + '/images'));
app.use("/scripts", express.static(__dirname + '/scripts'));
app.use("/node_modules", express.static(__dirname + '/node_modules'));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + 'index.html'));
});

app.listen(process.env.PORT || 8000);