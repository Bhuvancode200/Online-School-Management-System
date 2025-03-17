import React, { useState } from 'react';

import './Assets/LoginRegister.css'

function LoginRegister() {
  // State to toggle between login and registration form
  const [isLogin, setIsLogin] = useState(true);

  // Handlers for form submissions
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    // Logic for handling login submission
    console.log('Login submitted');
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    // Logic for handling registration submission
    console.log('Register submitted');
  };

  return (
    <div className="App">
      <div className="form-container">
        {/* Toggle between Login and Register forms */}
        <div className="toggle-buttons">
          <button
            className={`toggle-button ${isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={`toggle-button ${!isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(false)}
          >
            Register
          </button>
        </div>

        {/* Login Form */}
        {isLogin ? (
          <form className="form" onSubmit={handleLoginSubmit}>
            <h2>Login</h2>
            <div className="input-group">
              <label>Email:</label>
             <input type="email" placeholder="Email" required />
            </div>
            <div className="input-group">
              <label>Password:</label>
              <input type="password" placeholder="Password" required />
            </div>
            <button type="submit">Login</button>
          </form>
        ) : ( 
          // Register Form
          <form className="form" onSubmit={handleRegisterSubmit}>
            <h2>Register</h2>
            <div className="input-group">
              <label>Name:</label>
              <input type="text" placeholder="Name" required />
            </div>
            <div className="input-group">
              <label>Email:</label>
              <input type="email" placeholder="Email" required />
            </div>
            <div className="input-group">
              <label>Password:</label>
              <input type="password" placeholder="Password" required />
            </div>
            <div className="input-group">
              <label>Confirm Password:</label>
              <input type="password" placeholder="Confirm Password" required />
            </div>
            <button type="submit">Register</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default LoginRegister;
