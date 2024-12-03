import React, { useState } from "react";
import { styles } from './../../../styles/style';
import { AiOutlineDelete, AiOutlinePlusCircle } from "react-icons/ai";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { BsLink45Deg, BsPencilFill } from "react-icons/bs";
import toast from "react-hot-toast";

type Props = {
  active: number;
  setActive: (active: number) => void;
  courseContentData: any;
  setCourseContentData: (courseContentData: any) => void;
  handlerSubmit: any;
};

const CourseContent: React.FC<Props> = ({active, setActive, courseContentData, setCourseContentData, handlerSubmit : handlerCourseSubmit}) => {


  const [isCollapsed, setIsCollapsed] = useState(
    Array(courseContentData.length).fill(false)
  );
  const [activeSection, setActiveSection] = useState(1);

  const handlerUpdateData = (index : number) => {
    if(index > 0){
        const updatedData = [...courseContentData];
        updatedData.splice(index, 1);
        setCourseContentData(updatedData);
    }
  }

  const handlerCollapseToggle = (index : number) => {
    const updatedIsCollapsed = [...isCollapsed];
    updatedIsCollapsed[index] = !updatedIsCollapsed[index];
    setIsCollapsed(updatedIsCollapsed);
  }

  const handlerRemoveLink = (index : number , linkIndex : number) => {
    const updatedData = [...courseContentData];
    updatedData[index].links.splice(linkIndex, 1);
    setCourseContentData(updatedData);
  }

  const handlerAddLink = (index: number) => {
    const updatedData = courseContentData.map((item: any, i: number) =>
      i === index
        ? { ...item, links: [...(item.links || []), { title: '', url: '' }] }
        : item
    );
    setCourseContentData(updatedData);
  };
  

//   handlerNewContent
  const handlerNewContent = (item : any) => {
    if(item.title === '' || item.description === '' || item.videoUrl === '' || item.links[0].title === '' || item.links[0].url === ''){
        toast.error("Please fill all empty field first!");
    }else{
        let newVideoSection = '';
        if(courseContentData.length > 0){
            const lastVideoSection = courseContentData[courseContentData.length - 1].videoSection;

            // use the last videosection if availble, else use user input
            if(lastVideoSection){
                newVideoSection = lastVideoSection;
            }
        }
        const newContent = {
            title: '',
            description : "",
            videoUrl : "",
            videoSection : newVideoSection,
            suggestion : "",
            link : [{
                title : "",
                url : ""
            }]
        }
        setCourseContentData([...courseContentData, newContent]);
    }
  }

  const addNewSection = () => {
    if(
      courseContentData[courseContentData.length - 1]?.title === '' || 
      courseContentData[courseContentData.length - 1]?.description === '' || 
      courseContentData[courseContentData.length - 1]?.videoUrl === '' || 
      courseContentData[courseContentData.length - 1]?.links?.[0]?.title === '' || 
      courseContentData[courseContentData.length - 1]?.links?.[0]?.url === ''
    ){
      toast.error("Please fill all empty field first!");
    }else{
      setActiveSection(activeSection + 1);
      const newContent = {
        title: '',
        description : "",
        videoUrl : "",
        videoSection : `Untitled Section ${activeSection}`,
        suggestion : "",
        link : [{title : "",url : ""}]}
    setCourseContentData([...courseContentData, newContent]);
    }
  }

  const prevButton = ()=>{
    setActive(active - 1)
}

const handlerOptions = () => {
  if(
    courseContentData[courseContentData.length - 1]?.title === '' || 
    courseContentData[courseContentData.length - 1]?.description === '' || 
    courseContentData[courseContentData.length - 1]?.videoUrl === '' || 
    courseContentData[courseContentData.length - 1]?.links?.[0]?.title === '' || 
    courseContentData[courseContentData.length - 1]?.links?.[0]?.url === ''
  ){
    toast.error("Please fill all empty field first!");
  }else{
    setActive( active + 1);
    handlerCourseSubmit();
  }
}

  return (
    <div className="w-[80%] m-auto mt-18 p-3 ">
      <form onSubmit={handlerCourseSubmit}>
        {courseContentData.map((item: any, index: number) => {
          const showSectionInput = 
          index === 0 || item.videoSection !== courseContentData[index - 1].videoSection;

          return (
            <>
              <div
                key={index}
                className={`w-full bg-[#cdc8c817] shadow-xl p-4 ${
                  showSectionInput ? "mt-10" : "mb-0"
                }`}
              >
                {showSectionInput && (
                    <>
                    <div className="flex w-full items-center">
                        <input type="text" className={`text-[20px] ${item.videoSection === 'Untitled Section' ? 'w-[170px]' : "w-min"} font-Poppins cursor-pointer dark:text-white text-black outline-none bg-transparent`} value={item.videoSection} onChange={(e) => {
                            const updatedData = [...courseContentData];
                            updatedData[index].videoSection = e.target.value;
                            setCourseContentData(updatedData);
                        }} />
                        <BsPencilFill className="cursor-pointer text-black dark:text-white" />
                    </div>
                    <br />
                    </>
                )}
                <div className="w-full flex items-center justify-between my-0">
                  {isCollapsed[index] ? (
                    <>
                      {item.title ? (
                        <p className="text-black dark:text-white font-Poppins">
                          {index + 1} {item.title}
                        </p>
                      ) : (
                        <></>
                      )}
                    </>
                  ) : (
                    <div></div>
                  )}

                  {/* arrow button for collasped video content */}
                  <div className="flex items-center">
                    <AiOutlineDelete className={`text-black dark:text-white text-[20px] mr-2 ${index > 0 ? 'cursor-pointer' : 'cursor-no-drop'}`} onClick={() => handlerUpdateData(index)}/>

                    <MdOutlineKeyboardArrowDown className="text-black dark:text-white" fontSize= 'large' style={{transform: isCollapsed[index] ? 'rotate(180deg)' : "rotate(0deg)"}} onClick={() => handlerCollapseToggle(index)}/>
                  </div>
                </div>
                <br />
                {!isCollapsed[index] && (
                    <>
                    <div className="my-5">
                        <label htmlFor="" className={`${styles.label}`}>Video Title</label>
                        <input type="text" placeholder="Project Plan..." className={`${styles.input}`} value={item.title}     onChange={(e) => {
                        const updatedData = courseContentData.map((content :any, i : any) =>
                            i === index
                                ? { ...content, title: e.target.value } 
                                : content
                        );
                        setCourseContentData(updatedData);
                    }} />
                    </div>
                    <div className="my-3">
                        <label htmlFor="" className={`${styles.label}`}>Video Url</label>
                        <input type="text" placeholder="https://www.course.com..." className={`${styles.input}`} value={item.videoUrl}     onChange={(e) => {
                        const updatedData = courseContentData.map((content : any, i :any) =>
                            i === index
                                ? { ...content, videoUrl: e.target.value }
                                : content
                        );
                        setCourseContentData(updatedData);
                        }} />

                        <label htmlFor="" className={`${styles.label}`}>Video Length (In Mintue)</label>
                        <input type="text" placeholder="30 min..." className={`${styles.input}`} value={item.videoLength}  onChange={(e) => {
                        const updatedData = courseContentData.map((content : any, i :any) =>
                            i === index
                                ? { ...content, videoLength: e.target.value }
                                : content
                        );
                        setCourseContentData(updatedData);
                        }} />
                        
                    </div>
                    <div className="my-3">
                        <label htmlFor="" className={`${styles.label}`}>Video Description</label>
                        <textarea rows={8} cols={30} placeholder="Enter Video Description" className={`${styles.input}`} value={item.description} 
                        onChange={(e) => {
                        const updatedData = courseContentData.map((content : any, i : any) =>
                            i === index
                                ? { ...content, description: e.target.value } 
                                : content
                        );
                        setCourseContentData(updatedData);
                        }} />
                        <br />
                        {(item?.links || []).map((link:any, linkIndex : number) => (
                            <div className="mb-3 block" key={linkIndex}>
                                <div className="w-full flex items-center justify-between">
                                    <label htmlFor="" className={`${styles.label}`}>Link {linkIndex + 1}</label>
                                    <AiOutlineDelete className={`${linkIndex === 0 ? 'cursor-no-drop' : "cursor-pointer"} text-[20px] text-black dark:text-white`} onClick={()=> linkIndex === 0 ? null : handlerRemoveLink(index, linkIndex)}/>
                                </div>
                                <input
                                  type="text"
                                  placeholder="Source Code... (Link Title)"
                                  className={`${styles.input}`}
                                  value={link.title}
                                  onChange={(e) => {
                                    // Deep copy the courseContentData to ensure immutability
                                    const updatedData = [...courseContentData];
                                    updatedData[index] = {
                                      ...updatedData[index],
                                      links: updatedData[index].links.map((linkItem : any, idx :any) =>
                                        idx === linkIndex ? { ...linkItem, title: e.target.value } : linkItem
                                      ),
                                    };
                                    setCourseContentData(updatedData);
                                  }}
                                />

                                <input type="url" placeholder="Source Code Url...(Link URL)" className={`${styles.input}`} value={link.url} onChange={(e) => {
                                const updatedData = [...courseContentData];
                                updatedData[index].links[linkIndex].url  = e.target.value;
                                setCourseContentData(updatedData);
                                }} />
                            </div>
                        ))}
                        <br />
                        {/* add link button */}
                        <div className="inline-block mb-4">
                            <p className="flex items-center text-[18px] cursor-pointer text-black dark:text-white" onClick={()=> handlerAddLink(index)}><BsLink45Deg className="mr-2"/> Add Link</p>
                        </div>
                    </div>
                    </>
                )}
                <br />
                {/* add new content */}
                {index === courseContentData.length - 1 && (
                    <div>
                        <p className="flex items-center text-[18px] dark:text-white text-black cursor-pointer" onClick={(e:any) => handlerNewContent(item)}>
                            <AiOutlinePlusCircle  className="mr-2"/> Add New Content
                        </p>
                    </div>
                )}
              </div>
            </>
          );
        })}
        <br />
        <div className='flex items-center text-[20px] text-black dark:text-white cursor-pointer' onClick={() => addNewSection()}>
          <AiOutlinePlusCircle className="mr-2" /> Add New Section
        </div>
          {/* prev and next button section */}
          <div className='w-full flex items-center justify-between'>
            <div onClick={() => prevButton()} className='w-full 800px:w-[180px] flex justify-center items-center cursor-pointer h-[40px] text-center text-white bg-[#37a39a] rounded mt-8'>Prev
            </div>
            <div onClick={() => handlerOptions()} className='w-full 800px:w-[180px] flex justify-center items-center cursor-pointer h-[40px] text-center text-white bg-[#37a39a] rounded mt-8'>Next
            </div>
        </div>
      </form>
      <br />
    </div>
  );
};

export default CourseContent;
