var express  = require('express');
var router  = express.Router();
var mongojs = require('mongojs');
var db = mongojs("mongodb://localhost:27017/Recipes");


router.get('/login', function(req, res, next){
  res.render('login.html');
});

router.post('/loginInputData', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  db.user.findOne({username: username, password: password}, function (err, user){
    if(err)
    {
      //console.log(err);
      res.send(err);
    }
  
    if(user)
      req.session.user = user;
    //res.render('user.html');
    res.send("KURCINA");

  });

});


module.exports = router;