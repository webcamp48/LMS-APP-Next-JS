import { useTheme } from 'next-themes';
import React, { FC, useEffect, useMemo, useState } from 'react';

import { AiOutlineDelete, AiOutlineMail } from 'react-icons/ai';
import { Box, Button, Modal } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

import { format } from 'timeago.js';
import Loader from '../../Loader/Loader';
import { styles } from '../../../styles/style';
import toast from 'react-hot-toast';

import { useGetAllUsersQuery, useUpdateUserRoleMutation, useDeleteUserMutation } from '@/redux/features/user/userApi';

type Props = {
  isTeam: boolean;
};

const AllUsers: FC<Props> = ({ isTeam }) => {
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Admin");

  const { data, isLoading, refetch } = useGetAllUsersQuery({}, {refetchOnMountOrArgChange : true});
  
  const [updateUserRole, {isSuccess, data:userRoleData, error}] = useUpdateUserRoleMutation();
  const [deleteUser, {isSuccess : deleteUserSuccess, data : deleteData, error : deleteUserError}] = useDeleteUserMutation()

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', flex: 0.2 },
    { field: 'name', headerName: 'Name', flex: 0.3 },
    { field: 'email', headerName: 'Email', flex: 0.4 },
    { field: 'role', headerName: 'Role', flex: 0.2 },
    { field: 'courses', headerName: 'Courses Purchased', flex: 0.2 },
    { field: 'created_at', headerName: 'Joined At', flex: 0.3 },
    {
      field: 'change role',
      headerName: 'Change Role',
      flex: 0.2,
      renderCell: (params: GridRenderCellParams) => (
        <Button onClick={() => handleOpenRoleModal(params.row.id, params.row.email)}>
          Role
        </Button>
      ),
    },
    {
      field: 'delete',
      headerName: 'Delete',
      flex: 0.2,
      renderCell: (params: GridRenderCellParams) => (
        <Button onClick={() => {
          setOpenDelete(!openDelete);
          setUserId(params.row.id)
        }}>
          <AiOutlineDelete size={25} className="text-black dark:text-white" />
        </Button>
      ),
    },
    {
      field: 'send email',
      headerName: 'Send Email',
      flex: 0.2,
      renderCell: (params: GridRenderCellParams) => (
        <a href={`mailto:${params.row.email}`}>
          <AiOutlineMail size={25} className="text-black dark:text-white" />
        </a>
      ),
    },
  ];

  const rows = useMemo(() => {
    if (!data) return [];
    const filteredUsers = isTeam ? data.users.filter((user: any) => user.role === 'Admin') : data.users;
    return filteredUsers.map((user: any) => ({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      courses: user.courses.length,
      created_at: format(user.createdAt),
    }));
  }, [data, isTeam]);


  useEffect(() => {
    if (isSuccess) {
      const message = userRoleData?.message || "User Role Update Successfully!";
      toast.success(message);
      setOpen(false);
      refetch();
    }
    if (error) {
      if ("data" in error) {
        const errorMessage = error as any;
        toast.error(errorMessage.data.message);
      }
    }
    if (deleteUserSuccess) {
      const message = deleteData?.message || "User Delete Successfully!";
      toast.success(message);
      setOpenDelete(false);
      refetch();
    }
    if (deleteUserError) {
      if ("data" in deleteUserError) {
        const errorMessage = deleteUserError as any;
        toast.error(errorMessage.data.message);
      }
    }
  }, [isSuccess, error, deleteUserSuccess, deleteUserError]);


  const handleOpenRoleModal = (id: string, email: string) => {
    setUserId(id);
    setEmail(email);
    setOpen(true);
  };

  const handleDelete = async () => {
    // Implement delete functionality here
    const id = userId
    await deleteUser(id)
  };

  const handlerUpdateUserRole = async () => {
    const id = userId;
    await updateUserRole({id, role});
    setOpen(false);
  };

  return (
    <div className="mt-[120px]">
      {isLoading ? (
        <Loader />
      ) : (
        <Box m="20px">
          <Box
            m="40px 0 0 0"
            height="80vh"
            sx={{
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: theme === 'dark' ? '#3e4396' : '#a4a9fc',
                borderTop: 'none',
              },
              '& .MuiDataGrid-root': { border: 'none', outline: 'none' },
              '& .MuiSvgIcon-root': { color: theme === 'dark' ? '#fff' : '#000' },
              '& .MuiDataGrid-sortIcon': { color: theme === 'dark' ? '#fff' : '#000' },
              '& .MuiDataGrid-row': {
                color: theme === 'dark' ? '#fff' : '#000',
                borderBottom: theme === 'dark' ? '1px solid #ffff30 !important' : '1px solid #ccc !important',
              },
              '& .MuiTablePagination-root': { color: theme === 'dark' ? '#fff' : '#000' },
              '& .MuiDataGrid-cell': { borderBottom: 'none' },
              '& .MuiCheckbox-root': {
                color: theme === 'dark' ? '#b7ebde !important' : '#000 !important',
              },
            }}
          >
            <DataGrid rows={rows} columns={columns} checkboxSelection />
          </Box>
          {open && (
            <Modal
              open={open}
              onClose={() => setOpen(false)}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[450px] dark:bg-slate-900 bg-white rounded-[8px] shadow p-4 outline-none">
                <h1 className={`${styles.title}`}>Change User Role</h1>
                <div className=" mb-6">
                  <input
                    type="text"
                    value={email}
                    placeholder="Email Address"
                    className={`${styles.input}`}
                    readOnly
                  />
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className={`${styles.input}`}
                  >
                    <option value="User">User</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                <input
                  type="submit"
                  onClick={handlerUpdateUserRole}
                  value="Change Role"
                  className={`${styles.button}`}
                />
              </Box>
            </Modal>
          )}

          {openDelete && (
            <Modal
              open={openDelete}
              onClose={() => setOpenDelete(!openDelete)}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box className='absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[450px] dark:bg-slate-900 bg-white rounded-[8px] shadow p-4 outline-none'>
                <h1 className={`${styles.title}`}>
                  Are you sure you want to delete this User ?
                </h1>
                <div className='flex w-full items-center justify-between mb-6'>
                  <div onClick={()=> setOpenDelete(!openDelete)} className={`${styles.button} !w-[120px] h-[30px] bg-[#3fc432]`}>
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


export default AllUsers;
