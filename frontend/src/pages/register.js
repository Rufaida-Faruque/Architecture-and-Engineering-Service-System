

import React, { useState, useEffect } from 'react';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('sp');
  const [error, setError] = useState('');

  // Add 'register-page' class to body when this page is loaded
  useEffect(() => {
    document.body.classList.add('register-page');

    // Clean up by removing the class when the component is unmounted
    return () => {
      document.body.classList.remove('register-page');
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role }),
    });

    const data = await response.json();

    if (response.status === 201) {
      alert('Registration successful!');
      window.location.href = '/login';  // Redirect to login page after successful registration
    } else {
      setError(data.message);
    }
  };

  return (
    <div className="register-container">
      <h1 className="register-title">Register</h1>
      <form onSubmit={handleSubmit} className="register-form">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="register-input"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="register-input"
        />
        <select value={role} onChange={(e) => setRole(e.target.value)} required className="register-input">
          <option value="sp">Service Provider</option>
          <option value="cl">Client</option>
          <option value="adm">Admin</option>
        </select>
        <button type="submit" className="register-button">Register</button>
      </form>
      {error && <p className="error-message">{error}</p>}

      {/* Add the "Already have an account?" section here */}
      <p className="login-link">
        Already have an account? <a href="/login">Login here</a>
      </p>
    </div>
  );
};

export default RegisterPage;
