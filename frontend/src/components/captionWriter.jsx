import React, { useState } from 'react';
import axios from 'axios';


function CaptionWriter({ image , toggleAddPost, imageFile}) {
  const [caption, setCaption] = useState('');
  const [postCreated, setPostCreated] = useState(false);

  const handleCaptionChange = (event) => {
    const words = event.target.value.split(/\s+/);
    if (words.length <= 200) {
      setCaption(event.target.value);
    }
  };
  const postFunction = async () => {
    const token = localStorage.getItem('token');


    try {
      const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('caption', caption);

      await axios.post('http://localhost:5000/post/', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      setCaption("");
      setPostCreated(true);
      toggleAddPost();
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };


  return (
    <div className='flex justify-center items-center h-full font-roboto font-bold'>
      <div className='bg-gray-200 w-[800px] h-[600px] m-14 flex flex-col justify-center items-center'>
        <div className='w-full flex justify-between items-center px-4'>
          <p className='pt-4 pb-2 border-b border-gray-300 w-full flex justify-center items-center'>Create new Post</p>
          <button
              className="p-2 rounded text-blue-500 font-xs 'bg-gray-300 font-normal"
              onClick={postFunction}
            >
              Post
            </button>
        </div>
        <div className='h-full flex flex-row justify-around items-center'>
            <div className='w-[45%] h-[90%]'>
                <img src={image} alt="Selected" className='w-full h-full object-cover' />
            </div>
          <textarea
            className='w-[45%] h-[90%] bg-transparent border-none focus:outline-none resize-none p-2 font-thin'
            placeholder='Write a caption (up to 200 words)'
            value={caption}
            onChange={handleCaptionChange}
            maxLength={200 * 5} // rough approximation to prevent excess typing (5 characters per word)
          />
        </div>
        {postCreated?<div className='text-center text-green-500'>Post Created Successfully!</div> : <div></div>}

      </div>
    </div>
  );
}

export default CaptionWriter;
