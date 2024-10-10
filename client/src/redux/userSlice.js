import { createSlice } from '@reduxjs/toolkit'
// Khởi tạo trạng thái
const initialState = {
    userId: "",
    userName: "",
    email: "",
    accessToken: "",
    isLoading: false,
}
//Quản lí và cập nhật trạng thái
export const userSlide = createSlice({
    name: 'user',
    initialState,
    reducers: {
        updateUser: (state, action) => {
            const { userId, userName, email, accessToken } = action.payload
            state.userId = userId
            state.userName = userName || email;
            state.email = email;
            state.accessToken = accessToken
        },
        resetUser: (state) => {
            state.userId = null
            state.userName = null
            state.email = null
            state.accessToken = null
        }
    }
})
export const { updateUser, resetUser } = userSlide.actions
export default userSlide.reducer