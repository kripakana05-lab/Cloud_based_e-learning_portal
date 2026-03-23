import React from 'react';
import AdminSidebar from './AdminSidebar';
import Navbar from './Navbar'; // Keep Navbar for top bar info if needed, or just sidebar

const AdminLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-50/50">
      <AdminSidebar />
      <div className="flex-grow flex flex-col">
        {/* We can keep the top Navbar but maybe simplify it for Admin */}
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
