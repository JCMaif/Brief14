const jwt = require('jsonwebtoken');
const config = require('../config.js');
const secret = config.jwtSecret;

module.exports = function(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).send('Unauthorized');
  }
  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).send('Unauthorized');
  }
};