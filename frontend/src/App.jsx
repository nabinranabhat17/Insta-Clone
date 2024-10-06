import React, { useState } from "react";
import HomePage from "./components/homePage";
import Signup from "./components/signup.jsx";
import Login from "./components/login.jsx";
import { Route, Routes } from "react-router-dom";
import ImageUploader from "./components/imageUploader.jsx";
import AddPost from "./components/addPost.jsx";
import CaptionWriter from "./components/captionWriter.jsx";
import ProfilePage from "./components/profilePage.jsx";
import FullPost from "./fullPost.jsx";
import EditPic from "./components/editPic.jsx";
import PostLoader from "./components/postLoader.jsx";

const App = () => {
  const [image, setImage] = useState(null);
  return (
    <>
      <Routes>
        <Route path="/home" element={<PostLoader />}></Route>
        <Route path="/profile/:id" element={<ProfilePage />}></Route>
        <Route path="/home" element={<HomePage />}></Route>
        <Route path="/register" element={<Signup />}></Route>
        <Route path="/login" element={<Login />}></Route>
      </Routes>
    </>
  );
};

export default App;
