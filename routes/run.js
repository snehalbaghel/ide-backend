const express = require('express')
const router = express.Router()
const { run } = require('../util/judge')

router.post('/run', async (req, res) => {
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
