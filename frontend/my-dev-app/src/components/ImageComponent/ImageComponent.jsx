import React, { useEffect, useState } from 'react'
import FilePageComponent from '../FilePageComponent/FilePageComponent'
import { useFile } from '../../contexts/FileContext';
import { useUser } from '../../contexts/UserContext';

const ImageComponent = () => {

  const {listFileType, getFileType} = useFile();
  const { account, getUser } = useUser();


console.log(account?.data?.id)
useEffect(() => {
  if (account?.data?.id != null) {
    getFileType("image"); // ✔️ truyền đúng rowId
  }
}, [account?.data?.id]);


  return (
    <div>
      <FilePageComponent 
              listFiles={listFileType}
              fileName={"Image"}
              isAllFile={false}
            />
    </div>
  )
}

export default ImageComponent