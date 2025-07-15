import React, { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "./UserContext";
import { fetchWithAuth } from "../utils/authFetch";

const UserContext = createContext({
    getListFile: () => { },
    listFile: [],
    setRowId: () => { },
    rowId: null
})

const token = localStorage.getItem("accessToken");

export const FileProvider = ({ children }) => {
    const [listFileParent, setListFileParent] = useState([]);
    const [listFileType, setListFileType] = useState([]);
    const { account, getUser } = useUser();
    const [rowId, setRowId] = useState(null); // ✅ tách riêng rowId
    const userId = account?.data?.id;

    const [listFileItemShare, setListFileItemShare] = useState([]);


    const getListFileParent = async (rowId) => {  
        const parentFolderId = rowId === undefined ? null : rowId;
        try {
            const response = await fetch(`http://localhost:5999/api/file/listFile/${userId}/${parentFolderId === null ? 'NULL' : rowId}`, {
                method: "GET",
                headers: {
                  'Authorization': 'Bearer ' + token,
                },
                credentials: 'include'
            })
            const data = await response.json();
            if (response.ok) {
                //chuẩn hóa lại dữ liệu datetime
                data.files.forEach(file => {
                    //  const formattedFile = { ...file };
                    if (file.createDate) {
                        file.createDate = new Date(file.createDate).toLocaleString();
                    }
                    if (file.updateDate) {
                        file.updateDate = new Date(file.updateDate).toLocaleString();
                    }
                    if (file.fileSize) {
                        file.fileSize = (file.fileSize / (1024 * 1024)).toFixed(2);
                    }
                });
                setListFileParent(data.files)

            } else {
                alert("Lỗi khi lấy danh sách: " + data.message)
            }
        } catch (err) {
            console.error("Lỗi fetch API", err);
        }
    }

    const getFileType = async(type)=>{
      try{
        const response = await fetchWithAuth(`http://localhost:5999/api/file/getFileType/${userId}/${type}`,{
          method: "GET",
          headers: {
                  'Authorization': 'Bearer ' + token,
                },
          credentials: 'include'
        })
        const data = await response.json();
        if(response.ok){
          setListFileType(data.file)
        }else{
          alert("Lỗi khi lấy danh sách: " + data.message)
        }
      }catch(err){
        alert("Lỗi server" + err.message)
      }
    }

    const removeFile = async (listFileId) => {
        try {
            const response = await fetchWithAuth("http://localhost:5999/api/file/deleteFile", {
                method: "DELETE",
                headers: {
                  'Authorization': 'Bearer ' + token,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: userId,
                    fileIds: listFileId, // mảng fileId
                }),
            });

            const data = await response.json();
            if (response.ok) {
                alert("🗑️ Xóa thành công các file/thư mục đã chọn!");
                getListFileParent(rowId);
            } else {
                alert("❌ Xóa thất bại: " + data.message);
            }
        } catch (err) {
            console.error("❌ Lỗi fetch API:", err);
            alert("Đã xảy ra lỗi khi gửi yêu cầu xóa.");
        }
    };


    const createFileShare = async(userId, fileId, permission, expiresDate)=>{
      try{
        const response = await fetchWithAuth("http://localhost:5999/api/file/createFileShare",{
          method: "POST",
          headers:{"Content-Type": "application/json",
            'Authorization': 'Bearer ' + token,
            
          },
          body: JSON.stringify({
            userId, fileId, permission, expiresDate
          })
        })
        const data = await response.json();
            if (response.ok) {
                setListFileItemShare(data.fileShare)
            } else {
                alert("Chia sẻ thất bại" + data.message);
            }
      }catch(err){
            console.error("❌ Lỗi fetch API:", err);
            alert("Đã xảy ra lỗi khi gửi yêu cầu chia sẻ");
      }
    }
    
//Lấy thông tin file mà user hiện hành đã nhận được

    const getReceiveFile = async(id)=>{
      try{
        const response = await fetchWithAuth(`http://localhost:5999/api/file/receivedFileShare/${id}`,{
          method: "GET",
          credentials: 'include',
            headers: {
                  'Authorization': 'Bearer ' + token,
                },
        })
        const data = await response.json();


        if(response.ok){
          return data.fileShares;
        }else{
          alert("Lỗi khi lấy danh sách: " + data.message)
        }
      }catch(err){
        alert("Lỗi server" + err.message)
      }
    }

        const getShareFile = async(id)=>{
      try{
        const response = await fetchWithAuth(`http://localhost:5999/api/file/sharedFile/${id}`,{
          method: "GET",
          credentials: 'include',
            headers: {
                  'Authorization': 'Bearer ' + token,
                },
        })
        const data = await response.json();
        if(response.ok){
          return data.fileShares;
        }else{
          alert("Lỗi khi lấy danh sách: " + data.message)
        }
      }catch(err){
        alert("Lỗi server" + err.message)
      }
    }

      const changePermissionFileShare = async (fileShareId, userId, permission) => {
        try {
            const response = await fetch("http://localhost:5999/api/file/changePermissionFileShare", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  fileShareId: fileShareId,
                    userId: userId,
                    permission: permission, 
                }),
            });

            const data = await response.json();
            console.log(data)
            if (response.ok) {
                return data.fileShares;
            } else {
                alert("Lỗi API");
            }
        } catch (err) {
          alert("Lỗi API");
        }
    };




    // useEffect(() => {
    //     if (account?.data?.id != null) {
    //         getListFileParent(rowId);
    //     }
    // }, [account?.data?.id, rowId]);




    return (
        <UserContext.Provider value={{ listFileParent, getListFileParent, rowId, setRowId,
         removeFile, listFileType, getFileType, listFileItemShare, createFileShare, getReceiveFile, getShareFile, changePermissionFileShare}}>
            {children}
        </UserContext.Provider>
    );
}

export const useFile = () => useContext(UserContext)