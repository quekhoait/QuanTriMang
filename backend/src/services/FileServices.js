const sql = require('mssql');
const {
	pool,
	poolConnect
} = require('../../db');
const { deleteCloudinaryFile } = require('../../cloudinary');
const { request } = require('express');

const createFile = async ({
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
		const result = await request.query(`
            SELECT * FROM Files 
            WHERE userId = @userId ${parentFolderId === null ? 'AND parentFolderId IS NULL' : 'AND parentFolderId = @parentFolderId'}
        `);
		//  console.log('Kết quả truy vấn:', result.recordset);
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
		request.input('userId', sql.Int, userId);
		request.input('id', sql.Int, fileId);

		const result = await request.query(`
            select * from Files where userId = @userId and id = @id
            `)

		return {
			file: result.recordset
		}

	} catch (error) {
		console.error('Lỗi khi lấy danh sách file trong DB:', error);
		throw error;
	}
}

const getFileType = async (userId, type) => {
	try {

		documentTypes = ['document', 'msword', 'pdf'];
		await poolConnect;
		const request = pool.request();
		request.input('userId', sql.Int, userId)
		let query = `SELECT * FROM Files WHERE userId = @userId `;

		if (type === 'document') {
			const conditions = documentTypes.map((ext, index) => {
				const param = `fileType${index}`;
				request.input(param, sql.NVarChar, `%${ext}`);
				demo = `fileType LIKE @${param}`

				return `fileType LIKE @${param}`;
			});
			query += `AND (${conditions.join(' OR ')})`;
		}
		else if (type !== 'null') {
			query += ` AND fileType LIKE '%' + @fileType + '%'`;
			request.input('fileType', sql.NVarChar, type);
		}
		const result = await request.query(query);

		return {
			file: result.recordset
		}

	} catch (err) {
		console.error("Lỗi khi lấy danh sách loại file", err);
	}
}

// đệ quy tìm toàn bộ file con
const deQuyFolder = async (userId, fileId) => {
	const listDeleteFileId = [] // list fileId con cần xóa, có thứ tự
	//tìm tất cả file cấp 1
	const request = pool.request()
	request.input("id", sql.Int, fileId)
	request.input("userId", sql.Int, userId)
	const result = await request.query("select id, isFolder from files where userId = @userId and parentFolderId = @id")

	//duyệt file cấp 1, nếu là file thì thêm vô list, folder thì đệ quy tiếp
	for (const child of result.recordset) {
		if (child.isFolder) {
			const subFiles = await deQuyFolder(userId, child.id);
			listDeleteFileId.push(...subFiles);
		}

		// luôn thêm file hiện tại và cả folder
		listDeleteFileId.push(child.id);
	}

	return listDeleteFileId;
}

//Xóa file/thư mục của user
const deleteUserFile = async (userId, listfileId) => {
	try {
		await poolConnect;
		const resultMessages = [];
		for (const fileId of listfileId) {
			const request = pool.request()
			request.input('userId', sql.Int, userId)
			request.input('id', sql.Int, fileId)

			//check xem file thư mục hay tệp tin
			const result = await request.query("select publicId, fileName, isFolder from Files where userId = @userId and id = @id");

			//case truy vấn ko thấy gì
			if (result.recordset.length === 0) {
				resultMessages.push(`❌ File ID ${fileId} không tồn tại hoặc không thuộc user.`);
				continue;
			}

			//case tệp tin, xóa fileshare trước
			if (result.recordset[0].isFolder === 0) {
				await request.query("delete from FileShare where id = @id")
				await request.query("delete from Files where userId = @userId and id = @id")

				//xóa luôn tệp trên cloudinary
				if (result.recordset[0].publicId) {
					await deleteCloudinaryFile(result.recordset[0].publicId)
				}
				resultMessages.push(`🗑️ Đã xóa file "${file.fileName}".`);
			} else {
				//thứ tự xóa từ trái sang phải, con cấp cao nhất về cấp thấp
				const listFileIdToDelte = await deQuyFolder(userId, fileId);
				//xóa hết file con rồi thì xóa file hiện tại
				listFileIdToDelte.push(fileId);

				for (const id of listFileIdToDelte) {
					const loopRequest = pool.request();
					loopRequest.input("userId", sql.Int, userId);
					loopRequest.input("id", sql.Int, id);

					const fileInfo = await loopRequest.query("select publicId from files where userId = @userId and id = @id")
					//cloudinary
					if (fileInfo.recordset.length > 0 && fileInfo.recordset[0].publicId && fileInfo.recordset[0].publicId.trim() !== "") {
						await deleteCloudinaryFile(fileInfo.recordset[0].publicId)
					}

					await loopRequest.query("delete from FileShare where fileId = @id");
					await loopRequest.query("delete from files where userId = @userId and id = @id");

				}

				resultMessages.push(`Xóa thư mục ${result.recordset[0].fileName} thành công`)
			}
		}
		return {
			message: "Xóa hoàn tất.",
			details: resultMessages
		};
	} catch (err) {
		console.error('Lỗi khi lấy danh sách file trong DB:', err);
		return {
			message: "Lỗi truy vấn cơ sở dữ liệu khi xóa file: " + err
		}
	}

}

const shareFile = async(userId, fileId, userIdRece)=>{
  const createDate = new Date();
  try{
    await poolConnect;
    const request =pool.request();
    request.input('userId', sql.Int, userId)
    request.input('fileId', sql.Int, fileId)
    request.input('userIdReceive', sql.Int, userIdRece)
	  request.input('createDate', sql.DateTime, createDate);
    		const result = await request.query(`
            INSERT INTO FileShare (userId, fileId, userIdReceive, createDate)
            VALUES (@userId, @fileId, @userIdReceive, @createDate);
            SELECT * FROM FileShare WHERE id = SCOPE_IDENTITY();
        `);
  return {
			file: result.recordset[0]
		};
  }catch(err){
    console.error('Lỗi khi lấy danh sách file trong DB:', err);
		return {
			message: "Lỗi truy vấn cơ sở dữ liệu khi xóa file: " + err
		}
  }
}


//lấy file đang share
const getFileShare = async(userId)=>{
try {
		await poolConnect;
		const request = pool.request();
		request.input('userId', sql.Int, userId);
		const result = await request.query(`
            select * from FileShare where userId = @userId 
            `)

		return {
			file: result.recordset
		}

	} catch (error) {
		console.error('Lỗi khi lấy danh sách file trong DB:', error);
		throw error;
	}
}


//lấy file nhận dc
const getFileReceive = async(userIdRece)=>{
try {
		await poolConnect;
		const request = pool.request();
		request.input('userIdReceive', sql.Int, userIdRece);
		const result = await request.query(`
            select * from FileShare where userIdReceive = @userIdReceive 
            `)

		return {
			file: result.recordset
		}

	} catch (error) {
		console.error('Lỗi khi lấy danh sách file trong DB:', error);
		throw error;
	}
}

module.exports = {
	createFile,
	getUserFiles,
	getUserFile,
	deleteUserFile,
	getFileType,
  shareFile,
  getFileShare,
  getFileReceive
};