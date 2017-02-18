var express  = require('express');
var router  = express.Router();
var mongojs = require('mongojs');

var db = mongojs("mongodb://localhost:27017/Recipes");


router.get('/', function(req, res, next){
  return res.render('index.html');
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
