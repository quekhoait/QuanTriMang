import { useState, useEffect, useRef, use } from "react";
import { FaDownload, FaFolder, FaFilePdf, FaRedoAlt, FaFolderOpen, FaShareAlt, FaTrash, FaPencilAlt, FaImages, FaAlignCenter, FaPhotoVideo } from "react-icons/fa";
import { useUser } from "../../contexts/UserContext";
import { useFile } from "../../contexts/FileContext";
import FormAuthenComponent from "../FormAuthenComponent/FormAuthenComponent";
import { FormShareComponent } from "../FormShareComponent/FormShareComponent";
import { fetchWithAuth } from "../../utils/authFetch";
import { IoDocumentText } from "react-icons/io5";
import { ClipLoader } from "react-spinners";

export default function FilePageComponent({ listFiles, isAllFile, fileName, rowId, setRowId }) {
    //listFiles json dữ liệu tệp tin lấy api/file/listFile/:userId/:parentFolderId
    const { getListFileParent,  removeFile } = useFile();
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

    const [selectRow, setSelectRow] = useState([]) //hàng dược chọn
    const [listFileId, setListFileId] = useState([]); 
    const [listFileSelect, setListFileSelect] = useState([]); //các file id được chọn

    const handleSelectItem = ( checked, name, id) => {
        if(checked){
            setListFileSelect(prev=>[...prev, name]);
setListFileId(prev=>[...prev, id]);
        }else{
            setListFileSelect(prev=>prev.filter(item=>item!==name));
setListFileId(prev=>prev.filter(item=>item!==id));
        }
    }

    const handleAllSelect = (checked, listFile) => {
        if(checked){
             const names = listFile.map(item => item.fileName);
            setListFileSelect(names);
             const ids = listFile.map(item => item.id);
            setListFileId(ids);
        }else{
            setListFileSelect([]);
            setListFileId([]);
        }
    };


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
        if (listFileSelect.length === 1) {
            const fileToRename = listFileSelect[0];
           setRenamingFile(fileToRename);

            setRenameValue(fileToRename);
                    setIsOpen(false);
            
        }else{
            alert("Chỉ lựa chọn 1 tập tin!");
            
        }
    };

    //Tạo folder mới
    const { account, getUser } = useUser();
    //Laayus token
    const token = localStorage.getItem('accessToken');
    const createFolder = async () => {
        try {
            const response = await fetchWithAuth('http://localhost:5999/api/file/upload', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
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
      console.log(renameValue)
      console.log(renamingFile)
        const newList = listFile.map(file => {
            if (file.fileName === renamingFile) {
                return { ...file, fileName: renameValue };
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
    //upload file
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
    const [isUploading, setIsUploading] = useState(false);

    const uploadFilde = async (fileUpload) => {
        const isDuplicate = listFiles.find(file => file.fileName === fileUpload.name);
        if (isDuplicate) {
            alert(" Tên file đã tồn tại!");
            return; // 👉 Dừng luôn hàm nếu trùng
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
        setIsUploading(true);
        try {
            const response = await fetchWithAuth('http://localhost:5999/api/file/upload', {
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
                getListFileParent(rowId)
            } else {
                alert("Upload file thất bại" + data.message)
            }

        } catch (err) {
            alert("Lỗi up file" + err.message)
        }
        finally {
            setIsUploading(false); // ✅ Dừng loading
        }
    }


    // Đường dẫn thư mục hiện hành
    const [pathFolder, setPathFolder] = useState([{ fileId: null, fileName: fileName }]);



    //xoa file
    const handleDeleteFile = async () => {
        const result = window.confirm("Bạn chắc chắn muốn xóa?");
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
    const [listFileDownload, setListFileDownload ] = useState([]);
    const getFileById = async(id)=>{

      try{
        const response = await fetch(`http://localhost:5999/api/file/getFileById/${id}`, {
          method: "GET",
          headers: {
              "Content-Type": "application/json",
          }
        })
        const data = await response.json();
        if (response.ok) {
              setListFileDownload(prev => [...prev, ...data.files])
            } else {
                alert("Lỗi Server " + data.message);
            }
      }catch(err){
        alert("Lỗi server" + err.message)
      }
    }

useEffect(() => {
  if (listFileDownload.length > 0) {
    listFileDownload.forEach((file, index) => {
      setTimeout(() => {
        const link = document.createElement("a");
        link.href = `http://localhost:5999/api/file/oneFile?path=${file.keyPath}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, index * 1000); // delay 1s mỗi file
    });
  }
}, [listFileDownload]);


const handelDownload = () => {
  setListFileDownload([]); // reset
  listFileId.forEach(id => {
    getFileById(id);  
  });
};

  
    //Load file
    const handleLoad = () => {
        window.location.reload();
    }

    //Mở file
    const handlOpenFile = (keyPath, typeFile) => {
        if (typeFile.includes("image") || typeFile.includes("pdf")) {
            // Nếu là pdf hoặc img thì mở trực tiếp
            window.open(`http://localhost:5999/api/file/oneFile?path=${keyPath}`, "_blank");
        } else {
            // Nếu không phải thì thông báo confirm
            if (window.confirm("Không hỗ trợ định dạng này! File sẽ được tải xuống!")) {
                window.open(`http://localhost:5999/api/file/oneFile?path=${keyPath}`, "_blank");
            }
        }
    }

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await fetch("http://localhost:5999/api/files");
                const json = await res.json();
                setData(json);
            } catch (err) {
                console.error("Lỗi khi lấy dữ liệu:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="p-6 relative">

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
                    listFileId={listFileId}
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
                    <FaRedoAlt className="cursor-pointer" onClick={handleLoad} />
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-4 mb-4">

                <input type="file"
                    style={{ display: 'none' }}
                    ref={fileInputRef}
                    onChange={handleChangeFile}
                />
                <button
                    className={`bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 
              ${isUploading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"}`}
                    onClick={handleChooseFile}
                    disabled={isUploading}
                >
                    <span>⬆</span>
                    <span>{isUploading ? "Đang tải..." : "Upload"}</span>
                </button>

                {listFileSelect.length > 0 ? (
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
                    </div>) :(
                            <button className="border px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-100" onClick={createNewFolder}>
                        <span><FaFolderOpen /></span>
                        <span>New Folder</span>
                    </button>
                    )}
            </div>

            <div className="h-[460px] overflow-y-auto border rounded-md relative">
                {isUploading && (
                    <div className="flex justify-center items-center py-10 absolute w-full h-full">
                        <ClipLoader size={40} color="#36d7b7" />
                        <p className="ml-2">Đang tải dữ liệu...</p>
                    </div>
                )}
                <table className="w-full text-left min-w-[600px]">

                    <thead className="sticky top-0 bg-white ">
                        <tr className="border-b">
                            <th className="p-2 text-blue-700 w-8">
                                <input type="checkbox" 
                                    checked = {(listFile.length !== listFileSelect.length) ? false : true}
                                    onChange={(e) => handleAllSelect(e.target.checked, listFile)}
                                />
                            </th>
                            <th className="p-2 text-blue-700">File name</th>
                            <th className="p-2 text-blue-700">Date added ⬇</th>
                            <th className="p-2 text-blue-700">Size</th>
                        </tr>
                    </thead>
                    <tbody>
                        <>
                            {isCreating && (
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
                            )}
                            {listFile.map((file, i) => {
                                return (
                                    <tr
                                        key={i}
                                        onDoubleClick={
                                            file.isFolder ? () => handleRowClick(file.id, file.fileName) : undefined
                                        }
                                        className={`group border-b hover:bg-gray-100 ${listFileSelect.includes(file.fileName) ? 'bg-[rgb(181_227_243)]' : ''
                                            }`}
                                    >
                                        <td
                                            className={`p-2 text-blue-700 w-8 ${listFileSelect.includes(file.fileName)  ? 'opacity-100' : 'opacity-0 group-hover:!opacity-100'
                                                } transition-opacity duration-200`}
                                        >
                                            <input
                                                type="checkbox"
                                                
                                                onChange={(e) => handleSelectItem(e.target.checked, file.fileName, file.id)}
                                                checked={listFileSelect.includes(file.fileName)}

                                            />
                                        </td>
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
                                                <IoDocumentText className="text-gray-500" />
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
                                                <a
                                                    onDoubleClick={() => handlOpenFile(file.keyPath, file.fileType)}
                                                    target="_blank"
                                                >
                                                    {file.fileName}
                                                </a>
                                            )}
                                        </td>
                                        <td className="p-2">{file.createDate}</td>
                                        <td className="p-2">{file.fileSize || "-"}</td>
                                    </tr>
                                );
                            })}
                        </>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
