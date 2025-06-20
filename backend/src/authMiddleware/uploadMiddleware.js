const multer = require('multer')
const path = require('path')
const fs = require('fs')

const uploadDir = 'src/uploads'

const avatarDir = path.join(uploadDir, 'avatar');
if (!fs.existsSync(avatarDir)) {
  fs.mkdirSync(avatarDir, { recursive: true });
}

const avatarStorage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, avatarDir)
  },
  filename: function(req, file, cb){
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext)
  }
})

const uploadAvatar = multer({storage: avatarStorage})

module.exports = {
  uploadAvatar
}