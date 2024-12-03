import React,{FC, useRef, useState,useEffect} from 'react';
import { useSelector } from 'react-redux';
import { useActivationMutation } from '@/redux/features/auth/authApi'; 
import {toast} from 'react-hot-toast';
import { styles } from './../../../app/styles/style';
import { VscWorkspaceTrusted } from "react-icons/vsc";


type Props = {
    setRoute: (route: string) => void;
}

type VerifyNumber = {
    "0" : string;
    "1" : string;
    "2" : string;
    "3" : string;
    "4" : string;
    "5" : string;
}

const Verification : FC <Props> = ({setRoute}) => {
    const {token} = useSelector((state:any) => state.auth);
    const [activation, {isSuccess,data, error}] = useActivationMutation()
    const [invalidError, setInvalidError] = useState <boolean> (false);

    useEffect(()=>{
        if(isSuccess) {
            const message = data?.message || "Account Activated Successfully!";
            toast.success(message);
            setRoute("Login");
        }
        if(error){
            if("data" in error){
                const errorData = error as any;
                toast.error(errorData.data.message);
                setInvalidError(true);
            }else{
                toast.error("An error occured");
            }
        }
    }, [isSuccess, error])

    const inputRefs = [
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
    ];

    const [verifyNumber, setVerifyNumber] = useState<VerifyNumber>({
        0 : "",
        1 : "",
        2 : "",
        3 : "",
        4 : "",
        5 : "",
    });

    // verifictionHandler otp
    const verifictionHandler = async () => {
        try {
            const verificationNumber = Object.values(verifyNumber).join("");
            if (verificationNumber.length !== 6) {
                setInvalidError(true);
                return;
            }
            await activation({
                activation_otp: verificationNumber,
                activation_token: token,
            });
        } catch (error) {
            console.error("Error in verification handler:", error);
        }
    };
    

    const handleInputChange = (index : number, value: string) => {

        // Ensure only single-digit input is accepted
        if (value.length > 1) return;
        setInvalidError(false);
        const newVerifyNumber = {...verifyNumber, [index] : value};
        setVerifyNumber(newVerifyNumber);

        // Auto-focus to next or previous field
        if(value === '' && index > 0) {
            inputRefs[index - 1].current?.focus();
        }else if(value.length === 1 && index < 5 ){
            inputRefs[index + 1].current?.focus();
        }
    }
    return (
        <div>
            <h1 className={`${styles.title}`}>
                Verify Your Account
            </h1>
            <br />
            <div className='w-full flex items-center justify-center mt-2'>
                <div className ='w-[80px] h-[80px] text-white rounded-full flex items-center justify-center bg-[#F05A7E]'>
                    <VscWorkspaceTrusted size={50}/>
                </div>
            </div>
            <br />
            <div className=' m-auto flex items-center justify-around'>
                {Object.keys(verifyNumber).map((key, index) => (
                    <input
                    type='text'
                    key={key} 
                    ref={inputRefs[index]}
                    maxLength={1}
                    value={verifyNumber[key as keyof VerifyNumber]}
                    onChange={(e)=> handleInputChange(index, e.target.value)} 
                    className={`w-[45px] h-[45px] bg-transparent border-[2px] rounded-[10px] flex items-center text-black dark:text-white justify-center text-[18px] font-Poppins text-center outline-none ${invalidError ? 'shake border-red-500' : "border-[#00004a] dark:border-white"}`} />
                ))}
            </div>
            <br /> <br />
            <div className='w-full flex justify-center'>
                <button className={`${styles.button}`} onClick={verifictionHandler}>Verify OTP</button>
            </div>
            <br />
            <h5 className='text-center pt-4 font-Poppins text-[15px] text-black dark:text-white'>
                Go Back To Sign In
                <span className='cursor-pointer pl-1 underline text-[#F05A7E]' onClick={() => setRoute("Login")}>Sign In</span>
            </h5>
        </div>
    )
}

export default Verification;
