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

const verify_token = (nonce, received_token, secret) => {
  if (!nonce || nonce.indexOf('|')===-1) {
    throw new Error({
      message: 'Nonce in Wrong Format',
      status: 403
    })
  }

  const timestamp = nonce.split('|')[0]

  const expiration_seconds = 300;
  const tolerance_seconds = 60;

  const now = Math.floor(Date.now()/1000);

  if(timestamp >= now + tolerance_seconds){
    throw new Error({
      message: "API auth_token timestamp is too far in the future",
      status: 403
    })
  } else if (timestamp < now - expiration_seconds){
    throw new Error({
      message: "API auth_token has expired.",
      status: 403
    })
  }

  const hash = crypto.createHash('sha256');
  const auth_token = hash.update(String(nonce) + String(secret)).digest('hex');

  if (!received_token || received_token !== auth_token) {
    throw new Error({
      message: "auth_token is missing or not valid",
      status: 403
    })
  }

  return true
}

module.exports = {
  get_nonce,
  get_auth_token,
  verify_token
}
