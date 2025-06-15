import { FaFolder, FaFilePdf, FaRedoAlt, FaTh, FaFolderOpen } from "react-icons/fa";

export default function FilePageComponent({listFiles, isAllFile, fileName}) {
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
        <button className="border px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-100">
          <span><FaFolderOpen /></span>
          <span>New Folder</span>
        </button>
      }
      </div>

      {/* Table */}
      <table className="w-full text-left">
        <thead>
          <tr className="border-b">
            <th className="p-2 text-blue-700 w-8">
              <input type="checkbox" />
            </th>
            <th className="p-2  text-blue-700">File name</th>
            <th className="p-2  text-blue-700">Date added ⬇</th>
            <th className="p-2  text-blue-700">Size</th>
          </tr>
        </thead>
        <tbody>
          {listFiles.map((file, i) => (
            <tr key={i} className="border-b hover:bg-gray-100">
              {/* <td className="p-2">
                <input type="checkbox" />
              </td> */}
              <td className="p-2 flex items-center space-x-2">
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
          ))}
        </tbody>
      </table>
    </div>
  );
}
