import React, { useState } from 'react';
import {jwtDecode} from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getDetailUser, signIn } from '../../services/AuthServices';
import { updateUser } from '../../redux/userSlice'; 
const SignInPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleSignIn = async () => {
    const res = await signIn({ email, password });
    if (res?.status === 'success') {
      const accessToken = res?.access_token;
      localStorage.setItem('accessToken', JSON.stringify(accessToken));
      if (accessToken) {
        const decode = jwtDecode(accessToken);
        console.log(decode);
        if (decode?.sub) {
          handleGetUserDetails(Number(decode?.sub), accessToken);
          navigate('/'); 
        }
      }
    }
  };
  const handleGetUserDetails = async (id, token) => {
    const res = await getDetailUser(id);
    dispatch(updateUser({ ...res, accessToken: token }));
  };
  return (
    <div className="py-16 bg-slate-100 min-h-screen">
      <div className="flex bg-white rounded-lg shadow-brand overflow-hidden mx-auto max-w-sm lg:max-w-4xl">
        <div className="hidden lg:block lg:w-1/2 bg-cover relative"
          style={{ background: `url(${"https://cdn.techinasia.com/wp-content/uploads/2022/09/1662307723_coolmate.jpeg"})`, backgroundPosition: "center", backgroundSize: "auto 100%", backgroundRepeat: "no-repeat" }}
        >
        </div>
        <div className="w-full p-8 lg:w-1/2">
          <h2 className="text-2xl font-semibold text-gray-700 text-center uppercase">đăng nhập</h2>
          <div className="mt-4">
            <label className="block text-start text-gray-700 text-sm font-bold mb-2">Địa Chỉ Email</label>
            <input
              className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
              type="email"
              onChange={(e) => { setEmail(e.target.value); }}
            />
          </div>
          <div className="mt-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Mật Khẩu</label>
            <input
              className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
              type="password"
              onChange={(e) => { setPassword(e.target.value); }}
            />
          </div>
          <div className="mt-8">
            <button
              className="bg-black hover:bg-blue-500 flex items-center justify-center text-white font-bold h-[45px] w-full rounded"
              onClick={handleSignIn}
            >
              Đăng nhập
            </button>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="border-b w-1/5 md:w-1/4"></span>
            <span className='text-sm text-gray-500'>Chưa có tài khoản? <a href="/signup" className="text-main">Đăng kí</a></span>
            <span className="border-b w-1/5 md:w-1/4"></span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SignInPage;
