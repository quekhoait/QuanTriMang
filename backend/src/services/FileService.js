const sql = require('mssql');
const {
    pool,
    poolConnect
} = require('../db');

async function createFile({
    userId,
    parentFolderId,
    fileName,
    fileSize,
    fileType,
    isFolder,
    keyPath,
    publicId,
    createDate,
    updateDate,
}){
    return new Promise(async (resolve, reject) => {
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
                INSERT INTO File (userId, parentFolderId, fileName, fileSize, fileType, isFolder, keyPath, publicId, createDate, updateDate)
                VALUES (@userId, @parentFolderId, @fileName, @fileSize, @fileType, @isFolder, @keyPath, @publicId, @createDate, @updateDate)
                SELECT SCOPE_IDENTITY() AS id
            `);

            resolve({
                status: 'SUCCESS',
                message: 'Tạo tệp thành công',
                id: result.recordset[0].id
            });
        } catch (err) {
            reject(err);
        }
    });
}