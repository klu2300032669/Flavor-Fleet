import React, { useState, useEffect, useRef } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useAuth } from "../components/AuthContext";
import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
`;

const confetti = keyframes`
  0% { transform: translateY(0) rotate(0deg); opacity: 1; }
  100% { transform: translateY(-120px) rotate(360deg); opacity: 0; }
`;

const SuccessAnimation = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  text-align: center;
  animation: ${fadeIn} 0.6s ease-out;
  position: relative;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
`;

const SuccessIcon = styled.div`
  font-size: 4.5rem;
  color: #28a745;
  margin-bottom: 2rem;
  animation: bounce 1s ease-in-out;
  &::before {
    content: "✔";
    font-family: "Poppins", sans-serif;
    font-weight: 700;
  }
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-12px); }
  }
`;

const SuccessTitle = styled.h3`
  color: #333;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.8rem;
  background: linear-gradient(90deg, #28a745, #34c759);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const SuccessMessage = styled.p`
  color: #666;
  font-size: 1.2rem;
  margin-bottom: 0;
  font-weight: 500;
`;

const ConfettiParticle = styled.div`
  position: absolute;
  width: 12px;
  height: 12px;
  background: ${(props) => props.color};
  border-radius: 50%;
  animation: ${confetti} 1.8s ease-out forwards;
  top: ${(props) => props.top}%;
  left: ${(props) => props.left}%;
  animation-delay: ${(props) => props.delay}s;
`;

const OtpInputContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 1.5rem;
`;

const OtpInput = styled.input`
  width: 50px;
  height: 50px;
  text-align: center;
  font-size: 1.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  transition: all 0.3s ease;
  &:focus {
    border-color: #ff6f61;
    box-shadow: 0 0 0 3px rgba(255, 111, 97, 0.25);
    outline: none;
  }
`;

const ResendButton = styled.button`
  background: none;
  border: none;
  color: #ff6f61;
  font-size: 0.95rem;
  font-weight: 500;
  text-decoration: underline;
  cursor: pointer;
  transition: color 0.3s ease;
  &:hover {
    color: #ff4081;
  }
  &:disabled {
    color: #ccc;
    cursor: not-allowed;
  }
`;

