const router = require('express').Router();
const multer = require('multer');
const {
    createFile
} = require('../controller/FileController');

const upload = multer();

router.post('/upload', upload.single('file'), createFile);

module.exports = router;