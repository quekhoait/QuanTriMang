import React, { useState } from 'react'
import FilePageComponent from '../FilePageComponent/FilePageComponent'
import { useFile } from '../../contexts/FileContext';

const ImageComponent = () => {
  const {fileImage, listFileImgae} = useState();
    const {listFileParent, getListFileParent} = useFile();
  console.log(listFileParent)

  // listFiles.forEach(element => {
    
  // });

  return (
    <div>
      <FilePageComponent 
              listFiles={fileImage}
              fileName={"Image"}
              isAllFile={false}
            />
    </div>
  )
}

export default ImageComponent