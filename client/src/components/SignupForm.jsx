import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
 import { createUser } from '../services/api';
import './SigninForm.css';

const SignupForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: ''
  });

  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      username: '',
      email: '',
      password: ''
    };

    if (!formData.username) {
      newErrors.username = 'Username is required';
      valid = false;
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is not valid';
      valid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await createUser(formData);
        setMessage('User created successfully');
        // Redirect to the home page upon successful signup
        navigate('/login');
      } catch (error) {
        setMessage('Signup failed');
      }
    }
  };

  return (
    <div className="sign-in-container">
      <h2 className="sign-in-title">Sign Up</h2>
      <form className="sign-in-form" onSubmit={handleSubmit}>
        <div className="field">
          <label className="label">Username</label>
          <div className="control">
            <input
              type="text"
              className={`input ${errors.username && 'is-danger'}`}
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
            />
            {errors.username && <p className="help is-danger">{errors.username}</p>}
          </div>
        </div>
        <div className="field">
          <label className="label">Email</label>
          <div className="control">
            <input
              type="email"
              className={`input ${errors.email && 'is-danger'}`}
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
            {errors.email && <p className="help is-danger">{errors.email}</p>}
          </div>
        </div>
        <div className="field">
          <label className="label">Password</label>
          <div className="control">
            <input
              type="password"
              className={`input ${errors.password && 'is-danger'}`}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
            {errors.password && <p className="help is-danger">{errors.password}</p>}
          </div>
        </div>
        <div className="field">
          <div className="control">
            <button type="submit" className="button is-primary">Sign Up</button>
          </div>
        </div>
        {message && <p className="message">{message}</p>}
      </form>
    </div>
  );
};

export default SignupForm;