import axios from "axios";
import React, { useState } from "react";


const SignUp= ()=>{
    const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        console.log("Form Data Submitted:", formData);
        const payload= {
            name:formData.name,
            email:formData.email,
            password:formData.password
        }


        try{
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/signup`,payload)
            console.log("response after signin -", response);

            localStorage.setItem("token", response.data.token);

        
            localStorage.setItem("user", JSON.stringify(response.data.user));

            if(response.status===201){
                window.location.href = "/";
            }


        }catch(e){
            console.log("error during signup- ",e);
        }
    };

    return(
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm"
        >
            <h1 className="text-2xl font-bold mb-6 text-center">Sign Up</h1>

            <div className="mb-4">
            <label className="block mb-1 font-medium" htmlFor="name">
                Name
            </label>
            <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Your Name"
                required
            />
            </div>

            <div className="mb-4">
            <label className="block mb-1 font-medium" htmlFor="email">
                Email
            </label>
            <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="you@example.com"
                required
            />
            </div>

            <div className="mb-6">
            <label className="block mb-1 font-medium" htmlFor="password">
                Password
            </label>
            <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="********"
                required
            />
            </div>

            <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
            Sign Up
            </button>

            <p className="mt-4 text-center text-gray-600">
            Alredy have account?{" "}
            <a 
                href="/login" 
                className="text-blue-500 font-medium hover:underline"
            >
                Login
            </a>
            </p>

        </form>
        </div>
    );
}

export default SignUp;