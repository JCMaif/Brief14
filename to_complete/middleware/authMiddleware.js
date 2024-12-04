const jwt = require('jsonwebtoken');
const config = require('../config.js');
const secret = config.jwtSecret;

module.exports = function(req, res, next) {
  // TODO: Récupérer le token dans les cookies et vérifier s'il est valide avec la méthode `jwt.verify`
  // TODO: Si le token est invalide, retourner une erreur 401
  // TODO: Si le token est valide, ajouter le contenu décodé du token dans `req.user`
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