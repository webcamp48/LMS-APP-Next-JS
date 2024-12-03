import React from 'react'
import { styles } from './../../../styles/style';
import { IoIosAddCircle } from "react-icons/io";
import toast from 'react-hot-toast';

type Props = {
    benefits? : {title : string}[];
    setBenefits : (benefits : {title : string}[]) => void;
    prerequisites? : {title : string }[];
    setPrerequisites : (prerequisites : {title : string}[]) => void;
    active : number;
    setActive : (active : number) => void;
}

const CourseData:React.FC<Props> = ({benefits = [],setBenefits,prerequisites = [],setPrerequisites, active, setActive,}) => {

    const handlerBenefitsChange = (index: number, value: any) => {
        const updatedBenefits = benefits.map((benefit, i) => 
            i === index ? { ...benefit, title: value } : benefit
        );
        setBenefits(updatedBenefits);
    };
    

    const handlerAddBenefits = () => {
        setBenefits([...benefits, {title : ''}])
    }

    const handlerPrerequisitesChange = (index: number, value: any) => {
        const updatedPrerequisites = prerequisites.map((prerequisite, i) => 
            i === index ? { ...prerequisite, title: value } : prerequisite
        );
        setPrerequisites(updatedPrerequisites);
    };

    const handlerAddPrerequisites = () => {
        setPrerequisites([...prerequisites, {title : ''}])
    }

    const prevButton = ()=>{
        setActive(active - 1)
    }

// Validate data and go to the next step
const handlerOptions = () => {
    if (
        benefits[benefits.length - 1]?.title !== '' &&
        prerequisites[prerequisites.length - 1]?.title !== ''
    ) {
        setActive(active + 1);
    } else {
        toast.error('Please fill all fields to proceed!');
    }
};

  return (
    <div className='w-[80%] m-auto mt-24 block'>
        {/* Benefits section */}
        <div>
            <label className={`${styles.label} text-[20px]`} htmlFor='email'>
                What are the Benefits for Studens in this course?
            </label>
            <br />
            {
                benefits?.map((benefit: any, index : number) => (
                    <div key={index}>
                        <input type='text' id='benefit' placeholder='You will be able to build Full Stack Elearning App' name='benefit' required value={benefit.title} onChange={(e:any)=> handlerBenefitsChange(index, e.target.value)} className={`${styles.input} my-2`}/>
                    </div>
                ))
            }
            <IoIosAddCircle size={25} onClick={handlerAddBenefits} className='dark:text-white' style={{margin : "10px 0", cursor:"pointer"}} />
        </div>
        {/* Prerequisites section */}
        <div>
            <label className={`${styles.label} text-[20px]`} htmlFor='email'>
                What are the Prerequisites for Starting this course?
            </label>
            <br />
            {
                prerequisites?.map((prerequisite: any, index : number) => (
                    <div key={index}>
                        <input type='text' id='prerequisites' placeholder='You Need Basic Knowledge of MERN Stack' name='prerequisites' required value={prerequisite.title} onChange={(e:any)=> handlerPrerequisitesChange(index, e.target.value)} className={`${styles.input}my-2`}/>
                    </div>
                ))
            }
            <IoIosAddCircle size={25} className='dark:text-white' onClick={handlerAddPrerequisites} style={{margin : "10px 0", cursor:"pointer"}} />
        </div>
        {/* prev and next button section */}
        <div className='w-full flex items-center justify-between'>
            <div onClick={() => prevButton()} className='w-full 800px:w-[180px] flex justify-center items-center cursor-pointer h-[40px] text-center text-white bg-[#37a39a] rounded mt-8'>Prev
            </div>
            <div onClick={() => handlerOptions()} className='w-full 800px:w-[180px] flex justify-center items-center cursor-pointer h-[40px] text-center text-white bg-[#37a39a] rounded mt-8'>Next
            </div>
        </div>
    </div>
  )
}

export default CourseData