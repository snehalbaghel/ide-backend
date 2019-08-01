const rp = require('request-promise')
const { get_nonce, get_auth_token } = require('./auth')
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];

const getHeaders = function() {
  
  const nonce = get_nonce()
  const token = get_auth_token(nonce, config.clientSecrets['judge-backend'])

  return {
    'x-Client-Name': 'ide-backend',
    'x-Auth-Nonce': nonce,
    'x-Auth-Token': token,
    'Authorization': 'Bearer 7718330d2794406c980bdbded6c9dc1d',
  }

}

const run = (lang, source, input) => {
  const nonce = get_nonce()
  const token = get_auth_token(nonce, config.clientSecrets['judge-backend'])
  const options = {
    method: 'POST',
    uri: config.judge2API,
    headers: getHeaders(),
    body: {
      lang,
      source,
      test_count: 1,
      input,
      expected_output: [''],
      get_output: true,
      wait: true,
      mode: "poll",
    },
    json: true // Automatically stringifies the body to JSON
  };
  return rp.post(options)
}

module.exports = {
  run,
  getHeaders,
}
