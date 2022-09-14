const {clearHash} = require('../services/cache');

module.exports = async (req,res,next) => {
  await next(); // After the route handler is complete
  clearHash(req.user.id);

};