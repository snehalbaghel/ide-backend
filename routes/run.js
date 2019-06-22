const express = require('express')
const router = express.Router()
const passport = require('passport')
const { run } = require('../util/judge')
const U = require('../util/util')
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 100 requests per windowMs
  keyGenerator: (req) => {
    return (req.user && req.user.id) || req.headers['x-real-ip'] || req.connection.remoteAddress;
  }
})


router.post('/run', U.authenticateOrPass, limiter, async (req, res) => {
  try {
    const { source, input, lang } = req.body
    const resp = await run(lang, source, input)
    res.json(resp)
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
})

module.exports = router
