import React, { useEffect, useState } from 'react'
import imageUser from '../../assets/user.png'
import logo from '../../assets/logo.png'
import { useUser } from '../../contexts/UserContext';
import { data, useNavigate } from 'react-router-dom';

const NavbarComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { account, getUser } = useUser();


  const navigate = useNavigate();

  const handleProfile = () => {
    navigate("/profile")
  }

  const handleHomePage = () => {
    navigate("/")
  }
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/account/login', { replace: true })
    }
  })

  //Đăng xuất user
  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:5999/api/user/logout', {
        method: "POST",
        headers: {
          'Contet-Type': 'application/json'
        }
      })
      if (response.ok) {
        alert("Đăng xuát thành công");
        localStorage.removeItem('accessToken');
        navigate('/account/login', { replace: true });
      }
    } catch (err) {
      alert("Lỗi đăng xuất" + err.message)
    }
  }

  //Tìm kiems file
  const [listFilesSearch, setListFilesSearch] = useState([]);
  const [keyword, setKeyword] = useState()
  const handleSearchFile = async (id, key) => {
    try {
      const response = await fetch(`http://localhost:5999/api/file/find-by-name/${id}/${key}`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json();
      if (response.ok) {
        setListFilesSearch(data.files);

      } else {
        setListFilesSearch([])
      }
      if (key !== "" && data.files.length === 0) {
        alert("Không tồn tại file")
      }
    } catch (err) {
      alert("Lỗi server" + err.message)
    }
  }

  useEffect(() => {
    navigate("/", { state: { listFilesSearch } });
  }, [listFilesSearch])

  return (
    <div className="bg-white py-[16px]  w-[100%] flex items-center justify-center shadow-md fixed">
      <nav className="flex items-center justify-between w-[90%]">
        <div className="flex items-center w-[40%] justify-between">
          <div className="flex items-center space-x-2">
            <img src={logo} alt="Logo" className="w-17 h-14" />
            <span onClick={handleHomePage} className="text-xl font-bold text-gray-800 cursor-pointer">Star Box</span>
          </div>

          {/* Search */}
          <div className="relative w-[300px]">
            <input
              type="text"
              placeholder="Search my files"
              className="w-full py-2 pl-4 rounded-full bg-gray-100 focus:outline-none pr-[60px]"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <i className="fa-solid fa-magnifying-glass top-[0px] right-[0px] h-[100%] border-l hover:bg-blue-400
              text-gray-600 absolute cursor-pointer pl-[12px] pr-[22px] text-[1.3rem] leading-[40px] rounded-r-[24px]" onClick={() => handleSearchFile(account?.data?.id, keyword)} />
          </div>
        </div>
        <div className="flex items-center space-x-4">

          {/* Avatar + Dropdown */}
          <div className="relative">
            <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
              <img
                src={account?.data?.avatar}
                alt="avatar"
                className="w-9 h-9 rounded-full cursor-pointer !m-auto"
              />
              <p className="text-blue-700 font-medium" >{account?.data?.username}</p>
            </div>
            {isOpen && (
              <ul className="absolute right-[-20px] mt-2 w-40 bg-white border rounded-lg shadow-lg z-10">
                <li onClick={handleProfile} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">My Profile</li>
                <li onClick={handleLogout} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Đăng xuất</li>
              </ul>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}

export default NavbarComponent