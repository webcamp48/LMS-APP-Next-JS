'use client';
import React, { useState } from 'react';
import ThemeSwitcher from "@/app/utils/ThemeSwitcher";
import { IoIosNotificationsOutline } from "react-icons/io";

type Props = {
    open?: boolean;
    setOpen?: any;
};

const DashboardHeader:React.FC<Props> = ({open,setOpen}) => {
    return(
        <div className='w-full flex items-center p-6 justify-end fixed top-5 right-8'>
            <ThemeSwitcher />
            <div className='relative cursor-pointer m-2' onClick={()=> setOpen(!open)}>
                <IoIosNotificationsOutline  className='text-2xl text-black dark:text-white cursor-pointer'/>
                <span className='absolute -top-2 -right-2 bg-[#3ccba0] w-[20px] rounded-full h-[20px] text-[13px] text-white flex items-center justify-center'>3</span>
            </div>

            {open && (
                <div className='w-[350px] h-[70vh] dark:bg-[#111c43] shadow-2xl p-2 bg-[#fff] absolute top-16 rounded z-10 overflow-auto'>
                    <h5 className='text-[20px] text-black dark:text-white text-center border-b dark:border-b-[#00000f] mb-1'>Notification</h5>
                    <div className="bg-[#fff] dark:bg-[#2d3a4ea1] font-Poppins border-b dark:border-b-[#00000f] p-2">
                        <div className='w-full flex justify-between items-center p-2'>
                            <p className="text-[#333] dark:text-white font-semibold mr-1">New Question Received</p>
                            <p className="text-black cursor-pointer dark:text-white">Mark as Read</p>
                        </div>
                        <p className='px-2 text-black dark:text-white'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ullam quis sed architecto? Nostrum quod, enim cumque accusamus aspernatur consectetur eos!</p>
                        <p className='text-black dark:text-white cursor-pointer ml-2 mt-2 text-[14px]'>5 Days ago</p>
                    </div>
                    <div className="bg-[#fff] dark:bg-[#2d3a4ea1] font-Poppins border-b dark:border-b-[#00000f] p-2">
                        <div className='w-full flex justify-between items-center p-2'>
                            <p className="text-[333] dark:text-white font-semibold mr-1">New Question Received</p>
                            <p className="text-black cursor-pointer dark:text-white">Mark as Read</p>
                        </div>
                        <p className='px-2 text-black dark:text-white'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ullam quis sed architecto? Nostrum quod, enim cumque accusamus aspernatur consectetur eos!</p>
                        <p className='text-black dark:text-white cursor-pointer ml-2 mt-2 text-[14px]'>5 Days ago</p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default DashboardHeader;