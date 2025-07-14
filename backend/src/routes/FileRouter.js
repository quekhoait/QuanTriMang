const router = require('express').Router();
const multer = require('multer');
const {
    createFile,
    getUserFiles,
    getUserFile,
    deleteUserFile,
    getFileType,
    createFileShare,
    getFileShare,
    getUserFileShare,
    changePermissionFileShare

} = require('../controller/FileController');
const uploadLimiter = require('../Middleware/uploadLimiter');



const upload = multer();


//  api/file
router.post('/upload', uploadLimiter,upload.single('file'), createFile);
router.get('/listFile/:userId/:parentFolderId', getUserFiles);
router.get('/oneFile/:userId/:fileId',getUserFile);
router.delete('/deleteFile',deleteUserFile);
router.get('/getFileType/:userId/:type', getFileType);
router.post('/createFileShare',uploadLimiter, createFileShare);
router.get('/receivedFileShare/:userId', getFileShare);
router.get('/sharedFile/:userId', getUserFileShare);
router.put('/changePermissionFileShare', changePermissionFileShare);



module.exports = router;