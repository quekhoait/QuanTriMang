import React from 'react'
import FilePageComponent from '../FilePageComponent/FilePageComponent'

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
  
    <div>
      <FilePageComponent 
        listFiles={files}
        fileName={"All file"}
        isAllFile={true}
      />
    </div>
  )
}
