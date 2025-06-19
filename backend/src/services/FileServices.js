const { pool } = require("../../db");

const createFolder = (newFolder)=>{
    return new Promise(async(resolve, reject)=>{
        try{
            await pool.connect();
            const checkFolderName = await pool
                .request()
                .input("fileName", newFolder.folderName)
                .input("parentFolder", newFolder.parentFolder)
                .query("Select * from Files WHERE fileName = @fileName and parentFolder= @parentFolder")
            if(checkFolderName.recordset.length > 0){
                resolve({
                    status: "ERR",
                    message: `Đã tồn tại folder có tên ${fileName}`
                })
            }
            await pool
            .request()
            .input("userId", newFolder.userId)
            .input("fileName", newFolder.folderName)
            .input("parentFolder", newFolder.parentFolder)
            .input('isFolder', true)
            .input('createDate', newFolder.createDate)
            .query("INSERT INTO Account (userId, fileName, parentFolder, isFolder,createDate ) VALUES (@userId, @fileName, @parentFolder, @isFolder, @createDate");
            return resolve({
                status: "SUCCESS",
                message: newUser.message,
            });
        }catch(err){
            reject(err);
        }
    })
}

module.exports = {
  createFolder
}