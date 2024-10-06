import React from "react";
import postPhoto from "../assets/postPhoto.svg";
import { IoIosHeart } from "react-icons/io";
import { CiHeart } from "react-icons/ci";
import { FaRegComment } from "react-icons/fa";
import message from "../assets/message.svg";
import { CiBookmark } from "react-icons/ci";
import { CiMenuKebab } from "react-icons/ci";
import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Post = ({
  post,
  toggleViewComment,
  setViewCommentPostId,
  loading,
  setLoading,
}) => {
  console.log(post);
  const Navigate = useNavigate();
  const [comment, setComment] = useState("");
  const [like, setLike] = useState([]);
  const [user, setUser] = useState("");
  const commentPost = async () => {
    const data = { userId: user, text: comment };
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.put(
        `http://localhost:5000/post/comments/${post._id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      setComment("");
      setLoading(false);
    } catch (error) {
      setLoading(false);

      console.log(error);
    }
  };
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/user/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        setUser(res.data.user._id);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    fetchUser();
    setLike(post.likes);
  }, []);
  const onLikeClick = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `http://localhost:5000/post/${post._id}`,
        { like: true },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      setLike(res.data.updatedPost.likes);
      setUser(res.data.userId);
    } catch (error) {
      console.log(error);
    }
  };
  const getHourFromDate = (dateStr, isUTC = true) => {
    // Convert the string to a Date object
    const givenDate = new Date(dateStr);

    // Get the current date and time
    const currentDate = new Date();

    // Calculate the difference in milliseconds
    const differenceInMilliseconds = currentDate - givenDate;

    // Convert the difference from milliseconds to hours
    const differenceInHours = differenceInMilliseconds / (1000 * 60 * 60);

    return Math.floor(differenceInHours);
  };
  return (
    <div className="md:min-w-[470px] max-w-[470px] flex flex-col gap-y-2 p-2 font-roboto">
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row gap-1 items-center text-[#8e8e8e] text-roboto">
          <div
            className="flex flex-row justify-center items-center cursor-pointer"
            onClick={() => {
              Navigate(`/profile/${post.user._id}`);
            }}
          >
            {/* <img
              src={`http://localhost:5000/uploads/${post.user.profilePic}`}
              alt=""
              className="h-8 w-8 rounded-full"
            /> */}
            <p className="ml-1 font-semibold text-[#262626]">
              {post.user.username}
            </p>
          </div>

          <p className=""></p>
          <p className="h-1 w-1 rounded-full bg-[#c7c7c7]"></p>
          <p>{`${getHourFromDate(post.createdAt)}h`}</p>
        </div>

        <CiMenuKebab />
      </div>
      <img src={post.image} className="w-[468px]" />
      <div className="flex flex-row justify-between">
        <div className="flex flex-row justify-start items-center gap-3">
          {like.includes(user) ? (
            <IoIosHeart
              className="h-8 w-8 cursor-pointer text-red-500"
              onClick={onLikeClick}
            />
          ) : (
            <CiHeart className="h-8 w-8 cursor-pointer" onClick={onLikeClick} />
          )}

          <FaRegComment className="h-7 w-7 " />
          <img src={message} className="h-7 w-7" />
        </div>
        <CiBookmark className="h-8 w-8" />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-bold">{like.length} likes</p>
        <div className="flex flex-row items-center  justify-start gap-2">
          <p className="text-sm font-bold">{post.user.username}</p>
          <p className="text-sm font-light">{post.caption}</p>
        </div>
        <p
          className="text-[13px] text-[#8e8e8e] cursor-pointer"
          onClick={() => {
            setViewCommentPostId(post._id);
            toggleViewComment();
          }}
        >
          View all 13,345 comments
        </p>

        <div className="flex justify-between items-center">
          <input
            type="text"
            placeholder="Add a comment..."
            className="w-full text-[14px] font-medium p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 border-none"
            value={comment}
            onChange={(e) => {
              setComment(e.target.value);
            }}
          />
          {comment ? (
            <button
              className="p-2 rounded text-blue-500 font-xs 'bg-gray-300 font-normal"
              onClick={commentPost}
            >
              Post
            </button>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default Post;
