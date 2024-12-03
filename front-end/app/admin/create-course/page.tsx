import DashboardHeader from "../../components/Admin/DashboardHeader";
import AdminSideBar from "../../components/Admin/sidebar/AdminSideBar";
import Heading from "../../utils/Heading";
import React from "react";
import CreateCourse from "../../components/Admin/Course/CreateCourse";

type Props = {};

const page: React.FC = (props: Props) => {
  return (
    <div>
      <Heading
        title="ELearning - Admin Panel"
        description="Admin panel for managing courses, teachers, and students in the ELearning platform"
        keywords="ELearning Admin Panel, MERN STACK Admin, NEXT JS Admin, Course Management"
      />
      <div className="flex">
        <div className="1500px:w-[16%] w-1/5">
        <AdminSideBar />
        </div>
        <div className='w-[85%]'>
            <DashboardHeader />
            <CreateCourse />
        </div>
      </div>
    </div>
  );
};

export default page;
