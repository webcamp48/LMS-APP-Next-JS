import React, { useEffect, useState } from 'react'
import { styles } from './../../../styles/style';
import { useGetHeroDataQuery } from '@/redux/features/layout/layout';
import { title } from 'process';

type Props = {
    courseInfo : any;
    setCourseInfo : (courseInfo : any) => void;
    active : number;
    setActive : (active : number) => void;
}

const CourseInformation:React.FC<Props> = ({active, setActive, courseInfo, setCourseInfo}) => {

    const [dragging, setDragging] = useState(false);
    const { data } = useGetHeroDataQuery("Categories",{});
    const [categories, setCategories] = useState<any>([]);

    useEffect(()=>{
        if(data){
            setCategories(data.layout.categories);
        }
    },[data])

    const handlerSubmit = (e : any) => {
        e.preventDefault();
        setActive(active + 1);
    }

    const handlerFileChange = (e: any) => {
        const file = e.target.files?.[0];
        const reader = new FileReader();
        reader.onload = () => {
            if(reader.readyState === 2) {
                setCourseInfo((prevCourseInfo : any) => ({ ...prevCourseInfo, thumbnail: reader.result}));
            }
        };
        reader.readAsDataURL(file);
    }

    const handlerDragOver = (e : any) => {
        e.preventDefault();
        setDragging(true);
    }

    const handlerDragLeave = (e : any) => {
        e.preventDefault();
        setDragging(false);
    }

    const handlerDrop = (e:any) => {
        setDragging(false); 
        const file = e.dataTransfer.files?.[0];
        const reader = new FileReader();

        reader.onload = () => {
            if(reader.readyState === 2) {
                setCourseInfo((prevCourseInfo : any) => ({ ...prevCourseInfo, thumbnail:reader.result}));
            }
        }
        reader.readAsDataURL(file);
    }

  return (
    <div className='w-[80%] m-auto mt-24'>
        <form onSubmit={handlerSubmit} >
            <div>
                <label htmlFor='Course Name' className={`${styles.label}`}>Course Name</label>
                <input type='text' id='name' placeholder='MERN Stack LMS platform with Next Js 15' name='course' required value={courseInfo.name} onChange={(e: any) => setCourseInfo({...courseInfo, name: e.target.value})} className={`${styles.input}`}/>
            </div>
            <br />
            <div className=''>
                <label htmlFor='Course desc' className={`${styles.label}`}>Course Description</label>
                <textarea cols={30} rows={8} placeholder='Write SomeThing Amazing...' name='course' value={courseInfo.description} onChange={(e: any) => setCourseInfo({...courseInfo, description: e.target.value})} className={`${styles.input} !h-min !py-2`}> </textarea>
            </div>
            <br />
            <div className='w-full flex justify-between mb-5'>
                <div className='w-[45%]'>
                    <label htmlFor='Course price' className={`${styles.label}`}>Course price</label>
                    <input type='number' id='number' placeholder='Enter Course Price' name='price' required value={courseInfo.price} onChange={(e: any) => setCourseInfo({...courseInfo, price: e.target.value})} className={`${styles.input}`}/>
                </div>
                <div className='w-[45%]'>
                    <label htmlFor='Course price' className={`${styles.label}`}>Estimated Price (Optional)</label>
                    <input type='number' id='number' placeholder='Enter Course Estimated Price' name='estimatedPrice' required  value={courseInfo.estimatedPrice} onChange={(e: any) => setCourseInfo({...courseInfo, estimatedPrice: e.target.value})} className={`${styles.input}`}/>
                </div>
            </div>
            <br />
            <div className='w-full flex justify-between'>
                <div className='w-[45%]'>
                    <label htmlFor='Course Level' className={`${styles.label}`}>Course Level</label>
                    <input type='text' id='levels' placeholder='Beginner/Intermediate/Expert' name='levels' required value={courseInfo.levels} onChange={(e: any) => setCourseInfo({...courseInfo, levels: e.target.value})} className={`${styles.input}`}/>
                    <label htmlFor='Course tags' className={`${styles.label}`}>Course Tags</label>
                    <input type='text' id='name' placeholder='MERN Stack, LMS App, Tailwinds, Next Js 15' name='tag' required value={courseInfo.tags} onChange={(e: any) => setCourseInfo({...courseInfo, tags: e.target.value})} className={`${styles.input}`}/>
                </div>
                <div className='w-[45%]'>
                    <label htmlFor='Course Demo Url' className={`${styles.label} w-[50%]`}>Demo Categories</label>
                    <select name="" id="" value={courseInfo.categories} onChange={(e)=> setCourseInfo({...courseInfo, categories : e.target.value})} className={`${styles.input}`}>
                        <option value="">Select Category</option>
                        {categories.map((item : any) => (
                            <option value={item.id} key={item._id}>{item.name}</option>
                        ))}
                    </select>
                </div>
            </div>
            <br />
            
            <br />
            <div className='w-full flex justify-between'>
                <div className='w-[45%]'>
                    <label htmlFor='Course Level' className={`${styles.label}`}>Course Level</label>
                    <input type='text' id='levels' placeholder='Beginner/Intermediate/Expert' name='levels' required value={courseInfo.levels} onChange={(e: any) => setCourseInfo({...courseInfo, levels: e.target.value})} className={`${styles.input}`}/>
                </div>
                <div className='w-[45%]'>
                    <label htmlFor='Course Demo Url' className={`${styles.label} w-[50%]`}>Demo Url</label>
                    <input type='text' id='url' placeholder='Enter Course Demo Url' name='url' required value={courseInfo.demoUrl} onChange={(e: any) => setCourseInfo({...courseInfo, demoUrl: e.target.value})} className={`${styles.input}`}/>
                </div>
            </div>
            <br />
            <div className='w-full'>
                <input type="file" accept='image/*' id='file' className='hidden' onChange={handlerFileChange} />
                <label htmlFor="file" className={`w-full min-h-[10vh] dark:border-white border-[#0000ff] border flex items-center justify-center ${dragging ? 'bg-blue-500' : "bg-transparent"}`}
                onDragOver={handlerDragOver}
                onDragLeave={handlerDragLeave}
                onDrop={handlerDrop}
                >
                    {
                        courseInfo.thumbnail ? (
                            <img src={courseInfo.thumbnail} alt={courseInfo.name} className='w-full max-h-full object-cover' />
                        ) : (
                            <span className='text-black dark:text-white'>
                                Drag and Drop Your Thumbnail here OR click to Browse
                            </span>
                        )
                    }
                </label>
            </div>
            <br />
            <div className='flex items-center justify-end w-full'>
                <input type="submit" value='Next' className='w-full 800px:w-[180px] h-[40px] bg-[#371391] text-center text-white rounded mt-8 cursor-pointer'/>
            </div>
        </form>
    </div>
  )
}

export default CourseInformation;