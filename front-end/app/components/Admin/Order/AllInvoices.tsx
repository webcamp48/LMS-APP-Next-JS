import { useGetAllCoursesQuery } from '@/redux/features/course/course';
import { useGetAllOrderQuery } from '@/redux/features/orders/orderApi';
import { useGetAllUsersQuery } from '@/redux/features/user/userApi';
import { useTheme } from 'next-themes';
import { format } from 'timeago.js';
import React, { FC, useEffect, useState } from 'react';
import { AiOutlineMail } from 'react-icons/ai';
import Loader from '../../Loader/Loader';
import { Box } from '@mui/material';
import { Checkbox, FormControlLabel } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

type Props = {
  isDashboard?: boolean;
}

const AllInvoices: FC<Props> = ({ isDashboard }) => {
  const { theme } = useTheme();
  const { data, isLoading } = useGetAllOrderQuery({});
  const { data: userData } = useGetAllUsersQuery({});
  const { data: coursesData } = useGetAllCoursesQuery({});

  const [orderData, setOrderData] = useState<any>([]);

  useEffect(() => {
    console.log("data", data);
    if (data && userData && coursesData) {
      const temp = data.orders.map((item: any) => {
        const user = userData?.users.find((user: any) => user._id === item.userId);
        const course = coursesData?.courses.find((course: any) => course._id === item.courseId);

        return {
          ...item,
          id: item._id,
          userName: user?.name || "ali",
          userEmail: user?.email,
          title: course?.name,
          created_at: format(course?.createdAt),
          price: `$${course?.price}`
        }
      });
      setOrderData(temp);
    }
  }, [data, userData, coursesData]);

  const columns: any = [
    { field: "id", headerName: "Id", flex: 0.3 },
    { field: "userName", headerName: "Name", flex: isDashboard ? 0.6 : 0.5 },
    ...(isDashboard
      ? []
      : [
          { field: "userEmail", headerName: "Email", flex: 1 },
          { field: "title", headerName: "Course Title", flex: 1 },
        ]
    ),
    { field: "price", headerName: "Price", flex: 0.3 },
    ...(isDashboard
      ? [
          { field: "created_at", headerName: "Created At", flex: 0.5 },
        ] : [
          { field: " ", headerName: "Email", flex: 0.3, renderCell: (params: any) => {
              return (
                <a href={`mailto: ${params.row.userEmail}`}>
                  <AiOutlineMail className='text-black dark:text-white' size={25} />
                </a>
              )
            }} ,
        ]
    )
  ];

  return (
    <div className={`${!isDashboard ? "mt-[120px]" : "mt-[0px]"}`}>
      {isLoading ? (
        <Loader />
      ) : (
        <Box
          m={isDashboard ? "0" : "40px 0 0 0"}
          overflow={"hidden"}
          height={isDashboard ? "55vh" : "90vh"}
          sx={{
            "& .MuiDataGrid-root": {
              border: "none",
              outline: "none"
            },
            "& .MuiDataGrid-sortIcon": {
              color: theme === 'dark' ? "#fff" : "#000"
            },
            "& .MuiDataGrid-row": {
              color: theme === 'dark' ? "#fff" : "#000",
              borderBottom:
                theme === 'dark' ? "1px solid #ffff34!important" : "1px solid #ccc!important"
            },
            "& .MuiTabPagination-root": {
              color: theme === 'dark' ? "#fff" : "#000"
            },
          }}
        >
          <DataGrid
            rows={orderData}
            columns={columns}
            components={{
              Toolbar: GridToolbar,
            }}
          />
        </Box>
      )}git config --global core.autocrlf true

    </div>
  );
}

export default AllInvoices;
