import React,{FC, useState, useEffect} from 'react';
import { styles } from './../../../app/styles/style';
import Image from 'next/image';
import {toast} from 'react-hot-toast';
import { AiOutlineCamera } from "react-icons/ai";

import { useUpdateAvatarMutation, useUpdateProfileMutation  } from '@/redux/features/user/userApi'; 
import { useLoadUserQuery } from '@/redux/features/api/apiSlice';


type Props ={
    user : any;
    avatar : string | null;
}

const ProfileInfo:FC<Props> = ({avatar, user}) => {

    const [name, setName] = useState(user && user.name);
    const [updateAvatar, {isSuccess, error}] = useUpdateAvatarMutation();
    const [updateProfile, {isSuccess: updateInfoSuccess,data, error : updateInfoError}] = useUpdateProfileMutation();


    const [loadUser, setLoadUser] = useState(false);
    const { } = useLoadUserQuery(undefined, { skip: !loadUser });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
       if(name !== ''){
        await updateProfile({name})  // pass name those save in state name.
       }
    };

    // user imageHandler update
    const imageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const fileReader = new FileReader();
            fileReader.onload = () => {
                if (fileReader.readyState === 2) {
                    const avatar = fileReader.result as string;
                    updateAvatar(avatar);
                }
            };
            fileReader.readAsDataURL(file);
        }
    };

    useEffect(() => {

        if (isSuccess || updateInfoSuccess) {
            setLoadUser(true); // Trigger re-fetch of user data
        }
        if(updateInfoSuccess){
            const message = data?.message || "User Name Updated Successfully!";
            toast.success(message);
        }
        if (error || updateInfoError) {
            console.error('Error updating avatar:', error);
        }
    }, [isSuccess, error,updateInfoSuccess, updateInfoError]);

    return (
        <div className="w-full max-w-md mx-auto my-[1rem] bg-white  p-6 rounded-lg shadow-md flex flex-col items-center">
            {/* Profile Avatar */}
            <div className="w-full mt-5 mb-1 relative h-24">
                <Image
                    src={user?.avatar || avatar ? user?.avatar?.url || avatar : '/avatar.png'}
                    alt={`Profile Image`}
                    fill
                    priority
                    className='w-[120px] h-[120px] rounded-full border-2 border-gray-400 cursor-pointer object-cover'
                />
                <input type='file' onChange={imageHandler} name='avatar' id='avatar' className='hidden' accept='image/png,image/jpg,image/jpeg,image/webp' />
                <label htmlFor='avatar'>
                    <div className='w-[30px] h-[30px] bg-slate-900 rounded-full absolute bottom-2 right-2 flex items-center justify-center cursor-pointer'>
                        <AiOutlineCamera size={25} className='z-1 text-white'/>
                    </div>
                </label>
            </div>

            {/* Full Name Input */}
            <form onSubmit={handleSubmit}>
            <div className='w-full mt-5 mb-1'>
                <label className={`${styles.label}`} htmlFor='name'>Your Full Name</label>
                <input
                    type='text'
                    name='name'
                    defaultValue={name} 
                    id='name'
                    placeholder='Enter Your Name'
                    className={`${styles.input}`}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>

            <div className='w-full mt-5 mb-1'>
                <label className={`${styles.label}`} htmlFor='email'>Your Email</label>
                <input
                    type='email'
                    name='email'
                    value={user?.email} 
                    id='email'
                    readOnly
                    placeholder='Enter Your Email'
                    className={`${styles.input}`}
                />
            </div>

            <div className='w-full mt-5'>
                <input
                    type='submit'
                    value='Update'
                    className={`${styles.button} text-white`}
                />
            </div>
            </form>
        </div>
    );
};

export default ProfileInfo;
