const rp = require('request-promise')
const { get_nonce, get_auth_token } = require('./auth')
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];

const run = (lang, source, input) => {
  const nonce = get_nonce()
  const token = get_auth_token(nonce, config.clientSecrets['judge-backend'])
  const options = {
    method: 'POST',
    uri: 'https://judge.codingblocks.xyz/api/submission',
    headers: {
      'x-Client-Name': 'ide-backend',
      'x-Auth-Nonce': nonce,
      'x-Auth-Token': token
    },
    body: {
      lang,
      source,
      test_count: 1,
      input,
      expected_output: [''],
      get_output: true,
      wait: true
    },
    json: true // Automatically stringifies the body to JSON
  };
  return rp.post(options)
}

module.exports = {
  run
}
