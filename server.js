var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var index = require('./routes/index');

var session = require('express-session');

var app = express();
var port = 8000;
//view engine

app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');
app.engine('html', require('ejs').renderFile);

//set static folder


//body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname, 'public')));

//session
app.use(session({secret:"Milos_SLEPI_DECAK12321321sdfsd", resave:false, saveUninitialized:true}));


app.use('/', index);

app.listen(port, function(){
    console.log('Server started on port', + port);
})
