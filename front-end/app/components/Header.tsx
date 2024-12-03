"use client";
import React, { FC, useState,useEffect } from "react";
import Link from "next/link";
import Image from 'next/image';
import NavItems from './../utils/NavItems'
import CustomModal from './../utils/CustomModal'
import Login from './Auth/Login';
import SignUp from './Auth/SignUp';
import Verification from './Auth/Verification';
import { useSelector } from 'react-redux';
import ThemeSwitcher from "../utils/ThemeSwitcher";
import {HiOutlineMenuAlt3, HiOutlineUserCircle} from 'react-icons/hi'
import avatar from './../../public/assets/avatar.png'
import { useSession } from "next-auth/react"
import { useSocialAuthMutation  } from '@/redux/features/auth/authApi'; 
import {toast} from 'react-hot-toast';


type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  activeItem: number;
  route : string;
  setRoute: (route: string) => void;
};

const Header: FC<Props> = ({activeItem, setOpen,open, route, setRoute}) => {
  const {user} = useSelector((state: any) => state.auth);
  const {data} = useSession();
  const [socialAuth, {isSuccess, error}] = useSocialAuthMutation();


  const [active, setActive] = useState(false);
  const [openSideBar, setOpenSideBar] = useState(false);


  useEffect(()=> {
    if(!user){
      if(data){
        socialAuth({
          name: data?.user?.name,
          email: data?.user?.email,
          avatar: data?.user?.image
        })
      }
    }

      if (isSuccess) {
        toast.success(`${data?.user?.name} Login Successfully`);
      }

    if(error){
        if("data" in error){
            const errorData = error as any;
            toast.error(errorData.data.message);
        }
    }
  }, [data, user, isSuccess, error, socialAuth])

  useEffect(() => {
    const handleScroll = () => {
      setActive(window.scrollY > 90);
    };

    window.addEventListener("scroll", handleScroll);
    
    // Call handleScroll once to set the initial state
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // handle sidebar close
  const handleClose = (e:any) => {
    if(e.target.id === 'screen'){
      setOpenSideBar(false)
    }
  }

  return (
    <div className="w-full relative">
      <div
        className={`${
          active
            ? "dark:bg-opacity-50 dark:bg-gradient-to-b dark:from-gray-900 dark:to-black fixed top-0 left-0 w-full h-[80px] z-[90] border-b dark:border-[#f8f8f8] shadow-xl transition duration-500"
            : "w-full border-b dark:border-[#f8f8f8] h-[80px] z-[90] dark:shadow"
        }`}
      >
        <div className="w-[95%] 800px-w-[92%] m-auto py-2 h-full">
          <div className="w-full h-[80px] flex items-center justify-between p-3">
            <div>
              <Link
                href={"/"}
                className="text-[25px] font-Poppins font-500 text-black dark:text-white"
              >
                Elearning App
              </Link>
            </div>
            <div className="flex items-center">
                <NavItems isMobile={false} activeItem={activeItem} />
                <ThemeSwitcher />
                {/* only for mobile device */}
                <div className='800px:hidden'>
                  <HiOutlineMenuAlt3 size={25} onClick={()=> setOpenSideBar(true)} className='cursor-pointer text-black dark:text-white'/>
                </div>
                {user ? (
                <Link href='/profile'>
                  <div className='relative w-[30px] h-[30px]'>
                    <Image
                      src={user.avatar ? user.avatar.url : avatar}
                      alt='User Profile Image'
                      width={30}
                      height={30}
                      priority 
                      className='rounded-full cursor-pointer object-cover'
                    />
                  </div>
                </Link>
              ) : (
                <HiOutlineUserCircle 
                  size={25} 
                  onClick={()=> setOpen(true)} 
                  className='hidden 800px:block cursor-pointer text-black dark:text-white'
                />
              )}
            </div>
          </div>
        </div>
        {/* for mobile sidebar */}
        {
          openSideBar && (
            <div className='fixed w-full h-screen top-0 left-0 z-[9999] dark:bg-[unset] bg-[#000024]' id='screen' onClick={handleClose}>
              <div className='w-[70%] h-screen fixed z-[999999] dark:bg-slate-900 bg-white dark:bg-opacity-90 top-0 right-0'>
                <NavItems  activeItem={activeItem} isMobile={true}/>
                <HiOutlineUserCircle size={25} onClick={()=> setOpen(true)} className='cursor-pointer my-3 ml-5 text-black dark:text-white'/>
                <br />
                <br />
                <p className='text-[16px] pl-5 px-3  text-black dark:text-white'>CopyRight @ 2024 Elearning App</p>
              </div>
            </div>
          )
        }
      </div>

      {
        route === "Login" && (
          <>
          {open && (
            <CustomModal 
              open={open}
              setOpen={setOpen}
              setRoute={setRoute}
              activeItem = {activeItem}
              component={Login}
            />
          )}
          </>
        )
      }

      {
        route === "Sign-Up" && (
          <>
          {open && (
            <CustomModal 
              open={open}
              setOpen={setOpen}
              setRoute={setRoute}
              activeItem = {activeItem}
              component={SignUp}
            />
          )}
          </>
        )
      }

      {
        route === "Verification" && (
          <>
          {open && (
            <CustomModal 
              open={open}
              setOpen={setOpen}
              setRoute={setRoute}
              activeItem = {activeItem}
              component={Verification}
            />
          )}
          </>
        )
      }
    </div>


  );
};

export default Header;


