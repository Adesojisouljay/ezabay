import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { loginUser } from "../api/auth";
import { loginStart, loginSuccess, loginFailure } from "../redux/userReducer";
import { isTokenValid } from "../utils";
import Logo from "../assets/Ezabay-st-logo.png";
import Secure from "../assets/icons8-secure-64.png"
import Google from "../assets/google-1.jfif"
import { Loader } from "../components/loader/Loader";
import cat from "../assets/document_shape.webp";
import eth from "../assets/eth-icon.webp";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { PasswordReset } from "../components/modal/PasswordReset";
import "./login.scss";

const Login = () => {
  const [password, setPassword] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false)
  const [openPasswordResetModal, setOpenPasswordResetModal] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const global = useSelector((state) => state);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (isTokenValid(token) && global.ekzaUser.user) {
      navigate("/dashboard");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userData = {
        password,
        identifier,
      };

      dispatch(loginStart());

      const response = await loginUser(userData);
      if (response && response?.data?.success) {
        dispatch(loginSuccess(response.data));

        window.location.href = "/dashboard";
        setLoading(false);
      } else {
        setError(response?.response.data?.message);
        dispatch(loginFailure("Invalid email or password"));
        setLoading(false);
      }
    } catch (error) {
      console.log(error)
      setLoading(false);
      dispatch(loginFailure("An error occurred. Please try again later."));
    }
  };

  const openPassword = () => {
    setOpenPasswordResetModal(true)
}

const closePassword = () => {
    setOpenPasswordResetModal(false)
}

  return (
    <div className="login-container">
      <div className="login-left">
        <img src={Logo} alt="" />
      </div>
      <div className="login-right">
      <div className="sign-in-wrap">
        <h1 className="header-text">Sign in to Ezabay</h1>
        <div className="caution-wrap">
          <img src={Secure} alt="" /> <span>Always verify that you are on <span className="securelink">ezabay.com</span></span>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="login-form-group">
            {/* <label>Email</label> */}
            <input
              type={"email" | "text"}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="login-form-group passwd">
            {/* <label>Password</label> */}
            <input
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
          {error && <p className="error-message">{error}</p>}
          <div className="Forget-Password-wrap">
          <span onClick={openPassword}>Forgot Password</span>
        </div>
          <button
            style={{ cursor: loading && "not-allowed" }}
            className="btn-login"
            disabled={loading}
            type="submit"
          >
            Login
          </button>
        </form>
        
        <div className="or-wrap">
        <div class="or-divider">
            <span>or</span>
        </div>
        </div>
        <div className="google-wrap">
            <div className="google-svg-wrap"><svg viewBox="0 0 32 32" fill="none" class="h-8 w-8 object-contain"><path fill-rule="evenodd" clip-rule="evenodd" d="M28.4388 16.7516C28.4388 15.8675 28.3594 15.0173 28.2121 14.2012H16.4688V19.0243H23.1792C22.8902 20.5829 22.0117 21.9035 20.6911 22.7876V25.9162H24.7208C27.0786 23.7455 28.4388 20.5489 28.4388 16.7516Z" fill="#4285F4" fill-opacity="1"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M16.4683 28.9376C19.8348 28.9376 22.6573 27.8211 24.7203 25.9168L20.6906 22.7882C19.5741 23.5364 18.1459 23.9784 16.4683 23.9784C13.2207 23.9784 10.4719 21.7851 9.4914 18.8379H5.32568V22.0684C7.37737 26.1435 11.5941 28.9376 16.4683 28.9376Z" fill="#34A853" fill-opacity="1"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M9.49194 18.8378C9.24256 18.0897 9.10087 17.2906 9.10087 16.4688C9.10087 15.647 9.24256 14.8478 9.49194 14.0997V10.8691H5.32623C4.48175 12.5524 4 14.4568 4 16.4688C4 18.4808 4.48175 20.3851 5.32623 22.0684L9.49194 18.8378Z" fill="#FBBC05" fill-opacity="1"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M16.4683 8.95918C18.2989 8.95918 19.9425 9.58829 21.2347 10.8238L24.811 7.24755C22.6516 5.23554 19.8292 4 16.4683 4C11.5941 4 7.37737 6.79414 5.32568 10.8692L9.4914 14.0997C10.4719 11.1526 13.2207 8.95918 16.4683 8.95918Z" fill="#EA4335" fill-opacity="1"></path></svg></div>
             <span>Sign in with Google</span><span className="coming-soon"> Soon</span>
        </div>
        <div className="reg-link">
          <span>
            Dont't have an account?{" "}
            <Link className="reg-link-reg" to="/register">
              Register
            </Link>
          </span>
        </div>
      </div>
      </div>

      {openPasswordResetModal && 
        <PasswordReset 
          isOpen={openPasswordResetModal} 
          onClose={closePassword}
          // propsEmail={email}
        />}
    </div>
  );
};

export default Login;
