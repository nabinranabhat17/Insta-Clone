import React, { useEffect, useState } from "react";
import logo from "../assets/logo.svg";
import reels from "../assets/reels.svg";
import { IoMdHome } from "react-icons/io";
import { CiSearch } from "react-icons/ci";
import { MdOutlineExplore } from "react-icons/md";
import { AiOutlineMessage } from "react-icons/ai";
import { CiHeart } from "react-icons/ci";
import { FaRegPlusSquare } from "react-icons/fa";
import { IoMdMenu } from "react-icons/io";
import profile from "../assets/profile.svg";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const NavBar = ({ toggleAddPost, user, setUser }) => {
  const Navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchId = async () => {
      setLoading(true);
      try {
        //get token from local storage
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "https://insta-clone-r30s.onrender.com/user/profile",
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.success) {
          setUser(response.data.user);
          setLoading(false);
        } else {
          Navigate("/login");
        }
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };
    fetchId();
  }, []);

  // if (loading) {
  //     return <p>Loading...</p>
  // }
  return (
    <div className="sticky left-0 top-0 min-w-[300px] flex-grow-0 pt-[40px] pr-[12px] pb-[16px] pl-[12px] bg-white  flex-col gap-[4px] h-screen border-r border-gray-300 hidden sm:flex">
      <img src={logo} className="mx-[10px] w-[102.4px] h-[29px] mb-4" />
      <div className="mb-[4px] py-[4px] text-base font-normal font-roboto flex flex-col gap-2">
        <Link
          to="/home"
          className="flex flex-row justify-start items-center p-[12px] gap-4 cursor-pointer"
        >
          <IoMdHome className="h-8 w-8" />
          <p className="font-bold">Home</p>
        </Link>
        <div className="flex flex-row justify-start items-center p-[12px] gap-4 cursor-pointer">
          <CiSearch className="h-8 w-8" />
          <p className="">Search</p>
        </div>
        <div className="flex flex-row justify-start items-center p-[12px] gap-4 cursor-pointer">
          <MdOutlineExplore className="h-7 w-7" />
          <p className="">Explore</p>
        </div>
        <div className="flex flex-row justify-start items-center p-[12px] gap-4 cursor-pointer">
          <img src={reels} className="h-7 w-7" />
          <p className="">Reels</p>
        </div>
        <div className="flex flex-row justify-start items-center p-[12px] gap-4 cursor-pointer">
          <AiOutlineMessage className="h-7 w-7" />
          <p className="">Messages</p>
        </div>
        <div className="flex flex-row justify-start items-center p-[12px] gap-4 cursor-pointer">
          <CiHeart className="h-7 w-7" />
          <p className="">Notifications</p>
        </div>
        <div
          className="flex flex-row justify-start items-center p-[12px] gap-4 cursor-pointer"
          onClick={toggleAddPost}
        >
          <FaRegPlusSquare className="h-7 w-7" />
          <p className="">Create</p>
        </div>
        <Link
          to={`/profile/${user._id}`}
          className="flex flex-row justify-start items-center p-[12px] gap-4 cursor-pointer"
        >
          <img src={user.profilePic} className="h-8 w-8 rounded-full" />
          <p className="">Profile</p>
        </Link>
      </div>
      <div className="flex flex-row justify-start items-center p-[12px] gap-4 cursor-pointer">
        <IoMdMenu className="h-8 w-8" />
        <p>More</p>
      </div>
    </div>
  );
};

export default NavBar;
