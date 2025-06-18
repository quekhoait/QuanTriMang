import React from 'react'

const MenuItemComponent = ({fileName, img:Icon, flag, onClick}) => {
  return (
    <button className={`flex items-center !pl-[36px] w-[95%] space-x-2 px-4 py-2 rounded-full hover:bg-blue-200 transition mt-[4px] mb-[4px]
                    ${flag ? 'bg-blue-500' : 'transparent'}`}
           onClick={onClick}
          >
      <Icon className="text-lg text-black" />
      <span className="text-black font-normal">{fileName}</span>
    </button>
  )
}

export default MenuItemComponent