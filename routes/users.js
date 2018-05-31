var express = require('express');
var router = express.Router();
var UsersUtil = require('../util/users');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.route('/me')
  .get( UsersUtil.me);

module.exports = router;
