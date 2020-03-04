module.exports = function(app) {
  // const helmet = require('helmet')

  // RATE-LIMIT
  // const redisClient = require('redis').createClient();
  // const limiter = require('express-limiter')(app, redisClient);
  // // Limit requests to 100 per hour per ip address.
  // limiter({
  //   lookup: ['connection.remoteAddress'], total: 100, expire: 1000 * 60 * 60
  // })

  // const csrf = require('csurf')
  // app.use(csrf())
  // app.use(function(req, res, next){ 
  //   // Expose variable to templates via locals
  //   res.locals.csrftoken = req.csrfToken(); 
  //   next()
  // })
  // // <input type="hidden" name="<i>csrf" value={{csrftoken}} />
  return this
}
