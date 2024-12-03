"use client";
import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./features/api/apiSlice";
import authSlice from './features/auth/authSlice'

export const store = configureStore({
    reducer : {
        // Add your reducers here   
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authSlice
    },
    devTools : false,
    middleware : (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware)
});

// call the refresh token handler on every page and load current  User
const initializeApp = async () =>{
    // await store.dispatch(apiSlice.endpoints.refreshtoken.initiate({}, {forceRefetch: true}));
    
    await store.dispatch(apiSlice.endpoints.loadUser.initiate({}, {forceRefetch: true}));
}

initializeApp();