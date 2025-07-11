import React, { useEffect } from 'react'
import FilePageComponent from '../FilePageComponent/FilePageComponent'
import { useFile } from '../../contexts/FileContext';
import { useUser } from '../../contexts/UserContext';

const VideoComponent = () => {
  const {listFileType, getFileType} = useFile();
  const { account, getUser } = useUser();
  
  useEffect(() => {
    if (account?.data?.id != null) {
      getFileType("Video"); // ✔️ truyền đúng rowId
    }
  }, [account?.data?.id]);
  return (
    <div>
      <FilePageComponent 
              listFiles={listFileType}
              fileName={"Video"}
              isAllFile={false}
            />
    </div>
  )
}

export default VideoComponent