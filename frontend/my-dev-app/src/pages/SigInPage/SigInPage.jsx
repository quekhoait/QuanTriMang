import { data, useNavigate } from 'react-router-dom';
import image from '../../assets/anhnen3.png';
import { useState } from 'react';
import { useUser } from '../../contexts/UserContext';

export default function SignInPage() {
  const navigate = useNavigate();
  const handlSigUp= ()=>{
    navigate('/account/regis')
  }
  const [error, setError] = useState();

  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
    const { setAccessToken, setRefreshToken } = useUser();

    const [eye, setEye] = useState(false);
    const handleEye=()=>{
    if(eye){
      setEye(false);
    }else{
      setEye(true);
    }
  }

    const handleSubmitSigIn = async(e)=>{
      e.preventDefault();
      try{
        const response = await fetch('http://localhost:5999/api/user/login', {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({username, password})
        })
        const data = await response.json();
        if(response.ok){
          alert("Đăng nhập thành công");
          localStorage.setItem('accessToken', data.accessToken);
        // localStorage.setItem('refreshToken', data.refreshToken);
          setAccessToken(data.accessToken);
          navigate('/')
        }else{
          setError("Lỗi " + data.message)
        }
      }catch(err){;

        alert("Lỗi server" + data.message);
      }
    }

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-cover"
     style={{ backgroundImage: `url(${image})` }}>
      {/* Nội dung form */}
      <div className="relative z-10 w-full max-w-md p-8 space-y-6 bg-white/80 backdrop-blur-md rounded shadow-md">
       <div
        className="absolute inset-0 bg-cover bg-center filter blur-xl scale-110"
        style={{ backgroundImage: `url(${image})`, zIndex: "-1" }}
      ></div>
        <h2 className="text-2xl font-bold text-center text-white">
          Đăng nhập
        </h2>
        <form className="space-y-2" onSubmit={handleSubmitSigIn}>
          {error && (
                  <div className="bg-red-300 rounded-md">
                    <label className="block mb-1 text-red-700 text-center px-3 py-2 text-lg font-medium">{error}</label>
                  </div>
                )}
          <div>
            <label className="block mb-1 text-white text-left">Tên đăng nhập</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
              placeholder="Nhập họ và tên"
              value={username}
              onChange={(e)=>setUsername(e.target.value)}
              required
            />
          </div>
          <div className="relative">
            <label className="block mb-1 text-white text-left">Mật khẩu</label>
            <input
              type={!eye ? 'text' : "password"}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400 pr-[46px]"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              required
            />
              <i onClick={handleEye} className={`absolute top-[60%] right-4 cursor-pointer text-gray-500 ${
                eye ? 'fa-regular fa-eye' : 'fa-regular fa-eye-slash'}`}></i>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 font-semibold text-white bg-blue-500 rounded hover:bg-blue-600 !mt-[32px]"
          >
            Đăng nhập
          </button>
        </form>
        <div className="text-center">
          <button
            className="mt-2 text-sm text-blue-500 hover:underline"
            type="button"
            onClick={handlSigUp}
          >
           Chưa có tài khoản? Đăng ký
          </button>
        </div>
      </div>
    </div>
  );
}
