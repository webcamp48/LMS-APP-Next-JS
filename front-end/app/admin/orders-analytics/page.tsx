"use client";
import React, { FC } from "react";
import AdminSideBar from "../../components/Admin/sidebar/AdminSideBar";
import AdminProtected from "../../hooks/useAdminProtected";
import DashboardHeader from "../../components/Admin/DashboardHeader";
import Heading from "./../../utils/Heading";
import OrderAnalytics from './../../components/Admin/Analytics/OrderAnalytics';

interface Props {}

const page: FC<Props> = () => {
  return (
    <div>
      <AdminProtected>
        <Heading
          title="All Courses - Admin Panel"
          description="Admin panel for managing courses, teachers, and students in the ELearning platform"
          keywords="ELearning Admin Panel, MERN STACK Admin, NEXT JS Admin, Course Management"
        />
        <div className="flex h-screen">
          <div className="1500px:w-[16%] w-1/5">
            <AdminSideBar />
          </div>
          <div className="w-[85%]">
            <DashboardHeader />
            <OrderAnalytics />
          </div>
        </div>
      </AdminProtected>
    </div>
  );
};

export default page;
