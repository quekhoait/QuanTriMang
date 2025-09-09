const router = require('express').Router();
const multer = require('multer');
const {
    createFile,
    getUserFiles,
    getFileByKeyPath,
    deleteUserFile,
    getFileType,
    createFileShare,
    getFileShare,
    getUserFileShare,
    changePermissionFileShare,
    findFileByKeyWord,


} = require('../controller/FileController');

const { authMiddleware, uploadLimiter } = require("../authMiddleware/authMiddleware");


const storage = multer.memoryStorage(); // Lưu vào RAM thay vì ổ đĩa
const upload = multer({ storage: storage });

//  api/file

router.post('/upload', authMiddleware, uploadLimiter, upload.single('file'), createFile);
router.get('/listFile/:userId/:parentFolderId', authMiddleware, getUserFiles);
router.get('/oneFile', getFileByKeyPath);
router.delete('/deleteFile', authMiddleware, deleteUserFile);
router.get('/getFileType/:userId/:type',authMiddleware,  getFileType);
router.post('/createFileShare',authMiddleware, createFileShare);
router.get('/receivedFileShare/:userId',authMiddleware,  getFileShare);
router.get('/sharedFile/:userId',authMiddleware,  getUserFileShare);
router.put('/changePermissionFileShare', changePermissionFileShare);
router.get('/find-by-name', findFileByKeyWord);




module.exports = router;