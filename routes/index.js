var express  = require('express');
var router  = express.Router();
var mongojs = require('mongojs');
var db_R = mongojs("mongodb://localhost:27017/Recepees");
var db_I = mongojs("mongodb://localhost:27017/Ingredients");

router.get('/', function(req, res, next){
  res.render('index.html');
});

router.post('/Ingredients', function(req, res, next){
  db.Ingredients.find(function(err, ingredients){
    if(err)
    {
      res.send(err);
    }
    res.json(ingredients);

  })
});


module.exports = router;
