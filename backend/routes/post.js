const express = require('express')

const router = express.Router()
const Post = require('../models/post')

router.post('', (req, res, next)=>{
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

router.get('/', (req, res)=>{
  Post.find()
  .then((documents)=> {
    res.status(200)
      .json({
        message: 'Post fetched successfully!',
        posts: documents
      })
  })
})

router.get('/:id', (req, res)=>{
  Post.findById(req.params.id)
  .then((post)=> {
    if (post) {
      return res.status(200)
        .json({
          message: 'Post fetched successfully!',
          posts: post
        })
    }
    res.status(404)
      .json({
        message: 'Post not found!'
      })
  })
})

router.patch('/:id', (req, res)=> {
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

router.delete('/:id', (req, res)=> {
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

module.exports = router
