import { configureStore } from "@reduxjs/toolkit"
import userReducer from '@/store/modules/user'

const store = configureStore({
    reducer: {
        user: userReducer
    }
})

export default store;