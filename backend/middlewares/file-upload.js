const multer = require('multer')

const mimeTypeMap = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
}

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

module.exports =  multer({ storage }).single('image')
