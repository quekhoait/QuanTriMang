import { useState } from "react";
import { FaFolder, FaFilePdf, FaRedoAlt, FaTh, FaFolderOpen } from "react-icons/fa";

export default function FilePageComponent({listFiles, isAllFile, fileName}) {

  //Tạo thêm folder mới
  const [isCreating, setIsCreating] = useState(false);
  const [nameNewFolder, setNameNewFolder] = useState("New folder")

  const createNewFolder = () =>{
    setIsCreating(true);
    setNameNewFolder("New Folder")
  }

  const [listFils, setListFils] = useState(listFiles);

  const handlSaveNewFolder = ()=>{
    if(nameNewFolder.trim()===" ") return;
    const newFolder = {
      type: "folder",
      name: nameNewFolder,
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
      size:"-"
    }
    setListFils([newFolder, ...listFils]);
    setIsCreating(false);
  }

  const [selectRow, setSelectRow] = useState([])
  const handleListSelect = (name, checked)=>{
    if(checked){
      setSelectRow(prev=>[...prev, name]);
    }else{
      setSelectRow(prev=>prev.filter(item => item !== name)) //lọc qua các phần tử và giữ lại phần tử khác name
    }
  }

  const handleAllSelect = (checked)=>{
    if(checked){
      setSelectRow(listFils.map(file => file.name));
    }else{
      setSelectRow([]);
    }
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-2xl font-semibold">{fileName}</h2>
        <div className="flex items-center space-x-4">
          <FaRedoAlt className="cursor-pointer" />
          <FaTh className="cursor-pointer" />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-4 mb-4">
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-600">
          <span>⬆</span>
          <span>Upload</span>
        </button>
      {isAllFile &&
        <button className="border px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-100" onClick={createNewFolder}>
          <span><FaFolderOpen /></span>
          <span>New Folder</span>
        </button>
      }
      </div>

<div className="max-h-[460px] overflow-y-auto border rounded-md">
  <table className="w-full text-left min-w-[600px]">
    <thead className="sticky top-0 bg-white z-10">
      <tr className="border-b">
        <th className="p-2 text-blue-700 w-8">
          <input type="checkbox" checked={selectRow.length === listFils.length}
            onChange={(e)=>handleAllSelect(e.target.checked)}
          />
        </th>
        <th className="p-2 text-blue-700">File name</th>
        <th className="p-2 text-blue-700">Date added ⬇</th>
        <th className="p-2 text-blue-700">Size</th>
      </tr>
    </thead>
    <tbody>

      {isCreating &&
        <tr className="border-b hover:bg-gray-100">
          <td><input type="checkbox"
              /></td>
          <td className="p-2 flex items-center space-x-2">
            <FaFolder className="text-yellow-500" />
            <input 
              autoFocus
              className="border px-2 py-1 rounder"
              value={nameNewFolder}
              onChange={(e)=>setNameNewFolder(e.target.value)}
              onBlur={handlSaveNewFolder}
            />
          </td>
          <td className="p-2">-</td>
          <td className="p-2">-</td>
        </tr>
      }
      {listFils.map((file, i) => {
        const isSelected = selectRow.includes(file.name);
        return(         
        <tr key={i} className={`group border-b hover:bg-gray-100 ${isSelected ? 'bg-[rgb(181_227_243)]' : ''}`}>
          <td className={`p-2 text-blue-700 w-8 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:!opacity-100'} transition-opacity duration-200`}>
            <input type="checkbox" checked={isSelected}
              onChange={(e)=>handleListSelect(file.name, e.target.checked)}
              />
          </td>
          <td className="cursor-pointer p-2 flex items-center space-x-2">
            {file.type === "folder" ? (
              <FaFolder className="text-yellow-500" />
            ) : (
              <FaFilePdf className="text-red-500" />
            )}
            <span>{file.name}</span>
          </td>
          <td className="p-2">{file.date}</td>
          <td className="p-2">{file.size || "-"}</td>
        </tr>
      )
      }
    )}
    </tbody>
  </table>
</div>

    </div>
  );
}
