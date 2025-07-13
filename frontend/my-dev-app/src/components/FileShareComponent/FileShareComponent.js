import React, { use, useEffect, useState } from "react";
import { useFile } from "../../contexts/FileContext";
import { useUser } from "../../contexts/UserContext";

const FileShareComponent = () => {
  //chứa dữ liệu đang chia sẻ của user hiện hành
const [permission, setPermission] = useState("view");

  const {account} = useUser();
  const { getReceiveFile,getShareFile, changePermissionFileShare} = useFile();

  const [listFileRece, setListFileRece] = useState([]);

  const [listFileShare, setListFileShare] = useState([]);

  const getReceiveFiles= async()=>{
    const fileReceive = await getReceiveFile(account?.data?.id);
    if(fileReceive === null){
      return;
    }else{
      setListFileRece(fileReceive);
    }
  }
  useEffect((e)=>{
    getReceiveFiles();
    
  }, [account?.data?.id])


    const getShareFiles= async()=>{
    const fileShare = await getShareFile(account?.data?.id);
    if(fileShare === null){
      return;
    }else{
      setListFileShare(fileShare);
    }
  }
    useEffect((e)=>{
    getShareFiles();
    
  }, [account?.data?.id])


const getDownloadUrl = (url) => {
  return url.replace('/upload/', '/upload/fl_attachment/');
};

const handlePermissionChange = async(index, value) => {
  const updatedList = [...listFileShare];
  updatedList[index].permission = value;
  setListFileShare(updatedList);  
  const file = updatedList[index]; // Lấy phần tử được chọn
  try {
    const result = await changePermissionFileShare(
      file.id,              // fileId
      file.sharedToUserId,      // user được chia sẻ
      file.permission                     // quyền mới
    );
    console.log("Cập nhật thành công:", result);
  } catch (error) {
    console.error("Lỗi khi cập nhật quyền:", error);
  }
};


  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-2 !pt-6 h-[90%]">
      {/* File đang chia sẻ */}
      <div className="bg-white shadow-md rounded-xl p-2 !pt-4">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          📤 File đang chia sẻ
        </h2>
        <p className="text-sm text-gray-500 mt-1 mb-4 text-left">
          Thông tin người được chia sẻ
        </p>

        <div className="overflow-hidden overflow-x-auto h-[480px]">
          <table className="text-sm text-left text-gray-600 w-[700px]">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100 border-b">
              <tr>
                <th className="px-3 py-3 max-w-[150px] truncate">Email</th>
                <th className="px-3 py-3 max-w-[120px] truncate">Tên</th>
                <th className="px-3 py-3 max-w-[150px] truncate">Tên file</th>
                <th className="px-3 py-3 max-w-[100px] truncate">Ngày gửi</th>
                <th className="px-3 py-3 max-w-[200px] truncate">Quyền</th>
              </tr>
            </thead>
            <tbody>
              {listFileShare.map((file, index) => (
                <tr key={index} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-3 py-3 max-w-[150px] truncate" title={file.email}>
                    {file.email}
                  </td>
                  <td className="px-3 py-3 max-w-[120px] truncate" title={file.username}>
                    {file.username}
                  </td>
                  <td className="px-3 py-3 max-w-[150px] truncate" title={file.fileName}>
                    <a href={file.keyPath}  target="_blank" >{file.fileName}</a>
                  </td>
                  <td className="px-3 py-3 max-w-[100px] truncate" title={file.createDate}>
                    {file.createDate}
                  </td>
                  <td className="px-3 py-3 max-w-[200px] truncate">
  <select
    className="border px-2 py-1 rounded w-full"
    value={file.permission}
    onChange={(e) => handlePermissionChange(index, e.target.value)}
  >
    <option value="view">Xem</option>
    <option value="edit">Chỉnh sửa</option>
  </select>
</td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* File nhận được */}
      <div className="bg-white shadow-md rounded-xl p-2 !pt-4">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          📥 File nhận được
        </h2>
        <p className="text-sm text-gray-500 mt-1 mb-4 text-left">
          Thông tin người đã chia sẻ
        </p>

        <div className="overflow-hidden overflow-x-auto h-[480px]">
          <table className="w-[700px] text-sm text-left text-gray-600">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100 border-b">
              <tr>
                <th className="px-3 py-3 max-w-[150px] truncate">Email</th>
                <th className="px-3 py-3 max-w-[120px] truncate">Tên</th>
                <th className="px-3 py-3 max-w-[150px] truncate">Tên file</th>
                <th className="px-3 py-3 max-w-[100px] truncate">Ngày gửi</th>
                <th className="px-3 py-3 max-w-[100px] truncate"></th>
              </tr>
            </thead>
            <tbody>
              {listFileRece.map((file, index) => (
                <tr key={index} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-3 py-3 max-w-[150px] truncate" title={file.email}>
                    {file.email}
                  </td>
                  <td className="px-3 py-3 max-w-[120px] truncate" title={file.name}>
                    {file.username}
                  </td>
                  <td className="px-3 py-3 max-w-[150px] truncate" title={file.fileName}>
                      <a href={file.keyPath}  target="_blank" >{file.fileName}</a>
                  </td>
                  <td className="px-3 py-3 max-w-[100px] truncate" title={file.createDate}>
                    {file.createDate}
                  </td>
                  <th className="px-3 py-3 max-w-[100px] truncate">
                    {file.permission === "edit" && (
                      <a href= {getDownloadUrl(file.keyPath)}>
                        <i className="fa-solid fa-download cursor-pointer"></i>                 
                      
                      </a>
                    )}
                  </th>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FileShareComponent;
