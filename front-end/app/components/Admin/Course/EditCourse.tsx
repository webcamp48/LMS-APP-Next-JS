// File: EditCourse.tsx

"use client"; // Client-side rendering
import React, { useEffect, useState } from "react";
import CourseOptions from "./CourseOptions";
import CourseInformation from "./CourseInformation";
import CourseData from "./CourseData";
import CourseContent from "./CourseContent";
import CoursePreview from "./CoursePreview";
import { useGetAllCoursesQuery, useUpdateCourseMutation } from "@/redux/features/course/course";
import toast from "react-hot-toast";
import { redirect } from "next/navigation";

type Props = {
  id: string;
};

const EditCourse: React.FC<Props> = ({ id }) => {
  // Fetch courses data
  const { data, isLoading, refetch } = useGetAllCoursesQuery({}, { refetchOnMountOrArgChange: true });
  
  // Mutation hook for updating the course
  const [updateCourse, { isSuccess, error }] = useUpdateCourseMutation();

  // Find the course data that matches the provided ID
  const editCourseData = data && data.courses.find((editData: any) => editData._id === id);

  const [active, setActive] = useState(0); 

  // This effect sets the form data when editCourseData changes
  useEffect(() => {
    if (editCourseData) {
      setCourseInfo({
        name: editCourseData.name,
        description: editCourseData.description,
        price: editCourseData.price,
        estimatedPrice: editCourseData?.estimatedPrice,
        tags: editCourseData.tags,
        levels: editCourseData.levels,
        demoUrl: editCourseData.demoUrl,
        thumbnail: editCourseData?.thumbnail?.url,
      });
      setBenefits(editCourseData.benefits); 
      setPrerequisites(editCourseData.prerequisites); 
      setCourseContentData(editCourseData.courseData); 
    }
  }, [editCourseData]);


  const [courseInfo, setCourseInfo] = useState({
    name: "",
    description: "",
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
      videoSection: "Untitled Section",
      suggestion: "",
      links: [{ title: "", url: "" }],
    },
  ]);


  useEffect(() => {
    if (isSuccess) {
      toast.success("Course Updated Successfully");
      redirect("/admin/courses");
    }
    if (error) {
      if ("data" in error) {
        const errorMessage = error as any;
        toast.error(errorMessage.data.message);
      }
    }
  }, [isSuccess, error]);


  const handlerSubmit = async () => {
    try {
      const formattedBenefits = benefits.map((benefit) => ({ title: benefit.title }));
      const formattedPrerequisites = prerequisites.map((prerequisite) => ({ title: prerequisite.title }));
      const formattedCourseContent = courseContentData.map((courseContent) => ({
        title: courseContent.title,
        description: courseContent.description,
        videoUrl: courseContent.videoUrl,
        videoSection: courseContent.videoSection,
        suggestion: courseContent.suggestion,
        links: courseContent.links.map((link) => ({ title: link.title, url: link.url })),
      }));

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
        courseData: formattedCourseContent,
      };

      setCourseData(formattedCourseInfoData); 
    } catch (error: any) {
      console.log(error);
    }
  };

  // Handler function for updating the course on the server
  const handlerCourseCreate = async (e: any) => {
    const data = courseData;
    await updateCourse({ id: editCourseData?._id, data });
  };

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
            isEdit={true}
          />
        )}
      </div>
      <div className="w-[20%] mt-[100px] fixed h-screen top-18 z-[-1] right-0">
        <CourseOptions active={active} setActive={setActive} />
      </div>
    </div>
  );
};

export default EditCourse;
