var express  = require('express');
var router  = express.Router();
var mongojs = require('mongojs');
var db = mongojs("mongodb://localhost:27017/Recipes");


router.get('/login', function(req, res, next){
  res.render('loginOrRegister.html');
});

router.post('/loginInputData', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  db.users.findOne({username: username, password: password}, function (err, user){
    if(err)
    {
      //console.log(err);
      res.send(err);
    }
  
    if(user)
      req.session.user = user;
    //res.render('user.html');
    res.send(req.session.user.username);

  });

});

router.post('/register', function(req, res, next){
    var username = req.body.username;
    var password = req.body.password;
    var email = req.body.email;
    var confirm_password = req.body.confirm_password;

    req.checkBody("username", "Username is required!").notEmpty();
    req.checkBody("password", "Password is required!").notEmpty();
    req.checkBody("email", "Email is required!").notEmpty();
    req.checkBody("email", "Email is not valid!").isEmail();
    req.checkBody("confirm_password", "Password confirmation is required!").notEmpty();
    req.checkBody("confirm_password", "Passwords do not match!").equals(req.body.password);

    var errors = req.validationErrors();

    

    if(errors)
        res.render('loginOrRegister.html', {errors:errors});

    db.users.findOne({username: username}, function (err, userByUsername){

        if(userByUsername)
            res.render('loginOrRegister.html'); // eventualno posalji da user_name vec postoji(preko mrtvog templejta)?

         db.users.findOne({email: email}, function (err, userByEmail){
                if(userByEmail)
                    res.render('loginOrRegister.html'); // eventualno posalji da email vec postoji?

               
                    var nextId = getNextSequence("userid");
                    db.users.insert({"_id": nextId, "username":username, "password":password, "email":email, "profilePicture":" ", "favoriteRecipes":[], "shortDescription":" "}, function(err, result) {

                        if(err)
                            res.send(err);
                        
                       
                        req.session.user._id = nextId; // id je dovoljan
                       

                        res.send("USPESAN MRTVI REGISTER!");

                        //res.render('user.html');

                    });


              
        });

    });
});


function getNextSequence(name) {
   db.counters.findAndModify(       //  DJUBRE NE RADI KAKO TREBA IZ NEKOG RAZLOGA
          {
            query: { _id: name },
            update: { $inc: { seq: 1 } },
            new: true
          }
   );

   db.counters.findOne({_id: name}, function (err, ret){
    if(err)
        return -1;

   return ret.seq;
   });
}

module.exports = router;