import React, { useState, useRef, useEffect } from 'react';
import { FiBell, FiSearch, FiMenu } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useProduct } from '@/context/ProductContext';

export default function Header({ onToggle }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { setSignIn, setToken, adminName } = useProduct();
  const userName = localStorage.getItem('name');

  // Close dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = event => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
        setSearchOpen(false);
      }
    };
    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    setToken(null);
    setSignIn(false);
    navigate('/signin');
  };

  const getInitials = text => {
    if (!text) return '';
    return text
      .split(' ')
      .map(word => word[0]?.toUpperCase())
      .join('');
  };

  return (
    <header className="flex flex-wrap items-center justify-between p-4 border-b bg-white fixed w-full top-0 z-30">
      <div className="flex items-center gap-4 flex-shrink-0">
        {/* Optional hamburger for sidebar toggle - show only on small screens */}
        {onToggle && (
          <button
            onClick={onToggle}
            className="md:hidden p-2 rounded hover:bg-gray-100 mr-2"
            aria-label="Toggle sidebar"
          >
            <FiMenu size={24} />
          </button>
        )}
        <h1 className="text-xl font-semibold whitespace-nowrap">Hi, Welcome back 👋</h1>
      </div>

      {/* Search Bar: full input on md+, icon toggles on mobile */}
      <div className="flex items-center flex-grow max-w-full md:max-w-xs relative">
        <input
          type="text"
          placeholder="Search..."
          className={`border rounded-md px-3 py-1 w-full transition-all duration-200
            ${searchOpen ? 'block absolute left-0 right-0 top-full mt-1 z-40 bg-white' : 'hidden md:block'}
          `}
        />
        <FiSearch
          className="text-gray-400 cursor-pointer md:hidden"
          size={20}
          onClick={() => setSearchOpen(prev => !prev)}
        />
      </div>

      <div className="flex items-center gap-4 flex-shrink-0 mt-2 md:mt-0">
        <button
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
          aria-label="Notifications"
        >
          <FiBell size={20} />
        </button>

        {/* Avatar and dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(prev => !prev)}
            className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center focus:outline-none"
            aria-haspopup="true"
            aria-expanded={menuOpen}
          >
            {getInitials(userName)}
          </button>

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
