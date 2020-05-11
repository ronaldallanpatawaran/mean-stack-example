const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const postsRoutes = require('./routes/post')

const app = express();

mongoose.connect('mongodb+srv://ronaldallanpatawaran:pDa5oc9r4AeDKOaZ@cluster0-souxd.mongodb.net/node-angular?retryWrites=true&w=majority')
  .then(()=> {
    console.info('Connected to database!')
  }).catch(()=> {
    console.error('Failed to connect to database!')
  })

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

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

module.exports = app;

