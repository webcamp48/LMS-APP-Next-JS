import React, { FC } from 'react';
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { FaUserCircle, FaTachometerAlt, FaCog, FaKey, FaBook, FaSignOutAlt } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';

type Props = {
  user: any;
  active: number;
  avatar: string | null;
  setActive: (active: number) => void;
  logoutHandler: any;
};

const SideBarProfile: FC<Props> = ({ user, active, avatar, setActive, logoutHandler }) => {
  return (
    <div className="w-full lg:w-64 h-full bg-gray-800 p-4 text-white flex flex-col items-center">
      {/* Profile Avatar */}
      <div className="mb-4">
        <Image
          src={user?.avatar || avatar ? user.avatar.url || avatar : '/avatar.png'} 
          alt="User Profile Image"
          width={80}
          height={80}
          priority
          className="rounded-full border-2 border-gray-400 cursor-pointer object-cover"

        />
      </div>

      {/* User Info */}
      <div className="text-center mb-6">
        <h2 className="text-lg font-semibold">{user.name}</h2>
        <p className="text-gray-400 text-sm">{user.email}</p>
      </div>

      {/* Navigation Links */}
      <div className="flex flex-col w-full space-y-2">
        <button
          onClick={() => setActive(1)}
          className={`py-2 px-4 rounded-md text-left flex items-center ${
            active === 1 ? 'bg-blue-500' : 'hover:bg-gray-700'
          }`}
        >
          <FaTachometerAlt className="mr-2" /> Dashboard
        </button>
        <button
          onClick={() => setActive(2)}
          className={`py-2 px-4 rounded-md text-left flex items-center ${
            active === 2 ? 'bg-blue-500' : 'hover:bg-gray-700'
          }`}
        >
          <FaKey className="mr-2" /> Change Password
        </button>
        <button
          onClick={() => setActive(3)}
          className={`py-2 px-4 rounded-md text-left flex items-center ${
            active === 3 ? 'bg-blue-500' : 'hover:bg-gray-700'
          }`}
        >
          <FaBook className="mr-2" /> Enrolled Courses
        </button>
        {/* if you have admin Role. then access */}
        {user?.role === 'Admin' && (
          <Link href='/admin'>
            <button
            onClick={() => setActive(5)}
            className={`py-2 px-4 rounded-md text-left flex items-center ${
              active === 5 ? 'bg-blue-500' : 'hover:bg-gray-700'
            }`}
          >
            <MdOutlineAdminPanelSettings className="mr-2" /> Admin Dashboard
            </button>
          </Link>
        )}
      </div>

      {/* Logout Button */}
      <button
        onClick={()=> logoutHandler()}
        className="mt-2 w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-md flex items-center justify-center"
      >
        <FaSignOutAlt className="mr-2" /> Logout
      </button>
    </div>
  );
};

export default SideBarProfile;
