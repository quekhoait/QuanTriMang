import React, { useEffect, useState } from 'react'
import NavbarComponent from '../../components/NavbarComponent/NavbarComponent';
import NavMenuComponent from '../../components/NavMenuComponent/NavMenuComponent'
// import { FaRegFileAlt, FaRegImage, FaMusic } from "react-icons/fa";
import { AllFileComponent } from '../../components/AllFileComponent/AllFileComponent';
import ImageComponent from '../../components/ImageComponent/ImageComponent';
import VideoComponent from '../../components/VideoComponent/VideoComponent';
import DocumentsComponent from '../../components/DocumentsComponent/DocumentsComponent';
import MusicComponent from '../../components/MusicComponent/MusicComponent'
import OtherComponent from '../../components/OtherComponent/OtherComponent';
import FileShareComponent from '../../components/FileShareComponent/FileShareComponent';

const HomePage = ({event}) => {  
  const [openItem, setOpenItem] = useState('AllFile'); // ✅ quản lý trạng thái ở đây

  const handleChange = (itemName) => {
    setOpenItem(itemName);
  };


  return (
    <div className="h-screen">
      <NavbarComponent />
      <div className="flex justify-center pt-[100px] h-screen">
        <div className="row w-[90%]">
          <div className="col-3 w-[20%]">
            <NavMenuComponent openItem={openItem} onChangeItem={handleChange}/>
          </div>
          <div className="col-9 bg-white">
            {openItem === 'AllFile' && <AllFileComponent />}
            {openItem === 'Image' &&     <ImageComponent />}
            {openItem === 'Video' &&     <VideoComponent />}
            {openItem === 'Documents' &&  <DocumentsComponent />}
            {openItem === 'Music' &&     <MusicComponent/>}
            {openItem === 'Other' &&  <OtherComponent />}
            {openItem === 'FileShare' &&  <FileShareComponent />}
          </div>
        </div>
      </div>
    </div>
  );
};


export default HomePage