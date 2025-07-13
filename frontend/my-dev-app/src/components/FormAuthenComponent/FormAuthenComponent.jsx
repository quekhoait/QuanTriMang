import React, { use, useState } from 'react'
import { useUser } from '../../contexts/UserContext'



const FormAuthenComponent = ({onSuccess, onClose, mess, notification}) => {

  const {account, getUser} = useUser();
  const [passwordAccept, setPasswordAccept] = useState('');

  //Nhấn Ok ddvaf kiểm tra mật khẩu
  const handleAccept = ()=>{
    if(passwordAccept === account?.data?.password){
      alert("Xác nhận thành công");
      onSuccess();      
    }else{
      alert("Xác nhận thất bại")
      return;
    }
  }

  const handleCancel = ()=>{
    onClose();
  }

  const [eye, setEye] = useState(false);
  const handleEye=()=>{
    if(eye){
      setEye(false);
    }else{
      setEye(true);
    }
  }

  return (
  <div className= {`fixed inset-0 bg-black/50 z-[100] flex items-center justify-center `}>
      <div className="bg-white rounded-2xl w-[360px] p-6 relative shadow-lg">
    <h1 className="text-[2rem] font-semibold text-center mb-4">{notification}</h1>
    <div className="mb-5">
      <label htmlFor="inputPassword" className="block font-medium text-gray-700 mb-1 text-[1.2em] text-left pb-2">
        {mess}
      </label>
      <div className="relative">
        <input
          id="inputPassword"
          type={!eye ? "text" : "password"}
          value={passwordAccept}
          onChange={(e)=>setPasswordAccept(e.target.value)}
          className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
          <i onClick={handleEye} className={`absolute top-1/2 -translate-y-1/2 right-4 cursor-pointer text-gray-500 ${
            eye ? 'fa-regular fa-eye' : 'fa-regular fa-eye-slash'}`}></i>
      </div>
    </div>

    <div className="flex justify-end gap-3">
      <button
        type="button"
        className="px-4 py-2 text-sm font-medium text-white bg-gray-500 rounded-lg hover:bg-gray-600"
        onClick={handleCancel}
      >
        Thoát
      </button>
      <button
        type="button"
        className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
        onClick={handleAccept}
      >
        Ok
      </button>
    </div>
  </div>
</div>

  )
}

export default FormAuthenComponent