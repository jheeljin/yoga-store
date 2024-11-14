import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // For navigation and location
import axios from 'axios';

const MainPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // To check the current route

  // Handle Login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/login',
        { email, password },
        { headers: { 'Content-Type': 'application/json' } }
      );
      localStorage.setItem('token', response.data.token); // Store token
      navigate('/admin'); // Redirect to AdminPage after login
    } catch (err) {
      console.error("Login error:", err.response ? err.response.data : err);
      setError(err.response ? err.response.data.message : 'Login failed! Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Registration
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/register',
        {
          name: registerName,
          username: registerUsername,
          email: registerEmail,
          password: registerPassword,
        },
        { headers: { 'Content-Type': 'application/json' } }
      );

      setError(''); // Reset error message
      alert('Registration successful! Please log in.');
      navigate('/main/login'); // Redirect to login after successful registration
    } catch (err) {
      console.error("Registration error:", err.response ? err.response.data : err);
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'Registration failed! Please try again.');
      } else {
        setError('Registration failed! Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Render Login or Register form based on the route
  return (
    <div>
      <h1>Welcome! Please {location.pathname === '/main/login' ? 'Login' : 'Register'}</h1>

      {/* Login Form */}
      {location.pathname === '/main/login' && (
        <div>
          <h2>Login</h2>
          <form onSubmit={handleLoginSubmit}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
            <button type="submit">{loading ? 'Logging in...' : 'Login'}</button>
          </form>

          <p>
            Don't have an account? <span onClick={() => navigate('/main/register')} style={{ cursor: 'pointer', color: 'blue' }}>Register here</span>
          </p>
        </div>
      )}

      {/* Registration Form */}
      {location.pathname === '/main/register' && (
        <div>
          <h2>Register</h2>
          <form onSubmit={handleRegisterSubmit}>
            <input
              type="text"
              value={registerName}
              onChange={(e) => setRegisterName(e.target.value)}
              placeholder="Name"
              required
            />
            <input
              type="text"
              value={registerUsername}
              onChange={(e) => setRegisterUsername(e.target.value)}
              placeholder="Username"
              required
            />
            <input
              type="email"
              value={registerEmail}
              onChange={(e) => setRegisterEmail(e.target.value)}
              placeholder="Email"
              required
            />
            <input
              type="password"
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
              placeholder="Password"
              required
            />
            <button type="submit">{loading ? 'Registering...' : 'Register'}</button>
          </form>

          <p>
            Already have an account? <span onClick={() => navigate('/main/login')} style={{ cursor: 'pointer', color: 'blue' }}>Login here</span>
          </p>
        </div>
      )}

      {/* Error message */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default MainPage;
