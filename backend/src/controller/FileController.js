const FileServices = require('../services/FileServices.js');
const streamifier = require('streamifier')
const {cloudinary} = require('../../cloudinary.js');
const dotenv = require('dotenv');
dotenv.config();

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    const dangerousExtensions = [
  '.exe', '.bat', '.cmd', '.vbs', '.js', '.msi', '.scr', '.jar', '.ps1', '.lnk', 
  '.docm', '.xlsm', '.pptm','.sql'
]; // mở rộng tùy dự án

// tạo file và folder lưu dưới db và cloudinary
const createFile = async (req, res) => {

    const fileName = (req.file?.originalname || req.body.fileName)?.trim();
    const fileSize = req.file?.size || 0;
    const fileType = req.file?.mimetype.trim() || null;
    const userId = req.body.userId;
    const parentFolderId = parseInt(req.body.parentFolderId) || null;
    const isFolder = parseInt(req.body.isFolder) || 0;
    const updateDate = null;
  console.log(req.file)
    //Kiểm tra quyenf hợp lệ khi đăng nhập và up
     if (req.user.id !== userId) {
        return res.status(403).json({ error: 'Bạn không có quyền upload file cho user này.' });
    }
    try {
        if (isFolder === 1) {
            // 👈 Trường hợp tạo FOLDER, không upload Cloudinary

            const newFolder = await FileServices.createFile({
                userId,
                parentFolderId,
                fileName,
                fileSize: 0,
                fileType: null,
                isFolder,
                keyPath: null,  // hoặc null nếu không dùng
                publicId: null,
                createDate: new Date(),
                updateDate: null,
            });
            return res.json({ message: 'Tạo thư mục thành công!', file: newFolder });
        }
           
          if (!req.file) {
            return res.status(400).json({ error: 'Không có file nào được upload.' });
        }

        // console.log(fileType)
      //  Kiểm tra định dạng MIME hợp lệ
        if (dangerousExtensions.includes(fileType)) {
            return res.status(415).json({ error: 'Định dạng tệp không được phép.' });
        }

        //  Giới hạn dung lượng file
        if (fileSize > MAX_FILE_SIZE) {
            return res.status(413).json({ error: 'Tệp quá lớn. Giới hạn là 10MB.' });
        }

        const path = require("path");

        const originalName = req.file.originalname; // Detai BaitapLon2022 (1).pdf
        const fileNameWithExt = path.parse(originalName).base; // giữ cả tên + đuôi
        const fileNameWithoutExt = path.parse(originalName).name;
        const fileExt = path.parse(originalName).ext; // .pdf

        const publicId = `${fileNameWithoutExt}${fileExt}`; // => Detai BaitapLon2022 (1).pdf


        const result = await new Promise((resolve, reject) => {
            streamifier.createReadStream(req.file.buffer).pipe(
                cloudinary.uploader.upload_stream(
                    {
                        folder: `uploads/user_${userId}`,
                        public_id: publicId,                // 👈 giữ đuôi .pdf
                        resource_type: "raw",
                        use_filename: true,
                        unique_filename: false,
                        overwrite: true
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                )
            );
        });

        const newFile = await FileServices.createFile({
            userId,
            parentFolderId,
            fileName,
            fileSize,
            fileType,
            isFolder: 0,
            keyPath: result.secure_url,
            publicId: result.public_id,
            createDate: new Date(),
            updateDate,
        });
    
        res.json({ message: 'Tải lên thành công!', file: newFile });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi tải lên tệp tin/thư mục.', info: error.message });
    }
};


//Lấy list file tại thư mục nào đó
const getUserFiles = async (req, res) => {
    const userId = req.params.userId;
    const parentFolderId = req.params.parentFolderId === 'NULL' ? null : parseInt(req.params.parentFolderId);
    try {
        const result = await FileServices.getUserFiles(userId, parentFolderId);
        res.json({ message: 'Lấy danh sách tệp thành công', files: result.files });
    } catch (error) {
        console.error('Lỗi khi lấy danh sách file:', error);
        res.status(500).json({ error: 'Lỗi khi lấy danh sách file.', info: error.message });
    }
};

//lấy chính xác 1 file nào đó
const getUserFile = async (req,res) => {
    const userId = parseInt(req.params.userId);
    const fileId = parseInt(req.params.fileId);
    try{
        const result = await FileServices.getUserFile(userId,fileId);        
        res.json({message: 'lấy file thành công', file: result.file})
    }catch(error){
        console.error('Lỗi khi lấy file: ',error)
        res.status(500).json({error: 'Lỗi khi lấy file', info: error.message})
    }
}

const deleteUserFile = async (req,res) => {
   const {userId, fileIds} = req.body;
    try{
        const result = await FileServices.deleteUserFile(userId,fileIds)
        res.json({message : result.message})
    }catch(err){
        console.error('Lỗi khi xóa file: ',err)
        res.status(500).json({
            error: "lỗi xóa file",
            info: err.message
        })
        
    }
}

const getFileType = async(req, res)=>{
  const type = req.params.type;
  const userId = req.params.userId;
  try{
    const result = await FileServices.getFileType(userId, type)
    res.json({message: 'lấy file thành công',
       file: result.file})
  }catch(err){
    console.log(err);
    res.status(500).json({error: 'Lỗi khi lấy file', info: err.message})
  }
}

// {
//   "userId": 2,
//   "fileId": 8,
//   "permission": "read",
//   "expiresDate": "2025/08/17"
// }
const createFileShare = async (req, res) => {
    const { userId, fileId, permission, expiresDate} = req.body;
    try {
        const result = await FileServices.createFileShare(userId, fileId, permission.trim(), expiresDate );
        res.json({ message: result.message, fileShare: result.fileShare });
    } catch (error) {
        console.error('Lỗi khi tạo chia sẻ file:', error);
        res.status(500).json({ error: 'Lỗi khi tạo chia sẻ file.', info: error.message });
    }
}

const getFileShare = async (req, res) => {
    const userId = parseInt(req.params.userId);
    try {
        const result = await FileServices.getFileShare(userId);
        res.json({ message: result.message, fileShares: result.fileShares });
    } catch (error) {
        console.error('Lỗi khi lấy danh sách file chia sẻ:', error);
        res.status(500).json({ error: 'Lỗi khi lấy danh sách file chia sẻ.', info: error.message });
    }
}

const getUserFileShare = async (req, res) => {
    const userId = parseInt(req.params.userId);
    try {
        const result = await FileServices.getUserFileShare(userId);
        res.json({ message: result.message, fileShares: result.fileShares });
    } catch (error) {
        console.error('Lỗi khi lấy danh sách file đã chia sẻ của user:', error);
        res.status(500).json({ error: 'Lỗi khi lấy danh sách file đã chia sẻ của user.', info: error.message });
    }
}

// {
//     "fileShareId":8,     
//     "userId":3,        // ID của người dùng muốn thay đổi quyền
//     "permission":"edit" // quyền mới
// }

const changePermissionFileShare = async (req, res) => {
    const { fileShareId, userId, permission } = req.body;
    try {
        const result = await FileServices.changePermissionFileShare(fileShareId,userId, permission);
        res.json({ message: result.message, fileShare: result.fileShare });
    } catch (error) {
        console.error('Lỗi khi thay đổi quyền chia sẻ file:', error);
        res.status(500).json({ error: 'Lỗi khi thay đổi quyền chia sẻ file.', info: error.message });
    }
}

module.exports = {
    createFile,
    getUserFiles,
    getUserFile,
    deleteUserFile,
    getFileType,
    createFileShare,
    getFileShare,
    getUserFileShare,
    changePermissionFileShare
};

