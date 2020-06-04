const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]
    const decodedToken = jwt.verify(token, 'KQ6EYQH7V9imvXc')
    req.userData = { email: decodedToken.email, userId: decodedToken.userId }
    return next()
  } catch (error) {
    return res.status(401).json({ message: 'You are not authenticated!' })
  }
}
