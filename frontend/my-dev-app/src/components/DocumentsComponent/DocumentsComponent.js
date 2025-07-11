import React, { useEffect } from 'react'
import FilePageComponent from '../FilePageComponent/FilePageComponent'
import { useFile } from '../../contexts/FileContext';
import { useUser } from '../../contexts/UserContext';

const DocumentsComponent = () => {
  const {listFileType, getFileType} = useFile();
    const { account, getUser } = useUser();
  
  useEffect(() => {
    if (account?.data?.id != null) {
      getFileType("msword"); // hoặc
      getFileType("pdf");
      getFileType("document")
    }
  }, [account?.data?.id]);
  return (
      <div>
        <FilePageComponent 
            listFiles={listFileType}
            fileName={"Documents"}
            isAllFile={false}
            />
      </div>
  )
}

export default DocumentsComponent