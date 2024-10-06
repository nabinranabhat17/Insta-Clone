import React, { useEffect, useState } from "react";
import { IoIosHeart } from "react-icons/io";
import { FaRegComment } from "react-icons/fa";
import { CiBookmark } from "react-icons/ci";
import axios from "axios";
import profile from "./assets/profile.svg";
import { CiHeart } from "react-icons/ci";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const FullPost = ({ viewCommentPostId }) => {
  const [comment, setComment] = useState("");
  const [putcomment, setPutcomment] = useState("");
  const [user, setUser] = useState("");
  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");
  const [selectedPostImage, setSelectedPostImage] = useState("");
  const [like, setLike] = useState([]);
  // const [commentUser, setCommentUser] = useState('');
  const [loading, setLoading] = useState(false);

  const commentPost = async () => {
    const data = { userId: user, text: putcomment };
    try {
      const token = localStorage.getItem("token");

      const res = await axios.put(
        `https://insta-clone-r30s.onrender.com/post/comments/${viewCommentPostId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      setPutcomment("");
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `https://insta-clone-r30s.onrender.com/post/comments/${viewCommentPostId}`
        );
        setComment(res.data.comments);
        setSelectedPostImage(res.data.image);
        setUsername(res.data.user.username);
        setFullname(res.data.user.fullname);
        setLike(res.data.likes);
        setLoading(false);
      } catch (error) {
        setLoading(false);

        console.log(error);
      }
    };
    fetchComments();
  }, [setPutcomment]);
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "https://insta-clone-r30s.onrender.com/user/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        setUser(res.data.user._id);
        setLoading(false);
      } catch (error) {
        setLoading(false);

        console.log(error);
      }
    };
    fetchUser();
  }, []);
  const onLikeClick = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      const res = await axios.put(
        `https://insta-clone-r30s.onrender.com/post/${viewCommentPostId}`,
        { like: true },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      setLike(res.data.updatedPost.likes);
      setLoading(false);
    } catch (error) {
      setLoading(false);

      console.log(error);
    }
  };
  return (
    <div className="flex flex-row h-[568px] w-[1000px] font-roboto bg-white">
      <div className="bg-black border w-[50%] h-full flex justify-center">
        {loading ? (
          <Skeleton className="h-full w-full" />
        ) : (
          <img
            src={selectedPostImage}
            alt="this is the image"
            className="h-full w-auto object-contain"
          />
        )}
      </div>
      <div className="flex flex-col w-[50%] h-full ">
        <div className="h-[70px] gap-y-2 flex flex-col justify-center items-start p-4 border-b-2">
          <p className="font-bold">{username}</p>
          <p className="text-sm">{fullname}</p>
        </div>
        <div className="h-full w-full flex flex-col my-2 custom-scrollbar ">
          {comment
            ? comment.map((com, index) => {
                return (
                  <div
                    key={index}
                    className="flex flex-col  justify-start items-start mb-4"
                  >
                    <div className="flex gap-x-2 p-1 px-3 flex-row justify-start items-start">
                      <img
                        src={profile}
                        alt="image"
                        className="h-8 w-8   rounded-full"
                      />
                      <p className="pt-0.5 text-[16px]">
                        <span className="font-bold text-sm  mr-2 ">
                          {com.user.username}
                        </span>
                        {com.text}
                      </p>
                    </div>
                    <div className="flex flex-row text-xs text-[#8e8e8e] font-bold gap-x-6 ml-12">
                      <p>3d</p>
                      <p>1 like</p>
                      <p>See translation</p>
                    </div>
                  </div>
                );
              })
            : ""}
        </div>
        <div className="w-full border-y-2 flex flex-col justify-between items-start p-2">
          <div className="flex flex-row justify-between w-full items-center">
            <div className="flex flex-row justify-start   items-center gap-3 ">
              {like.includes(user) ? (
                <IoIosHeart
                  className="h-8 w-8 cursor-pointer text-red-500"
                  onClick={onLikeClick}
                />
              ) : (
                <CiHeart
                  className="h-8 w-8 cursor-pointer"
                  onClick={onLikeClick}
                />
              )}

              <FaRegComment className="h-7 w-7 " />
            </div>
            <CiBookmark className="h-8 w-8 flex justify-center items-center" />
          </div>
          <p className="mt-2 pl-1">Liked by {like.length}</p>
        </div>

        <div className="flex flex-row p-4">
          <input
            type="text"
            placeholder="Add a comment..."
            className="w-full text-[14px] font-medium p-2 border     border-gray-300 rounded focus:outline-none      focus:border-blue-500 border-none"
            value={putcomment}
            onChange={(e) => {
              setPutcomment(e.target.value);
            }}
          />
          <button
            className="p-2 rounded text-blue-500    font-xs   'bg-gray-300 font-normal"
            onClick={commentPost}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default FullPost;
