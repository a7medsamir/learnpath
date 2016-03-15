var express = require('express'),
    stylus = require('stylus'),
    logger = require('morgan'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose');


var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var app = express();

function compile(str, path) {
    return stylus(str).set('filename', path);
}

app.set('views', __dirname + '/server/views');
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(stylus.middleware({
    src: __dirname + '/public',
    compile: compile
}));
app.use(express.static(__dirname + '/public'));

//Database section
mongoose.connect('mongodb://localhost/learnpath');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error...'));
db.once('open', function callback() {
    console.log('learnpath db opened');
});
var courseSchema = mongoose.Schema({ name: String, price: Number });
var Course = mongoose.model('Course', courseSchema);
var mongoCourse;
Course.findOne().exec(function(err, courseDoc) {
    mongoCourse = courseDoc.name;
});

//angular section
app.get('/partials/:partialPath', function(req, res) {
    res.render('partials/' + req.params.partialPath);
})

app.get('*', function(req, res) {
    res.render('index', {
        mongoCourse: mongoCourse
    });
});

var port = 3030;
app.listen(port)
console.log('Listening on port ' + port + ' ...');
