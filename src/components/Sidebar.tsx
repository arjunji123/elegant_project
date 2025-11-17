import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FiHome, FiUser, FiBox, FiEdit3, FiList, FiMenu, FiX, FiFolder, FiLayers } from 'react-icons/fi';

const menu = [
  { path: '/', label: 'Dashboard', icon: <FiHome /> },
  { path: '/users', label: 'User', icon: <FiUser /> },
  { path: '/products', label: 'Product', icon: <FiBox /> },
  { path: '/categories', label: 'Categories', icon: <FiFolder /> },
  { path: '/sub-categories', label: 'SubCategories', icon: <FiLayers /> },
  { path: '/orders', label: 'Orders', icon: <FiList /> },
];

export default function Sidebar({ collapsed = false, onToggle, mobileOpen, onMobileToggle }) {
  const location = useLocation();

  // Close mobile sidebar on outside click
  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const isActiveMenu = (path) => {
    if (path === '/products') return location.pathname === '/products' || location.pathname === '/add-product';
    if (path === '/categories') return location.pathname === '/categories' || location.pathname === '/add-categories';
    if (path === '/sub-categories') return location.pathname === '/sub-categories' || location.pathname === '/add-sub-categories';
    return location.pathname === path;
  };

  return (
    <>
      {/* Overlay for mobile */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-30 lg:hidden" onClick={onMobileToggle} aria-hidden="true" />
      )}

      <aside
 className={`
  fixed top-0 left-0 h-full bg-white border-r z-40
  transition-all duration-300
  ${mobileOpen ? 'translate-x-0 w-60' : '-translate-x-full w-60'}
  ${collapsed ? 'lg:w-16' : 'lg:w-60'}
  lg:translate-x-0 lg:static
`}
// className={`
//   fixed top-0 left-0 h-full bg-white border-r z-40
//   transition-all duration-300
//   ${mobileOpen ? 'translate-x-0 w-60' : '-translate-x-full w-60'}
//   ${collapsed ? 'lg:w-16' : 'lg:w-20'}
//   lg:translate-x-0 lg:static
// `}
        aria-label="Sidebar navigation"
      >
        {/* Mobile close button */}
        {mobileOpen && (
          <button
            className="absolute top-4 right-4 z-50 bg-gray-300 rounded-full w-8 h-8 flex items-center justify-center text-xl font-bold"
            onClick={onMobileToggle}
            aria-label="Close sidebar"
          >
            <FiX />
          </button>
        )}

        {/* Logo */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">E</div>
            {!collapsed && <div className="text-lg font-semibold">Elegent</div>}
          </div>

          {/* Collapse button for desktop */}
          <button onClick={onToggle} className="lg:block hidden p-1 rounded hover:bg-gray-100">
            {collapsed ? '→' : '←'}
          </button>
        </div>

        {/* Menu items */}
        <nav className="mt-4 px-2 flex flex-col gap-1" role="menu">
          {menu.map(m => (
            <NavLink
              key={m.path}
              to={m.path}
              end={m.path === '/'}
              className={() =>
                `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors
                ${isActiveMenu(m.path) ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`
              }
              role="menuitem"
            >
              <div className="text-lg">{m.icon}</div>
              {!collapsed && <span className="font-medium">{m.label}</span>}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Mobile toggle button */}
      {!mobileOpen && (
        <button
          type="button"
          className="fixed top-4 left-4 z-50 p-2 rounded bg-white shadow-lg lg:hidden"
          aria-label="Toggle sidebar"
          onClick={onMobileToggle}
        >
          <FiMenu />
        </button>
      )}
    </>
  );
}
