const request = require('request-promise');
const secrets = require('../secrets.json');
const DB = require ('./db');

module.exports = {
  login: (req, res, next) => {
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
        const options = {
          method: 'GET',
          uri: 'https://account.codingblocks.com/api/users/me',
          headers: {
            "Authorization" : `Bearer ${Res.access_token}`
          },
          json: true
        };
        request(options)
          .then(data => {
            req.session.user = data.id;
            req.session.save();
            DB.query (
              'select * from users where oneauthid = $1',
              [data.id]
            )
            .then (({ rows }) => {
              if(!rows[0]) {
                DB.query (
                  'insert into users (oneauthid, username, firstname, lastname) values ($1, $2, $3, $4) returning *',
                  [data.id, data.username, data.firstname, data.lastname]
                )
                .then (({ rows }) => console.log (rows[0]))
                .catch (error => console.error (error))
              }
              else console.log(rows[0])
              res.status(200).send("success");
            })
            .catch (error => console.error (error))
          });
      });
  },

  me: (req, res, next) => {
    if(req.session.user){
      DB.query (
        'select * from users where oneauthid = $1',
        [req.session.user]
      )
      .then (({ rows }) => {
        console.log(rows[0])
        res.send("success")
      })
      .catch (error => console.error (error)) 
    }
    else
      res.send("please login")
  },
  logout: async (req, res, next) => {
    console.log('I managed to log out!');
    req.session = null;
    res.redirect('/');
  }
}