import React, { useState } from "react";
import logo from "../assets/logo.svg";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleClick = async () => {
    const data = {
      fullname: fullname,
      username: username,
      email: email,
      password: password,
    };
    setError("");
    setSuccess("");
    await axios
      .post("https://insta-clone-r30s.onrender.com/user/register", data)
      .then((Response) => {
        console.log(Response);
        setSuccess("Registration successful");
      })
      .catch((error) => {
        console.log(error);
        setError(
          error.response ? error.response.data.message : "Registration failed"
        );
      });
  };

  return (
    <div className="flex flex-col justify-start items-center m-5">
      <div className="flex flex-col p-3 border w-[400px] gap-y-1 items-center justify-center text-roboto font-semibold text-gray-500">
        <img className="w-32 m-5" src={logo} alt="" />
        <p className="">Sign Up to see photos and Videos</p>
        <p className="mb-3">from your family and friends</p>
        <input
          className="border p-2 font-thin w-[250px] focus:outline-none"
          type="text"
          placeholder="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <input
          className="border p-2 font-thin w-[250px] focus:outline-none"
          type="text"
          placeholder="fullname"
          value={fullname}
          onChange={(e) => {
            setFullname(e.target.value);
          }}
        />
        <input
          className="border p-2 font-thin w-[250px] focus:outline-none"
          type="text"
          placeholder="username"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />
        <input
          className="border p-2 font-thin w-[250px] focus:outline-none"
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <p className="flex items-center justify-center font-thin text-xs mt-4">
          People who use our service may have uploaded{" "}
        </p>
        <p className="flex items-center justify-center font-thin text-xs">
          your contact information to Instagram.{" "}
        </p>
        <p className="flex items-center justify-center font-thin text-xs mb-4">
          Learn More
        </p>
        <button
          className="p-2 w-[200px] bg-blue-400 text-white font-bold rounded-md mb-10"
          onClick={handleClick}
        >
          Sign Up
        </button>
        {error && <p className="text-center text-red-500">{error}</p>}
        {success && <p className="text-center text-green-500">{success}</p>}
      </div>
      <div className="flex flex-row p-8 border w-[400px] gap-y-1 items-center justify-center text-roboto mt-5 gap-2">
        <p>Have an Account?</p>
        <Link to="/login">
          <p className="text-blue-700 hover:underline cursor-pointer">log In</p>
        </Link>
      </div>
    </div>
  );
};

export default Signup;
