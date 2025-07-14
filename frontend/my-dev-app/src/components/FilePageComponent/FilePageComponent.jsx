import { useState, useEffect, useRef, use } from "react";
import { FaDownload, FaFolder, FaFilePdf, FaRedoAlt, FaTh, FaFolderOpen, FaShareAlt, FaTrash, FaPencilAlt, FaImages, FaAlignCenter, FaPhotoVideo } from "react-icons/fa";
import { AiOutlineFolderAdd } from "react-icons/ai";
import { CiMenuKebab } from "react-icons/ci";
import { FaRegStar } from "react-icons/fa6";
import { useUser } from "../../contexts/UserContext";
import { useFile } from "../../contexts/FileContext";
import FormAuthenComponent from "../FormAuthenComponent/FormAuthenComponent";
import { FormShareComponent } from "../FormShareComponent/FormShareComponent";
import FileShareComponent from "../FileShareComponent/FileShareComponent";

export default function FilePageComponent({ listFiles, isAllFile, fileName, rowId, setRowId }) {
  //listFiles json dữ liệu tệp tin lấy api/file/listFile/:userId/:parentFolderId
  const { getListFileParent, removeFile } = useFile();

  //Tạo thêm folder mới
  const [isCreating, setIsCreating] = useState(false);
  const [nameNewFolder, setNameNewFolder] = useState()
  const [dateTime, setDateTime] = useState();
  //Lưu sô newfolder tạo ra
  const generateFolderName = () => {
    const baseName = "New Folder";
    let name = baseName;
    let counter = 1;
    const existingNames = listFile.map(f => f.fileName);
    while (existingNames.includes(name)) {
      name = `${baseName} ${counter}`;
      counter++;
    }
    return name;
  };
  const createNewFolder = () => {
    setIsCreating(true);
    setIsCreating(true);
    const uniqueName = generateFolderName();
    setNameNewFolder(uniqueName);
  }

  const [listFile, setlistFile] = useState(listFiles);
  useEffect(() => {
    setlistFile(listFiles)
  }, [listFiles])

  const currentDate = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });


  const handlSaveNewFolder = () => {
    const cnt = 0;
    if (nameNewFolder.trim() === " ") return;
    listFile.forEach(e => {
      if (e.fileName === nameNewFolder && e.parentFolderId === rowId && e.isFolder === true) {
        alert("Tên đã tồn tại");
        return;
      }
    });

    const newFolder = {
      fileName: nameNewFolder,
      fileSize: "-",
      createDate: currentDate,
      isFolder: true
    };
    setDateTime(newFolder.date);
    setlistFile([newFolder, ...listFile]);
    setIsCreating(false);
    createFolder();
  }

  const [selectRow, setSelectRow] = useState([])
  const [listFileId, setListFileId] = useState([]);
  const [listFileSelect, setListFileSelect] = useState([]);
  const handleListSelect = (name, checked, ListFileId, listFileSelect) => {
    if (checked) {
      setSelectRow(prev => [...prev, name]);
      setListFileId(prev => [...prev, ListFileId]);
      setListFileSelect(prev => [...prev, listFileSelect])
    } else {
      setSelectRow(prev => prev.filter(item => item !== name)) //lọc qua các phần tử và giữ lại phần tử khác name
      setListFileId(prev => prev.filter(id => id !== listFileId));
      setListFileSelect(prev =>prev.filter(keyPath => keyPath !== listFileSelect))
    }
  }

  const handleAllSelect = (checked) => {
    if (checked) {
      setSelectRow(listFile.map(file => file.name));
    } else {
      setSelectRow([]);
    }
  }

  //submenu controll CiMenuKebab
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  //control trạng thái của nút tạo folder mới
  const [isAllFileState, setIsAllFileState] = useState(isAllFile);
  useEffect(() => {
    if (selectRow.length > 0) {
      setIsAllFileState(false);
    } else {
      setIsAllFileState(true);
    }
  }, [selectRow]);


  //Xử lý rename File
  const [renamingFile, setRenamingFile] = useState(null);
  const [renameValue, setRenameValue] = useState("");

  const handleRename = () => {
    if (selectRow.length === 1) {
      const fileToRename = selectRow[0];
      setRenamingFile(fileToRename);
      setRenameValue(fileToRename);
      setIsOpen(false);
    }
  };

  //Tạo folder mới
  const { account, getUser } = useUser();
  //Laayus token
  const token = localStorage.getItem('accessToken');
  const createFolder = async () => {  
    console.log(token)
    try {
      const response = await fetch('http://localhost:5999/api/file/upload', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+ token
        },
        credentials: 'include',
        body: JSON.stringify({
          userId: account?.data?.id,
          fileName: nameNewFolder,
          fileType: "folder",
          createDate: dateTime,
          isFolder: 1,
          parentFolderId: rowId
        })
      })
      const data = await response.json();
      if (response.ok) {
        alert("Tạo thành công");
      } else {
        alert("Tạo folder thất bại" + data.message)
      }
    } catch (err) {
      alert("Lỗi server" + err.message)
    }
  }

  const handleSaveRename = () => {
    if (renameValue.trim() === "") return;

    const newList = listFile.map(file => {
      if (file.name === renamingFile) {
        return { ...file, name: renameValue };
      }
      return file;
    });

    setlistFile(newList);
    setRenamingFile(null);
    setSelectRow([]);
  };

  //Lấy file id của hàng mình nhấn
  const handleRowClick = (folderId, folderName) => {
    setPathFolder(prev => [...prev, { fileId: folderId, fileName: folderName }]);
    setRowId(folderId);
  }

  const handleFolderClick = (e, fileId, index) => {
    // Xử lý khi người dùng nhấn vào thư mục
    if (pathFolder.length > 1) {
      setPathFolder(prev => prev.slice(0, index + 1)); // Xóa phần tử cuối cùng trong mảng
      // const lastFolder = pathFolder[pathFolder.length - 2];
      setRowId(fileId);
    }
  }
  //uplaod file
  const { fileUpload, setFileUpLoad } = useState(null);
  const fileInputRef = useRef(null);
  const handleChooseFile = (e) => {
    e.preventDefault();
    fileInputRef.current.click();
  }
  const handleChangeFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    const result = window.confirm("Bạn chắc chắc upload file: " + file.name)
    if (result) {
      uploadFilde(file)
    }
  }

  const uploadFilde = async (fileUpload) => {
    const isDuplicate = listFiles.find(file => file.fileName === fileUpload.name);
    if (isDuplicate) {
      alert(" Tên file đã tồn tại!");
      return; // 👉 Dừng luôn hàm nếu trùng
    }
     if (fileUpload.size > 10 * 1024 * 1024) {
    alert(" Kích thước file vượt quá 10MB!");
    return;
  }
  if (!token) {
    alert(" Token không tồn tại. Vui lòng đăng nhập lại!");
    return;
  }
    const formData = new FormData();
    formData.append("file", fileUpload);
    formData.append("userId", account?.data?.id);
    //formData.append("fileName", fileUpload.name);
    //formData.append("fileType", fileUpload.type);
    //formData.append("fileSize", fileUpload.size);
    formData.append("isFolder", 0);
    formData.append("parentFolderId", rowId);
    try {
      const response = await fetch('http://localhost:5999/api/file/upload', {
        method: "POST",
         headers: {
        'Authorization': 'Bearer ' + token
      },
      credentials: 'include',
        body: formData
      })
      const data = await response.json();
      if (response.ok) {
        alert("Upload file thành công");
        getListFileParent(rowId);
      } else {
        alert("Upload file thất bại" + data.message)
      }

    } catch (err) {
      alert("Lỗi up file" + err.message)
    }
  }


  // Đường dẫn thư mục hiện hành
  const [pathFolder, setPathFolder] = useState([{ fileId: null, fileName: fileName }]);



  //xoa file


  const handleDeleteFile = async () => {
    const result = window.confirm("Bạn chắc chắn muốn xóa?");
    console.log(listFileId)
    if (result && listFileId.length > 0) {
      await removeFile(listFileId);
    } else {
      return;
    }
  }

  //Xử lý share dữ liệu

