var express = require('express');
var router = express.Router();
var UsersUtil = require('../controllers/users');
const passport = require('passport');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.get('/me', 
  passport.authenticate('bearer', { session: false }), UsersUtil.me);

module.exports = router;
