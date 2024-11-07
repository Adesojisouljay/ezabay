import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../api/auth';
import cat from "../assets/document_shape.webp";
import eth from "../assets/eth-icon.webp";
import './register.scss';
import Logo from "../assets/Ezabay-st-logo.png";
import { Loader } from '../components/loader/Loader';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';

const Register = () => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastname] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false)
      return;
    }

    try {
      const userData = { email, password, username, firstName, lastName };
      const resp = await registerUser(userData);
      console.log(resp);

      if (resp.success) {
        navigate("/login");
        setLoading(false)
      } else {
        setError(resp.message);
        setLoading(false)
      }
    } catch (error) {
      console.log('Error registering user:', error);
      setError('An unexpected error occurred');
      setLoading(false)
    }
  };

  return (
    <div className="register-container">
      <div className="reg-left">
      <h1 className="header-text">Register on Ezabay</h1>
        {loading && <Loader/>}
      <form onSubmit={handleSubmit}>
          <div className="reg-form-group">
            <label>First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter your first name"
              required
            />
          </div>
          <div className="reg-form-group">
            <label>Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastname(e.target.value)}
              placeholder="Enter your last name"
              required
            />
          </div>
          <div className="reg-form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="reg-form-group">
            <label>Username</label>
            <input
              className="yep"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>
          <div className="reg-form-group passwd">
            <label>Password</label>
            <input
              className="yep"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
           {!showPassword ? <FaRegEye 
              className='eye-icon' 
              size={20}
              onClick={() => setShowPassword(!showPassword)}
            /> :
            <FaRegEyeSlash 
              className='eye-icon' 
              size={20}
              onClick={() => setShowPassword(!showPassword)}
            />}
          </div>
          <div className="reg-form-group passwd">
            <label>Confirm Password</label>
            <input
              className="test"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
            />
            {!showConfirmPassword ? <FaRegEye 
              className='eye-icon' 
              size={20}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            /> :
            <FaRegEyeSlash 
              className='eye-icon' 
              size={20}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            />}
          </div>
          {error && <span>{error}</span>}
          <button
            style={{cursor: loading ? "not-allowed" : "pointer"}}
            className="btn-register" 
            type="submit"
            disabled={loading}
            >
              Register
            </button>
        </form>
        <div className="reg-link">
           <span>Already have an account? <Link className="login-span" to="/login">Login</Link></span>
        </div>
      </div>
      <div className="reg-right">
      <img src={Logo} alt="" />
      </div>
    </div>
  );
};

export default Register;
