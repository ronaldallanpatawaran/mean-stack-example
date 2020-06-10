const Post = require('../models/post')

exports.createPost = (req, res, next)=>{
  const url = req.protocol + '://' + req.get('host')
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + '/images/' + req.file.filename,
    creator: req.userData.userId
  })
  post.save()
    .then((createdPost)=> {
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
    .catch(error=> {
      res.status(500)
        .json({
          message: 'Creating post failed!'
        })
    })
}

exports.getPosts = (req, res)=>{
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
  .catch(error=> {
    res.status(500)
      .json({
        message: 'Couldn\'t get posts!'
      })
  })
}

exports.getPost = (req, res)=>{
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
}

exports.updatePost = (req, res)=> {
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
    Post.updateOne({_id: req.body.id, creator: req.userData.userId}, post)
      .then((result)=> {
        if (result.n > 0) {
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
      .catch(error=> {
        res.status(500)
          .json({
            message: 'Couldn\'t update post!'
          })
      })
}

exports.deletePost = (req, res)=> {
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
    .catch(error=> {
      res.status(500)
        .json({
          message: 'Couldn\'t delete post!'
        })
    })
}
