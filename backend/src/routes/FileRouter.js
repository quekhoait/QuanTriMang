const router = require('express').Router();
const multer = require('multer');
const {
    createFile,
    getUserFiles,
    getUserFile
} = require('../controller/FileController');


const upload = multer();

router.post('/upload', upload.single('file'), createFile);
router.get('/listFile/:userId/:parentFolderId', getUserFiles);
router.get('/oneFile/:userId/:fileId',getUserFile);

module.exports = router;