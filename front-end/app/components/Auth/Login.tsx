"use client";
import React, { FC, useState,useEffect } from 'react';
import {signIn } from "next-auth/react"
import { useLoginMutation } from '@/redux/features/auth/authApi'; 
import { useFormik } from 'formik';

import * as Yup from 'yup';
import { styles } from './../../../app/styles/style';
import { AiOutlineEye, AiOutlineEyeInvisible, AiFillGithub } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import {toast} from 'react-hot-toast';



type Props = {
    setRoute: (route: string) => void;
    setOpen : (open: boolean) => void;
}

const schema = Yup.object().shape({
    email: Yup.string().email("Invalid Email").required("Please Enter Your Email"),
    password: Yup.string().required("Please Enter Your Password").min(6),
});

const Login: FC<Props> = ({setRoute, setOpen}) => {
    const [show, setShow] = useState(false);
    const [login, {isSuccess,data, error}] = useLoginMutation();

    const formik = useFormik({
        initialValues: { email: "", password: "" },
        validationSchema: schema,
        onSubmit: async ({ email, password }) => {
           await login({ email, password });
        }
    });

    useEffect(()=> {
        if(isSuccess){
            const message = data?.message || "Account login Successfully!";
            toast.success(message);
            setOpen(false);
        }
        if(error){
            if("data" in error){
                const errorData = error as any;
                toast.error(errorData.data.message);
            }
        }
    }, [isSuccess, error]);


    // handleGoogleSignIn
    const handleGoogleSignIn = async () => {
        const res = await signIn('google', { redirect: false });
        if (res && res.error) {
            console.error("Google Sign In Error: ", res.error);
        }
    };
    
    // handleGithubSignIn
    const handleGithubSignIn = async () => {
        const res = await signIn('github', { redirect: false });
        if (res && res.error) {
            console.error("GitHub Sign In Error: ", res.error);
        }
    };

    const { errors, values, touched, handleChange, handleSubmit } = formik;

    return (
        <div className='w-full'>
            <h1 className={`${styles.title}`}>Login With ELearning</h1>
            <form onSubmit={handleSubmit}>
                <div className='w-full mt-5 mb-1'>
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
                <div className='w-full mt-5 relative mb-1'>
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
                        value='Login' 
                        className={`${styles.button} text-white`} 
                    />
                </div>
                <br />
                <h5 className='pt-4 text-center text-[16px] font-Poppins text-black dark:text-white'>
                    or Join With
                </h5>
                <div className='flex items-center justify-center my-4'>
                    <FcGoogle onClick={handleGoogleSignIn} size={30} className='cursor-pointer mr-2' />
                    <AiFillGithub onClick={handleGithubSignIn} size={30} className='dark:text-white cursor-pointer ml-2' />
                </div>
                <h5 className='text-center text-black dark:text-white pt-4 font-Poppins text-[16px]'>
                    Not have Any Account?
                    <span className='pl-1 cursor-pointer underline text-[#F05A7E]' onClick ={()=> setRoute("Sign-Up")}>Sign Up</span>
                </h5>
            </form>
        </div>
    );
}

export default Login;



