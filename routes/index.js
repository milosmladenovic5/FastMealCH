var express  = require('express');
var router  = express.Router();
var mongojs = require('mongojs');
var db = mongojs("mongodb://localhost:27017/Recipes");


router.get('/', function(req, res, next){
  res.render('index.html');
});

router.post('/Ingredients', function(req, res, next){
  db.ingredients.find(function(err, ingredients){
    if(err){
      res.send(err);
    }
    res.json(ingredients);
  })
});

router.get('/Recipes', function(req, res, next){
  db.recipes.find(function(err, recipes){
    if(err)
    {
      res.send(err);
    }
    res.json(recipes);
  });
});

router.get('/GetRecipe/:name', function(req, res){
  db.recipes.findOne({name: req.params.name}, function(err, recipe){
    if(err)
      res.send(err);
    
    res.json(recipe);
  });
});

router.post('/login', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  db.user.findOne({username: username, password: password}, function (err, user){
    if(err)
    {
      //console.log(err);
      return res.status(500).send();
    }
    
    if(!user)
    {
      return res.status(404).send();
    }

    req.session.user = user;
    //return res.status(200).send();

  });

});
module.exports = router;
