const express = require('express');
const { uploadFile, getFileByKey, deleteFileByPath } = require('../controller/FileController');
const router = express.Router();

router.post('/upload',uploadFile);
router.get('/get-file', getFileByKey);
router.delete('/delete-file', deleteFileByPath);
module.exports = router;