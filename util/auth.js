const crypto = require('crypto')

const get_nonce = () => {
  let possible = "abcdefghijklmnopqrstuvwxyz0123456789";
  let text = String(Math.floor(Date.now()/1000))+'|';
  for(let i = 0; i < 20; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
 
const get_auth_token = (nonce, secret) => {
  const hash = crypto.createHash('sha256');
  let token = hash.update(String(nonce) + String(secret)).digest('hex');
  return (token);
};

module.exports = {
  get_nonce,
  get_auth_token
}
