const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

exports.createUser =  (req, res, next) => {
  const hashedPassword = bcrypt.hashSync(req.body.password, 10)
  const user = new User({
    email: req.body.email,
    password: hashedPassword
  })

  user.save()
    .then((result)=> {
      res.status(201).json({
        message: 'User created!',
        result: result
      })
    })
    .catch((err)=> {
      res.status(500).json({
        message: 'Invalid authentication credentials!'
      })
    })
}

exports.loginUser = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user)=> {
      if (!user) {
        return res.status(401).json({
          message: 'Invalid authentication credentials!'
        })
      }
      const hashedPassword = user.password
      if (bcrypt.compareSync(req.body.password, hashedPassword)) {
        const token = jwt.sign(
          {
            email: user.email,
            userId: user._id
          },
          'KQ6EYQH7V9imvXc',
          { expiresIn: '1h' }
        )
        return res.status(200).json({
          message: 'Auth successful!',
          token: token,
          expiresIn: 3600,
          userId: user._id
        })
      } else {
        return res.status(401).json({
          message: 'Invalid authentication credentials!'
        })
      }
    })
}
