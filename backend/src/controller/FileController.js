const FileServices = require('../services/FileServices.js');
const streamifier = require('streamifier')
const cloudinary = require('../../cloudinary.js');
const dotenv = require('dotenv');
dotenv.config();

// tạo file và folder lưu dưới db và cloudinary
const createFile = async (req, res) => {
    const fileName = (req.file?.originalname || req.body.fileName)?.trim();
    const fileSize = req.file?.size || 0;
    const fileType = req.file?.mimetype.trim() || null;
    const userId = req.body.userId;
    const parentFolderId = req.body.parentFolderId || null;
    const isFolder = parseInt(req.body.isFolder) || 0;
    const updateDate = null;

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

        // 👇 Trường hợp upload FILE
        const result = await new Promise((resolve, reject) => {
            streamifier.createReadStream(req.file.buffer).pipe(
                cloudinary.uploader.upload_stream(
                    { folder: `uploads/user_${userId}` },
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
        console.error('Lỗi tải lên:', error);
        res.status(500).json({ error: 'Lỗi tải lên tệp tin/thư mục.', info: error.message });
    }
};


//Lấy list file tại thư mục nào đó
const getUserFiles = async (req, res) => {
    const userId = req.params.userId;
    const parentFolderId = req.params.parentFolderId === 'NULL' ? null : parseInt(req.params.parentFolderId);
    try {
        const result = await FileServices.getUserFiles(userId, parentFolderId);
      console.log("result: ", result)
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



module.exports = {
    createFile,
    getUserFiles,
    getUserFile,
};

