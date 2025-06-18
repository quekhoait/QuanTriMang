const sql = require('mssql');
const { pool, poolConnect } = require('../../db');

async function createFile({
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
}) {
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
            status: 'SUCCESS',
            message: 'Tạo tệp thành công',
            file: result.recordset[0]
        };
    } catch (error) {
        console.error('Lỗi khi tạo file trong DB:', error);
        throw error;
    }
}

module.exports = {
    createFile
};