const LoginModal = ({ onLoginSuccess }) => {
  const { login, signup, verifySignupOtp, forgotPassword, resetPassword } = useAuth();
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showSignupConfirmPassword, setShowSignupConfirmPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("login");
  const [resendCooldown, setResendCooldown] = useState(0);
  const otpRefs = useRef([]);

  const handleFocus = (e) => {
    e.target.placeholder = "";
  };

  const handleBlur = (e) => {
    if (e.target.value === "") {
      e.target.placeholder = e.target.getAttribute("data-placeholder");
    }
  };

  const resetForm = () => {
    setLoginEmail("");
    setLoginPassword("");
    setSignupName("");
    setSignupEmail("");
    setSignupPassword("");
    setSignupConfirmPassword("");
    setForgotEmail("");
    setOtp(["", "", "", "", "", ""]);
    setNewPassword("");
    setConfirmNewPassword("");
    setShowLoginPassword(false);
    setShowSignupPassword(false);
    setShowSignupConfirmPassword(false);
    setShowNewPassword(false);
    setShowConfirmNewPassword(false);
    setError("");
    setActiveTab("login");
    setResendCooldown(0);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!loginEmail || !loginPassword) {
      setError("Please enter both email and password");
      return;
    }
    setIsLoading(true);
    const { success, error: loginError } = await login(loginEmail, loginPassword);
    setIsLoading(false);
    if (success) {
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        resetForm();
        if (onLoginSuccess) onLoginSuccess();
        const modal = document.getElementById("loginModal");
        const modalInstance = bootstrap.Modal.getInstance(modal);
        if (modalInstance) {
          modalInstance.hide();
          setTimeout(() => window.location.reload(), 100);
        }
      }, 1800);
    } else {
      if (loginError === "User not found") {
        setError("User not found. Please check your email.");
      } else if (loginError === "Invalid credentials") {
        setError("Invalid password. Please try again.");
      } else {
        setError(loginError || "Login failed. Please try again.");
      }
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!signupName || !signupEmail || !signupPassword || !signupConfirmPassword) {
      setError("Please fill all fields");
      return;
    }
    if (signupPassword !== signupConfirmPassword) {
      setError("Passwords don't match");
      return;
    }
    setIsLoading(true);
    const { success, error: signupError } = await signup(signupName, signupEmail, signupPassword);
    setIsLoading(false);
    if (success) {
      setActiveTab("verify-signup");
      setResendCooldown(30);
    } else {
      setError(signupError || "Signup failed. Please try again.");
    }
  };

  const handleVerifySignupSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const otpValue = otp.join("");
    if (!otpValue) {
      setError("Please enter the OTP");
      return;
    }
    setIsLoading(true);
    const { success, error: verifyError } = await verifySignupOtp(signupEmail, otpValue);
    setIsLoading(false);
    if (success) {
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        resetForm();
        if (onLoginSuccess) onLoginSuccess();
        const modal = document.getElementById("loginModal");
        const modalInstance = bootstrap.Modal.getInstance(modal);
        if (modalInstance) {
          modalInstance.hide();
          setTimeout(() => window.location.reload(), 100);
        }
      }, 1800);
    } else {
      setError(verifyError || "Invalid OTP. Please try again.");
    }
  };

  const handleResendSignupOtp = async () => {
    setError("");
    setIsLoading(true);
    const { success, error: signupError } = await signup(signupName, signupEmail, signupPassword);
    setIsLoading(false);
    if (success) {
      setResendCooldown(30);
      setError("OTP resent successfully!");
    } else {
      setError(signupError || "Failed to resend OTP. Please try again.");
    }
  };

  const handleForgotPasswordClick = () => {
    setActiveTab("forgot");
    setError("");
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!forgotEmail) {
      setError("Please enter your email");
      return;
    }
    setIsLoading(true);
    const { success, error: forgotError } = await forgotPassword(forgotEmail);
    setIsLoading(false);
    if (success) {
      setActiveTab("reset");
      setResendCooldown(30);
    } else {
      setError(forgotError || "Failed to send OTP. Please try again.");
    }
  };

  const handleResendOtp = async () => {
    setError("");
    setIsLoading(true);
    const { success, error: forgotError } = await forgotPassword(forgotEmail);
    setIsLoading(false);
    if (success) {
      setResendCooldown(30);
      setError("OTP resent successfully!");
    } else {
      setError(forgotError || "Failed to resend OTP. Please try again.");
    }
  };

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      otpRefs.current[index + 1].focus();
    } else if (!value && index > 0) {
      otpRefs.current[index - 1].focus();
    }
  };

  const handleOtpPaste = (e) => {
    const paste = e.clipboardData.getData("text").slice(0, 6);
    if (!isNaN(paste)) {
      const newOtp = paste.split("").concat(Array(6).fill("")).slice(0, 6);
      setOtp(newOtp);
      otpRefs.current[5].focus();
    }
    e.preventDefault();
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const otpValue = otp.join("");
    if (!otpValue || !newPassword || !confirmNewPassword) {
      setError("Please fill all fields");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError("Passwords don't match");
      return;
    }
    setIsLoading(true);
    const { success, error: resetError } = await resetPassword(forgotEmail, otpValue, newPassword, confirmNewPassword);
    setIsLoading(false);
    if (success) {
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        resetForm();
        const modal = document.getElementById("loginModal");
        const modalInstance = bootstrap.Modal.getInstance(modal);
        if (modalInstance) {
          modalInstance.hide();
        }
      }, 1800);
    } else {
      setError(resetError || "Password reset failed. Please try again.");
    }
  };

  useEffect(() => {
    const modal = document.getElementById("loginModal");
    const handleModalHide = () => {
      resetForm();
      setShowSuccess(false);
      setIsLoading(false);
    };
    modal.addEventListener("hidden.bs.modal", handleModalHide);
    return () => modal.removeEventListener("hidden.bs.modal", handleModalHide);
  }, []);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [resendCooldown]);

  const confettiParticles = Array.from({ length: 25 }).map((_, i) => (
    <ConfettiParticle
      key={i}
      color={["#ff6f61", "#28a745", "#ffd740", "#34c759", "#ff4081"][Math.floor(Math.random() * 5)]}
      top={Math.random() * 100}
      left={Math.random() * 100}
      delay={Math.random() * 0.6}
    />
  ));

  return (
    <>
      <div
        className="modal fade"
        id="loginModal"
        tabIndex="-1"
        aria-labelledby="loginModalLabel"
        aria-hidden="true"
        data-bs-backdrop="static" // Prevents closing on backdrop click
        data-bs-keyboard="false" // Prevents closing with Escape key
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="loginModalLabel">
                Flavor Fleet
              </h5>
              <button
                type="button"
                className="btn-close btn-close-custom"
                data-bs-dismiss="modal"
                aria-label="Close"
                disabled={isLoading}
              ></button>
            </div>
            <div className="modal-body">
              {showSuccess ? (
                <SuccessAnimation>
                  {confettiParticles}
                  <SuccessIcon />
                  <SuccessTitle>Success!</SuccessTitle>
                  <SuccessMessage>Welcome aboard!</SuccessMessage>
                </SuccessAnimation>
              ) : (
                <>
                  {["login", "signup"].includes(activeTab) && (
                    <ul className="nav nav-tabs nav-justified mb-3" id="authTabs" role="tablist">
                      <li className="nav-item" role="presentation">
                        <button
                          className={`nav-link ${activeTab === "login" ? "active" : ""}`}
                          id="login-tab"
                          data-bs-toggle="tab"
                          data-bs-target="#login"
                          type="button"
                          role="tab"
                          aria-controls="login"
                          aria-selected={activeTab === "login"}
                          onClick={() => setActiveTab("login")}
                          disabled={isLoading}
                        >
                          Login
                        </button>
                      </li>
                      <li className="nav-item" role="presentation">
                        <button
                          className={`nav-link ${activeTab === "signup" ? "active" : ""}`}
                          id="signup-tab"
                          data-bs-toggle="tab"
                          data-bs-target="#signup"
                          type="button"
                          role="tab"
                          aria-controls="signup"
                          aria-selected={activeTab === "signup"}
                          onClick={() => setActiveTab("signup")}
                          disabled={isLoading}
                        >
                          Sign Up
                        </button>
                      </li>
                    </ul>
                  )}
                  {error && (
                    <div className="alert alert-danger" role="alert">
                      {error}
                    </div>
                  )}
                  <div className="tab-content" id="authTabsContent">
                    <div
                      className={`tab-pane fade ${activeTab === "login" ? "show active" : ""}`}
                      id="login"
                      role="tabpanel"
                      aria-labelledby="login-tab"
                    >
                      <form onSubmit={handleLoginSubmit}>
                        <div className="mb-3 position-relative">
                          <label htmlFor="loginEmail" className="form-label">
                            Email
                          </label>
                          <input
                            type="email"
                            className="form-control"
                            id="loginEmail"
                            placeholder="name@example.com"
                            data-placeholder="name@example.com"
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            required
                            disabled={isLoading}
                          />
                        </div>
                        <div className="mb-3 position-relative">
                          <label htmlFor="loginPassword" className="form-label">
                            Password
                          </label>
                          <input
                            type={showLoginPassword ? "text" : "password"}
                            className="form-control password-input"
                            id="loginPassword"
                            placeholder="Password"
                            data-placeholder="Password"
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            required
                            disabled={isLoading}
                          />
                          <span
                            className="password-toggle"
                            onClick={() => !isLoading && setShowLoginPassword(!showLoginPassword)}
                            aria-label={showLoginPassword ? "Hide password" : "Show password"}
                          >
                            {showLoginPassword ? <FiEyeOff /> : <FiEye />}
                          </span>
                        </div>
                        <div className="d-grid mb-2">
                          <button type="submit" className="btn btn-primary" disabled={isLoading}>
                            {isLoading ? (
                              <>
                                <span
                                  className="spinner-border spinner-border-sm me-2"
                                  role="status"
                                  aria-hidden="true"
                                ></span>
                                Logging in...
                              </>
                            ) : (
                              "Login"
                            )}
                          </button>
                        </div>
                        <div className="text-center">
                          <button
                            type="button"
                            className="text-warning btn btn-link"
                            onClick={handleForgotPasswordClick}
                            disabled={isLoading}
                          >
                            Forgot Password?
                          </button>
                        </div>
                        <hr className="my-3" />
                        <div className="text-center">
                          <p className="mb-2">Or login with:</p>
                          <button type="button" className="btn btn-outline-custom me-2" disabled={isLoading}>
                            <i className="fab fa-google"></i> Google
                          </button>
                          <button type="button" className="btn btn-outline-custom" disabled={isLoading}>
                            <i className="fab fa-facebook-f"></i> Facebook
                          </button>
                        </div>
                      </form>
                    </div>
                    <div
                      className={`tab-pane fade ${activeTab === "signup" ? "show active" : ""}`}
                      id="signup"
                      role="tabpanel"
                      aria-labelledby="signup-tab"
                    >
                      <form onSubmit={handleSignupSubmit}>
                        <div className="mb-3 position-relative">
                          <label htmlFor="signupName" className="form-label">
                            Name
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="signupName"
                            placeholder="Full Name"
                            data-placeholder="Full Name"
                            value={signupName}
                            onChange={(e) => setSignupName(e.target.value)}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            required
                            disabled={isLoading}
                          />
                        </div>
                        <div className="mb-3 position-relative">
                          <label htmlFor="signupEmail" className="form-label">
                            Email
                          </label>
                          <input
                            type="email"
                            className="form-control"
                            id="signupEmail"
                            placeholder="name@example.com"
                            data-placeholder="name@example.com"
                            value={signupEmail}
                            onChange={(e) => setSignupEmail(e.target.value)}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            required
                            disabled={isLoading}
                          />
                        </div>
                        <div className="mb-3 position-relative">
                          <label htmlFor="signupPassword" className="form-label">
                            Password
                          </label>
                          <input
                            type={showSignupPassword ? "text" : "password"}
                            className="form-control password-input"
                            id="signupPassword"
                            placeholder="Password"
                            data-placeholder="Password"
                            value={signupPassword}
                            onChange={(e) => setSignupPassword(e.target.value)}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            required
                            disabled={isLoading}
                          />
                          <span
                            className="password-toggle"
                            onClick={() => !isLoading && setShowSignupPassword(!showSignupPassword)}
                            aria-label={showSignupPassword ? "Hide password" : "Show password"}
                          >
                            {showSignupPassword ? <FiEyeOff /> : <FiEye />}
                          </span>
                        </div>
                        <div className="mb-3 position-relative">
                          <label htmlFor="signupConfirmPassword" className="form-label">
                            Confirm Password
                          </label>
                          <input
                            type={showSignupConfirmPassword ? "text" : "password"}
                            className="form-control password-input"
                            id="signupConfirmPassword"
                            placeholder="Confirm Password"
                            data-placeholder="Confirm Password"
                            value={signupConfirmPassword}
                            onChange={(e) => setSignupConfirmPassword(e.target.value)}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            required
                            disabled={isLoading}
                          />
                          <span
                            className="password-toggle"
                            onClick={() =>
                              !isLoading && setShowSignupConfirmPassword(!showSignupConfirmPassword)
                            }
                            aria-label={showSignupConfirmPassword ? "Hide password" : "Show password"}
                          >
                            {showSignupConfirmPassword ? <FiEyeOff /> : <FiEye />}
                          </span>
                        </div>
                        <div className="d-grid mb-2">
                          <button type="submit" className="btn btn-primary" disabled={isLoading}>
                            {isLoading ? (
                              <>
                                <span
                                  className="spinner-border spinner-border-sm me-2"
                                  role="status"
                                  aria-hidden="true"
                                ></span>
                                Signing up...
                              </>
                            ) : (
                              "Sign Up"
                            )}
                          </button>
                        </div>
                        <hr className="my-3" />
                        <div className="text-center">
                          <p className="mb-2">Or sign up with:</p>
                          <button type="button" className="btn btn-outline-custom me-2" disabled={isLoading}>
                            <i className="fab fa-google"></i> Google
                          </button>
                          <button type="button" className="btn btn-outline-custom" disabled={isLoading}>
                            <i className="fab fa-facebook-f"></i> Facebook
                          </button>
                        </div>
                      </form>
                    </div>
                    <div
                      className={`tab-pane fade ${activeTab === "verify-signup" ? "show active" : ""}`}
                      id="verify-signup"
                      role="tabpanel"
                      aria-labelledby="signup-tab"
                    >
                      <form onSubmit={handleVerifySignupSubmit}>
                        <div className="mb-3">
                          <label className="form-label">Enter OTP sent to {signupEmail}</label>
                          <OtpInputContainer>
                            {otp.map((digit, index) => (
                              <OtpInput
                                key={index}
                                type="text"
                                maxLength="1"
                                value={digit}
                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                onPaste={index === 0 ? handleOtpPaste : null}
                                ref={(el) => (otpRefs.current[index] = el)}
                                disabled={isLoading}
                                required
                              />
                            ))}
                          </OtpInputContainer>
                          <div className="text-center">
                            <ResendButton
                              onClick={handleResendSignupOtp}
                              disabled={isLoading || resendCooldown > 0}
                            >
                              {resendCooldown > 0 ? `Resend OTP (${resendCooldown}s)` : "Resend OTP"}
                            </ResendButton>
                          </div>
                        </div>
                        <div className="d-grid mb-2">
                          <button type="submit" className="btn btn-primary" disabled={isLoading}>
                            {isLoading ? (
                              <>
                                <span
                                  className="spinner-border spinner-border-sm me-2"
                                  role="status"
                                  aria-hidden="true"
                                ></span>
                                Verifying...
                              </>
                            ) : (
                              "Verify OTP"
                            )}
                          </button>
                        </div>
                        <div className="text-center">
                          <button
                            type="button"
                            className="text-warning btn btn-link"
                            onClick={() => setActiveTab("signup")}
                            disabled={isLoading}
                          >
                            Back to Sign Up
                          </button>
                        </div>
                      </form>
                    </div>
                    <div
                      className={`tab-pane fade ${activeTab === "forgot" ? "show active" : ""}`}
                      id="forgot"
                      role="tabpanel"
                      aria-labelledby="login-tab"
                    >
                      <form onSubmit={handleForgotPasswordSubmit}>
                        <div className="mb-3 position-relative">
                          <label htmlFor="forgotEmail" className="form-label">
                            Email
                          </label>
                          <input
                            type="email"
                            className="form-control"
                            id="forgotEmail"
                            placeholder="name@example.com"
                            data-placeholder="name@example.com"
                            value={forgotEmail}
                            onChange={(e) => setForgotEmail(e.target.value)}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            required
                            disabled={isLoading}
                          />
                        </div>
                        <div className="d-grid mb-2">
                          <button type="submit" className="btn btn-primary" disabled={isLoading}>
                            {isLoading ? (
                              <>
                                <span
                                  className="spinner-border spinner-border-sm me-2"
                                  role="status"
                                  aria-hidden="true"
                                ></span>
                                Sending OTP...
                              </>
                            ) : (
                              "Send OTP"
                            )}
                          </button>
                        </div>
                        <div className="text-center">
                          <button
                            type="button"
                            className="text-warning btn btn-link"
                            onClick={() => setActiveTab("login")}
                            disabled={isLoading}
                          >
                            Back to Login
                          </button>
                        </div>
                      </form>
                    </div>
                    <div
                      className={`tab-pane fade ${activeTab === "reset" ? "show active" : ""}`}
                      id="reset"
                      role="tabpanel"
                      aria-labelledby="login-tab"
                    >
                      <form onSubmit={handleResetPasswordSubmit}>
                        <div className="mb-3">
                          <label className="form-label">Enter OTP sent to {forgotEmail}</label>
                          <OtpInputContainer>
                            {otp.map((digit, index) => (
                              <OtpInput
                                key={index}
                                type="text"
                                maxLength="1"
                                value={digit}
                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                onPaste={index === 0 ? handleOtpPaste : null}
                                ref={(el) => (otpRefs.current[index] = el)}
                                disabled={isLoading}
                                required
                              />
                            ))}
                          </OtpInputContainer>
                          <div className="text-center">
                            <ResendButton
                              onClick={handleResendOtp}
                              disabled={isLoading || resendCooldown > 0}
                            >
                              {resendCooldown > 0 ? `Resend OTP (${resendCooldown}s)` : "Resend OTP"}
                            </ResendButton>
                          </div>
                        </div>
                        <div className="mb-3 position-relative">
                          <label htmlFor="newPassword" className="form-label">
                            New Password
                          </label>
                          <input
                            type={showNewPassword ? "text" : "password"}
                            className="form-control password-input"
                            id="newPassword"
                            placeholder="New Password"
                            data-placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            required
                            disabled={isLoading}
                          />
                          <span
                            className="password-toggle"
                            onClick={() => !isLoading && setShowNewPassword(!showNewPassword)}
                            aria-label={showNewPassword ? "Hide password" : "Show password"}
                          >
                            {showNewPassword ? <FiEyeOff /> : <FiEye />}
                          </span>
                        </div>
                        <div className="mb-3 position-relative">
                          <label htmlFor="confirmNewPassword" className="form-label">
                            Confirm New Password
                          </label>
                          <input
                            type={showConfirmNewPassword ? "text" : "password"}
                            className="form-control password-input"
                            id="confirmNewPassword"
                            placeholder="Confirm New Password"
                            data-placeholder="Confirm New Password"
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            required
                            disabled={isLoading}
                          />
                          <span
                            className="password-toggle"
                            onClick={() =>
                              !isLoading && setShowConfirmNewPassword(!showConfirmNewPassword)
                            }
                            aria-label={showConfirmNewPassword ? "Hide password" : "Show password"}
                          >
                            {showConfirmNewPassword ? <FiEyeOff /> : <FiEye />}
                          </span>
                        </div>
                        <div className="d-grid mb-2">
                          <button type="submit" className="btn btn-primary" disabled={isLoading}>
                            {isLoading ? (
                              <>
                                <span
                                  className="spinner-border spinner-border-sm me-2"
                                  role="status"
                                  aria-hidden="true"
                                ></span>
                                Resetting...
                              </>
                            ) : (
                              "Reset Password"
                            )}
                          </button>
                        </div>
                        <div className="text-center">
                          <button
                            type="button"
                            className="text-warning btn btn-link"
                            onClick={() => setActiveTab("login")}
                            disabled={isLoading}
                          >
                            Back to Login
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <style>{`
        #loginModal .modal-dialog {
          max-width: 450px;
        }
        #loginModal .modal-content {
          background: linear-gradient(135deg, #ffffff 0%, #fef8f5 100%);
          border-radius: 30px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
          border: none;
          overflow: hidden;
          font-family: "Poppins", sans-serif;
          animation: modalFadeIn 0.4s ease-out;
        }
        #loginModal .modal-header {
          background: linear-gradient(90deg, #ff6f61 0%, #ff4081 100%);
          color: #fff;
          border-bottom: none;
          padding: 1.5rem 2rem;
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        #loginModal .modal-title {
          font-size: 2rem;
          font-weight: 700;
          letter-spacing: 1.2px;
          text-shadow: 0 3px 15px rgba(0, 0, 0, 0.2);
          margin: 0;
        }
        #loginModal .btn-close-custom {
          background: rgba(255, 255, 255, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.5);
          border-radius: 50%;
          width: 32px;
          height: 32px;
          padding: 0;
          position: absolute;
          right: 1.5rem;
          top: 1.5rem;
          opacity: 1;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        #loginModal .btn-close-custom::before,
        #loginModal .btn-close-custom::after {
          content: "";
          position: absolute;
          width: 18px;
          height: 2px;
          background: #fff;
          transition: all 0.3s ease;
        }
        #loginModal .btn-close-custom::before {
          transform: rotate(45deg);
        }
        #loginModal .btn-close-custom::after {
          transform: rotate(-45deg);
        }
        #loginModal .btn-close-custom:hover {
          background: rgba(255, 255, 255, 0.4);
          transform: rotate(90deg);
          border-color: rgba(255, 255, 255, 0.7);
        }
        #loginModal .modal-body {
          padding: 2.5rem;
        }
        #loginModal .nav-tabs {
          background: rgba(255, 255, 255, 0.98);
          border-radius: 50px;
          padding: 0.6rem;
          box-shadow: 0 6px 25px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 111, 97, 0.25);
        }
        #loginModal .nav-link {
          color: #555;
          font-size: 1.2rem;
          font-weight: 600;
          padding: 0.8rem 2rem;
          border-radius: 50px;
          transition: all 0.3s ease;
        }
        #loginModal .nav-link:hover {
          color: #ff6f61;
          background: rgba(255, 111, 97, 0.15);
        }
        #loginModal .nav-link.active {
          background: #ff6f61;
          color: #fff;
          box-shadow: 0 6px 25px rgba(255, 111, 97, 0.4);
        }
        #loginModal .form-label {
          font-size: 1rem;
          font-weight: 500;
          color: #333;
          margin-bottom: 0.6rem;
        }
        #loginModal .form-control {
          border-radius: 20px;
          border: 1px solid #e0e0e0;
          padding: 0.9rem 2.5rem 0.9rem 1.5rem;
          font-size: 1.1rem;
          color: #333;
          background: #fff;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
        }
        #loginModal .form-control:focus {
          border-color: #ff6f61;
          box-shadow: 0 0 0 5px rgba(255, 111, 97, 0.25);
          outline: none;
        }
        #loginModal .form-control::placeholder {
          color: #bbb;
          font-weight: 400;
        }
        #loginModal .position-relative {
          position: relative;
        }
        #loginModal .password-toggle {
          position: absolute;
          right: 1.2rem;
          top: calc(60% + 0.6rem);
          transform: translateY(-50%);
          cursor: pointer;
          color: #888;
          font-size: 1.3rem;
          transition: color 0.3s ease;
        }
        #loginModal .password-toggle:hover {
          color: #ff6f61;
        }
        #loginModal .btn-primary {
          background: linear-gradient(45deg, #ff6f61, #ff4081);
          border: none;
          border-radius: 50px;
          padding: 1rem 2rem;
          font-size: 1.2rem;
          font-weight: 600;
          text-transform: uppercase;
          transition: all 0.4s ease;
          box-shadow: 0 10px 30px rgba(255, 111, 97, 0.35);
        }
        #loginModal .btn-primary:hover {
          background: linear-gradient(45deg, #ff4081, #ff2e1f);
          transform: translateY(-3px);
          box-shadow: 0 12px 35px rgba(255, 111, 97, 0.45);
        }
        #loginModal .text-warning {
          color: #ffca28 !important;
          font-size: 0.95rem;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.3s ease;
        }
        #loginModal .text-warning:hover {
          color: #ffb300 !important;
          text-decoration: underline;
        }
        #loginModal hr {
          border-color: rgba(0, 0, 0, 0.15);
          margin: 2rem 0;
        }
        #loginModal .text-center p {
          color: #666;
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }
        #loginModal .btn-outline-custom {
          border-radius: 50px;
          border: 1px solid #e0e0e0;
          color: #444;
          font-size: 1.1rem;
          font-weight: 500;
          padding: 0.8rem 2rem;
          background: #fff;
          transition: all 0.3s ease;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.05);
        }
        #loginModal .btn-outline-custom:hover {
          background: linear-gradient(45deg, #ff6f61, #ff4081);
          color: #fff;
          border-color: #ff6f61;
          box-shadow: 0 10px 25px rgba(255, 111, 97, 0.35);
          transform: translateY(-3px);
        }
        #loginModal .btn-outline-custom i {
          margin-right: 0.7rem;
          font-size: 1.3rem;
          vertical-align: middle;
        }
        @keyframes modalFadeIn {
          from { opacity: 0; transform: scale(0.97); }
          to { opacity: 1; transform: scale(1); }
        }
        @media (max-width: 576px) {
          #loginModal .modal-dialog {
            margin: 1.2rem;
            max-width: 95%;
          }
          #loginModal .modal-content {
            border-radius: 25px;
          }
          #loginModal .modal-header {
            padding: 1.2rem 1.8rem;
          }
          #loginModal .modal-title {
            font-size: 1.8rem;
          }
          #loginModal .modal-body {
            padding: 2rem;
          }
          #loginModal .nav-tabs {
            margin-bottom: 2rem;
          }
          #loginModal .nav-link {
            font-size: 1.1rem;
            padding: 0.7rem 1.8rem;
          }
          #loginModal .form-label {
            font-size: 0.95rem;
            margin-bottom: 0.5rem;
          }
          #loginModal .form-control {
            font-size: 1rem;
            padding: 0.8rem 2.2rem 0.8rem 1.2rem;
            height: 48px;
          }
          #loginModal .password-toggle {
            font-size: 1.2rem;
            right: 1.2rem;
            top: 70%;
          }
          #loginModal .btn-primary {
            font-size: 1.1rem;
            padding: 0.9rem 1.8rem;
          }
          #loginModal .btn-outline-custom {
            font-size: 1rem;
            padding: 0.7rem 1.8rem;
            margin: 0 0.4rem;
          }
          #loginModal .text-warning {
            font-size: 0.9rem;
          }
          #loginModal .text-center p {
            font-size: 0.95rem;
            margin-bottom: 0.8rem;
          }
          #loginModal hr {
            margin: 1.5rem 0;
          }
        }
      `}</style>
    </>
  );
};

export default LoginModal;