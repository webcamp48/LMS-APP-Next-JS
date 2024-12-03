import React,{FC, useState, useEffect} from 'react';
import { styles } from '../../styles/style';
import { toast } from 'react-hot-toast';
import { useUpdatePasswordMutation  } from '@/redux/features/user/userApi'; 

type Props = {
    user : any
}
const UpdatePassword:FC<Props> = () => {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [updatePassword, {isSuccess,data, error}] = useUpdatePasswordMutation();


    useEffect(()=>{
        if(isSuccess){
            const message = data?.message || "Password Updated Successfully!.";
            toast.success(message);
        }
        if(error){
            if("data" in error){
                const errorData = error as any;
                toast.error(errorData.data.message);
            }
        }
    }, [isSuccess, error])

    // updatePasswordHandler
    const updatePasswordHandler = async (e:any) => {
        e.preventDefault();
        if(newPassword !== confirmPassword){
            toast.error("Password do not match.")
        }else{
            await updatePassword({oldPassword,newPassword });
        }
    }
    return (
        <form onSubmit={updatePasswordHandler} className='w-full bg-[#F9F9F9] dark:bg-slate-900 my-4 p-8 rounded-lg shadow-lg flex justify-center flex-col items-center'>
            <h2 className='dark:text-white font-Poppins text-2xl font-semibold'>Update Password</h2>
            <div className='w-full mt-4 mb-2'>
                <label className={`${styles.label}`} htmlFor='oldPassword'>
                    Enter Your Old Password
                </label>
                <input
                    type='password'
                    name='oldPassword'
                    id='oldPassword'
                    placeholder='Enter Your Old Password'
                    onChange={(e)=> setOldPassword(e.target.value)}
                    className={`${styles.input} mt-2 p-2 border border-gray-300 rounded-md w-full`}
                />
            </div>
            <div className='w-full mt-4 mb-2'>
                <label className={`${styles.label}`} htmlFor='newPassword'>
                    Enter Your New Password
                </label>
                <input
                    type='password'
                    name='newPassword'
                    id='newPassword'
                    placeholder='Enter Your New Password'
                    onChange={(e)=> setNewPassword(e.target.value)}
                    className={`${styles.input} mt-2 p-2 border border-gray-300 rounded-md w-full`}
                />
            </div>
            <div className='w-full mt-4 mb-2'>
                <label className={`${styles.label}`} htmlFor='confirmPassword'>
                    Confirm Your New Password
                </label>
                <input
                    type='password'
                    name='confirmPassword'
                    id='confirmPassword'
                    onChange={(e)=> setConfirmPassword(e.target.value)}
                    placeholder='Confirm Your New Password'
                    className={`${styles.input} mt-2 p-2 border border-gray-300 rounded-md w-full`}
                />
            </div>
            <button 
                type='submit'
                className='w-full mt-5 p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors'
            >
                Update Password
            </button>
        </form>
    );
};

export default UpdatePassword;
