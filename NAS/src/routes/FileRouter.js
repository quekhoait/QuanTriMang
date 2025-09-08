const express = require('express');
const { uploadFile, getFileByKey } = require('../controller/FileController');
const router = express.Router();

router.post('/upload',uploadFile);
router.get('/get-file', getFileByKey);
module.exports = router;