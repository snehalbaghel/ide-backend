const request = require('request-promise');
const secrets    = require('../config/config.json')[process.env.NODE_ENV || 'development'];
const models = require('../models');
const uid = require('uid');

var response_token;
module.exports = {
  login: async (req, res, next) => {
    const options = {
      method: 'POST',
      uri: 'https://account.codingblocks.com/oauth/token',
      body: {
        "client_id" : secrets.clientId,
        "redirect_uri" : secrets.callbackURL,
        "client_secret" : secrets.clientSecret,
        "grant_type" : "authorization_code",
        "code"  : req.query.code
      },
      json: true
    };
    request(options)
      .then(Res => {
        console.log(Res);
        response_token = Res.access_token
        const options = {
          method: 'GET',
          uri: 'https://account.codingblocks.com/api/users/me',
          headers: {
            "Authorization" : `Bearer ${response_token}`
          },
          json: true
        };
        request(options)
          .then(data => {
            models.Token.findOrCreate({
              where: {
                accesstoken: response_token
              },
              defaults: {
                accesstoken: response_token,
                clienttoken: uid(16),
                User: {
                  oneauthId: data.id,
                  username: data.username,
                  firstname: data.firstname, 
                  lastname: data.lastname
                }
              },
              include: [models.User]
            }).then(function (tokenrow) {
            tokenrow = tokenrow[0].get()
            tokenrow.User = tokenrow.User.get()
            res.json({"token":tokenrow.clienttoken})
          }).catch(function (err) {
            console.log(err);
            res.status(401).send("Unauthorised");
          })
      });
    })
  },

  me: async (req, res, next) => {
    if (!req.user) 
      return res.status(401).send("Unauthorised");
    else {
      res.json(req.user);
    }
  },
  logout: async (req, res, next) => {
    models.Token.destroy({
      where: {
        clienttoken: req.headers.token
      }
    }).then(() => {
      res.send("success");
    }).catch((err) => {
      console.log(err);
      res.status(500).send("Server Error")
    })
  }
}