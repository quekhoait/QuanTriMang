const router = require('express').Router();
const multer = require('multer');
const {
    createFile,
    getUserFiles,
    getUserFile,
    deleteUserFile,
    getFileType
} = require('../controller/FileController');



const upload = multer();


//  api/file
router.post('/upload', upload.single('file'), createFile);
router.get('/listFile/:userId/:parentFolderId', getUserFiles);
router.get('/oneFile/:userId/:fileId',getUserFile);
router.delete('/deleteFile',deleteUserFile);
router.get('/getFileType/:userId/:type', getFileType);

module.exports = router;