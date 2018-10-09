const express = require ('express'),
  U = require('../util/util'),
  DB = require ('../models'),
  passport = require('passport'),
  router = express.Router ()
;

router.get('/', passport.authenticate('bearer', {session: false}), (req, res, next) => {
  const offset = req.query.offset || 0
  const limit = req.query.limit || 20
  const filter = JSON.parse(req.query.filter)

  DB.code.findAndCountAll({
    where: {
      ...filter,
      userId: req.user.id,
    },
    offset,
    limit
  }).then(({rows, count}) => {
    res.json({
      count,
      codes: rows
    })
  })
})

router.get ('/:id', (req, res, next) => {
  DB.code.findById(req.params.id, {
    attributes: ['language', 'code', ['custom_input', 'customInput'], ['file_name', 'fileName'] ]
  })
  .then (code => res.json (code))
  .catch (error => console.error (error))
})


router.post('/', U.authenticateOrPass, (req, res, next) => {
  const {language, code, customInput, filename} = req.body
  DB.code.create({
    language,
    code,
    custom_input: customInput,
    file_name: filename,
    userId: req.user ? req.user.id : null
  }, {
    returning: true
  })
    .then(code => res.json(code))
    .catch(error => console.error(error))
})

module.exports = router;
