const FileService = require('../services/FileService.js');
const streamifier = require('streamifier')
const cloudinary = require('../../cloudinary.js');
const dotenv = require('dotenv');
dotenv.config();
const createFile = async (req, res) => {
    const fileName = (req.file?.originalname || req.body.fileName)?.trim();
    const fileSize = req.file?.size || 0;
    const fileType = req.file?.mimetype || null;
    const userId = parseInt(req.body.userId);
    const parentFolderId = req.body.parentFolderId || null;
    const isFolder = parseInt(req.body.isFolder) || 0;
    const updateDate = null;

    try {
        if (isFolder === 1) {
            // 👈 Trường hợp tạo FOLDER, không upload Cloudinary
            const newFolder = await FileService.createFile({
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
                    { folder: 'uploads' },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                )
            );
        });

        const newFile = await FileService.createFile({
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



module.exports = {
    createFile
};

