import React,{FC} from 'react'
import CoursePlayer from './../../../utils/CoursePlayer';
import { styles } from '@/app/styles/style';
import { IoCheckmarkDoneCircleSharp } from "react-icons/io5";
import Ratings from './../../../utils/Ratings';

type Props = {
    active: number;
    setActive: (active: number) => void;
    courseData : any;
    handlerCourseCreate : any;
    isEdit? : boolean;
}

const CoursePreview:FC<Props> = ({active, setActive , courseData, handlerCourseCreate, isEdit}) => {

  const createCourse = () => {
    handlerCourseCreate()
  }

  const prevButton = () => {
    setActive(active - 1)
  }

  // discountPercentenge
  const discountPercentenge = ((courseData?.estimatedPrice - courseData?.price) / courseData?.estimatedPrice) * 100;
  const courseDiscountPrice = discountPercentenge.toFixed(0);


  return (
    <div className='w-[90%] m-auto py-5 mb-5'>
        <div className='w-full relative'>
            <div className='w-full mt-10'>
                <CoursePlayer videoUrl = {courseData?.demoUrl} title={courseData?.title} />
            </div>
            <div className="flex items-center dark:text-white">
              <h1 className='pt-5 text-[25px]'>
                {courseData?.price === 0 ? 'Free' : '$'+courseData?.price}
              </h1>
              <h5 className='pl-2 text-[20px] mt-2 line-through opacity-80'>${courseData?.estimatedPrice}
              </h5>
              <h4 className='pl-5 pt-4 text-[20px]'>
                {courseDiscountPrice}% off
              </h4>
            </div>
            <div className="flex items-center">
              <div className={`${styles.button} !w-[180px] my-3 !bg-[crimson] cursor-not-allowed font-Poppins`}>
                Buy Now ${courseData?.price || 0}
              </div>
            </div>
            <div className='flex items-center'>
              <input type="text" placeholder='Discount Code' className={`${styles.input} 1500px:!w-[50%] 1100px:!w-[60%] ml-3 !mt-0`} />
              <div className={`${styles.button} !w-[120px] my-3 ml-4 font-Poppins cursor-pointer`}>Apply
              </div>
            </div>
            <div className='flex items-center'>
              <IoCheckmarkDoneCircleSharp size={25} />
              <p className="pb-1 dark:text-white">Source Code Include</p>
            </div>
            <div className='flex items-center'>
              <IoCheckmarkDoneCircleSharp size={25} />
              <p className="pb-1 dark:text-white">Full Lifetime Access</p>
            </div>
            <div className='flex items-center'>
              <IoCheckmarkDoneCircleSharp size={25} />
              <p className="pb-3 800px:pb-1 dark:text-white">Premium Support</p>
            </div>
            <div className='flex items-center'>
              <IoCheckmarkDoneCircleSharp size={25} />
              <p className="pb-1 dark:text-white">Certificate of Completion</p>
            </div>
        </div>
        <div className="w-full">
          <div className="w-full 800px:pr-5">
            <h1 className='text-[25px] dark:text-white font-Poppins font-[600]'>
              {courseData?.name}
            </h1>
            <div className='pt-3 flex items-center justify-between'>
              <div className="flex items-center justify-between">
                <Ratings rating={0} />
                <h5 className='dark:text-white'>0 Reviews</h5>
              </div>
              <h5 className='dark:text-white'>0 Students</h5>
            </div>
            <br />
            <h1 className="dark:text-white text-[25px] font-Poppins font-[600]">
              What You will learn from this course ?
            </h1>
          </div>
          {courseData?.benefits?.map((item : any, index: number) => (
            <div key={index} className='w-full flex 800px:items-center py-2'>
              <div className='w-[15px] mr-1 dark:text-white'>
                <IoCheckmarkDoneCircleSharp size={25} />
              </div>
              <p className='pl-2 dark:text-white'>{item.title}</p>
            </div>
          ))}
          <br /><br />
          {/* course description */}
          <div className="w-full 800px:pr-5">
            <h1 className='dark:text-white text-[25px] font-[600] font-Poppins'>Course Details</h1>
            <p className='dark:text-white text-[18px] mt-[20px] w-full whitespace-pre-line overflow-hidden'> {courseData?.description}</p>
          </div>
          <br /> <br />
        </div>
        {/* prev and next button section */}
        <div className='w-full flex items-center justify-between'>
            <div onClick={() => prevButton()} className='w-full 800px:w-[180px] flex justify-center items-center cursor-pointer h-[40px] text-center text-white bg-[#37a39a] rounded mt-8'>Prev
            </div>
            <div onClick={() => createCourse()} className='w-full 800px:w-[180px] flex justify-center items-center cursor-pointer h-[40px] text-center text-white bg-[#37a39a] rounded mt-8'>
            {
              isEdit ? "Update Course" : "Create"
            }
            </div>
        </div>
    </div>
  )
}

export default CoursePreview