import React, { use, useEffect, useRef, useState } from 'react'
import NavbarComponent from '../../components/NavbarComponent/NavbarComponent'
import imageUser from '../../assets/user.png'
import LabelFieldComponent from '../../components/ProfileComponent/LabelFieldComponent'
import { useUser } from '../../contexts/UserContext'
import FormAuthenComponent from '../../components/FormAuthenComponent/FormAuthenComponent'


const ProfilePage = () => {
  //button Edit
  const [isEditing, setEditing] = useState(false)

  //info
  const { account, getUser } = useUser();
  const [usernameUpdate, setUsernameUpdate] = useState();
  const [emailUpdate, setEmailUpdate] = useState();
  const [passwordUpdate, setPasswordUpdate] = useState();

  useEffect((e) => {
    if (account?.data?.username) {
      setUsernameUpdate(account?.data?.username)
    }
  }, [account?.data?.username])

  useEffect((e) => {
    if (account?.data?.email) {
      setEmailUpdate(account?.data?.email)
    }
  }, [account?.data?.email])

  useEffect((e) => {
    if (account?.data?.password) {
      setPasswordUpdate(account?.data?.password)
    }
  }, [account?.data?.password])

  //Lấy ảnh
  const [selectImage, setSelectImage] = useState();
  const [selectFileImage, setSelectFileImage] = useState();
  const fileInputRef = useRef(null);
  const handleChooseIamge = (e) => {
    e.preventDefault();
    fileInputRef.current.click();
  }

  const handleChangeImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    setSelectFileImage(file);
    setSelectImage(file);
  }
  //////////////////
  //Đổi avatar
  const [hoverAvatar, setHoverAvatar] = useState(false)
  const [showEditImage, setShowEditImage] = useState(false)

  useEffect(() => {
    if (hoverAvatar && isEditing) {
      setShowEditImage(true);
    } else {
      setShowEditImage(false); // ẩn khi không hover hoặc không edit
    }
  }, [hoverAvatar, isEditing]);
  ////////////////////////////
  //Update user
  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("username", usernameUpdate);
      formData.append("email", emailUpdate);
      formData.append("password", passwordUpdate);
      if (selectFileImage) {
        formData.append('avatar', selectFileImage)
      }
      const response = await fetch(`http://localhost:5999/api/user/update/${account?.data?.id}`, {
        method: "PUT",
        body: formData
      })
      const data = await response.json();
      if (response.ok) {
        alert("Cập nhật thành công");
        setEditing(false);
      } else {
        alert("Lỗi1" + data.message)
      }
    } catch (err) {
      alert("Lỗi" + err.message)
    }
  }

  const handleShowForm = () => {
    if (isShowForm) {
      setIsShowForm(false);
      return;
    } else {
      setIsShowForm(true);
      return;
    }
  }

  const handleEdit = () => {
    setEditing(true);
    setIsShowForm(false);
  }
  //Ẩn hiện form xác nhận mật khẩu
  const [isShowForm, setIsShowForm] = useState(false);

  return (
    <>
      <div className="min-w-screen flex bg-[#ebebeb]">
        <NavbarComponent />
        {isShowForm && (
          <FormAuthenComponent
            onSuccess={handleEdit}
            onClose={handleShowForm}
            mess={"Mật khẩu"}
            notification={"Yêu cầu xác thực"}
          />
        )
        }
        <div className="w-full h-screen px-24 mt-24 bg-[#ebebeb] flex space-x-4 items-start justify-between">
          {/* Sidebar */}
          <div className="rounded-tl-xl rounded-bl-xl border-2 border-black w-[20%] bg-white bg-opacity-10 text-gray-900 p-2 mt-8 space-y-4">
            <h2 className="text-lg font-bold">Thông Tin Cá Nhân</h2>
          </div>

          <div className="w-full bg-white rounded-t-lg shadow-lg overflow-hidden">
            {/* Gradient Header */}
            <div className="w-full">
              <div className="bg-gradient-to-r from-blue-200 to-yellow-100 h-32 w-full "></div>
            </div>

            {/* Profile Section – avatar chồng lên gradient */}
            <div className="-mt-16 p-6 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-[120px] h-[120px] rounded-full border-4 border-white shadow-md flex items-center justify-center">
                  <div className="relative w-full h-full rounded-full overflow-hidden"
                    onMouseEnter={() => setHoverAvatar(true)}
                    onMouseLeave={() => setHoverAvatar(false)}>
                    <img
                      src={selectImage ? URL.createObjectURL(selectFileImage) : account?.data?.avatar}
                      className="w-full h-full object-cover"
                      alt="Avatar"
                    />
                    {showEditImage && (
                      <div
                        className="absolute bottom-0 left-0 w-full h-[36px] bg-[rgb(121_120_120_/_50%)] rounded-b-full flex items-center justify-center cursor-pointer"
                        onClick={handleChooseIamge}
                      >
                        <span className="text-white font-medium">Choose</span>
                      </div>
                    )}
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleChangeImage}
                      accept="image/jpeg,image/png,image/webp"
                      style={{ display: 'none' }}
                    />
                  </div>
                </div>
                <div className='pt-3'>
                  <h2 className="text-xl font-bold">{usernameUpdate}</h2>
                  <p className="text-gray-500 text-sm">{emailUpdate}</p>
                </div>
              </div>
              <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                onClick={isEditing ? handleUpdate : handleShowForm}
              >
                {!isEditing ? "Chỉnh sửa thông tin" : "Cập nhật"}
              </button>
            </div>
            {/* Form */}
            <div className="grid grid-cols-2 gap-x-24 px-4 pb-4 gap-y-5 ">
              <LabelFieldComponent
                label="Username"
                value={usernameUpdate}
                placeholder="Nhập Thông Tin Họ Tên..."
                isEditing={isEditing}
                onChange={(e) => setUsernameUpdate(e.target.value)}
              />
              <LabelFieldComponent
                label="Email"
                value={emailUpdate}
                placeholder="Nhập Thông Tin Email..."
                isEditing={isEditing}
                onChange={(e) => setEmailUpdate(e.target.value)}
              />
              <LabelFieldComponent
                label="Password"
                value={isEditing ? passwordUpdate : "******"}
                placeholder="Nhập Thông Tin Password..."
                isEditing={isEditing}
                type='password'
                onChange={(e) => setPasswordUpdate(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProfilePage
