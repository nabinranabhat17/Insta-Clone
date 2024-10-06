import React, { useState, useRef } from 'react';
import { IoMdPhotos } from 'react-icons/io';

function ImageUploader({ image, setImage, onNext, imageFile, setImageFile }) {
  const [isNextEnabled, setIsNextEnabled] = useState(false);
  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageFile(file);
        setImage(reader.result);
        setIsNextEnabled(true); // Enable the Next button when an image is loaded
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className='flex justify-center items-center h-full font-roboto font-bold'>
      <div className='bg-gray-200 w-[500px] h-[600px] m-14 flex flex-col justify-center items-center'>
        <div className='w-full flex justify-between items-center px-4'>
          <p className='pt-4 pb-2 border-b border-gray-300 w-full flex justify-center items-center'>Create new Post</p>
          {image && (
            <button
              onClick={onNext}
              disabled={!isNextEnabled}
              className={`p-2 rounded ${isNextEnabled ? 'text-blue-500 font-semibold font-xs' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
            >
              Next
            </button>
          )}
        </div>
        {image ? (
          <img src={image} alt="Selected" className='w-[90%] h-[90%] object-cover mt-4 p-2' />
        ) : (
          <div className='h-full flex justify-center items-center flex-col'>
            <IoMdPhotos size={150} color={'#333'} className='m-5 cursor-pointer' onClick={handleClick} />
            <p className='cursor-pointer' onClick={handleClick}>Upload photos and videos here</p>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default ImageUploader;
