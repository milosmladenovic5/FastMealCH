var express  = require('express');
var router  = express.Router();

router.get('/recepee', function(req, res, next){
  res.render('recepee.html');
});

module.exports = router;
