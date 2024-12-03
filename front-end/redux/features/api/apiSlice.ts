import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userLoggedIn } from "../auth/authSlice";

export const apiSlice = createApi ({
    reducerPath : "api",
    baseQuery : fetchBaseQuery ({
        baseUrl : process.env.NEXT_PUBLIC_SERVER_URL
    }),
    
    endpoints : (builder) => ({
        // call the refresh token handler on every page
        refreshtoken : builder.query({
            query : (data)=> ({
                url: "user/refreshtoken",
                method: 'GET',
                credentials : 'include' as const
            })
        }),
        // get current login user info
        loadUser : builder.query({
            query: (data) => ({
                url: "user/getuserInfo",
                method: "GET",
                credentials : 'include' as const
            }),
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                try {
                    const response = await queryFulfilled;
                    dispatch(userLoggedIn({ 
                        accessToken: response.data.accessToken,
                        user: response.data.user,
                    }));
                } catch (error : any) {
                    console.log('Get User info error:', error);
                }
            },
        })
    }),

})

export const {useRefreshtokenQuery, useLoadUserQuery}  = apiSlice;