const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const Post = require('./models/post')

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

app.post('/api/posts', (req, res, next)=>{
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  })
  post.save()
  res.status(201)
    .json({
      message: 'Post added successfully'
    })
})

app.get('/api/posts', (req, res, next)=>{
  Post.find()
  .then((documents)=> {
    res.status(200)
      .json({
        message: 'Post fetched successfully!',
        posts: documents
      })
  })
})

app.delete('/api/posts/:id', (req, res)=> {
  const id = req.params.id
  Post.deleteOne(id)
    .then((response)=> {
      res.status(200)
      .json({
        message: 'Post successfully deleted!'
      })
    })
})

module.exports = app;

