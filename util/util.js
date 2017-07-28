const requireFromEnvironment = (variable) => {
  let value = process.env[variable]

  if (! value) {
    console.error ("No $" + variable + " found in environment.")
    console.log ("You probably forgot to export the correct variables specified in util/environment.sh")
    process.exit (1)
  }

  return value
}

const setCorsHeaders = (request, response, next) => {
  response.setHeader ('Access-Control-Allow-Origin', '*' );
  response.setHeader ('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  response.setHeader ('Access-Control-Allow-Headers', 'X-Requested-With,content-type,api-key,user,user-id,access-token,oauth-id');
  response.setHeader ('Access-Control-Allow-Credentials', true);
  next ()
}

module.exports.requireFromEnvironment = requireFromEnvironment
module.exports.setCorsHeaders = setCorsHeaders
