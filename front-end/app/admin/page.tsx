'use client';
import React,{FC} from 'react';
import Heading from "../utils/Heading";
import AdminSideBar from '../components/Admin/sidebar/AdminSideBar';
import AdminProtected from '../hooks/useAdminProtected';
import DashboardHeader from '../components/Admin/DashboardHeader';
import DashboardHero from '../components/Admin/DashboardHero';

interface Props {};
const page : FC<Props> = () => {
    return (
        <div>
            <AdminProtected>
                <Heading
                title="Create Course - Admin Panel"
                description="Admin panel for managing courses, teachers, and students in the ELearning platform"
                keywords="ELearning Admin Panel, MERN STACK Admin, NEXT JS Admin, Course Management"
                />
                <div className='flex h-[200vh]'>
                    <div className='1500px:w-[16%] w-1/5'>
                        <AdminSideBar />
                    </div>
                    <div className='w-[85%]'>
                        {/* <DashboardHeader isDashboard = {true}/> */}
                        <DashboardHero isDashboard = {true}/>

                    </div>
                </div>
            </AdminProtected>
        </div>
    )
}

export default page;