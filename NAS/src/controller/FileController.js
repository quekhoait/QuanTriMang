const multer = require('multer');
const path = require('path');
const fs = require('fs');
const ParentFolder = 'C:\\uploads\\NAS\\Demo';

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
  try {
    let filePath =  req.query.path; 
    if (!filePath) return res.status(400).json({ message: "Missing path" });

    // Chuyển \ thành / để tránh lỗi khi gọi từ Windows
    filePath = filePath.replace(/\\/g, "/");

    filePath = path.normalize(filePath);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found" });
    }

    res.sendFile(filePath);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error reading file" });
  }
};

module.exports = {
    uploadFile,
    getFileByKey
}