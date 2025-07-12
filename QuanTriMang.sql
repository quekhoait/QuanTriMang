CREATE TABLE Account (
    id INT IDENTITY(1,1) PRIMARY KEY,
    username NVARCHAR(300) NULL,
    password NVARCHAR(200) NULL,
    createDate DATETIME NULL,
    avatar CHAR(500) NULL,
    role CHAR(50) NULL,
    email CHAR(300) NULL,
    sizeUsed BIGINT NULL,
    maxSizeUsed BIGINT NOT NULL DEFAULT '1073741824'
);

CREATE TABLE Files (
    id INT IDENTITY(1,1) PRIMARY KEY,
    userId INT NOT NULL,
    parentFolderId INT NULL,
    fileName NVARCHAR(255) NULL,
    fileSize BIGINT NULL,
    fileType NVARCHAR(200) NULL,
    isFolder BIT NULL,
    keyPath NVARCHAR(500) NULL,
    publicId NVARCHAR(255) NULL,
    createDate DATETIME NULL,
    updateDate DATETIME NULL,
    CONSTRAINT FK_Files_Account FOREIGN KEY (userId) REFERENCES Account(id),
    CONSTRAINT FK_Files_ParentFolder FOREIGN KEY (parentFolderId) REFERENCES Files(id)
);

CREATE TABLE FileShare (
    id INT IDENTITY(1,1) PRIMARY KEY,
    fileId INT NULL,
    userId INT NULL,
    token NVARCHAR(255) NULL,
    permission NCHAR(100) NULL,
    expiresDate DATETIME NULL,
    createDate DATETIME NULL,
    CONSTRAINT FK_FileShare_File FOREIGN KEY (fileId) REFERENCES Files(id),
    CONSTRAINT FK_FileShare_Account FOREIGN KEY (userId) REFERENCES Account(id)
);

select * from files
select * from Account

INSERT INTO Account (username, password, createDate, avatar, role, email, sizeUsed)
VALUES (N'user_demo', N'123456', GETDATE(), NULL, N'user', N'user@example.com', 0);

INSERT INTO Files (userId, parentFolderId, fileName, isFolder, createDate)
VALUES 
(1, NULL, N'Tài liệu', 1, GETDATE()),
(1, NULL, N'Hình ảnh', 1, GETDATE()),
(1, NULL, N'Video', 1, GETDATE()),
(1, NULL, N'Nhạc', 1, GETDATE()),
(1, NULL, N'Dự án', 1, GETDATE());

CREATE TRIGGER trg_UpdateSizeUsed_Insert
ON Files
AFTER INSERT
AS
BEGIN
    UPDATE Account
    SET SizeUsed = SizeUsed + ISNULL(I.fileSize, 0)
    FROM Account A
    JOIN inserted I ON A.id = I.userId
    WHERE I.isFolder = 0;  -- Chỉ tính file, không tính thư mục
END

CREATE TRIGGER trg_UpdateSizeUsed_Delete
ON Files
AFTER DELETE
AS
BEGIN
    UPDATE Account
    SET SizeUsed = SizeUsed - ISNULL(D.fileSize, 0)
    FROM Account A
    JOIN deleted D ON A.id = D.userId
    WHERE D.isFolder = 0;
END

CREATE TRIGGER trg_UpdateSizeUsed_Update
ON Files
AFTER UPDATE
AS
BEGIN
    -- Trừ size cũ
    UPDATE Account
    SET SizeUsed = SizeUsed - ISNULL(D.fileSize, 0)
    FROM Account A
    JOIN deleted D ON A.id = D.userId
    WHERE D.isFolder = 0;

    -- Cộng size mới
    UPDATE Account
    SET SizeUsed = SizeUsed + ISNULL(I.fileSize, 0)
    FROM Account A
    JOIN inserted I ON A.id = I.userId
    WHERE I.isFolder = 0;
END





