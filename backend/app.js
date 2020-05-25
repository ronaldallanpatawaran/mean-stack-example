const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const path = require('path')

const postsRoutes = require('./routes/post')
const userRoutes = require('./routes/user')

const app = express();

mongoose.connect(
  'mongodb+srv://ronaldallanpatawaran:pDa5oc9r4AeDKOaZ@cluster0-souxd.mongodb.net/node-angular?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    }
  )
  .then(()=> {
    console.info('Connected to database!')
  }).catch(()=> {
    console.error('Failed to connect to database!')
  })

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use('/images', express.static(path.join('backend', 'images')))

app.use((req, res, next)=> {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
    )
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, OPTIONS'
    )
  return next()
})

app.use('/api/posts', postsRoutes)
app.use('/api/user', userRoutes)

module.exports = app;

