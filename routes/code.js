const express = require ('express'),
  U = require('../util/util'),
  DB = require ('../models'),
  passport = require('passport'),
  router = express.Router (),
  minio = require('../services/minio'),
  config = require('../config/config.json')[process.env.NODE_ENV || 'development']
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

router.get ('/:id', async (req, res, next) => {
  const dbCode = await DB.code.findById(req.params.id, {
    attributes: ['id', 'title', 'language', ['custom_input', 'customInput'], ['file_name', 'fileName'] ]
  })

  //get code from minio
  const stream = await minio.getObject(config.minio.bucket, dbCode.id + '/code.txt')
  
  // extract complete code from stream
  dbCode.code = await U.getDataFromStream(stream)

  res.json (dbCode)
})


router.post('/', U.authenticateOrPass, async (req, res, next) => {
  const {id, language, code, customInput, filename} = req.body
  const title = req.body.title || 'Untitled'

  if (id && req.user.id) {
    // we have a codeId and user is authenticated -> we can update this code 
    // instead of creating a new one

    //check if this code belongs to current user
    let dbCode = await DB.code.findById(id)
    if (dbCode && dbCode.userId === req.user.id) {
      dbCode.set("language", language)
      dbCode.set("code", code)
      dbCode.set("custom_input", customInput)
      dbCode.set("file_name", filename)
      dbCode.set("title", title)
      await dbCode.save()
      // save to minio
      await minio.putObject(config.minio.bucket, dbCode.id + '/code.txt', code)
      return res.json(dbCode)
    }
  }


  // else just create a new one
  dbCode = await DB.code.create({
    language,
    title,
    code: '',
    custom_input: customInput,
    file_name: filename,
    userId: req.user ? req.user.id : null
  }, {
    returning: true
  })
  
  await minio.putObject(config.minio.bucket, dbCode.id + '/code.txt' , code)

  res.json(dbCode)
})

module.exports = router;
