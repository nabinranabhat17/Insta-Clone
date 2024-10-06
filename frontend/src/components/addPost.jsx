// AddPost.jsx
import React, { useState } from 'react';
import ImageUploader from './imageUploader.jsx';
import CaptionWriter from './captionWriter.jsx';


function AddPost({image, setImage, toggleAddPost}) {
  const [step, setStep] = useState(1);
  const [imageFile, setImageFile] = useState(null);


  const handleNextStep = () => {
    setStep(prevStep => prevStep + 1);
  };

  return (
    <div className="add-post-container">
      {step === 1 && <ImageUploader image={image} setImage={setImage} onNext={handleNextStep} imageFile={imageFile} setImageFile={setImageFile}/>}
      {step === 2 && <CaptionWriter image={image} toggleAddPost={toggleAddPost} imageFile={imageFile}/>}
    </div>
  );
}

export default AddPost;
