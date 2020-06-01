const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]
    jwt.verify(token, 'KQ6EYQH7V9imvXc')
    return next()
  } catch (error) {
    console.log(error)
    return res.status(401).json({ message: 'Auth failed!' })
  }
}
