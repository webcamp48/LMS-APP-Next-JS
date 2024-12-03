import React, {FC} from 'react';
import Link from 'next/link';
export const navItemsData = [
    {
        name:"Home",
        url:"/"
    },
    {
        name:"Courses",
        url:"/courses"
    },
    {
        name:"About",
        url:"/about"
    },
    {
        name:"Policy",
        url:"/policy"
    },
    {
        name:"Faq",
        url:"/faq"
    },
]

type Props = {
    activeItem : number;
    isMobile : boolean
}

const NavItems : FC<Props> = ({activeItem, isMobile}) => {
  return (
    <>
    <div className='hidden 800px:flex'>
        {
            navItemsData && navItemsData.map((nav, index) => (
                <Link key={index} href={`${nav.url}`} passHref>
                    <span className={`${activeItem === index ? "dark:text-[#37a39a] text-[crimson]" : "text-black dark:text-white"} px-6 text-[18px] font-[400] font-[Proppins]`}>{nav.name}</span>
                </Link>
            ))
        }
    </div>
    {
        isMobile && (
        <div className='800px:hidden mt-4'>
            <div className='w-full text-center py-5'>
                <Link href={"/"} passHref>
                <span className='text-[26px] font-Poppins text-black font-[500] dark:text-white'>Elearning App</span>
                </Link>
            </div>
            <div>
            {
                navItemsData && navItemsData.map((nav, index) => (
                    <Link key={index} href={`${nav.url}`} passHref>
                        <span className={`${activeItem === index ? "dark:text-[#37a39a] text-[crimson]" : "text-black dark:text-white"} block p-6 text-[18px] font-[400] font-[Proppins]`}>{nav.name}</span>
                    </Link>
                ))
            }
            </div>
        </div>
        )
    }
    </>
  )
}


export default NavItems;