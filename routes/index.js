var express = require('express');
var router = express.Router();

var User = require('../db/controller/user');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.route('/x')
    .get(function(req, res, next) {
      res.render('index', { title: 'Expreddddss' });
    })

module.exports = router;
