"use client";
import React,{FC, useState} from 'react';
import { useSelector } from 'react-redux';
import Header from "../components/Header";
import Heading from "../utils/Heading";
import Protected from '../hooks/useProtected';
import Profile from '../components/Profile/Profile';

interface Props {}

const Page: FC<Props> = (props) => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(5);
  const [route, setRoute] = useState("Login");
  const {user} = useSelector((state:any) => state.auth);

  return (
    <div>
      <Protected> 
        <Heading
          title={`${user?.name} Profile Elearning`}
          description={`Explore ${user?.name}'s profile on our eLearning platform, featuring personalized learning experiences and resources.`}
          keywords={`User Profile, ${user?.name}, eLearning, student learning, personalized education, teacher support`}
        />
        <Header open={open} setOpen={setOpen} activeItem={activeItem} route={route} setRoute={setRoute} />
        <Profile user={user}/>
      </Protected>
    </div>
  );
};

export default Page;