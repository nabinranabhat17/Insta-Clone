// src/components/ProfilePhotoModal.js
import React, { useRef , useState} from 'react';
import axios from 'axios';
import Skeleton from 'react-loading-skeleton';


const EditPic = ({ toggleEditPost, setUser, setIsPPchanging }) => {
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState('');
 

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file);
      setIsPPchanging(true);
      setTimeout(() => {
      changePic(file);
      setIsPPchanging(false);
      }
      , 1000);

      toggleEditPost();
    }
  };
  const deletePic = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('http://localhost:5000/user/delete/profilepic', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      if (res.data.success) {
        setUser(res.data.user);
      }
    }
    catch (error) {
      console.error('Error deleting profile picture:', error);
    }
  };

  const changePic = async (file) => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await axios.put('http://localhost:5000/user/', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      if (res.data.success) {
        setUser(res.data.user);
      }

    } catch (error) {
      console.error('Error changing profile picture:', error);
    }
  };
  return (

      <div className="bg-white text-black rounded-lg w-80 text-center pt-6 shadow-lg font-roboto">
        <h2 className="py-2 text-lg font-semibold">Change Profile Photo</h2>
        <div className="w-full text-blue-500 py-3 border-y cursor-pointer" onClick={handleClick}>
          <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          Upload Photo
        </div>
        <div onClick={()=>{
        toggleEditPost();
          setIsPPchanging(true);
          setTimeout(() => {
          deletePic();
          setIsPPchanging(false);
          },1000);
        }} className="w-full text-red-500 py-3 border-b cursor-pointer">
          Remove Current Photo
        </div>
        <div className="w-full py-3 cursor-pointer" onClick={toggleEditPost}>
          Cancel
        </div>
      </div>

  );
};

export default EditPic;