const [isShowForm, setIsShowForm] = useState(false);
const [isShowFormInfo, setIsShowFormInfo] = useState(false);

// Toggle
const handleShowForm = () => setIsShowForm(prev => !prev);
const handleShowFormInfo = () => setIsShowFormInfo(prev => !prev);

// Xác thực thành công => ẩn xác thực, hiện form nhập email
const handleEdit = () => {
  setIsShowForm(false);     // Ẩn form xác thực
  setIsShowFormInfo(true);  // Mở form nhập email chia sẻ
};

const handleShareData = () => {
  setIsShowForm(true); // Bắt đầu bằng việc xác thực
};

//Hàm download
//chứ xong còn phần dổi tên khi dowb xún
const getDownloadUrl = (url) => {
  return url.replace('/upload/', '/upload/fl_attachment/');
};



const handelDownload = () => {
  const hasFolder = listFileSelect.some((file) => Number(file.isFolder) === 1);
  if (hasFolder) {
    alert(" Không thể tải thư mục. Vui lòng bỏ chọn thư mục.");
    return;
  }
   listFileSelect.forEach((file, index) => {
    setTimeout(() => {
      const link = document.createElement("a");
      link.href = getDownloadUrl(file.keyPath);
      link.setAttribute("download", file.fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, index * 500); // mỗi lần cách nhau 500ms
  });
};



  return (
    <div className="p-6">

      {/* Header */}
      {isShowForm && (
                  <FormAuthenComponent 
                    onSuccess={handleEdit}
                    onClose={handleShowForm}
                    mess={"Mật khẩu"}
                    notification={"Yêu cầu xác thực"}
                  />
                  )
                }
    {isShowFormInfo && (
          <FormShareComponent
      listFileId = {listFileId}
     />
    )}
      
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-0">

          {/* Hiển thị đường dẫn thư mục */}
          {pathFolder.map((path, index) => {
            let style = (rowId !== path.fileId ? "text-gray-500 " : "") + "text-2xl font-semibold cursor-pointer";
            return path.fileId === null ? <span onClick={(e) => handleFolderClick(e, path.fileId, index)}><h2 className={style}>{path.fileName}</h2></span> :
              <span onClick={(e) => handleFolderClick(e, path.fileId, index)}><h2 className={style}>{"/" + path.fileName}</h2></span>
          })}

        </div>

        <div className="flex items-center space-x-4">
          <FaRedoAlt className="cursor-pointer" />
          <FaTh className="cursor-pointer" />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-4 mb-4">

        <input type="file"
          style={{ display: 'none' }}
          ref={fileInputRef}
          onChange={handleChangeFile}
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-600"
          onClick={handleChooseFile}
        >
          <span>⬆</span>
          <span>Upload</span>
        </button>
        {!isAllFile && isAllFileState &&
          <button className="border px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-100" onClick={createNewFolder}>
            <span><FaFolderOpen /></span>
            <span>New Folder</span>
          </button>
        }

        {selectRow.length > 0 &&
          <div className="flex items-center space-x-4 text-lg">
            <button className="text-xl" onClick={handleDeleteFile} >
              <FaTrash />
            </button>

            <button className="" onClick={handleRename}>
              <FaPencilAlt />
            </button>

            <button className="" onClick={handleShareData}>
              <FaShareAlt />
            </button>

            <button className="" onClick={handelDownload} > 
              <FaDownload />
            </button>
          </div>}
      </div>

      <div className="max-h-[460px] overflow-y-auto border rounded-md">
        <table className="w-full text-left min-w-[600px]">
          <thead className="sticky top-0 bg-white ">
            <tr className="border-b">
              <th className="p-2 text-blue-700 w-8">
                <input type="checkbox" checked={selectRow.length === listFile.length}
                  onChange={(e) => handleAllSelect(e.target.checked)}
                />
              </th>
              <th className="p-2 text-blue-700">File name</th>
              <th className="p-2 text-blue-700">Date added ⬇</th>
              <th className="p-2 text-blue-700">Size</th>
            </tr>
          </thead>
          <tbody>

            {isCreating &&
              <tr className="border-b hover:bg-gray-100">
                <td><input type="checkbox" /></td>
                <td className="p-2 flex items-center space-x-2">
                  <FaFolder className="text-yellow-500" />
                  <input
                    autoFocus
                    className="border px-2 py-1 rounded"
                    value={nameNewFolder}
                    onChange={(e) => setNameNewFolder(e.target.value)}
                    onBlur={handlSaveNewFolder}
                  />
                </td>
                <td className="p-2">-</td>
                <td className="p-2">-</td>
              </tr>
            }
            {listFile.map((file, i) => {
              const isSelected = selectRow.includes(file.fileName);
              return (
                // UI tập tin được hiển thị
                <tr onDoubleClick={file.isFolder ? () => handleRowClick(file.id, file.fileName) : undefined} key={i} className={`group border-b hover:bg-gray-100 ${isSelected ? 'bg-[rgb(181_227_243)]' : ''}`}>
                  {/* Checkbox để chọn tập tin */}
                  <td className={`p-2 text-blue-700 w-8 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:!opacity-100'} transition-opacity duration-200`}>
                    <input type="checkbox" checked={isSelected}
                      onChange={(e) => handleListSelect(file.fileName, e.target.checked, file.id, file)}

                    />
                  </td>
                  {/* Hiển thị tên tập tin hoặc thư mục */}
                  <td className="cursor-pointer p-2 flex items-center space-x-2">
                    {file.isFolder ? (
                      <FaFolder className="text-yellow-500" />
                    ) : file.fileType?.includes("pdf") ? (
                      <FaFilePdf className="text-red-500" />
                    ) : file.fileType?.includes("image") ? (
                      <FaImages className="text-blue-500" />
                    ) : file.fileType?.includes("video") ? (
                      <FaPhotoVideo className="text-blue-500" />
                    ) : (
                      <FaAlignCenter className="text-gray-500" />
                    )}
                    {renamingFile === file.fileName ? (
                      <input
                      
                        autoFocus
                        value={renameValue}
                        onChange={(e) => setRenameValue(e.target.value)}
                        onBlur={handleSaveRename}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSaveRename();
                        }}
                        className="border px-2 py-1 rounded"
                      />
                    ) : (
                      <a href= {file.keyPath}  target="_blank">{file.fileName}</a>
      
                    )}
                  </td>
                  {/* Hiển thị ngày tạo tập tin */}
                  <td className="p-2">{file.createDate}</td>
                  {/* Hiển thị kích thước tập tin */}
                  <td className="p-2">{file.fileSize || "-"}</td>
                </tr>
              )
            }
            )}
          </tbody>
        </table>
      </div>
    </div>

  );
}
