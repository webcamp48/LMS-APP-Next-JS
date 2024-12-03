import React from 'react';
import { redirect } from 'next/navigation';
import { useSelector } from 'react-redux';

interface ProtectedProps {
    children : React.ReactNode;
}

export default function AdminProtected ({children} :ProtectedProps ) {
    const {user} = useSelector((state:any) => state.auth);

    if(user){
        const isAdmin = user?.role === 'Admin';
        return isAdmin ? children : redirect("/")
    }
}