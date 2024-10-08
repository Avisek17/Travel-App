
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LoginForm.css';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/user/login', {
        username,
        password,
      }, {
        withCredentials: true // Ensures cookies (like session ID) are included
      });
      
      if (response.status === 200 )  {
        sessionStorage.setItem('id', response.data.id); 
        localStorage.setItem('isAuthenticated', 'true');  // Set auth status in localStorage
        navigate('/');
      }
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label className="label">Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input"
          />
        </div>
        <div className="field">
          <label className="label">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
          />
        </div>
        <button type="submit" className="button is-primary">Login</button>
        {error && <p className="help is-danger">{error}</p>}
      </form>
    </div>
  );
};

export default LoginForm;
