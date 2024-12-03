import { useTheme } from 'next-themes';
import React, { useEffect, useState } from 'react'
import {BiSun, BiMoon} from 'react-icons/bi';

const ThemeSwitcher = () => {
    const [mounted, setMounted] = useState(false);
    const {theme, setTheme} = useTheme();

    useEffect(()=> setMounted(true), []);
    if (!mounted) return null;

  return (
    <div className='flex items-center justify-center mx-4'>
        {
            theme === 'light' ? (
            <BiMoon className='cursor-pointer' style={{color:"black"}}   size={25} onClick={()=> setTheme("dark")} />
        ) : (
            <BiSun className='cursor-pointer' style={{color:"yellow"}} size={25} onClick={()=> setTheme("light")} />
        )
        }
    </div>
  )
}

export default ThemeSwitcher