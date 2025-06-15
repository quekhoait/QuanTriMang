import React, { useState } from 'react'
import MenuItemComponent from '../MenuItemComponent/MenuItemComponent'
import { FaAddressBook, FaEllipsisH, FaImages, FaMusic, FaPhotoVideo, FaRegFileAlt } from 'react-icons/fa'
import HomePage from '../../pages/HomePage/HomePage'

const NavMenuComponent = ({openItem, onChangeItem}) => {
  return (
    <div>
      <div className="pb-[16px] border-b-[2px] border-blue-400">
      <MenuItemComponent 
          fileName = {"All file"}
          img = {FaRegFileAlt}
          onClick={() => onChangeItem('AllFile')}
          flag={openItem === 'AllFile'}
      />
      <MenuItemComponent 
          fileName = {"Image"}
          img = {FaImages}
          onClick={() => onChangeItem('Image')}
          flag={openItem === 'Image'}
      />
      <MenuItemComponent 
          fileName = {"Video"}
          img = {FaPhotoVideo}
          onClick = {()=>onChangeItem('Video')}
          flag={openItem === 'Video'}
      />
      <MenuItemComponent 
          fileName = {"Documents"}
          img = {FaAddressBook}
          // onClick = {()=>handleChange('Documents')}
          flag={openItem === 'Documents'}
      />
      <MenuItemComponent 
          fileName = {"Music"}
          img = {FaMusic}
          // onClick = {()=>handleChange('Music')}
          flag={openItem === 'Music'}
      />
      <MenuItemComponent 
          fileName = {"Orther"}
          img = {FaEllipsisH}
          // onClick = {()=>handleChange('Orther')}
          flag={openItem === 'Orther'}
      />
      
    </div>

    <div className="pt-[16px]">
      <MenuItemComponent 
          fileName = {"All file"}
          img = {FaRegFileAlt}
      />
      <MenuItemComponent 
          fileName = {"All file"}
          img = {FaRegFileAlt}
      />
      <MenuItemComponent 
          fileName = {"All file"}
          img = {FaRegFileAlt}
      />   
    </div>
    </div>
  )
}

export default NavMenuComponent