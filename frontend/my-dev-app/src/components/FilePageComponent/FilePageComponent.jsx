import { useState, useEffect, useRef, use } from "react";
import { FaDownload, FaFolder, FaFilePdf, FaRedoAlt, FaTh, FaFolderOpen, FaShareAlt } from "react-icons/fa";
import { AiOutlineFolderAdd } from "react-icons/ai";
import { CiMenuKebab } from "react-icons/ci";
import { FaRegStar } from "react-icons/fa6";
import { useUser } from "../../contexts/UserContext";

export default function FilePageComponent({ listFiles, isAllFile, fileName, rowId, setRowId }) {
  //listFiles json dữ liệu tệp tin lấy api/file/listFile/:userId/:parentFolderId


  //Tạo thêm folder mới
  const [isCreating, setIsCreating] = useState(false);
  const [nameNewFolder, setNameNewFolder] = useState("New folder")
  const [dateTime, setDateTime] = useState();

  const createNewFolder = () => {
    setIsCreating(true);
    setNameNewFolder("New Folder")
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
    if (nameNewFolder.trim() === " ") return;

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
  const handleListSelect = (name, checked) => {
    if (checked) {
      setSelectRow(prev => [...prev, name]);
    } else {
      setSelectRow(prev => prev.filter(item => item !== name)) //lọc qua các phần tử và giữ lại phần tử khác name
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

  const createFolder = async () => {
    try {
      const response = await fetch('http://localhost:5999/api/file/upload', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
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
  const handleRowClick = (folderId,folderName) => {
    setPathFolder(prev => [...prev,{fileId: folderId, fileName: folderName}]);
    setRowId(folderId);
  }

  const handleFolderClick = (e,fileId,index) => {
    // Xử lý khi người dùng nhấn vào thư mục
    if (pathFolder.length > 1) {
      setPathFolder(prev => prev.slice(0, index + 1)); // Xóa phần tử cuối cùng trong mảng
      // const lastFolder = pathFolder[pathFolder.length - 2];
      setRowId(fileId);
    }
  }
  //uplaod file
  const {fileUpload, setFileUpLoad} = useState(null);
  const fileInputRef = useRef(null);
  const handleChooseFile = (e)=>{
    e.preventDefault();
    fileInputRef.current.click();
  }  
      const handleChangeFile = (e)=>{
        const file = e.target.files?.[0];
        if(!file){
          return;
        }
        const result = window.confirm("Bạn chắc chắc upload file: " + file.name)
        if(result){
          uploadFilde(file)
        }
      }

  const uploadFilde = async(fileUpload)=>{
    const formData = new FormData();
      formData.append("file", fileUpload);
      formData.append("userId", account?.data?.id);
      //formData.append("fileName", fileUpload.name);
      //formData.append("fileType", fileUpload.type);
      //formData.append("fileSize", fileUpload.size);
      formData.append("isFolder", 0);
      formData.append("parentFolderId", rowId);
    try{
        console.log(fileUpload);
        const response = await fetch ('http://localhost:5999/api/file/upload',{
          method: "POST",
          credentials: 'include',
          body: formData          
        })
        const data = await response.json();
        console.log(response)
        if (response.ok) {
          alert("Upload file thành công");
        } else {
          alert("Upload file thất bại" + data.message)
        }
      
    }catch(err){
      alert("Lỗi up file" + err.message)
    }
  }

  // Đường dẫn thư mục hiện hành
  const [pathFolder, setPathFolder] = useState([{fileId: null, fileName: fileName}]);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-0">
          
          {/* Hiển thị đường dẫn thư mục */}
          {pathFolder.map((path, index) => {
            let style = (rowId !== path.fileId ? "text-gray-500 ": "" ) + "text-2xl font-semibold cursor-pointer";
            return path.fileId === null ? <span onClick={(e) => handleFolderClick(e,path.fileId,index)}><h2 className={style}>{path.fileName}</h2></span> :
            <span onClick={(e) => handleFolderClick(e,path.fileId,index)}><h2 className={style}>{"/" + path.fileName}</h2></span>
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
          style={{display: 'none'}}
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
            <button className="text-xl">
              <AiOutlineFolderAdd />
            </button>

            <button className="">
              <FaRegStar />
            </button>

            <button className="">
              <FaShareAlt />
            </button>

            <button className="">
              <FaDownload />
            </button>
            <div className="relative" ref={menuRef}>
              <button onClick={() => setIsOpen(!isOpen)}>
                <CiMenuKebab />
              </button>
              {isOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-20">
                  <ul className="text-sm text-gray-700">
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Move</li>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Copy</li>
                    {selectRow.length === 1 && <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={handleRename}>Rename</li>}
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Delete</li>
                  </ul>
                </div>
              )}
            </div>
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
                <tr onDoubleClick={file.isFolder ? () => handleRowClick(file.id,file.fileName) : undefined} key={i} className={`group border-b hover:bg-gray-100 ${isSelected ? 'bg-[rgb(181_227_243)]' : ''}`}>
                  {/* Checkbox để chọn tập tin */}
                  <td className={`p-2 text-blue-700 w-8 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:!opacity-100'} transition-opacity duration-200`}>
                    <input type="checkbox" checked={isSelected}
                      onChange={(e) => handleListSelect(file.fileName, e.target.checked)}
                    />
                  </td>
                  {/* Hiển thị tên tập tin hoặc thư mục */}
                  <td className="cursor-pointer p-2 flex items-center space-x-2">
                    {file.isFolder === true ? (
                      <FaFolder className="text-yellow-500" />
                    ) : (
                      <FaFilePdf className="text-red-500" />
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
                      <span>{file.fileName}</span>
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
