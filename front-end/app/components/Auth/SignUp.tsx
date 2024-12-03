import React, { FC, useState,useEffect } from 'react';
import { useRegisterMutation } from '@/redux/features/auth/authApi'; 

import { useFormik } from 'formik';
import * as Yup from 'yup';
import { styles } from './../../../app/styles/style';
import { AiOutlineEye, AiOutlineEyeInvisible, AiFillGithub } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";

import {toast} from 'react-hot-toast';

type Props = {
    setRoute: (route: string) => void;
}

const schema = Yup.object().shape({
    name: Yup.string().required("Please Enter Your Name"),
    email: Yup.string().email("Invalid Email").required("Please Enter Your Email"),
    password: Yup.string().required("Please Enter Your Password").min(6),
});

const SignUp: FC<Props> = ({setRoute}) => {
    const [show, setShow] = useState(false);
    const [register, {  data, error, isSuccess }] = useRegisterMutation();

    useEffect(() => {
        if (isSuccess) {
            const message = data?.message || "Registration Successfully!";
            toast.success(message);
            setRoute("Verification");
        }
        if (error && "data" in error) {
            const errorData = error as any;
            toast.error(errorData?.data.message || "Unknown error occurred");
        }
        
    }, [isSuccess, error]);
    

    const formik = useFormik({
        initialValues: {name:"", email: "", password: "" },
        validationSchema: schema,
        onSubmit: async ({ name, email, password }) => {
            const data = {name, email, password};
            await register(data);
        }
    });

    const { errors, values, touched, handleChange, handleSubmit } = formik;

    return (
        <div className='w-full'>
            <h1 className={`${styles.title}`}>Sign Up With ELearning</h1>
            <form onSubmit={handleSubmit}>
                <div className='w-full mb-1'>
                    <label className={`${styles.label}`} htmlFor='name'>Enter Your Name</label>
                    <input 
                        type='text' 
                        name='name' 
                        value={values.name} 
                        onChange={handleChange} 
                        id='name' 
                        placeholder='Enter Your Name' 
                        className={`${errors.name && touched.name && "border-red-500"} ${styles.input}`}
                    />
                    {errors.name && touched.name && (
                        <span className='text-red-500 block pt-2'>{errors.name}</span>
                    )}
                </div>
                <div className='w-full mb-1'>
                    <label className={`${styles.label}`} htmlFor='email'>Enter Your Email</label>
                    <input 
                        type='email' 
                        name='email' 
                        value={values.email} 
                        onChange={handleChange} 
                        id='email' 
                        placeholder='email@gmail.com' 
                        className={`${errors.email && touched.email && "border-red-500"} ${styles.input}`}
                    />
                    {errors.email && touched.email && (
                        <span className='text-red-500 block pt-2'>{errors.email}</span>
                    )}
                </div>
                <div className='w-full mb-1 relative'>
                    <label className={`${styles.label}`} htmlFor='password'>Enter Your Password</label>
                    <input 
                        type={show ? "text" : "password"} 
                        name='password' 
                        value={values.password} 
                        onChange={handleChange} 
                        id='password' 
                        placeholder='Enter Your Password' 
                        className={`${errors.password && touched.password && "border-red-500"} ${styles.input}`}
                    />
                    {!show ? (
                        <AiOutlineEyeInvisible 
                            className='dark:text-white absolute top-12 right-2 z-10 cursor-pointer' 
                            size={20} 
                            onClick={() => setShow(true)} 
                        />
                    ) : (
                        <AiOutlineEye 
                            className='dark:text-white absolute top-12 right-2 z-10 cursor-pointer' 
                            size={20} 
                            onClick={() => setShow(false)} 
                        />
                    )}
                    {errors.password && touched.password && (
                        <span className='text-red-500 block pt-2'>{errors.password}</span>
                    )}
                </div>
                <div className='w-full mt-5'>
                    <input 
                        type='submit' 
                        value='Sign Up' 
                        className={`${styles.button} text-white`} 
                    />
                </div>
                <br />
                <h5 className='pt-2 text-center text-[16px] font-Poppins text-black dark:text-white'>
                    or Join With
                </h5>
                <div className='flex items-center justify-center my-2'>
                    <FcGoogle size={30} className='cursor-pointer mr-2' />
                    <AiFillGithub size={30} className='dark:text-white cursor-pointer ml-2' />
                </div>
                <h5 className='text-center text-black dark:text-white pt-4 font-Poppins text-[16px]'>
                    Already have an Account?
                    <span className='pl-1 cursor-pointer underline text-[#F05A7E]' onClick ={()=> setRoute("Login")}>Sign In</span>
                </h5>
            </form>
        </div>
    );
}

export default SignUp;
