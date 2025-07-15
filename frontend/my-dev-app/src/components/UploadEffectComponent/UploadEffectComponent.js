import React, { useState } from "react";
import { ClipLoader } from "react-spinners";

const UploadEffectComponent = ({loading, data}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "your_preset"); // thay bằng preset của bạn
    formData.append("cloud_name", "your_cloud_name");

    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/your_cloud_name/image/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setImageUrl(data.secure_url);
    } catch (err) {
      console.error("Lỗi upload:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (

  <div>
    {loading ? (
      <div className="flex justify-center mt-10">
        <ClipLoader size={40} color="#36d7b7" />
        <p className="ml-2">Đang tải dữ liệu...</p>
      </div>
    ) : (
      <div>
        {/* render dữ liệu */}
        {data?.map(item => (
          <p key={item.id}>{item.name}</p>
        ))}
      </div>
    )}
  </div>
);


};

export default UploadEffectComponent;
