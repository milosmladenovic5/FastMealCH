var express  = require('express');
var router  = express.Router();
var mongojs = require('mongojs');
var ObjectId = mongojs.ObjectId;
var db = mongojs("mongodb://localhost:27017/Recipes");
var multer  = require('multer');
var upload = multer({dest:'./public/images/'});
var fs = require("fs");


router.get('/login', function(req, res, next){
  var regData = {username:" ", password:" ", email:" ", cpassword:" " };
  return res.render('loginOrRegister.html', {errors:null, regData:regData});
});




router.post('/submitRecipe', function(req, res, next){
    var recipeName = req.body.recipeName;
    var preparationTime = req.body.recipePrepTime;
    var ingredients = req.body[ 'ingredients[]'];
    var prepDescription = req.body.prepDescription;
    var image = req.body.image;
    var nextId = getNextSequence("recipeid");

    var username = req.session.username;

    db.recipes.findOne({"name": recipeName}, function (err, recipe){
        if(recipe)
        {
            var alert = "There is already a recipe with the same name.";
            return res.json(alert);
        }

        db.recipes.insert({"_id": nextId, "name":recipeName, "ingredients":ingredients, "estimatedTime":preparationTime, "image":image, "wayOfPreparation":prepDescription}, function(err, result) {
            if(err)
            {
                return res.send(err);
                console.log("error");
            }

            db.users.update({"username":username}, {$push: {"addedRecipes":recipeName}}, function(err,data){
                console.log("kucina");
               return res.json();
            });

        });
    });
});



router.post('/updateUserInfo', function(req, res){
    console.log("function called");

    var userPass = req.body.userPass;
    var userEmail = req.body.userEmail;
    var username = req.body.username;
    var userPic = req.body.userPic;
    var shortDescription = req.body.shortDescription;
    
    console.log(userPass);

    db.users.update({"username":username}, {$set: {email:userEmail, profilePicture:userPic, password:userPass, shortDescription:shortDescription}} , function(err,user){
            if(err)
            {
                res.send(err);
            }
  
            if(user)
            {   
               
                db.users.findOne({username: username}, function (err, user){
                     console.log(username);
                       return res.render('user.html',  {user:user});  
                });
            }
    });
});


router.get('/myProfile', function(req, res){
    var username = req.session.username;
    var password = req.session.password;
    
     db.users.findOne({username: username, password: password}, function (err, user){
        if(err)
        {
        //console.log(err);
        res.send(err);
        }
    
        if(user)
        {
            console.log(user);
            return res.render('user.html',  {user:user}); 
        //req.session.user = user;
        }
     });
});

router.post('/loginInputData', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  req.checkBody("username", "Username is required!").notEmpty();
  req.checkBody("password", "Password is required!").notEmpty();

  var errors = req.validationErrors();
  var regData = {username:" ", password:" ", email:" ", cpassword:" " };

  if(errors)
     return res.render('loginOrRegister.html', {errors:errors, regData:regData});

  db.users.findOne({username: username, password: password}, function (err, user){
    if(err)
    {
      //console.log(err);
      res.send(err);
    }
  
    if(user)
    {
        req.session.userId = user._id;
        req.session.username = user.username;
        req.session.password = user.password;
        console.log(user.addedRecipes);
        return res.render('user.html',  {user:user}); 
      //req.session.user = user;
    }
    errors = new Array();
    errors.push({ param: ' ', msg: 'No such user exists!', value: ' ' })

    return res.render('loginOrRegister.html', {errors:errors, regData:regData}); 
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
    var regData = {username:username, password:password, email:email, cpassword:confirm_password };

    // { param: 'getparam', msg: 'Invalid getparam', value: '1ab' } - Format  error "objekta" sa oficijalne stranice za validator

    if(errors)
        return res.render('loginOrRegister.html', {errors:errors, regData:regData});

    db.users.findOne({username: username}, function (err, userByUsername){

        if(userByUsername)
        {
            errors = new Array();
            errors.push({ param: ' ', msg: 'Username is already taken!', value: ' ' })
            return res.render('loginOrRegister.html', {errors:errors, regData:regData});
        }
           

         db.users.findOne({email: email}, function (err, userByEmail){
                if(userByEmail)
                    {
                        errors = new Array();
                        errors.push({ param: ' ', msg: 'Email is already taken!', value: ' ' })
                        return res.render('loginOrRegister.html', {errors:errors, regData:regData});
                    }

               
                    var nextId = getNextSequence("userid");
                    db.users.insert({"_id": nextId, "username":username, "password":password, "email":email, "profilePicture":" ", "favoriteRecipes":[""], "addedRecipes":[""], "shortDescription":" "}, function(err, result) {

                        if(err)
                            res.send(err);
                        
                        //da bi ga ulogovalo cim se USPESNO registruje...
                        db.users.findOne({username: username}, function (err, user){
                        
                        req.session.userId = user._id;
                        return res.render('user.html',  {user:user});
                        });

                    });
              
        });

    });
});

router.post('/file_upload', upload.single('pic'), function (req, res) {
   return res.end( JSON.stringify( req.file.filename ) );   
});

router.post('/addToFavorites', function (req, res) {
      var userId = req.session.userId;
      var recipeName = req.body.recipeName;
      db.users.update({_id: ObjectId(userId)},  { $push: { favoriteRecipes: recipeName } } , function(err,user){
            return res.end("Success!!");
       }); 
});


router.post('/removeFromFavorites', function (req, res) {
      var userId = req.session.userId;
      var recipeName = req.body.recipeName;
      db.users.update({_id: ObjectId(userId)},  { $pull: { favoriteRecipes: recipeName } } , function(err,user){
            return res.end("Success!!");
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