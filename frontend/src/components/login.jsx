import React, { useState } from 'react';
import logo from "../assets/logo.svg";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleClick = async () => {
    const data = { email, password };
    setError('');
    setSuccess('');

    try {
      const response = await axios.post("http://localhost:5000/user/login", data, { withCredentials: true });
      localStorage.setItem('token', response.data.authToken)
      setSuccess("Logged in successfully");
      navigate('/home'); 
    } catch (error) {
      setError(error.response ? error.response.data.message : 'Login failed');
    }
  };

  return (
    <div className='flex flex-col justify-start items-center m-5'>
      <div className='flex flex-col p-3 border w-[400px] gap-y-1 items-center justify-center text-roboto font-semibold text-gray-500'>
        <img className="w-32 m-5" src={logo} alt="" />
        <p className=''>Log in to see photos and Videos</p>
        <p className='mb-5'>from your family and friends</p>
        <input
          className="border p-2 font-thin w-[250px] focus:outline-none"
          type="text"
          placeholder='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="border p-2 font-thin w-[250px] focus:outline-none"
          type="password"
          placeholder='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className='p-2 w-[200px] bg-blue-400 text-white font-bold rounded-md mb-10' onClick={handleClick}>Login</button>
        {error && <p className='text-center text-red-500'>{error}</p>}
        {success && <p className='text-center text-green-500'>{success}</p>}
      </div>
      <div className='flex flex-row p-8 border w-[400px] gap-y-1 items-center justify-center text-roboto mt-5 gap-2'>
        <p>Don't have an account?</p>
        <p className='text-blue-700 hover:underline cursor-pointer' onClick={() => navigate('/register')}>Sign Up</p>
      </div>
    </div>
  );
};

export default Login;
