import { useTheme } from 'next-themes';
import React, { FC, useEffect, useMemo, useState } from 'react';

import { AiOutlineDelete } from 'react-icons/ai';
import { FaRegEdit } from 'react-icons/fa';

import { useGetAllCoursesQuery, useDeleteCourseMutation } from '@/redux/features/course/course';

import { Box, Button, Modal } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

import { format } from 'timeago.js';
import Loader from '../../Loader/Loader';
import {styles} from '../../../styles/style';
import toast from 'react-hot-toast';
import Link from 'next/link';


type Props = {};

const AllCourses: FC<Props> = () => {
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);
  const [courseId, setCourseId] = useState("");

  const { data, isLoading, refetch } = useGetAllCoursesQuery({}, {refetchOnMountOrArgChange : true});
  const [deleteCourse, {isSuccess, error, data : deleteCourseData}] = useDeleteCourseMutation({});

  
  useEffect(()=> {
    if(isSuccess){
      const message = deleteCourseData?.message || "Course Delete Successfully"
      toast.success(message)
      setOpen(false);
      refetch();
    }
    if(error){
      if("data" in error){
        const errorMessage = error as any;
        toast.error(errorMessage.data.message)
      }
    }
  }, [isSuccess, error, deleteCourseData]);
  
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', flex: 0.5 },
    { field: 'title', headerName: 'Course Title', flex: 1.2 },
    { field: 'ratings', headerName: 'Rating', flex: 0.5 },
    { field: 'purchased', headerName: 'Purchased', flex: 0.5 },
    { field: 'created_at', headerName: 'Created At', flex: 0.5 },
    {
      field: 'edit',
      headerName: 'Edit',
      flex: 0.2,
      renderCell: (params: GridRenderCellParams) => (
        <Link href={`/admin/edit-course/${params.row.id}`}>
          <FaRegEdit size={25} className='text-black dark:text-white' />
        </Link>
      ),
    },
        {
      field: 'delete',
      headerName: 'Delete',
      flex: 0.2,
      renderCell: (params: GridRenderCellParams) => (
        <Button onClick={() => {
          setOpen(!open);
          setCourseId(params.row.id)
        }}>
          <AiOutlineDelete size={25} className='text-black dark:text-white' />
        </Button>
      ),
    },
  ];

  const rows = useMemo(() => {
    return (
      data?.courses?.map((item: any) => ({
        id: item._id,
        title: item.name,
        ratings: item.ratings,
        purchased: item.purchased,
        created_at: format(item.createdAt),
      })) || []
    );
  }, [data]);


  const handleDelete = async () => {
    // Implement delete functionality here
    const id = courseId;
    await deleteCourse(id);
  };
  

  return (
    <div className='mt-[120px]'>
      {isLoading ? (
        <Loader />
      ) : (
        <Box m='20px'>
          <Box
            m='40px 0 0 0'
            height='80vh'
            sx={{
              '& .MuiDataGrid-columnHeaders': {
                color: "#000",
                borderTop: 'none',
                backgroundColor: theme === 'dark' ? '#3e4396' : '#a4a9fc',
              },
              '& .MuiDataGrid-root': { border: 'none', outline: 'none' },
              '& .MuiSvgIcon-root': { color: theme === 'dark' ? '#fff' : '#000' },
              '& .MuiDataGrid-sortIcon': { color: theme === 'dark' ? '#fff' : '#000' },
              '& .MuiDataGrid-row': {
                color: theme === 'dark' ? '#fff' : '#000',
                borderBottom: theme === 'dark' ? '1px solid #ffff30!important' : '1px solid #ccc !important',
              },
              '& .MuiTablePagination-root': { color: theme === 'dark' ? '#fff' : '#000' },
              '& .MuiDataGrid-cell': { borderBottom: 'none' },

              '& .MuiCheckbox-root': {
                color: theme === 'dark' ? '#b7ebde !important' : '#000 !important',
              },
              '& .MuiDataGrid-toolbarContainer .MuiButton-text': { color: '#fff !important' },
            }}
          >
            <DataGrid rows={rows} columns={columns} checkboxSelection />
          </Box>
            {open && (
              <Modal
                open={open}
                onClose={() => setOpen(!open)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box className='absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[450px] dark:bg-slate-900 bg-white rounded-[8px] shadow p-4 outline-none'>
                  <h1 className={`${styles.title}`}>
                    Are you sure you want to delete this Course ?
                  </h1>
                  <div className='flex w-full items-center justify-between mb-6'>
                    <div onClick={()=> setOpen(!open)} className={`${styles.button} !w-[120px] h-[30px] bg-[#3fc432]`}>
                    Cancle
                    </div>
                    <div  onClick={handleDelete} className={`${styles.button} !w-[120px] h-[30px] bg-[#ca39bd]`}>
                      Delete
                    </div>
                  </div>
                </Box>
              </Modal>
            )}
        </Box>
      )}
    </div>
  );
};

export default AllCourses;
