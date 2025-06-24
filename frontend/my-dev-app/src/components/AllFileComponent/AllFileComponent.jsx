import React, { use, useEffect, useState } from 'react'
import FilePageComponent from '../FilePageComponent/FilePageComponent'
import { FaFilePdf, FaFolder } from 'react-icons/fa';
import { useUser } from '../../contexts/UserContext';


const flatData = [
  { id: 1, userId: 1, parentFolderId: null, fileName: "Tài liệu", type: "folder" },
  { id: 2, userId: 1, parentFolderId: 1, fileName: "CV.pdf", type: "pdf" },
  { id: 3, userId: 1, parentFolderId: 1, fileName: "Ảnh đại diện", type: "folder" },
  { id: 4, userId: 1, parentFolderId: 3, fileName: "me.jpg", type: "jpg" },
  { id: 5, userId: 1, parentFolderId: null, fileName: "Tài liệu Bob", type: "folder" },
];



export const AllFileComponent = () => {  
  const {account, getUser} = useUser();

  const [listFile, setListFile] = useState([]);
    const [rowId, setRowId] = useState();
  console.log(rowId)

  const getListFile = async()=>{
    const userId = account?.data?.id;
    const parentFolderId = rowId === undefined ? null : rowId;
    try{
      const response = await fetch(`http://localhost:5999/api/file/listFile/${userId}/${parentFolderId===null ? 'NULL' : rowId}`,{
        method: "GET",
        credentials: 'include'
      })
      const data = await response.json();
      if(response.ok){
        console.log(data.files)
        setListFile(data.files)
      }else{
        alert("Lỗi khi lấy danh sách: " + data.message)
      }
    }catch(err){
      console.error("Lỗi fetch API", err);
    }
  }

  useEffect((e)=>{
    if(account?.data?.id){
      getListFile();
    }
  }, [account?.data?.id,rowId])




  return (
  <FilePageComponent 
      listFiles={listFile}
      fileName={"All file"}
      isAllFile={false}
      setRowId={setRowId}
      rowId = {rowId}
    />  
  
  )
}
