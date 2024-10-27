import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import loginIllustration from 'layouts/login-illustration.png';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('host');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, role }),
      });

      if (response.ok) {
        const data = await response.json();
        const { userId, role } = data;
        localStorage.setItem('userId', userId);
        localStorage.setItem('role', role);
        
        if (userId) {
          if (role === 'host') {
            navigate('/admin');
          } else if (role === 'receptionist') {
            navigate('/receptionist');
          }
        } else {
          alert("Tumse na paega");
        }
      } else {
        alert('Invalid login credentials');
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('Login failed, please try again.');
    }
  };

  return (
    <div className="bg-gray-100 h-screen flex justify-center items-center">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-center shadow-lg p-8 rounded-lg bg-white">
        {/* Image Section */}
        <div className="hidden md:block md:w-[500px] pr-8">
          <img
src={loginIllustration}            alt="Login Illustration"
            className="w-full h-auto"
          />
        </div>
        
        {/* Login Form Section */}
        <div className="md:w-1/4 w-full">
          <h1 className="text-3xl font-bold mb-5 text-center">Welcome Back :)</h1>
          <p className="text-center mb-4 text-gray-500">To keep connected with us please login with your personal info</p>
          <form id="loginForm" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="username" className="block text-gray-600">
                User Name
              </label>
              <input
                type="text"
                id="username"
                className="border p-2 rounded w-full"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-600">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="border p-2 rounded w-full"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="role" className="block text-gray-600">
                Login as:
              </label>
              <select
                id="role"
                className="border p-2 rounded w-full"
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="host">Host</option>
                <option value="receptionist">Receptionist</option>
              </select>
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600"
            >
              Login Now
            </button>
          </form>
          <div className="text-center mt-4">
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
