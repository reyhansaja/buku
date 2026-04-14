import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Book, Info, Download, ChevronDown, LogOut, LayoutDashboard, ChevronRight } from 'lucide-react';
import axios from 'axios';

const Sidebar = ({ isOpen, setIsOpen, isAdmin, setIsAdmin }) => {
  const [genres, setGenres] = useState([]);
  const [isGenresOpen, setIsGenresOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchGenres();
  }, []);

  const fetchGenres = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/genres');
      setGenres(res.data);
    } catch (err) {
      console.error("Error fetching genres", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAdmin(false);
    navigate('/');
  };

  const navItems = [
    { name: 'Home', path: '/', icon: Book },
    { name: 'Info', path: '/info', icon: Info },
    // { name: 'Downloads', path: '/downloads', icon: Download },
  ];

  return (
    <div className={`fixed inset-y-0 left-0 z-[120] w-[280px] p-6 flex flex-col glass border-r border-white/10 transition-transform duration-500 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="mb-10">
        <h1 className="text-3xl font-outfit text-indigo-500 font-bold tracking-tight">Buku.</h1>
        <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mt-1">Premium Library</p>
      </div>

      <nav className="flex-1">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link 
                to={item.path} 
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 p-3 rounded-xl text-slate-400 transition-all hover:bg-white/5 hover:text-white ${location.pathname === item.path ? 'bg-indigo-500/10 text-indigo-400 border-l-4 border-indigo-500' : ''}`}
              >
                <item.icon size={20} />
                <span className="font-medium text-[0.95rem]">{item.name}</span>
              </Link>
            </li>
          ))}

          {/* Genres Dropdown */}
          <li>
            <div 
              className={`flex items-center gap-3 p-3 rounded-xl text-slate-400 transition-all hover:bg-white/5 hover:text-white cursor-pointer justify-between ${isGenresOpen ? 'bg-white/5' : ''}`} 
              onClick={() => setIsGenresOpen(!isGenresOpen)}
            >
              <div className="flex items-center gap-3">
                <Book size={20} />
                <span className="font-medium text-[0.95rem]">Genres</span>
              </div>
              <ChevronDown size={16} className={`transition-transform duration-300 ${isGenresOpen ? 'rotate-180' : ''}`} />
            </div>
            
            <div className={`overflow-hidden transition-all duration-300 pl-6 ${isGenresOpen ? 'max-h-[400px] mt-2' : 'max-h-0'}`}>
              <div className="space-y-1">
                {genres.map(genre => (
                  <Link 
                    key={genre.id} 
                    to={`/genre/${genre.id}`}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-2 py-2 px-3 text-[0.85rem] transition-colors hover:text-indigo-400 ${location.pathname === `/genre/${genre.id}` ? 'text-indigo-400 font-semibold' : 'text-slate-500'}`}
                  >
                    <ChevronRight size={14} />
                    {genre.name}
                  </Link>
                ))}
              </div>
            </div>
          </li>
        </ul>
      </nav>

      <div className="mt-10 pt-6 border-t border-white/10">
        {isAdmin ? (
          <div className="space-y-2">
            <Link to="/admin/dashboard" onClick={() => setIsOpen(false)} className={`flex items-center gap-3 p-3 rounded-xl text-slate-400 transition-all hover:bg-white/5 hover:text-white ${location.pathname === '/admin/dashboard' ? 'bg-indigo-500/10 text-indigo-400 border-l-4 border-indigo-500' : ''}`}>
              <LayoutDashboard size={20} />
              <span className="font-medium text-[0.95rem]">Dashboard</span>
            </Link>
            <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500/10 text-red-500 font-semibold transition-all hover:bg-red-500/20 active:scale-95">
              <LogOut size={18} /> Logout
            </button>
          </div>
        ) : (
          <Link to="/admin/login" onClick={() => setIsOpen(false)} className={`flex items-center gap-3 p-3 rounded-xl text-slate-400 transition-all hover:bg-white/5 hover:text-white ${location.pathname === '/admin/login' ? 'bg-indigo-500/10 text-indigo-400 border-l-4 border-indigo-500' : ''}`}>
            <LogOut size={20} />
            <span className="font-medium text-[0.95rem]">Admin Login</span>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
