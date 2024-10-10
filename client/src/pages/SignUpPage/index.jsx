import React, { useEffect, useState } from 'react';
import { signUp } from '../../services/AuthServices';
import { useNavigate } from 'react-router-dom';

const SignUpPage = () => {
  const navigate = useNavigate()
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    const res = await signUp({ username, email, password})
    if(res){
      alert("Đăng kí thành công")
      navigate("/signin")
    }
  };
  return (
    <div className="py-16 bg-slate-100 min-h-screen">
      <div className="flex bg-white rounded-lg shadow-brand overflow-hidden mx-auto max-w-sm lg:max-w-4xl">
        <div className="hidden lg:block lg:w-1/2 bg-cover relative"
          style={{ background: `url(${"https://cdn.techinasia.com/wp-content/uploads/2022/09/1662307723_coolmate.jpeg"})`, backgroundPosition: "center", backgroundSize: "auto 100%", backgroundRepeat: "no-repeat" }}
        >
        </div>
        <div className="w-full p-8 lg:w-1/2">
          <h2 className="text-2xl font-semibold text-gray-700 text-center uppercase">Đăng ký</h2>
          <div className="mt-4">
            <label className="block text-start text-gray-700 text-sm font-bold mb-2">Họ Tên</label>
            <input
              className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
              type="text"
              onChange={(e) => { setUserName(e.target.value) }}
            />
          </div>
          <div className="mt-4">
            <label className="block text-start text-gray-700 text-sm font-bold mb-2">Địa Chỉ Email</label>
            <input
              className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
              type="email"
              onChange={(e) => { setEmail(e.target.value) }}
            />
          </div>
          <div className="mt-4">
            <div className="flex justify-between">
              <label className="block text-gray-700 text-sm font-bold mb-2">Mật Khẩu</label>
            </div>
            <input
              className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
              type="password"
              onChange={(e) => { setPassword(e.target.value) }}
            />
          </div>
          <div className="mt-4">
            <div className="flex justify-between">
              <label className="block text-gray-700 text-sm font-bold mb-2">Xác Nhận Mật Khẩu</label>
            </div>
            <input
              className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
              type="password"
              onChange={(e) => { setConfirmPassword(e.target.value) }}
            />
          </div>
          <div className="mt-8">
            <button
              onClick={handleSubmit}
              className={`${(username && email && password && confirmPassword) ? "bg-black hover:bg-blue-500" : "bg-gray-500"} 
                flex items-center justify-center text-white font-bold h-[45px] w-full rounded`}
              disabled={!username || !email || !password || !confirmPassword}
            >
              Sign Up
            </button>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="border-b w-1/5 md:w-1/4"></span>
            <span className='text-sm text-gray-500'>Đã có tài khoản? <a href="/signin" className="text-main">Đăng nhập</a></span>
            <span className="border-b w-1/5 md:w-1/4"></span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SignUpPage;
