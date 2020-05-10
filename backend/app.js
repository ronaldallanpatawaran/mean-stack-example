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
  post.save().then((createdData)=> {
    res.status(201)
      .json({
        message: 'Post added successfully',
        postId: createdData._id
      })
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

app.patch('/api/posts/:id', (req, res)=> {
  const post = new Post(
      {
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content
      }
    )
    Post.updateOne({ _id: req.params.id }, post).then((result)=> {
      console.log(result)
      res.status(200)
      .json({
        message: 'Post successfully updated!',
        postId: result._id
      })
    })
})

app.delete('/api/posts/:id', (req, res)=> {
  const postId = req.params.id
  Post.deleteOne({ _id: postId })
    .then(()=> {
      res.status(200)
      .json({
        message: 'Post successfully deleted!',
        postId
      })
    })
})

module.exports = app;

