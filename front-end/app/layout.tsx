"use client";
import React from 'react';
import ThemeProvider from "@/app/utils/theme-provider";
import { SessionProvider } from "next-auth/react";
import { Providers } from "./Provider";
import { Poppins } from "next/font/google";
import { Josefin_Sans } from "next/font/google";
import "./globals.css";
import {Toaster} from 'react-hot-toast';
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import Loader from './components/Loader/Loader';


const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-Poppins", 
});

const josefin = Josefin_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-Josefin",
});



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${josefin.variable} !bg-white bg-no-repeat dark:bg-gradient-to-b dark:to-black duration-300 dark:from-gray-900`}
      >
        <Providers>
          <SessionProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Custom>{children}</Custom>
            <Toaster reverseOrder={false} />
          </ThemeProvider>
          </SessionProvider>
        </Providers>
      </body>
    </html>
  );
}



const Custom: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoading } = useLoadUserQuery({});
  
  return (
    isLoading ? <Loader /> : <> {children} </>
  );
}

