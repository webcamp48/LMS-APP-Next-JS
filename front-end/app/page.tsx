"use client";
import React, { FC, useState } from "react";
import Heading from "./utils/Heading";
import Header from "./components/Header";
import Hero from './components/Route/Hero'

interface Props {}

const Page: FC<Props> = (props) => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(0);
  const [route, setRoute] = useState("Login");
  return (
    <div>
      <Heading
        title="ELearning"
        description="ELearning is a platform for student to learn and get help from teacher"
        keywords="ELearning App, MERN STACK APP, NEXT JS App, MVC Pattern"
      />
      <Header open={open} setOpen={setOpen} activeItem={activeItem} route={route} setRoute={setRoute} />
      <Hero />
    </div>
  );
};

export default Page;
