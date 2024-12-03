import { apiSlice } from "../api/apiSlice";

export const courseApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createCourse: builder.mutation({
            query: (data) => ({
                url: "course/createCourse",
                method: "POST",
                body: data,
                credentials: "include" as const
            })
        }),
        getAllCourses : builder.query ({
            query : () => ({
                url : "course/getAdminAllCourses",
                method : "GET",
                credentials : "include" as const,
            })
        }),
        deleteCourse : builder.mutation({
            query : (id) => ({
                url : `course/deleteCourse/${id}`,
                method : "DELETE",
                credentials : "include" as const,
            })
        }),
        updateCourse : builder.mutation({
            query : ({id, data}) => ({
                url : `course/updateCourse/${id}`,
                method : "PUT",
                body : data,
                credentials : "include" as const,
            })
        }),
    })
});

export const { useCreateCourseMutation, useGetAllCoursesQuery, useDeleteCourseMutation,useUpdateCourseMutation, } = courseApi;
