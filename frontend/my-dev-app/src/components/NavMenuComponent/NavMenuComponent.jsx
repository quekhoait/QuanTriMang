import React, { useEffect, useState } from 'react'
import MenuItemComponent from '../MenuItemComponent/MenuItemComponent'
import { FaAddressBook, FaEllipsisH, FaImages, FaMusic, FaPhotoVideo, FaRegFileAlt } from 'react-icons/fa'
import HomePage from '../../pages/HomePage/HomePage'
import { useUser } from '../../contexts/UserContext'

const NavMenuComponent = ({ openItem, onChangeItem }) => {

  const { account, getUser } = useUser();
  const [dataUsed, setDataUsed] = useState(0)
  console.log(account)

  const ToGB =(value)=>{
    setDataUsed((value / (1024 * 1024)).toFixed(2));
  }

  useEffect((e)=>{
    const dataUsed = parseInt(account?.data?.sizeUsed ||"0");
    ToGB(dataUsed)
  }, [account?.data?.sizeUsed])

  const TinhDungLuong = ()=>{
    return parseFloat((dataUsed / 1024) * 100).toFixed(2);
  }
  return (
    <div>
      <div className="pb-[16px] border-b-[2px] border-blue-400">
        <MenuItemComponent
          fileName={"All file"}
          img={FaRegFileAlt}
          onClick={() => onChangeItem('AllFile')}
          flag={openItem === 'AllFile'}
        />
        <MenuItemComponent
          fileName={"Image"}
          img={FaImages}
          onClick={() => onChangeItem('Image')}
          flag={openItem === 'Image'}
        />
        <MenuItemComponent
          fileName={"Video"}
          img={FaPhotoVideo}
          onClick={() => onChangeItem('Video')}
          flag={openItem === 'Video'}
        />
        <MenuItemComponent
          fileName={"Documents"}
          img={FaAddressBook}
          onClick={() => onChangeItem('Documents')}
          flag={openItem === 'Documents'}
        />
  
      </div>

      <div className="pt-[16px] h-[380px]">
        <div className="flex flex-col items-center justify-between rounded-md h-[100%]">
          <MenuItemComponent
            fileName={"File share"}
            img={FaEllipsisH}
            onClick={() => onChangeItem('FileShare')}
            flag={openItem === 'FileShare'}
          />
          {/* Progress bar */}
          <div className="w-full mt-auto justify-center">
            <div className="text-gray-700 pb-[12px]">admin@gmail.com | {dataUsed} / 1024Mb</div>
            <div className="w-full bg-gray-200 rounded-full dark:bg-gray-700">
              <div className = "bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full" style={{width: TinhDungLuong()}}> {TinhDungLuong()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NavMenuComponent