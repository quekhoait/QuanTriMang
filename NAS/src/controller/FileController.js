const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'Demo/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
})

const upload = multer({ storage: storage }).single('file');

const demo = async (req, res) => {
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

module.exports = {
    demo
}