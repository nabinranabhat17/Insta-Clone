import React, { useState, useEffect } from "react";
import NavBar from "./navBar";
import profile from "../assets/profile.svg";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import FullPost from "../fullPost";
import { RxCross1 } from "react-icons/rx";
import { useParams } from "react-router-dom";
import EditPic from "./editPic";
import Spinner from "./spinner.jsx";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [viewCommentPostId, setViewCommentPostId] = useState("");
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [viewComment, setViewComment] = useState(false);
  const [user, setUser] = useState({});
  const { id } = useParams();
  const [showEditPost, setShowEditPost] = useState(false);
  const [isPPchanging, setIsPPchanging] = useState(false);

  //  useEffect(()=>{
  //   if (!id){

  //   }
  //  }, [])
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/user/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        if (response.data.success) {
          setUser(response.data.user);
          try {
            const userResponse = await axios.get(
              `http://localhost:5000/post/${id}`
            );
            setPosts(userResponse.data);
          } catch (error) {
            console.log(error);
          }
        } else {
          setLoading(false);
          navigate("/login");
        }
      } catch (error) {
        console.error("User fetch failed:", error);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);
  const toggleEditPost = () => {
    setShowEditPost(!showEditPost);
  };

  return (
    <div className="flex flex-row">
      <NavBar user={user} setUser={setUser} />
      <div className="w-full flex py-0 px-[65px] font-roboto">
        <div className="flex-grow-1 ml-[44px] mr-[110px]">
          <div className="w-full my-5 pb-8 flex flex-row gap-20 border-b-2 relative justify-start items-center">
            {isPPchanging && (
              <div className="absolute inset-0 flex items-start justify-start bg-white bg-opacity-50 rounded-full py-4">
                <div className="h-[150px] w-[150px] rounded-full ml-20 cursor-pointer flex justify-center items-center">
                  <Spinner />
                </div>
              </div>
            )}
            {loading ? (
              <Skeleton className="h-[150px] w-[150px] rounded-full ml-20" />
            ) : (
              <img
                src={user.profilePic}
                alt=""
                className="h-[150px] w-[150px] rounded-full ml-20 cursor-pointer"
                onClick={toggleEditPost}
              />
            )}

            <div className="flex flex-col flex-grow w-full gap-y-3">
              <div className="flex flex-row gap-5 my-4 justify-start items-center">
                <p className="">
                  {loading ? <Skeleton className="w-5" /> : user.username}
                </p>
                <div className=" h-8 flex flex-row justify-center items-center px-[17.5px] py-2 rounded-lg bg-[#efefef] font-semibold text-sm">
                  {loading ? <Skeleton className="w-5" /> : "Edit Profile"}
                </div>
                <div className=" h-8 flex justify-center items-center px-[17.5px] py-2 rounded-lg bg-[#efefef] font-semibold text-sm">
                  {loading ? <Skeleton className="w-5" /> : "Ad Tools"}
                </div>
              </div>
              <div className="flex flex-row gap-10 justify-start items-center text-sm">
                <p className="">
                  {loading ? <Skeleton className="w-10" /> : "11 Posts"}
                </p>
                <p>
                  {loading ? <Skeleton className="w-10" /> : "20 followers"}
                </p>
                <p>
                  {loading ? <Skeleton className="w-10" /> : "24 following"}
                </p>
              </div>
              <div className="flex flex-col h-full mt-3 gap-y-2">
                <p>{loading ? <Skeleton className="w-[30px]" /> : "links"}</p>
                <p>{loading ? <Skeleton className="w-[30px]" /> : "Bio"}</p>
              </div>
            </div>
          </div>
          {showEditPost && (
            <div className="fixed top-0 left-0 w-full h-[100vh] flex justify-center items-center bg-black bg-opacity-50 z-20">
              <EditPic
                toggleEditPost={toggleEditPost}
                setUser={setUser}
                setIsPPchanging={setIsPPchanging}
              />
            </div>
          )}
          {viewComment && (
            <div className="fixed top-0 left-0 w-full h-[100vh] flex justify-center items-center bg-black bg-opacity-50 z-20">
              <FullPost viewCommentPostId={viewCommentPostId} />
              <RxCross1
                className="h-9 w-9 absolute top-4 right-4 p-2 text-white text-2xl cursor-pointer"
                onClick={() => setViewComment(false)}
              />
            </div>
          )}
          <div className="flex flex-row flex-wrap gap-1">
            {loading
              ? [1, 2, 3, 4, 5].map((index) => {
                  return (
                    <Skeleton key={index} className="h-[309px] w-[309px]" />
                  );
                })
              : posts.map((post, index) => {
                  return (
                    <img
                      src={post.image}
                      key={index}
                      alt=""
                      className="h-[309px] w-[309px] object-cover border bg-gray-50 cursor-pointer"
                      onClick={() => {
                        setViewComment(true);
                        setViewCommentPostId(post._id);
                      }}
                    />
                  );
                })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
