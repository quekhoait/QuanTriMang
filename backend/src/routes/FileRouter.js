const router = require('express').Router();
const multer = require('multer');
const {
    createFile,
    getUserFiles,
    getUserFile,
    deleteUserFile
} = require('../controller/FileController');



const upload = multer();


//  api/file
router.post('/upload', upload.single('file'), createFile);
router.get('/listFile/:userId/:parentFolderId', getUserFiles);
router.get('/oneFile/:userId/:fileId',getUserFile);
router.get('/deleteFile/:userId/:fileId',deleteUserFile);


module.exports = router;