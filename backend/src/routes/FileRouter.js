const express = require('express');
const router = express.Router();

router.post('/create', FileController.uploadFile.createFolder);
router.post('/upload', FileController.uploadFile);

module.exports = router;