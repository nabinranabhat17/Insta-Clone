import React from "react";
import profile from "../assets/profile.svg";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Link } from "react-router-dom";

const SideBar = ({ fullname, username, loading, user }) => {
  const items = [
    "About",
    "Help",
    "Press",
    "Api",
    "Jobs",
    "Privacy",
    "Terms",
    "Location",
    "Language",
    "Meta Verified",
  ];
  return (
    <div className="max-w-[320px] m-3 md:flex-col gap-y-[15px] font-roboto py-[61px] hidden md:flex">
      <div className="flex flex-row gap-2 items-center justify-between">
        {loading ? (
          <>
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="w-full flex flex-col items-start">
              <Skeleton className="w-[100px]" />
              <Skeleton className="w-[50px]" />
            </div>
          </>
        ) : (
          <>
            <Link
              to={`/profile/${user._id}`}
              className="flex flex-row gap-2 justify-center items-center"
            >
              <img
                src={user.profilePic}
                className="border rounded-full h-10 w-10"
              />
              <div className="w-full flex flex-col items-start">
                <p className="font-semibold">{username}</p>
                <p className="font-light ">{fullname}</p>
              </div>
            </Link>
            <span className="text-[#0095f6] cursor-pointer">switch</span>
          </>
        )}
      </div>
      <div className="h-5 flex flex-row justify-between">
        <p className="text-[#8e8e8e] font-semibold">Suggestions for you</p>
        <p className="text-[#262626] font-bold cursor-pointer">See All</p>
      </div>
      <div className="w-full flex flex-col justify-center gap-3">
        {Array.from({ length: 4 }, (_, index) => {
          return (
            <div
              key={index}
              className="flex flex-row gap-2 items-center justify-between w-full"
            >
              {loading ? (
                <div className="flex flex-row gap-x-2">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex flex-col justify-center items-start">
                    <Skeleton className="w-[100px]" />
                    <Skeleton className="w-[50px]" />
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex gap-2">
                    <div
                      key={index}
                      className="h-10 w-10 rounded-full bg-gray-400"
                    />
                    <div className="flex flex-col items-start">
                      <p className="font-semibold">Username</p>
                      <p className="font-light ">Full Name</p>
                    </div>
                  </div>

                  <span className="text-[#0095f6] cursor-pointer">Follow</span>
                </>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex flex-row flex-wrap gap-1">
        {items.map((item, index) => {
          return (
            <span
              key={index}
              className="flex flex-row justify-center items-center gap-2 text-roboto text-[#c7c7c7] text-[14px] cursor-pointer"
            >
              <p className="">{item}</p>
              <p className="h-0.5 w-0.5 rounded-full bg-[#c7c7c7]"></p>
            </span>
          );
        })}
      </div>
      <p className="text-[#c7c7c7]">© 2023 INSTAGRAM FROM META</p>
    </div>
  );
};

export default SideBar;
