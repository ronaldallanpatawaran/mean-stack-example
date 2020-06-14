const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const path = require('path')
const cors = require('cors')

const postsRoutes = require('./routes/post')
const userRoutes = require('./routes/user')

require('dotenv').config({path: path.join(__dirname, '.env')})

const app = express()

mongoose.connect(
  `mongodb+srv://${process.env.MONGO_ATLAS_USER}:${process.env.MONGO_ATLAS_PW}@cluster0-souxd.mongodb.net/node-angular?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    }
  )
  .then(()=> {
    console.info('Connected to database!')
  }).catch((err)=> {
    console.error('Failed to connect to database!', err)
  })

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())
app.use('/public/images', express.static(path.join('public', 'images')))

app.use((req, res, next)=> {
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
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

