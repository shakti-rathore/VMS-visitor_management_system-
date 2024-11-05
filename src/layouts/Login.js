import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import loginIllustration from 'layouts/login-illustration.png';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('host');
    const [showModal, setShowModal] = useState(false);
    const [newUser, setNewUser] = useState({
        username: '',
        password: '',
        role: 'host',
        email: '',
        emailPassword: ''
    });
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
                const { userId, role, token } = data;
                localStorage.setItem('token', token);
                localStorage.setItem('userId', userId);
                localStorage.setItem('role', role);
                if (role === 'host') {
                    navigate('/admin/dashboard');
                    console.log(token,userId,role);
                } else if (role === 'receptionist') {
                    navigate('/receptionist/dashboardrecp');
                    console.log(token,userId,role);

                }
            } else {
                alert('Invalid login credentials');
            }
        } catch (error) {
            console.error('Error during login:', error);
            alert('Login failed, please try again.');
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newUser),
            });

            if (response.ok) {
                alert('User registered successfully');
                setShowModal(false);
            } else {
                alert('Failed to register user');
            }
        } catch (error) {
            console.error('Error during registration:', error);
            alert('Registration failed, please try again.');
        }
    };
    

    return (
      <div className="bg-gray-100 h-screen flex justify-center items-center">
          <div className="container mx-auto flex flex-col md:flex-row items-center justify-center shadow-lg p-8 rounded-lg bg-white">
              
              {/* Image Section */}
              <div className="hidden md:block md:w-[500px] pr-8">
                  <img src={loginIllustration} alt="Login Illustration" className="w-full h-auto" />
              </div>

              {/* Login Form Section */}
              <div className="md:w-1/4 w-full">
                  <h1 className="text-3xl font-bold mb-5 text-center">Welcome Back :)</h1>
                  <p className="text-center mb-4 text-gray-500">
                      To keep connected with us please login with your personal info
                  </p>
                  <form id="loginForm" onSubmit={handleSubmit}>
                      <div className="mb-4">
                          <label htmlFor="username" className="block text-gray-600">User Name</label>
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
                          <label htmlFor="password" className="block text-gray-600">Password</label>
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
                          <label htmlFor="role" className="block text-gray-600">Login as:</label>
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
                          type="button"
                          onClick={() => setShowModal(true)}
                          className="text-blue-600 hover:underline"
                      >
                          Register User
                      </button>
                      <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600 mt-4">
                          Login Now
                      </button>
                  </form>
              </div>
          </div>

          {/* Modal for Registering User */}
          {showModal && (
            <div className="fixed inset-0 flex items-center justify-center   bg-opacity-50 backdrop-filter backdrop-blur-lg transition-opacity duration-300 ease-in-out">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 backdrop-filter backdrop-blur-lg bg-white bg-opacity-30 transition-transform transform duration-300 translate-y-0">
           <h2 className="text-2xl font-bold mb-4">Register User</h2>
                      <form onSubmit={handleRegister}>
                          <div className="mb-4">
                              <label className="block text-gray-600">Username</label>
                              <input
                                  type="text"
                                  className="border p-2 rounded w-full"
                                  required
                                  value={newUser.username}
                                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                              />
                          </div>
                          <div className="mb-4">
                              <label className="block text-gray-600">Password</label>
                              <input
                                  type="password"
                                  className="border p-2 rounded w-full"
                                  required
                                  value={newUser.password}
                                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                              />
                          </div>
                          <div className="mb-4">
                              <label className="block text-gray-600">Role</label>
                              <select
                                  className="border p-2 rounded w-full"
                                  required
                                  value={newUser.role}
                                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                              >
                                  <option value="host">Host</option>
                                  <option value="receptionist">Receptionist</option>
                              </select>
                          </div>
                          <div className="mb-4">
                              <label className="block text-gray-600">Email (optional)</label>
                              <input
                                  type="email"
                                  className="border p-2 rounded w-full"
                                  value={newUser.email}
                                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                              />
                          </div>
                          <div className="mb-4">
                              <label className="block text-gray-600">Email Password</label>
                              <input
                                  type="password"
                                  className="border p-2 rounded w-full"
                                  required
                                  value={newUser.emailPassword}
                                  onChange={(e) => setNewUser({ ...newUser, emailPassword: e.target.value })}
                              />
                          </div>
                          <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600">
                              Register
                          </button>
                          <button
                              type="button"
                              onClick={() => setShowModal(false)}
                              className="bg-transparent text-gray-500 mt-3 w-full hover:bg-gray-200 rounded p-2 border-0"
                              >
                              Cancel
                          </button>
                      </form>
                  </div>
              </div>
          )}
      </div>
  );
};

export default Login;
