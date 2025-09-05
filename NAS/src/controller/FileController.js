const multer = require('multer');
const path = require('path');
const fs = require('fs');
const ParentFolder = 'Demo';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        //tạo đường dẫn thư mục của user và parentFolder
        console.log("========" + req.query.userId);
        const userId = req.query.userId || 'unknow';
        const uploadPath = path.join(ParentFolder, `User_${userId}`);
        //tạo đường dẫn nếu chưa tồn tại
        fs.mkdirSync(uploadPath, { recursive: true });

        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
})

const upload = multer({ storage: storage }).single('file');

const uploadFile = async (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            console.error('Lỗi khi upload:', err);
            return res.status(500).json({ message: 'Upload thất bại', error: err });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'Không có file nào được gửi lên' });
        }

        // Nếu thành công, multer sẽ lưu file và gắn info vào req.file
        return res.status(200).json({
            message: 'Upload thành công',
            file: {
                originalname: req.file.originalname,
                filename: req.file.filename,
                path: req.file.path,
                size: req.file.size
            }
        });
    });
};

const getFileByKey = async (req, res) => {
    //C:\Users\Latitude 3400\Workspace\2025\Test\QuanTriMang2\QuanTriMang\NAS\src\controller\Demo\User_1\1757085628580-illust_126291174_20250413_2238151.jpg
    try {
        const filePath = req.query.path; // ?path=D:/NAS_STORAGE/user_1/1693748293_baocao.pdf
        res.sendFile(filePath); // cần root để Express resolve tuyệt đối
    } catch (err) {
        console.error('Lỗi khi demo:', err);
        res.status(500).json({ error: 'Lỗi khi demo.', info: err.message });
    }
}

module.exports = {
    uploadFile,
    getFileByKey
}