var express  = require('express');
var router  = express.Router();
var mongojs = require('mongojs');
var ObjectId = mongojs.ObjectId;
var db = mongojs("mongodb://localhost:27017/Recipes");


router.get('/login', function(req, res, next){
  return res.render('loginOrRegister.html', {errors:null});
});

router.post('/loginInputData', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

   req.checkBody("username", "Username is required!").notEmpty();
   req.checkBody("password", "Password is required!").notEmpty();

   var errors = req.validationErrors();


    if(errors)
        return res.render('loginOrRegister.html', {errors:errors});

  db.users.findOne({username: username, password: password}, function (err, user){
    if(err)
    {
      //console.log(err);
      res.send(err);
    }
  
    if(user)
    {
        req.session.userId = user._id;
        return res.render('user.html',  {user:user}); 
      //req.session.user = user;
    }
    errors = new Array();
    errors.push({ param: ' ', msg: 'No such user exists!', value: ' ' })

    return res.render('loginOrRegister.html', {errors:errors}); 

  
    

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

    // { param: 'getparam', msg: 'Invalid getparam', value: '1ab' } - Format sa error "objekta" sa oficijalne stranice za validator

    if(errors)
        return res.render('loginOrRegister.html', {errors:errors});

    db.users.findOne({username: username}, function (err, userByUsername){

        if(userByUsername)
        {
            errors = new Array();
            errors.push({ param: ' ', msg: 'Username is already taken!', value: ' ' })
            return res.render('loginOrRegister.html', {errors:errors});
        }
           

         db.users.findOne({email: email}, function (err, userByEmail){
                if(userByEmail)
                    {
                        errors = new Array();
                        errors.push({ param: ' ', msg: 'Email is already taken!', value: ' ' })
                        return res.render('loginOrRegister.html', {errors:errors});
                    }

               
                    var nextId = getNextSequence("userid");
                    db.users.insert({"_id": nextId, "username":username, "password":password, "email":email, "profilePicture":" ", "favoriteRecipes":[], "shortDescription":" "}, function(err, result) {

                        if(err)
                            res.send(err);
                        
                        //da bi ga ulogovalo cim se USPESNO registruje...
                        req.session.userId = ObjectId(nextId);
                        var user = {_id: ObjectId(nextId), username:username, password:password, email:email, profilePicture:" ", favoriteRecipes:[], shortDescription:" "}
                        
                        return res.render('user.html',  {user:user});

                    });
              
        });

    });
});


function getNextSequence(name) {
  db.counters.findAndModify(       
          {
            query: { _id: name },
            update: { $inc: { seq: 1 } },
            new: true,
            
          },
          function(err, ret) {if(err) return -1; return ret.seq;}
   );

}

module.exports = router;