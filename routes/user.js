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
    var nextId = getNextSequence("recipeid");

    db.recipes.findOne({"name": recipeName}, function (err, recipe){
        if(recipe)
        {
            var alert = "There is already a recipe with the same name.";
            return res.json(alert);
        }

        db.recipes.insert({"_id": nextId, "name":recipeName, "ingredients":ingredients, "estimatedTime":preparationTime, "image":"/images/1.jpg", "wayOfPreparation":prepDescription}, function(err, result) {
            if(err)
            {
                return res.send(err);
                console.log("error");
            }
            console.log("not error");
            return res.json();
        });
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

router.post('/file_upload', upload.single('pic'), function (req, res) {

   console.log(req.file.filename);
   console.log(req.file.path);
   console.log(req.file.type);

  
   return res.end( JSON.stringify( req.file.filename ) );
   
})




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