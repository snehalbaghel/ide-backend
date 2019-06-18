const express = require('express')
const router = express.Router()
const passport = require('passport')
const { run } = require('../util/judge')
const base64 = require('base-64')

router.options('*', (req, res) => {
  res.status(204).send('OK')
})

router.post('/run', passport.authenticate('bearer', {session: false}), async (req, res) => {
  try {
    const { source, input, lang } = req.body
    console.log('running')
    const resp = await run(lang, source, input)
    console.log(resp)
    res.json(resp)
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
})

module.exports = router
