import { createSlice } from "@reduxjs/toolkit";
const userSlice = createSlice({
    name: "userAdmin",
    initialState: {
        email: null,
        isAdmin: null,
        _id: null
    },
    reducers: {
        loginSuccess: (state, action) => {
            state.email = action.payload.email;
            state.isAdmin = action.payload.isAdmin;
            state._id = action.payload._id;
        },
        logout: (state) => {
            state.email = null;
            state.isAdmin = null;
            state._id = null;
        },
    }
})
export const { loginSuccess, logout } = userSlice.actions;
export default userSlice.reducer;