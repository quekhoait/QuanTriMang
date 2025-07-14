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
    if(fileSize > 1024 * 10 *1024){
      return {
      success: false, 
      message: "Kích thước file quá nhỏ (tối thiểu 10KB)"
  };
    }

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

const getConditions = (request, listType) => {
	let conditions = [];
	listType.map((ext, index) => {
		const param = `fileType${index}`;
		request.input(param, sql.NVarChar, `%${ext}`);
		conditions.push(`fileType LIKE @${param}`);
	});
	return `AND (${conditions.join(' OR ')})`;
}

const getNegativeConditions = (request, listType) => {
	let conditions = [];
	listType.map((ext, index) => {
		const param = `fileType${index}`;
		request.input(param, sql.NVarChar, `%${ext}`);
		conditions.push(`fileType NOT LIKE @${param}`);
	});
	return `AND (${conditions.join(' AND ')})`;
}

const getFileType = async (userId, type) => {
	try {

		documentTypes = ['document', 'msword', 'pdf'];
		imageTypes = ['image', 'png', 'jpg', 'jpeg', 'gif'];
		videoTypes = ['video', 'mp4'];
		musicTypes = ['audio', 'mp3', 'wav'];

		await poolConnect;
		const request = pool.request();
		request.input('userId', sql.Int, userId)
		let query = `SELECT * FROM Files WHERE userId = @userId `;

		if (type === 'document') {
			query += getConditions(request, documentTypes);
		} else if (type === 'image') {
			query += getConditions(request, imageTypes);
		} else if (type === 'video') {
			query += getConditions(request, videoTypes);
		} else if (type === 'music') {
			query += getConditions(request, musicTypes);
		} else if (type === 'orther') {
			query += getNegativeConditions(request, [...documentTypes, ...imageTypes, ...videoTypes, ...musicTypes]);
		}

		// else if (type !== 'null') {
		// 	query += ` AND fileType LIKE '%' + @fileType + '%'`;
		// 	request.input('fileType', sql.NVarChar, type);
		// }
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

// share file cho người khác
// userId: id của được chia chia sẻ, fileId: id của file được chia sẻ
const createFileShare = async (userId, fileId, permission, expiresDate = null) => {
	try {
		await poolConnect;
		const request = pool.request();
		request.input('userId', sql.Int, userId);
		request.input('fileId', sql.Int, fileId);
		request.input('permission', sql.NVarChar, permission);
		request.input('expiresDate', sql.DateTime, expiresDate);
		request.input('createDate', sql.DateTime, new Date());

		// Kiểm tra xem file đã được chia sẻ cho người dùng này chưa
		const checkUserFile = await request.query(`
			SELECT * FROM FileShare WHERE userId = @userId AND fileId = @fileId;	
		`);

		if (checkUserFile.recordset.length > 0) {
			return {
				message: 'File đã được chia sẻ cho người dùng này.',
				fileShare: checkUserFile.recordset[0]
			}
		}

		// Nếu chưa, thực hiện chia sẻ file
		const result = await request.query(`
			INSERT INTO FileShare (userId, fileId, permission, expiresDate, createDate)
			VALUES (@userId, @fileId, @permission, @expiresDate, @createDate);
			SELECT * FROM FileShare WHERE id = SCOPE_IDENTITY();
		`);
		result.recordset[0].permission = result.recordset[0].permission.trim();
		return {
			message: 'Chia sẻ file thành công!',
			fileShare: result.recordset[0]
		};

	} catch (error) {
		console.error('Lỗi khi chia sẻ file:', error);
		throw error;
	}
}

// Lấy danh sách file đã được chia sẻ cho user
const getFileShare = async (userId) => {
	try {
		await poolConnect;
		const request = pool.request();
		request.input('userId', sql.Int, userId);

		// f.* là thông tin file được chia sẻ của user là u.username,uemail
		// fs.* thông tin file được chia sẻ cho user này userId
		const result = await request.query(`
			SELECT f.*, u.email, u.username, fs.permission,fs.expiresDate,fs.createDate as shareDate
			FROM FileShare fs
			JOIN Files f ON fs.fileId = f.id
			JOIN Account u ON f.userId = u.id
			WHERE fs.userId = @userId;
		`);

		return {
			message: 'Lấy danh sách file chia sẻ thành công',
			fileShares: result.recordset
		};
	} catch (error) {
		console.error('Lỗi khi lấy danh sách file chia sẻ:', error);
		throw error;
	}
}

//lấy danh sách file đã chia sẻ của user
const getUserFileShare = async (userId) => {
	try {
		await poolConnect;
		const request = pool.request();
		request.input('userId', sql.Int, userId);
		const result = await request.query(`
			select f.*, fs.userId as sharedToUserId, c.username,c.email, fs.createDate,fs.expiresDate,fs.permission
			from FileShare fs
			join Files f on f.id = fs.fileId
			join Account c on c.id = fs.userId
			where f.userId = @userId
		`);

		return {
			message: 'Lấy danh sách file đã chia sẻ của user thành công',
			fileShares: result.recordset
		};
	} catch (error) {
		console.error('Lỗi khi lấy danh sách file chia sẻ của user:', error);
		throw error;
	}
}

const changePermissionFileShare = async (fileShareId, userId, permission) => {
	try {
		await poolConnect;
		const request = pool.request();
		request.input('fileShareId', sql.Int, fileShareId);
		request.input('userId', sql.Int, userId);
		request.input('permission', sql.NVarChar, permission);

		const result = await request.query(`
			UPDATE FileShare
			SET permission = @permission
			WHERE FileId = @fileShareId AND userId = @userId;
			SELECT * FROM FileShare WHERE FileId = @fileShareId AND userId = @userId;
		`);
      console.log(result)
		return {
			message: 'Cập nhật quyền chia sẻ thành công',
			fileShares: result.recordset
		};
	} catch (error) {
		console.error('Lỗi khi cập nhật quyền chia sẻ:', error);
		throw error;
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