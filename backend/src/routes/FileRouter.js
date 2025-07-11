const router = require('express').Router();
const multer = require('multer');
const {
    createFile,
    getUserFiles,
    getUserFile,
    deleteUserFile,
    getFileType,
    shareFile,
    getFileShare,
    getFileReceive
} = require('../controller/FileController');



const upload = multer();


//  api/file
router.post('/upload', upload.single('file'), createFile);
router.get('/listFile/:userId/:parentFolderId', getUserFiles);
router.get('/oneFile/:userId/:fileId',getUserFile);
router.delete('/deleteFile',deleteUserFile);
router.get('/getFileType/:userId/:type', getFileType);
router.post('/shareFile/:userId/:fileId/:userIdRece', shareFile)
router.get('/getFileShare/:userId', getFileShare)
router.get('/getFileReceive/:userIdRece', getFileReceive)


module.exports = router;