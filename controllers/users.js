const request = require('request-promise');
const secrets    = require('../config/config.json')[process.env.NODE_ENV || 'development'];
const models = require('../models');
const uuidv4 = require('uuid/v4');

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
    try {
      const Res = await request(options)
      console.log(Res);
      response_token = Res.access_token
      const options2 = {
        method: 'GET',
        uri: 'https://account.codingblocks.com/api/users/me',
        headers: {
          "Authorization" : `Bearer ${response_token}`
        },
        json: true
      };
      try {
        const data = await request(options2);
        const user = await models.User.findOrCreate({
          where: {
            oneauthId: data.id
          },
          defaults: {
            oneauthId: data.id,
            username: data.username,
            firstname: data.firstname, 
            lastname: data.lastname
          }
        })
        const tokenrow = await models.Token.findOrCreate({
          where: {
            accesstoken: response_token
          },
          defaults: {
            accesstoken: response_token,
            clienttoken: uuidv4(),
            UserId: user[0].id
          },
          include: [models.User]
        });
        res.json({"token":tokenrow[0].clienttoken});
      } catch (error) {
        res.status(401).send("Unauthorised");
      }
    } catch (error) {
      res.status(401).send("Unauthorised");
    }
  },

  me: async (req, res, next) => {
    if (!req.user) 
      return res.status(401).send("Unauthorised");
    else {
      res.json(req.user);
    }
  },
  logout: async (req, res, next) => { 
    try {
      const header = req.headers.authorization.split(' ');
      const token = header[1];
      const destroyed = await models.Token.destroy({
        where: {
          clienttoken: token
        }
      })
      res.status(200).send("success");
    } catch (error) { 
      console.log(err);
      res.status(500).send("Server Error")
    }
  }
}