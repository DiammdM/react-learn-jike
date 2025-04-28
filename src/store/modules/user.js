import { getToken, removeToken } from "@/utils";
import { createSlice } from "@reduxjs/toolkit";

const store = createSlice({
    name: 'user',
    initialState: {
        token: getToken(),
        userInfo: {}
    },
    reducers: {
        setToken(state, action) {
            state.token = action.payload;
        },
        setUserInfo(state, action) {
            state.userInfo = action.payload;
        },
        clearUserInfo(state) {
            state.token = '';
            state.userInfo = {};
            removeToken();
        }
    }
})

const { setToken, setUserInfo, clearUserInfo } = store.actions;
export { setToken, setUserInfo, clearUserInfo };
export default store.reducer