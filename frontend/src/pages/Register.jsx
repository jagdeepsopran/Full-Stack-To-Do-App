import React, { useState } from "react";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import axios from "axios";
import toast, { useToaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { baseURL } from "../varibles.jsx";

const RegisterForm = () => {
  // State to handle form inputs
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
  });

  // State to handle loading status
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let res = await axios.post(`${baseURL}/api/users/register`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false); // Re-enable inputs and button
    }
  };

  return (
    <div className=" h-screen w-screen flex justify-center items-center rounded bg-gradient-to-b from-gray-600 to-black">
      <div className="max-w-md w-full mx-auto mt-10 p-6 bg-white shadow-xl shadow-gray-400 rounded-3xl">
        <h2 className="text-2xl font-bold text-center mb-4">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="flex flex-col">
            <Label htmlFor="fullname" className="mb-2">
              Full Name
            </Label>
            <Input
              type="text"
              id="fullname"
              name="fullName"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          {/* Username */}
          <div className="flex flex-col">
            <Label htmlFor="username" className="mb-2">
              Username
            </Label>
            <Input
              type="text"
              id="username"
              name="username"
              placeholder="Enter a username"
              value={formData.username}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <Label htmlFor="email" className="mb-2">
              Email
            </Label>
            <Input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          {/* Password */}
          <div className="flex flex-col">
            <Label htmlFor="password" className="mb-2">
              Password
            </Label>
            <Input
              type="password"
              id="password"
              name="password"
              placeholder="Enter a password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full mt-4" disabled={loading}>
            {loading ? <><TbLoader2 className="animate-spin" /> <p>Registering....</p> </> : "Register"}
          </Button>
        </form>
        <p className="text-blue-800 text-center mt-2">
          Already register ?{" "}
          <Link to="/login" className="text-blue-800 underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
