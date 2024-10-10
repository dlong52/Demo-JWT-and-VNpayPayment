import axios from 'axios'
const axiosJwt = axios.create()
const signIn = async (data) => {
    const res = await axios.post(`http://localhost:8080/api/auth/sign-in`, data,{
        withCredentials: true
    })    
    return res.data
}
const refreshToken = async () => {
    const res = await axios.post(`http://localhost:8080/api/auth/refresh-token`, {}, {
        withCredentials: true // Đảm bảo cookie được gửi kèm
    });
    return res.data;
};
const signUp = async (data) => {
    const res = await axios.post(`http://localhost:8080/api/auth/sign-up`, data)
    return res.data
}
const getDetailUser = async (id) => {
    try {
        const res = await axiosJwt.get(`http://localhost:8080/api/auth/${id}`);
        return res.data;
    } catch (error) {
        console.error('Error fetching user details:', error.response || error.message);
        throw error; 
    }
};
export {
    signIn,
    refreshToken,
    signUp,
    getDetailUser,
    axiosJwt
}