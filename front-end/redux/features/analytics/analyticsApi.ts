import { apiSlice } from "../api/apiSlice";

export const analyticsApi = apiSlice.injectEndpoints({
    endpoints : (builder) => ({
        getCourseAnalytics : builder.query({
            query : () => ({
                url : "analytics/get-courses-analytics",
                method : "GET",
                credentials : "include" as const
            })
        }),
        getUsersAnalytics : builder.query({
            query : () => ({
                url : "analytics/get-users-analytics",
                method : "GET",
                credentials : "include" as const
            })
        }),
        getOrdersAnalytics : builder.query({
            query : () => ({
                url : "analytics/get-orders-analytics",
                method : "GET",
                credentials : "include" as const
            })
        }),
    })
})

export const {useGetCourseAnalyticsQuery, useGetUsersAnalyticsQuery, useGetOrdersAnalyticsQuery} = analyticsApi;