import React, { use, useEffect, useState } from 'react'
import FilePageComponent from '../FilePageComponent/FilePageComponent'
import { FaFilePdf, FaFolder } from 'react-icons/fa';
import { useUser } from '../../contexts/UserContext';
import { useFile } from '../../contexts/FileContext';


const flatData = [
  { id: 1, userId: 1, parentFolderId: null, fileName: "Tài liệu", type: "folder" },
  { id: 2, userId: 1, parentFolderId: 1, fileName: "CV.pdf", type: "pdf" },
  { id: 3, userId: 1, parentFolderId: 1, fileName: "Ảnh đại diện", type: "folder" },
  { id: 4, userId: 1, parentFolderId: 3, fileName: "me.jpg", type: "jpg" },
  { id: 5, userId: 1, parentFolderId: null, fileName: "Tài liệu Bob", type: "folder" },
];



export const AllFileComponent = () => {
  const { account, getUser } = useUser();
  const {listFileParent, getListFileParent, rowId, setRowId} = useFile();


useEffect(() => {
  if (account?.data?.id != null) {
  getListFileParent(rowId);

  }
}, [account?.data?.id, rowId]);


  return (
    <FilePageComponent
      listFiles={listFileParent}
      fileName={"All File"}
      isAllFile={false}
      setRowId={setRowId}
      rowId={rowId}
    />

  )
}
