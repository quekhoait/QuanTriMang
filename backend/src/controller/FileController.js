const FileService = require('../services/FileService.js');
const streamifier = require('streamifier')
const cloudinary = require('../../cloudinary.js');
const dotenv = require('dotenv');
dotenv.config();
const createFile = async (req, res) => {
    console.log(process.env.CLOUDINARY_CLOUD_NAME);
    console.log(process.env.CLOUDINARY_API_KEY);
    console.log(process.env.CLOUDINARY_API_SECRET);

    
    const userId = 1;
    const parentFolderId = 0;
    const isFolder = 0;
    const updateDate = new Date();

    try {
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

        await FileService.createFile({
            userId,
            parentFolderId,
            fileName: req.file.originalname,
            fileSize: req.file.size,
            fileType: req.file.mimetype,
            isFolder,
            keyPath: result.secure_url,
            publicId: result.public_id,
            createDate: new Date(),
            updateDate,
        });

        res.json({ message: 'Tải lên thành công!', file: result });
    } catch (error) {
        console.error('Lỗi tải lên:', error);
        res.status(500).json({ error: 'Lỗi tải lên tệp tin.', info: error.message });
    }
};



module.exports = {
    createFile
};
