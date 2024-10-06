import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NavBar from "./navBar";
import SideBar from "./sideBar";
import Post from "./post";
import AddPost from "./addPost";
import FullPost from "../fullPost";
import { RxCross1 } from "react-icons/rx";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import PostLoader from "./postLoader";

const HomePage = () => {
  const navigate = useNavigate();
  const [viewCommentPostId, setViewCommentPostId] = useState("");
  const [viewComment, setViewComment] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fullname, setFullname] = useState(null);
  const [username, setUsername] = useState(null);
  const [showAddPost, setShowAddPost] = useState(false);
  const [image, setImage] = useState(null);
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
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
              `http://localhost:5000/user/${response.data.user._id}`
            );
            setFullname(userResponse.data.fullname);
            setUsername(userResponse.data.username);
            setLoading(false);
          } catch (error) {
            console.log(error);
            setLoading(false);
          }
        } else {
          navigate("/login");
        }
      } catch (error) {
        setLoading(false);
        console.error("User fetch failed:", error);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/post");
        setPosts(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Posts fetch failed:", error);
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);
  const toggleViewComment = () => {
    setViewComment(!viewComment);
  };
  useEffect(() => {
    if (showAddPost) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    // Cleanup function to remove the class when the component unmounts or showAddPost changes
    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [showAddPost]);

  const toggleAddPost = () => {
    setShowAddPost(!showAddPost);
  };

  return (
    <div className="flex flex-row relative">
      <NavBar toggleAddPost={toggleAddPost} user={user} setUser={setUser} />
      <div className="w-full flex flex-row justify-center gap-20">
        <div className="flex flex-col justify-center items-center gap-5">
          {loading &&
            Array.from({ length: 5 }).map((_, index) => {
              return <PostLoader key={index} />;
            })}
          <div>Story Section</div>
          {posts.map((post, index) => {
            return (
              <>
                <Post
                  key={post._id}
                  post={post}
                  toggleViewComment={toggleViewComment}
                  setViewCommentPostId={setViewCommentPostId}
                  loading={loading}
                  setLoading={setLoading}
                />
              </>
            );
          })}
        </div>
        <SideBar
          fullname={fullname}
          username={username}
          loading={loading}
          user={user}
        />
      </div>
      {showAddPost && (
        <div className="fixed top-0 left-0 w-full h-[100vh] flex justify-center items-center bg-black bg-opacity-50 z-20">
          <AddPost
            image={image}
            setImage={setImage}
            toggleAddPost={toggleAddPost}
          />
          <button
            onClick={toggleAddPost}
            className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded"
          >
            Close
          </button>
        </div>
      )}
      {viewComment && (
        <div className="fixed top-0 left-0 w-full h-[100vh] flex justify-center items-center bg-black bg-opacity-50 z-20">
          <FullPost viewCommentPostId={viewCommentPostId} />
          <RxCross1
            className="h-9 w-9 absolute top-4 right-4 p-2 text-white text-2xl cursor-pointer"
            onClick={toggleViewComment}
          />
        </div>
      )}
    </div>
  );
};

export default HomePage;
