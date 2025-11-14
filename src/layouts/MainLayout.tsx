import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false); // desktop collapse
  const [mobileOpen, setMobileOpen] = useState(false); // mobile sidebar

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((s) => !s)}
        mobileOpen={mobileOpen}
        onMobileToggle={() => setMobileOpen((o) => !o)}
      />

      {/* Main content */}
      <div
        className={`
          flex-1 flex flex-col transition-all duration-300
          ${collapsed ? 'ml-16' : 'ml-0'}
          lg:ml-0
        `}
      >
        <Header
          onToggle={() => setCollapsed((s) => !s)}
          onMobileToggle={() => setMobileOpen((o) => !o)}
        />

        {/* Add top padding for fixed Header */}
        <main className="pt-16 p-6 bg-gray-50 min-h-[calc(100vh-64px)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
