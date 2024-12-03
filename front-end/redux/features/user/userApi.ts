import { apiSlice } from "../api/apiSlice";

export const userApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        updateAvatar: builder.mutation({
            query : (avatar) => ({
                url: 'user/updateUserAvatar',
                method: "PUT",
                body: avatar,
                credentials : "include" as const,
            })
        }),
        updateProfile : builder.mutation({
            query : (name) => ({
                url : "user/updateUserInfo",
                method : "PUT",
                body: name,
                credentials : "include" as const,
            })
        }),
        updatePassword : builder.mutation({
            query : ({oldPassword, newPassword})=> ({
                url: "user/updateUserPassword",
                method : "PUT",
                body: {oldPassword, newPassword},
                credentials : "include" as const,
            })
        }),
        getAllUsers : builder.query({
            query : () => ({
                url : "user/getAllUser",
                method : "GET",
                credentials : "include" as const,
            }) 
        }),
        deleteUser : builder.mutation ({
            query : (id)=> ({
                url : `user/deleteUser/${id}`,
                method : "DELETE",
                credentials : "include" as const,
            })
        }),
        updateUserRole : builder.mutation({
            query : ({id, role}) => ({
                url : "user/updateUserRole",
                method : "PUT",
                body : {id, role},
                credentials : "include" as const,
            })
        }),
    })
})

export const {useUpdateAvatarMutation, useUpdateProfileMutation, useUpdatePasswordMutation, useGetAllUsersQuery, useDeleteUserMutation, useUpdateUserRoleMutation} = userApi;