var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var multer  = require('multer');
var fs = require("fs");

var index = require('./routes/index');
var user = require('./routes/user')

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
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));
//app.use(multer({dest:'./images/'}).single('singleInputFileName'));
app.use(express.static(path.join(__dirname, 'public')));

//session
app.use(session({secret:"password", resave:false, saveUninitialized:true}));


app.use('/', index);
app.use('/api', user);

app.listen(port, function(){
    console.log('Server started on port', + port);
})
