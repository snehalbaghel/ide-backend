const express = require ('express'),
  DB = require ('../util/db'),
  router = express.Router ()
;

router.get ('/:id', (req, res, next) => {
  DB.query (
    'select id, language, code, custom_input as "customInput", file_name as "fileName" from codezzz where id = $1',
    [req.params.id]
  )
  .then (({ rows }) => res.json (rows[0]))
  .catch (error => console.error (error))
})

router.post ('/', (req, res, next) => {
  DB.query (
    'insert into codezzz (language, code, custom_input, file_name) values ($1, $2, $3, $4) returning *',
    [req.body.language, req.body.code, req.body.customInput, req.body.fileName]
  )
  .then (({ rows }) => res.json (rows[0]))
  .catch (error => console.error (error))
})

module.exports = router;
