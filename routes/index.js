var express  = require('express');
var router  = express.Router();
var mongojs = require('mongojs');
var db = mongojs("mongodb://localhost:27017/Recepees");


router.get('/', function(req, res, next){
  res.render('index.html');
});

router.post('/Ingredients', function(req, res, next){
  db.ingredients.find(function(err, ingredients){
    if(err)
    {
      res.send(err);
    }
    res.json(ingredients);

  })
});

router.get('/Recepees', function(req, res, next){
  db.recepees.find(function(err, recepees){
    if(err)
    {
      res.send(err);
    }
    res.json(recepees);

  })
});

module.exports = router;
