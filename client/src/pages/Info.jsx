import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Mail, Globe, BookOpen } from 'lucide-react';

const Info = () => {
  const [info, setInfo] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInfo();
  }, []);

  const fetchInfo = async () => {
    try {
      const res = await axios.get('https://api.portorey.my.id/api/info');
      setInfo(res.data);
    } catch (err) {
      console.error("Error fetching info", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade max-w-4xl mx-auto">
      <header className="mb-12 text-center">
        <h1 className="text-5xl font-bold tracking-tighter mb-4 whitespace-nowrap overflow-hidden text-ellipsis">
          {info.site_title || 'Buku Library'}
        </h1>
        <div className="w-24 h-1.5 bg-indigo-500 mx-auto rounded-full"></div>
      </header>

      <div className="glass p-8 sm:p-12 rounded-[2.5rem] mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 tracking-tight">
          <BookOpen className="text-indigo-400" /> About Our Library
        </h2>
        <p className="text-slate-400 text-lg leading-relaxed whitespace-pre-wrap font-medium">
          {info.about_us || 'Experience the future of digital reading with our curated collection of premium e-books.'}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-6">
        <div className="glass p-8 rounded-3xl flex-1 flex flex-col items-center text-center group hover:bg-indigo-500/5 transition-all">
          <div className="bg-indigo-500/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-4 text-indigo-400 group-hover:scale-110 transition-transform">
            <Mail size={24} />
          </div>
          <h3 className="text-xl font-bold mb-2">Email Contact</h3>
          <p className="text-slate-500 font-medium">{info.contact_email || 'admin@buku.com'}</p>
        </div>

        <div className="glass p-8 rounded-3xl flex-1 flex flex-col items-center text-center group hover:bg-indigo-500/5 transition-all">
          <div className="bg-indigo-500/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-4 text-indigo-400 group-hover:scale-110 transition-transform">
            <Globe size={24} />
          </div>
          <h3 className="text-xl font-bold mb-2">24/7 Support</h3>
          <p className="text-slate-500 font-medium">Available for all members</p>
        </div>
      </div>
    </div>
  );
};

export default Info;
