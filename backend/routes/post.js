const express = require('express')
const multer = require('multer')

const router = express.Router()

const checkAuthentication = require('../middlewares/check-authentication')
const extractFile = require('../middlewares/file-upload')

const Post = require('../models/post')

const {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost
}  = require('../controllers/post')

router.post('', checkAuthentication, extractFile, createPost)

router.get('/', getPosts)

router.get('/:id', getPost)

router.patch('/:id', checkAuthentication, extractFile, updatePost)

router.delete('/:id', checkAuthentication, deletePost)

module.exports = router
