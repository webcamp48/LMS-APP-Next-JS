import { createSlice, PayloadAction  } from "@reduxjs/toolkit";

const authSlice = createSlice ({
    name : "auth",
    initialState : {
        token : "",
        user : ""
    },
    reducers : {
        userRegistration : (state, action: PayloadAction<{token : string}>) => {
            state.token = action.payload.token;
        },
        userLoggedIn :(state, action: PayloadAction<{accessToken : string, user : string}>) => {
            state.token = action.payload.accessToken;
            state.user = action.payload.user;
        },
        userLoggout : (state) => {
            state.token = "";
            state.user = "";
        }
    }
});

export const {userRegistration,userLoggedIn, userLoggout } = authSlice.actions;
export default authSlice.reducer;