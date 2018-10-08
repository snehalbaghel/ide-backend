const express = require ('express'),
  U = require('../util/util'),
  DB = require ('../models'),
  router = express.Router ()
;

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
