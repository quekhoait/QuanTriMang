import { useNavigate } from 'react-router-dom';
import image from '../../assets/anhnen3.png';

export default function SignInPage() {
  const navigator = useNavigate();
  const handlSigUp= ()=>{
    navigator('/regis')
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
        <form className="space-y-2">
          <div className="bg-red-300 rounded-md">
             <label className="block mb-1 text-red-700 text-center px-3 py-2 text-lg font-medium">* Vui lòng nhập đầy đủ thông tin</label>
          </div>
          <div>
            <label className="block mb-1 text-white text-left">Tên đăng nhập</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
              placeholder="Nhập họ và tên"
              required
            />
          </div>
          <div className="relative">
            <label className="block mb-1 text-white text-left">Mật khẩu</label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400 pr-[46px]"
              placeholder="Nhập mật khẩu"
              required
            />
            <i class="fa-regular fa-eye absolute top-[60%] right-4 cursor-pointer "></i>
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
