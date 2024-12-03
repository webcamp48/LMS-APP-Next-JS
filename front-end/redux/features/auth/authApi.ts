import { apiSlice } from "../api/apiSlice";
import { userRegistration, userLoggedIn, userLoggout } from "./authSlice";

type RegistrationResponse = {
    message: string;
    token: string;
};

type RegistrationData = {
    name: string;
    email: string;
    password: string;
};

export const authApi = apiSlice.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        register: builder.mutation<RegistrationResponse, RegistrationData>({
            query: (data) => ({
                url: "user/registration",
                method: "POST",
                body: data,
                credentials: "include" as const,
            }),
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                try {
                    const response = await queryFulfilled;
                    dispatch(userRegistration({ token: response.data.token }));
                } catch (error) {
                    console.log('Registration error:', error);
                }
            },
        }),
        activation: builder.mutation({
            query: ({  activation_otp, activation_token }) => ({
                url: "user/activateUser",
                method: "POST",
                body: { activation_otp, activation_token },
                credentials: "include" as const,
            }),
        }),
        login : builder.mutation ({
            query : ({email, password}) => ({
                url : "user/login",
                method: "POST",
                body : {email, password},
                credentials: "include" as const,
            }),
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                try {
                    const response = await queryFulfilled;
                    dispatch(userLoggedIn({ 
                        accessToken: response.data.accessToken,
                        user: response.data.user,
                    }));
                } catch (error) {
                    console.log('Login error:', error);
                }
            },
        }),
        socialAuth : builder.mutation ({
            query : ({name, email, avatar}) => ({
                url : "user/socialAuth",
                method: "POST",
                body : {name, email, avatar},
                credentials: "include" as const,
            }),
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                try {
                    const response = await queryFulfilled;
                    dispatch(userLoggedIn({ 
                        accessToken: response.data.accessToken,
                        user: response.data.user,
                    }));
                } catch (error) {
                    console.log('social Auth error:', error);
                }
            },
        }),
        logout : builder.query ({
            query : () => ({
                url : "user/logout",
                method : "GET",
                credentials: "include" as const,
            }),
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                try{
                    await queryFulfilled;
                    dispatch(userLoggout());
                }
                catch(error : any) {
                    console.log("user Logout Error", error)
                }
            }
        })
    }),
});

export const { useRegisterMutation, useActivationMutation, useLoginMutation, useSocialAuthMutation, useLogoutQuery   } = authApi;
