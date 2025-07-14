import React, { use, useEffect, useState } from 'react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useFile } from '../../contexts/FileContext';
import { useUser } from '../../contexts/UserContext';

export const FormShareComponent = ({listFileId}) => {
    const [email, setEmail] = useState("");
  const [expireDate, setExpireDate] = useState(null);
  const [permission, setPermission] = useState("read");
  const { getUserByEmail, account} = useUser();
  const {createFileShare, getUserFile, userFile} = useFile();


  const handleSubmit = async(e) => {
  e.preventDefault();
  try {
    // Lấy thông tin người dùng từ email
    const user = await getUserByEmail(email); // nên trả về từ hàm
    if (!user || !user.id) {
      alert("Không tìm thấy người dùng");
      return;
    } 
     if (user.id === account?.data?.id) {
      alert("Không Hợp lệ");
      return;
    }
    // // ✅ Định dạng ngày hết hạn
    const formattedExpireDate = expireDate
      ? `${expireDate.getFullYear()}/${String(expireDate.getMonth() + 1).padStart(2, '0')}/${String(expireDate.getDate()).padStart(2, '0')}`
      : null;

  
    // Gửi từng fileId
    for (const fileId of listFileId) {
      await createFileShare(user.id, fileId, permission, formattedExpireDate);
    }

    alert("✅ Chia sẻ thành công!");
    window.location.reload();
  } catch (error) {
    console.error("❌ Lỗi chia sẻ:", error);
    alert("❌ Chia sẻ thất bại: " + error.message);
  }
    
  };
  return (
      <div className= {`fixed inset-0 bg-black/50 z-[100] flex items-center justify-center `}>
         <form onSubmit={handleSubmit} className="p-6 max-w-md mx-auto bg-white rounded-2xl shadow-md space-y-6">
      <h2 className="text-xl font-semibold text-gray-700">Chia sẻ tập tin</h2>

      {/* Email input */}
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-600">Email người nhận</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="example@gmail.com"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

    <div className="flex justify-between">
        {/* Expire date */}
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-600">Ngày hết hạn</label>
        <DatePicker
          selected={expireDate}
          onChange={(date) => setExpireDate(date)}
          dateFormat="yyyy-MM-dd"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholderText="Chọn ngày hết hạn"
          isClearable
        />
      </div>

      {/* Permission select */}
      <div className="ml-[8px]">
        <label className="block mb-1 text-sm font-medium text-gray-600">Quyền truy cập</label>
        <select
          value={permission}
          onChange={(e) => setPermission(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="read">Đọc</option>
          <option value="write">Viết</option>
        </select>
      </div>

    </div>
      <button
        type="submit"
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
      >
        Chia sẻ
      </button>
    </form>
</div>
  )
}
