import React, { useState } from 'react'
import NavbarComponent from '../../components/NavbarComponent/NavbarComponent';
import NavMenuComponent from '../../components/NavMenuComponent/NavMenuComponent'
import { FaRegFileAlt, FaRegImage, FaMusic } from "react-icons/fa";
import { AllFileComponent } from '../../components/AllFileComponent/AllFileComponent';
import ImageComponent from '../../components/ImageComponent/ImageComponent';


const HomePage = ({event}) => {  
  const [openItem, setOpenItem] = useState('AllFile'); // ✅ quản lý trạng thái ở đây

  const handleChange = (itemName) => {
    setOpenItem(itemName);
  };
  return (
    <div>
      <NavbarComponent />
      <div className="flex justify-center pt-[12px]">
        <div className="row w-[90%]">
          <div className="col-3 w-[20%]">
            <NavMenuComponent openItem={openItem} onChangeItem={handleChange}/>
          </div>
          <div className="col-9 bg-white">
            {openItem === 'AllFile' && <AllFileComponent />}
            {openItem === 'Image' &&     <ImageComponent />}
        
          </div>
        </div>
      </div>
    </div>
  );
};


export default HomePage