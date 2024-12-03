"use client";
import React, { useEffect, useState } from "react";

import CourseOptions from "./CourseOptions";
import CourseInformation from "./CourseInformation";
import CourseData from "./CourseData";
import CourseContent from "./CourseContent";
import CoursePreview from "./CoursePreview";
import { useCreateCourseMutation } from "@/redux/features/course/course";

import toast from "react-hot-toast";
import { redirect } from "next/navigation";

type Props = {};

const CreateCourse: React.FC<Props> = () => {


  const [createCourse, {isLoading, isSuccess, data, error}] = useCreateCourseMutation();
  const [active, setActive] = useState(0);
  const [courseInfo, setCourseInfo] = useState({
    name: "",
    description: "",
    categories : "",
    price: "",
    estimatedPrice: "",
    tags: "",
    levels: "",
    demoUrl: "",
    thumbnail: null,
  });
  const [benefits, setBenefits] = useState([{ title: "" }]);
  const [prerequisites, setPrerequisites] = useState([{ title: "" }]);
  const [courseData, setCourseData] = useState({});
  const [courseContentData, setCourseContentData] = useState([
    {
      title: "",
      description: "",
      videoUrl: "",
      videoLength : "",
      videoSection: "Untitled Section",
      suggestion: "",
      links: [{ title: "", url: "" }],
    },
  ]);


  useEffect(()=> {
    if(isSuccess){
      const message = data?.message || "Course Created Successfully!";
      toast.success(message);
      redirect("/admin/courses")
    }
    if(error){
      if("data" in error){
          const errorData = error as any;
          toast.error(errorData.data.message);
      }
  }
  }, [isSuccess,error])


  const handlerSubmit = async () => {
    try {
      // format benefits array data
      const formattedBenefits = benefits.map((benefit) => ({
        title: benefit.title,
      }));
      // format prerequisites array data
      const formattedPrerequisites = prerequisites.map((prerequisite) => ({
        title: prerequisite.title,
      }));
      // format course content data
      const formattedCourseContent = courseContentData.map((courseContent) => ({
        title: courseContent.title,
        description: courseContent.description,
        videoUrl: courseContent.videoUrl,
        videoLength: courseContent.videoLength,
        videoSection: courseContent.videoSection,
        suggestion: courseContent.suggestion,
        links: courseContent.links.map((link) => ({
          title: link.title,
          url: link.url,
        })),
      }));
      // format course info data
      const formattedCourseInfoData = {
        name: courseInfo.name,
        description: courseInfo.description,
        price: courseInfo.price,
        estimatedPrice: courseInfo.estimatedPrice,
        tags: courseInfo.tags,
        levels: courseInfo.levels,
        demoUrl: courseInfo.demoUrl,
        thumbnail: courseInfo.thumbnail,
        totalVideos: courseContentData.length,
        prerequisites: formattedPrerequisites,
        benefits: formattedBenefits,
        courseContent: formattedCourseContent,
      };
      // send data to server
      setCourseData(formattedCourseInfoData);
    } catch (error: any) {
        console.log(error)
    }
  };

  const handlerCourseCreate = async (e:any) => {
    // send data to server
    const data = courseData;
    if(!isLoading){
      await createCourse(data);
    }
  }
  
  return (
    <div className="w-full flex min-h-screen mb-15">
      <div className="w-[80%]">
        {active === 0 && (
          <CourseInformation
            courseInfo={courseInfo}
            setCourseInfo={setCourseInfo}
            active={active}
            setActive={setActive}
          />
        )}
        {active === 1 && (
          <CourseData
            benefits={benefits}
            setBenefits={setBenefits}
            prerequisites={prerequisites}
            setPrerequisites={setPrerequisites}
            active={active}
            setActive={setActive}
          />
        )}
        {active === 2 && (
          <CourseContent
            courseContentData={courseContentData}
            setCourseContentData={setCourseContentData}
            active={active}
            setActive={setActive}
            handlerSubmit={handlerSubmit}
          />
        )}
        {active === 3 && (
          <CoursePreview
          active={active}
          setActive={setActive}
          courseData={courseData}
          handlerCourseCreate={handlerCourseCreate}
          />
        )}
      </div>
      <div className="w-[20%] mt-[100px] fixed h-screen top-18 z-[-1] right-0">
        <CourseOptions active={active} setActive={setActive} />
      </div>
    </div>
  );
};

export default CreateCourse;
