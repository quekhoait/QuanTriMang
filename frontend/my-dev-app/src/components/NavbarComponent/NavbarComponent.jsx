import React, { useState } from 'react'
import image from '../../assets/user.png'

const NavbarComponent = () => {
    const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white py-[16px]  w-[100%] flex items-center justify-center shadow-md fixed">
      <nav className="flex items-center justify-between w-[90%]">
        <div className="flex items-center w-[40%] justify-between">
          <div className="flex items-center space-x-2">
            <img src="/logo192.png" alt="Logo" className="w-8 h-8" />
            <span className="text-xl font-bold text-gray-800">TeraBox</span>
          </div>

          {/* Search */}
          <div className="relative w-[300px]">
            <input
              type="text"
              placeholder="Search my files"
              className="w-full py-2 pl-4 rounded-full bg-gray-100 focus:outline-none pr-[60px]"
            />
            <i className="fa-solid fa-magnifying-glass top-[0px] right-[0px] h-[100%] border-l hover:bg-blue-400
              text-gray-600 absolute cursor-pointer pl-[12px] pr-[22px] text-[1.3rem] leading-[40px] rounded-r-[24px]" />
          </div>
        </div>
        <div className="flex items-center space-x-4">

          {/* Avatar + Dropdown */}
          <div className="relative">
            <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
              <img
              src="https://i.imgur.com/0y0y0y0.png"
              alt="avatar"
              className="w-9 h-9 rounded-full cursor-pointer"
              />
              <p className="text-blue-700 font-medium"  >user</p>
            </div>
            {isOpen && (
              <ul className="absolute right-[-20px] mt-2 w-40 bg-white border rounded-lg shadow-lg z-10">
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">My Profile</li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Settings</li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Log Out</li>
              </ul>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}

export default NavbarComponent