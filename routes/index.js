var express  = require('express');
var router  = express.Router();
var mongojs = require('mongojs');
var ObjectId = mongojs.ObjectId;

var db = mongojs("mongodb://localhost:27017/Recipes");


router.get('/', function(req, res, next){

  if(req.session.userId === undefined || req.session.userId === null)
  {
      console.log("no session");
      var user = null;
      return res.render('index.html', {user:user});
  }
  else
  {
      console.log(req.session.userId);
      var userId = req.session.userId;
      db.users.findOne({_id: ObjectId(userId)}, function(err, user){
        console.log(user.username);
            return res.render('index.html',{user:user});
       }); 
  } 



});

router.get('/logout', function(req, res, next){
  req.session.userId = null;
  return res.render('index.html', {user:null});
});

router.post('/Ingredients', function(req, res, next){
  db.ingredients.find(function(err, ingredients){
    if(err){
      return res.send(err);
    }
    return res.json(ingredients);
  })
});

router.get('/Recipes', function(req, res, next){
  db.recipes.find(function(err, recipes){
    if(err)
    {
      return res.send(err);
    }
    return res.json(recipes);
  });
});

router.get('/GetRecipe/:name', function(req, res){
  db.recipes.findOne({name: req.params.name}, function(err, recipe){
    if(err)
      return res.send(err);
    
    return res.json(recipe);
  });
});



module.exports = router;
