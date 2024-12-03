"use client";

import React, { useState } from 'react';
import { ProSidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { Box, IconButton, Typography } from '@mui/material';
import 'react-pro-sidebar/dist/css/styles.css';
import {
  FaChartBar,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaBookOpen,
  FaArrowLeft,
  FaCog,
  FaQuestionCircle,
  FaTag,
  FaUsers,
  FaClipboardList,
  FaChevronDown,
  FaChevronRight,
  FaUserShield,
  FaChartLine  
} from 'react-icons/fa';
import { IoMdSettings, IoIosLogOut  } from "react-icons/io";
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { useTheme } from 'next-themes';
import Image from 'next/image';

interface ItemProps {
  title: string;
  to: string;
  icon: JSX.Element;
  selected: string;
  setSelected: React.Dispatch<React.SetStateAction<string>>;
}

const Item: React.FC<ItemProps> = ({ title, to, icon, selected, setSelected }) => {
  return (
    <MenuItem
      active={selected === title}
      icon={icon}
      onClick={() => setSelected(title)}
      style={{
        backgroundColor: selected === title ? '#333' : 'transparent',
        marginLeft:"0.8rem"
      }}
    >
      <Typography className='!text-[16px] !font-Poppins'>{title}</Typography>
      <Link href={to} />
    </MenuItem>
  );
};

export default function AdminSideBar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user } = useSelector((state: any) => state.auth);
  const [selected, setSelected] = useState('Dashboard');

  // State for toggling sub-menu visibility
  const [showCustomization, setShowCustomization] = useState(false);
  const [showControllers, setShowControllers] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showData, setShowData] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [showExtra, setShowExtra] = useState(false);

  const { theme } = useTheme();

  return (
    <Box sx={{
      '& .pro-sidebar-inner': {
        background: `${theme === 'dark' ? '#1A1A2E !important' : '#f7f7f7 !important'}`,
      },
      '& .pro-icon-wrapper': {
        backgroundColor: "transparent !important"
      },
      '& .pro-inner-item:hover': {
        color: '#8687f1'
      },
      '& .pro-menu-item.active': {
        backgroundColor: '#333',
        color: '#fff',
      },
      '& .pro-menu-item': {
        color: `${theme !== 'dark' ? "#000" : "#fff"}`,
      },
      '& .pro-inner-item': {
        padding: '5px 35px 5px 20px',
        opacity: 1
      },
    }}
      className='!bg-[#111c43] dark:bg-[#1A1A2E]'
    >
      <ProSidebar
        collapsed={isCollapsed}
        style={{ position: "fixed", top: "0", left: "0", height: "100vh", width: isCollapsed ? "0%" : "16%" }}
        breakPoint="md"
        width="250px"
        collapsedWidth="80px"
      >
        <Menu>
          <MenuItem icon={isCollapsed ? <FaChartBar /> : undefined} onClick={() => setIsCollapsed(!isCollapsed)} style={{ margin: "10px 0 20px 0" }}>
            {!isCollapsed && (
              <Box display='flex' justifyContent='space-between' alignItems='center' ml='15px'>
                <Link href='/Dashboard'>
                  <h3 className='text-25px font-Poppins uppercase text-black dark:text-white hover:bg-transparent'>Elearning App</h3>
                </Link>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)} className='inline-block'>
                  <FaArrowLeft className='text-black dark:text-white' />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box mb='25px' display='flex' flexDirection='column' alignItems='center'>
              <Image
                alt=''
                width={80}
                height={80}
                src={user.avatar ? user.avatar.url : '/avatar.png'}
                className='rounded-full border-2 border-indigo-600 object-cover object-center mb-4'
              />
              <Typography variant='h4' className='!text-[20px] text-black dark:text-white text-center'>{user?.name || ""}</Typography>
              <Typography variant='h6' className='!text-[16px] text-black dark:text-white text-center'>{user?.role || ""}</Typography>
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? "undefined" : "10%"}>
            <Item title='Dashboard' to='/admin' icon={<FaChartBar size={20}/>} selected={selected} setSelected={setSelected} />
            
            <MenuItem
              icon={showData ? <FaChevronDown /> : <FaChevronRight />}
              onClick={() => setShowData(!showData)}
              style={{ margin: "10px 0" }}
            >
              <Typography className='!text-[16px] !font-Poppins'>Data</Typography>
            </MenuItem>
            {showData && (
              <>
                <Item title='Users' to='/admin/users' icon={<FaUserGraduate size={20}/>} selected={selected} setSelected={setSelected} />
                <Item title='Invoices' to='/admin/invoices' icon={<FaClipboardList size={20}/>} selected={selected} setSelected={setSelected} />
              </>
            )}

            <MenuItem
              icon={showContent ? <FaChevronDown /> : <FaChevronRight />}
              onClick={() => setShowContent(!showContent)}
              style={{ margin: "10px 0" }}
            >
              <Typography className='!text-[16px] !font-Poppins'>Content</Typography>
            </MenuItem>
            {showContent && (
              <>
                <Item title='Create Course' to='/admin/create-course' icon={<FaChalkboardTeacher size={20}/>} selected={selected} setSelected={setSelected} />
                <Item title='All Courses' to='/admin/courses' icon={<FaBookOpen size={20}/>} selected={selected} setSelected={setSelected} />
              </>
            )}

            <MenuItem
              icon={showCustomization ? <FaChevronDown /> : <FaChevronRight />}
              onClick={() => setShowCustomization(!showCustomization)}
              style={{ margin: "10px 0" }}
            >
              <Typography className='!text-[16px] !font-Poppins'>Customization</Typography>
            </MenuItem>
            {showCustomization && (
              <>
                <Item title='Hero' to='/admin/hero' icon={<FaTag size={20}/>} selected={selected} setSelected={setSelected} />
                <Item title='FAQ' to='/admin/faq' icon={<FaQuestionCircle size={20}/>} selected={selected} setSelected={setSelected} />
                <Item title='Categories' to='/admin/categories' icon={<FaTag size={20}/>} selected={selected} setSelected={setSelected} />
              </>
            )}

            <MenuItem
              icon={showControllers ? <FaChevronDown /> : <FaChevronRight />}
              onClick={() => setShowControllers(!showControllers)}
              style={{ margin: "10px 0" }}
            >
              <Typography className='!text-[16px] !font-Poppins'>Controllers</Typography>
            </MenuItem>
            {showControllers && (
              <Item title='Manage Team' to='/admin/team' icon={<FaUsers size={20}/>} selected={selected} setSelected={setSelected} />
            )}

            <MenuItem
              icon={showAnalytics ? <FaChevronDown /> : <FaChevronRight />}
              onClick={() => setShowAnalytics(!showAnalytics)}
              style={{ margin: "10px 0" }}
            >
              <Typography className='!text-[16px] !font-Poppins'>Analytics</Typography>
            </MenuItem>
            {showAnalytics && (
              <>
                <Item title='Courses Analytics' to='/admin/courses-analytics' icon={<FaChartBar size={20}/>} selected={selected} setSelected={setSelected} />
                <Item title='Orders Analytics' to='/admin/orders-analytics' icon={<FaChartLine  size={20}/>} selected={selected} setSelected={setSelected} />
                <Item title='Users Analytics' to='/admin/users-analytics' icon={<FaUserShield  size={20}/>} selected={selected} setSelected={setSelected} />
              </>
            )}

            <MenuItem
              icon={showExtra ? <FaChevronDown /> : <FaChevronRight />}
              onClick={() => setShowExtra(!showExtra)}
              style={{ margin: "10px 0" }}
            >
              <Typography className='!text-[16px] !font-Poppins'>Extras Features</Typography>
            </MenuItem>
            {showExtra && (
              <>
                <Item title='Setting' to='/admin/setting' icon={<IoMdSettings size={20}/>} selected={selected} setSelected={setSelected} />
                <Item title='Logout' to='/admin/logout' icon={<IoIosLogOut size={20}/>} selected={selected} setSelected={setSelected} />
              </>
            )}
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
}


