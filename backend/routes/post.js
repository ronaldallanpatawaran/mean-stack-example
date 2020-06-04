const express = require('express')
const multer = require('multer')

const router = express.Router()

const mimeTypeMap = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
}

const Post = require('../models/post')
const checkAuthentication = require('../middlewares/check-authentication')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = mimeTypeMap[file.mimetype]
    let error = new Error('Invalid mime type.')
    if (isValid) {
      error = null
    }
    cb(error, 'backend/images')
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-')
    const ext = mimeTypeMap[file.mimetype]
    cb(null, name + '-' + Date.now() + '-' + ext)
  }
})

router.post('',
  checkAuthentication,
  multer({ storage })
  .single('image'), (req, res, next)=>{
  const url = req.protocol + '://' + req.get('host')
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + '/images/' + req.file.filename,
    creator: req.userData.userId
  })
  post.save().then((createdPost)=> {
    res.status(201)
      .json({
        message: 'Post added successfully',
        post: {
          id: createdPost._id,
          title: createdPost.title,
          content: createdPost.content,
          imagePath: createdPost.imagePath,
          __v: createdPost.__v
        }
      })
  })
})

router.get('/', (req, res)=>{
  const currentPage = req.query.page ? +req.query.page : 1
  const pageSize = req.query.pageSize ? +req.query.pageSize : 1000

  Post.find()
  .skip(pageSize * (currentPage - 1))
  .limit(pageSize)
  .then((documents)=> {
    fetchedDocuments = documents
    return Post.countDocuments()
  })
  .then((postCount)=> {
    res.status(200)
      .json({
        message: 'Post fetched successfully!',
        posts: fetchedDocuments,
        postCount
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

router.patch('/:id',
  checkAuthentication,
  multer({ storage })
  .single('image'), (req, res)=> {
  let imagePath
  if (req.file) {
    const url = req.protocol + '://' + req.get('host')
    imagePath = url + '/images/' + req.file.filename
  } else {
    imagePath = req.body.imagePath
  }
  const post = new Post(
      {
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath,
        creator: req.userData.userId
      }
    )
    Post.updateOne({_id: req.body.id, creator: req.userData.userId}, post).then((result)=> {
      if (result.nModified > 0) {
        res.status(200)
        .json({
          message: 'Post successfully updated!',
          postId: req.params.id
        })
      } else {
        res.status(401)
        .json({
          message: 'Not Authorized!'
        })
      }
    })
})

router.delete('/:id', checkAuthentication, (req, res)=> {
  const postId = req.params.id
  Post.deleteOne({ _id: postId, creator: req.userData.userId })
    .then((result)=> {
      if (result.n > 0) {
        res.status(200)
        .json({
          message: 'Post successfully deleted!',
          postId: req.params.id
        })
      } else {
        res.status(401)
        .json({
          message: 'Not Authorized!'
        })
      }
    })
})

module.exports = router
