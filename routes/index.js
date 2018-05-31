var express = require('express');
var router = express.Router();
var UsersUtil = require('../util/users');
/* GET home page. */
router.get('/', function(req, res, next) {
  var sessData = req.session;
  sessData.user = null;
  res.render('index', { title: 'Express' });
});

router.route('/logout')
  .get(UsersUtil.logout);

router.route('/login')
  .get(UsersUtil.login);

module.exports = router;
