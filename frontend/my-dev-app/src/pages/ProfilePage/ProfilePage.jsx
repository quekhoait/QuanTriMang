import React, { use, useState } from 'react'
import NavbarComponent from '../../components/NavbarComponent/NavbarComponent'
import avatarImg from '../../assets/1ijqna72ktqfeb86jl62e8lfg.jpg'
import LabelFieldComponent from '../../components/ProfileComponent/LabelFieldComponent'


const ProfilePage = () => {
    //button Edit
    const [isEditing, setEditing] = useState(false)

    //info
    const [name, setName] = useState('Alexa Rawles');
    const [email, setEmail] = useState('alexarawles@gmail.com');
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('0901234444');
    const [gender, setGender] = useState('Gay')
    const [birthDay, setBirthDay] = useState('2000-01-01');




    return (
        <>
            <div className="min-w-screen flex bg-[#ebebeb]">
                <NavbarComponent />

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
                                <img
                                    src={avatarImg}
                                    className="w-[120px] h-[120px] rounded-full border-4 border-white shadow-md"
                                    alt="Avatar"
                                />
                                <div className='pt-3'>
                                    <h2 className="text-xl font-bold">Alexa Rawles</h2>
                                    <p className="text-gray-500 text-sm">alexarawles@gmail.com</p>
                                </div>
                            </div>
                            {!isEditing ?
                                (<button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                                    onClick={() => setEditing(!isEditing)}>
                                    Chỉnh Sửa Thông Tin
                                </button>) :
                                (<button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                                    onClick={() => setEditing(!isEditing)}>
                                    Cập Nhật
                                </button>)}
                        </div>

                        {/* Form */}
                        <div className="grid grid-cols-2 gap-x-24 px-4 pb-4 gap-y-5 ">
                            <LabelFieldComponent
                                label="Họ Tên"
                                value={name}
                                placeholder="Nhập Thông Tin Họ Tên..."
                                isEditing={isEditing}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <LabelFieldComponent
                                label="Email"
                                value={email}
                                placeholder="Nhập Thông Tin Email..."
                                isEditing={isEditing}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <LabelFieldComponent
                                label="Password"
                                value={password}
                                placeholder="Nhập Thông Tin Password..."
                                isEditing={isEditing}
                                type='password'
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <LabelFieldComponent
                                label="số Điện Thoại"
                                value={phoneNumber}
                                placeholder="Nhập thông tin số điện thoại..."
                                isEditing={isEditing}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                            />
                            <LabelFieldComponent
                                label="Giới Tính"
                                value={gender}
                                placeholder="Nhập thông tin giới tính..."
                                isEditing={isEditing}
                                onChange={(e) => setGender(e.target.value)}
                            />
                            <LabelFieldComponent
                                label="Ngày Sinh"
                                value={birthDay}
                                placeholder="Nhập thông tin ngày sinh..."
                                isEditing={isEditing}
                                onChange={(e) => setBirthDay(e.target.value)}
                            />
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}

export default ProfilePage
