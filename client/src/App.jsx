import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Info from './pages/Info';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import BookDetails from './pages/BookDetails';
import './index.css';

function App() {
  const [isAdmin, setIsAdmin] = useState(!!localStorage.getItem('token'));
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <Router>
      <div className="flex min-h-screen bg-slate-925">
        {/* Sidebar Backdrop for Mobile */}
        <div
          className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] cursor-pointer transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
          onClick={() => setIsSidebarOpen(false)}
        />

        <Sidebar
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          isAdmin={isAdmin}
          setIsAdmin={setIsAdmin}
        />

        {/* Mobile Header */}
        <div className="lg:hidden fixed top-0 w-full h-[70px] px-6 flex items-center justify-between glass z-[100] border-b border-white/10">
          <h2 className="text-2xl font-outfit text-indigo-500 font-bold tracking-tight">Buku.</h2>
          <button
            onClick={toggleSidebar}
            className="p-2.5 rounded-xl glass text-white active:scale-95 transition-all"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>

        <main className="flex-1 w-full max-w-[1600px] lg:ml-[280px] p-6 sm:p-10 pt-[110px] lg:pt-16 transition-all duration-300">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/genre/:id" element={<Home />} />
            <Route path="/book/:id" element={<BookDetails />} />
            <Route path="/info" element={<Info />} />
            <Route path="/admin/login" element={isAdmin ? <Navigate to="/admin/dashboard" /> : <AdminLogin setIsAdmin={setIsAdmin} />} />
            <Route path="/admin/dashboard" element={isAdmin ? <AdminDashboard /> : <Navigate to="/admin/login" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
