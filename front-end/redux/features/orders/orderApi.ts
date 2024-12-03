import { apiSlice } from "../api/apiSlice";

export const ordersApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllOrder: builder.query({
            query : () => ({
                url: 'order/getAllOrder',
                method: "GET",
                credentials : "include" as const,
            })
        })
    })
})

export const {useGetAllOrderQuery} = ordersApi;