const sql = require('mssql');
const {
    pool,
    poolConnect
} = require('../../db');

const createFile= async({
    userId,
    parentFolderId = null,
    fileName,
    fileSize = 0,
    fileType = null,
    isFolder = 1,
    keyPath,
    publicId,
    createDate,
    updateDate = null,
  }) => {
    try {
        await poolConnect;
        const request = pool.request();
        request.input('userId', sql.Int, userId);
        request.input('parentFolderId', sql.Int, parentFolderId);
        request.input('fileName', sql.NVarChar, fileName);
        request.input('fileSize', sql.BigInt, fileSize);
        request.input('fileType', sql.NVarChar, fileType);
        request.input('isFolder', sql.Bit, isFolder);
        request.input('keyPath', sql.NVarChar, keyPath);
        request.input('publicId', sql.NVarChar, publicId);
        request.input('createDate', sql.DateTime, createDate);
        request.input('updateDate', sql.DateTime, updateDate);

        const result = await request.query(`
            INSERT INTO Files (userId, parentFolderId, fileName, fileSize, fileType, isFolder, keyPath, publicId, createDate, updateDate)
            VALUES (@userId, @parentFolderId, @fileName, @fileSize, @fileType, @isFolder, @keyPath, @publicId, @createDate, @updateDate);
            SELECT * FROM Files WHERE id = SCOPE_IDENTITY();
        `); 
        return {
            file: result.recordset[0]
        };
    } catch (error) {
        console.error('Lỗi khi tạo file trong DB:', error);
        throw error;
    }
}

const getUserFiles = async (userId, parentFolderId = null) => {
    try {
        await poolConnect;
        const request = pool.request();
        request.input('userId', sql.Int, userId);

        request.input('parentFolderId', sql.Int, parentFolderId);
        console.log('userId:', userId, typeof userId);
        console.log('parentFolderId:', parentFolderId, typeof parentFolderId);


        const result = await request.query(`
            SELECT * FROM Files 
            WHERE userId = @userId ${parentFolderId === null ? 'AND parentFolderId IS NULL' : 'AND parentFolderId = @parentFolderId'}
        `);
        console.log('Kết quả truy vấn:', result.recordset);
        // console.log('userId:', userId);
        // console.log('parentFolderId:', parentFolderId, 'typeof:', typeof parentFolderId);
        return {
            files: result.recordset
        };
    } catch (error) {
        console.error('Lỗi khi lấy danh sách file trong DB:', error);
        throw error;
    }
}

const getUserFile = async (userId, fileId) => {
    try {
        await poolConnect;
        const request = pool.request();
        request.input('userId', userId);
        request.input('id', fileId);

        const result = await request.query(`
            select * from Files where userId = @userId and id = @id
            `)

        return {
            file: result.recordset
        }

    } catch (error){
        console.error('Lỗi khi lấy danh sách file trong DB:', error);
        throw error;
    }
}

//Xóa file/thư mục của user
const deleteUserFile = async (userId, fileId) => {
    
}


module.exports = {
    createFile,
    getUserFiles,
    getUserFile
};