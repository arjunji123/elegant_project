import React, { useState, useRef, useEffect } from 'react';
import { FiBell, FiSearch } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useProduct } from '@/context/ProductContext';

export default function Header({ onToggle }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { setSignIn, setToken, adminName } = useProduct();
const userName = localStorage.getItem('name');
  // Close dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = () => {
    // Clear auth token & state
    localStorage.removeItem('aushToken');
    setToken(null);
    setSignIn(false);
    navigate('/signin');
  };
const getInitials = (text) => {
  if (!text) return '';
  return text
    .split(' ')                       // split by spaces
    .map(word => word[0]?.toUpperCase()) // take first letter uppercased
    .join('');                       // join without delimiter
};
  return (
    <header className="flex items-center justify-between p-4 border-b bg-white right-0" style={{ zIndex: 30 }}>
      <div className="flex items-center gap-4">
        {/* <button onClick={onToggle} className="md:hidden p-2 rounded hover:bg-gray-100">
          ☰
        </button> */}
        <h1 className="text-xl font-semibold">Hi, Welcome back 👋</h1>
      </div>

      <div className="flex items-center gap-4">
        {/* <div className="relative">
          <input placeholder="Search..." className="border rounded-md px-3 py-1 w-60" />
          <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div> */}
        <button className="p-2 rounded-full bg-gray-100">
          <FiBell />
        </button>

        {/* Avatar and dropdown container */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(prev => !prev)}
            className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center focus:outline-none"
            aria-haspopup="true"
            aria-expanded={menuOpen}
          >
           {getInitials(userName)}
          </button>

          {/* Dropdown menu */}
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow-lg z-50">
              <button
                onClick={handleSignOut}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100 rounded"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
