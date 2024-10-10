import { useEffect } from 'react'
import publicRoutes from './routes'
import { Route, Routes } from 'react-router-dom'
import { axiosJwt, getDetailUser, refreshToken } from './services/AuthServices';
import { useDispatch } from 'react-redux';
import { resetUser, updateUser } from './redux/userSlice';
import { jwtDecode } from 'jwt-decode';
function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    const { decoded, storageData } = handleDecode();
    if (decoded?.sub) {
      handleGetUserDetails(Number(decoded?.sub), storageData);
    }
  }, []);
  axiosJwt.interceptors.request.use(async (config) => {
    const currentTime = new Date().getTime() / 1000; // Lấy thời gian hiện tại tính bằng giây
    let { decoded, storageData } = handleDecode(); // Giải mã token
    // Kiểm tra nếu access token đã hết hạn
    if (decoded?.exp < currentTime) {
      localStorage.removeItem('accessToken');
      dispatch(resetUser());
      try {
        // Gọi API để lấy refresh token
        const data = await refreshToken();
        // Lưu access token mới vào localStorage
        localStorage.setItem('accessToken', JSON.stringify(data.access_token));
        // Cập nhật header Authorization với token mới
        config.headers['Authorization'] = `Bearer ${data.access_token}`;
      } catch (error) {
        console.error("Failed to refresh token:", error);
      }
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  });
  const handleGetUserDetails = async (id, token) => {
    try {
      const res = await getDetailUser(id);
      dispatch(updateUser({ ...res, accessToken: token }));
    } catch (error) {
      console.error(error);
      dispatch(updateUser(null));
    }
  };
  const handleDecode = () => {
    let storageData = localStorage.getItem('accessToken')
    let decoded = {}
    if (storageData) {
      storageData = JSON.parse(storageData)
      decoded = jwtDecode(storageData)
    }
    return { decoded, storageData }
  }
  return (
    <Routes>
      {publicRoutes.map((route, index) => {
        const PageComponent = route.component; // Gọi component ra
        return (
          <Route
            key={index}
            path={route.path}
            element={<PageComponent />} // Sử dụng <PageComponent /> thay vì chỉ trả về PageComponent
          />
        );
      })}
    </Routes>)
}
export default App
