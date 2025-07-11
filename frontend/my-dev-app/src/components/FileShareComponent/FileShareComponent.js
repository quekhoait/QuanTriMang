import React, { use, useEffect, useState } from "react";
import { useFile } from "../../contexts/FileContext";
import { useUser } from "../../contexts/UserContext";

const FileShareComponent = () => {
  //chứa dữ liệu đang chia sẻ của user hiện hành
  const {listFileShare, getFileShare, getUserFile, userFile} = useFile();
  const {account, getUser} = useUser();




  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-2 !pt-6 h-[90%]">
      {/* File đang chia sẻ */}
      <div className="bg-white shadow-md rounded-xl p-2 !pt-4">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          📤 File đang chia sẻ
        </h2>
        <p className="text-sm text-gray-500 mt-1 mb-4 text-left">
          Thông tin người được chia sẻ
        </p>

        <div className="overflow-hidden overflow-x-auto h-[480px]">
          <table className="text-sm text-left text-gray-600 w-[700px]">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100 border-b">
              <tr>
                <th className="px-3 py-3 max-w-[150px] truncate">Email</th>
                <th className="px-3 py-3 max-w-[120px] truncate">Tên</th>
                <th className="px-3 py-3 max-w-[150px] truncate">Tên file</th>
                <th className="px-3 py-3 max-w-[100px] truncate">Ngày gửi</th>
                <th className="px-3 py-3 max-w-[200px] truncate">Quyền</th>
              </tr>
            </thead>
            <tbody>
              {listFileShare.map((file, index) => (
                <tr key={index} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-3 py-3 max-w-[150px] truncate" title={file.email}>
                    {file.email}
                  </td>
                  <td className="px-3 py-3 max-w-[120px] truncate" title={file.name}>
                    {file.name}
                  </td>
                  <td className="px-3 py-3 max-w-[150px] truncate" title={file.fileName}>
                    {file.fileName}
                  </td>
                  <td className="px-3 py-3 max-w-[100px] truncate">
                    {file.sharedDate}
                  </td>
                  <td className="px-3 py-3 max-w-[200px] truncate">
            <select className="border px-2 py-1 rounded w-full" defaultValue="view">
              <option value="view">Xem</option>
              <option value="edit">Chỉnh sửa</option>
              <option value="download">Tải xuống</option>
            </select>
          </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* File nhận được */}
      <div className="bg-white shadow-md rounded-xl p-2 !pt-4">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          📥 File nhận được
        </h2>
        <p className="text-sm text-gray-500 mt-1 mb-4 text-left">
          Thông tin người đã chia sẻ
        </p>

        <div className="overflow-hidden overflow-x-auto h-[480px]">
          <table className="w-[700px] text-sm text-left text-gray-600">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100 border-b">
              <tr>
                <th className="px-3 py-3 max-w-[150px] truncate">Email</th>
                <th className="px-3 py-3 max-w-[120px] truncate">Tên</th>
                <th className="px-3 py-3 max-w-[150px] truncate">Tên file</th>
                <th className="px-3 py-3 max-w-[100px] truncate">Ngày gửi</th>
              </tr>
            </thead>
            <tbody>
              {listFileShare.map((file, index) => (
                <tr key={index} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-3 py-3 max-w-[150px] truncate" title={file.email}>
                    {file.email}
                  </td>
                  <td className="px-3 py-3 max-w-[120px] truncate" title={file.name}>
                    {file.name}
                  </td>
                  <td className="px-3 py-3 max-w-[150px] truncate" title={file.fileName}>
                    {file.fileName}
                  </td>
                  <td className="px-3 py-3 max-w-[100px] truncate">
                    {file.receivedDate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FileShareComponent;
