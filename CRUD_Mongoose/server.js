var colors = require('colors');
var path = require('path');
// console.log('hello'.green); // outputs green text
// console.log('i like cake and pies'.underline.red) // outputs red underlined text
// console.log('inverse the color'.inverse); // inverses the color
// console.log('OMG Rainbows!'.inverse.rainbow); // rainbow
// console.log('Run the trap'.trap); // Drops the bass
var morgan = require('morgan');
var express = require('express');


var app = express();

app.use(function (req, res, next) {
  console.log('Time:', Date.now());
  next();
});
app.use(express.static(path.join(__dirname, 'image')));
// start the server in the port 3000 !
app.listen(3000, function () {
    console.log('Example app listening on port 3000.');
});
morgan('combined')
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/test.html'));
});
app.get('/test', function(req, res) {
    res.send("Yahou");
});
module.exports = app;  

