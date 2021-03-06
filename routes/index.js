var express  = require('express');
var router  = express.Router();
var mongojs = require('mongojs');
var ObjectId = mongojs.ObjectId;

var db = mongojs("mongodb://localhost:27017/Recipes");


router.get('/', function(req, res, next){

  if(req.session.userId === undefined || req.session.userId === null)
  {
      var user = {userStatus:1};
      return res.render('index.html', {user:user});
  }
  else
  {
      var userId = req.session.userId;
      db.users.findOne({_id: ObjectId(userId)}, function(err, user){
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
  db.recipes.findOne({name: req.params.name}, function(err, recipe1){
    if(err)
      return res.send(err);

    var recipe = recipe1;
    
      var userId = req.session.userId;
      console.log(userId);

      if(userId === undefined || userId === null)
      {
        var recipeExtended = {_id:recipe._id, name:recipe.name, ingredients:recipe.ingredients, estimatedTime:recipe.estimatedTime, image:recipe.image, wayOfPreparation:recipe.wayOfPreparation, userStatus:1 };
        return res.json(recipeExtended);
      }
      db.users.findOne({_id: ObjectId(userId)}, function(err, user){
        console.log(user.username);

        var recipeExtended;

        if(user.favoriteRecipes.indexOf(recipe.name) === -1)
            recipeExtended = {_id:recipe._id, name:recipe.name, ingredients:recipe.ingredients, estimatedTime:recipe.estimatedTime, image:recipe.image, wayOfPreparation:recipe.wayOfPreparation, userStatus:2 };
        else
            recipeExtended = {_id:recipe._id, name:recipe.name, ingredients:recipe.ingredients, estimatedTime:recipe.estimatedTime, image:recipe.image, wayOfPreparation:recipe.wayOfPreparation, userStatus:3 };

        return res.json(recipeExtended);

        
      // userStatus : 1 - korisnik nije ulogovan
      //              2 - korisnik je ulogovan i nema recept u svojoj listi
      //              3 - korisnik je ulogovan i ima recept u svojoj listi
    
    
      });
  });
});



module.exports = router;
