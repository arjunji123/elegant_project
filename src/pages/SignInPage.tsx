import { useProduct } from '@/context/ProductContext';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignInPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { setSignIn, setToken ,setAdminName} = useProduct();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to login');
      }

      const data = await res.json();
      const token = data.token;
      if (data.success) {
        // Save token in localStorage or context
        localStorage.setItem('authToken', token);
        localStorage.setItem('name', data.user.name);

        setSignIn(true); 
        console.log("Login successful, token:", token,data);
        navigate('/dashboard');   // redirect to protected page or dashboard
      } else {
        throw new Error('Login response missing token');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-blue-50">
      <div className="bg-white shadow-xl rounded-3xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-2">Sign in</h2>
        <p className="text-gray-500 text-center mb-6">
          Don't have an account?{' '}
          <a href="/register" className="text-blue-600 font-medium hover:underline">
            Get started
          </a>
        </p>

        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
          <input
            type="email"
            className="w-full mb-5 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400"
            placeholder="hello@gmail.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoFocus
            required
          />

          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-medium text-gray-700">Password</label>
            <a href="/forgot" className="text-sm text-gray-500 hover:underline">
              Forgot password?
            </a>
          </div>
          <div className="relative mb-6">
            <input
              type="password"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <span className="absolute right-4 top-3 text-gray-400 cursor-pointer">
              {/* eye icon SVG here if you want toggle */}
            </span>
          </div>

          {error && <p className="mb-4 text-red-600">{error}</p>}

          <button
            type="submit"
            className="w-full py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 shadow transition mb-2"
          >
            Sign in
          </button>
        </form>

        {/* Your existing divider & social login buttons */}

      </div>
    </div>
  );
};

export default SignInPage;
