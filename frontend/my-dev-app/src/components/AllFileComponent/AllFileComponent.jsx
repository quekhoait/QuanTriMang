import React, { useState } from 'react'
import FilePageComponent from '../FilePageComponent/FilePageComponent'
import { FaFilePdf, FaFolder } from 'react-icons/fa';


const flatData = [
  { id: 1, userId: 1, parentFolderId: null, fileName: "Tài liệu", type: "folder" },
  { id: 2, userId: 1, parentFolderId: 1, fileName: "CV.pdf", type: "pdf" },
  { id: 3, userId: 1, parentFolderId: 1, fileName: "Ảnh đại diện", type: "folder" },
  { id: 4, userId: 1, parentFolderId: 3, fileName: "me.jpg", type: "jpg" },
  { id: 5, userId: 1, parentFolderId: null, fileName: "Tài liệu Bob", type: "folder" },
];



export const AllFileComponent = () => {  

  const files = [
  { name: "video", date: "Mar 07", type: "folder" },
  { name: "AI", date: "Dec 05,2024", type: "folder" },
  { name: "img_video", date: "Dec 05,2024", type: "folder" },
  { name: "ae", date: "Sep 30,2024", type: "folder" },
  { name: "MMT", date: "Jul 20,2024", type: "folder" },
  { name: "From:  SM-A325F", date: "Jun 25,2024", type: "folder" },
  { name: "SổtayBắtđầuTeraBox.pdf", date: "Jun 25,2024", size: "44.38MB", type: "pdf" },
];

  return (  
    <FilePageComponent 
      listFiles={files}
      fileName={"All file"}
      isAllFile={false}
    />
  )
}
