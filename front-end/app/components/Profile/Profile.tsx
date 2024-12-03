'use client';
import React, { FC, useState, useEffect } from 'react';
import { useLogoutQuery  } from '@/redux/features/auth/authApi'; 
import { signOut } from 'next-auth/react';

import SideBarProfile from './SideBarProfile';
import ProfileInfo from './ProfileInfo';
import UpdatePassword from './UpdatePassword';



type Props = {
  user: any;
};

const Profile: FC<Props> = ({ user }) => {
  const [scroll, setScroll] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [active, setActive] = useState(1);
  const [logout, setLogout] = useState(false);

  const {} = useLogoutQuery(undefined, {
    skip : !logout ? true : false,
  })

  // logoutHandler function
  const logoutHandler = async () => {
    setLogout(true);
    await signOut();
  };

  // Scroll effect for positioning
  useEffect(() => {
    const handleScroll = () => {
      setScroll(window.scrollY > 85);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="w-full max-w-[95%] md:max-w-[100%] lg:w-[85%] mx-auto my-4 md:my-6 lg:my-8 flex flex-col lg:flex-row items-start">
      {/* Sidebar Card */}
      <div
        className={`w-full sm:w-[160px] md:w-[200px] lg:w-[250px] h-[auto] bg-slate-900 bg-opacity-90 border border-slate-400 rounded-[5px] shadow-md  lg:sticky ${
          scroll ? 'top-[120px]' : 'top-[30px]'
        }`}
      >
        <SideBarProfile
          user={user}
          active={active}
          avatar={avatar}
          setActive={setActive}
          logoutHandler={logoutHandler}
        />
      </div>
      
      {/* Main Profile Content */}
      <div className="flex-1 bg-white dark:bg-slate-900 p-4 sm:p-6 lg:ml-6 rounded-md shadow-md mt-4 lg:mt-0">
        <h2 className="text-xl sm:text-2xl dark:text-white font-semibold mb-4">Welcome, {user?.name}</h2>
        <p className="text-gray-600 dark:text-white">Here you can manage your profile, update Info, and view your Enrolled Courses.</p>

        {active === 1 && (
          <ProfileInfo user={user} avatar={avatar}/>
        )}

        {active === 2 && (
          <UpdatePassword user={user}/>
        )}

      </div>
    </div>
  );
};

export default Profile;
