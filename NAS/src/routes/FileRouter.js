const express = require('express');
const { uploadFile, getFileByKey } = require('../controller/FileController');
const router = express.Router();

router.post('/upload',uploadFile);
router.get('/demo',getFileByKey);
module.exports = router;