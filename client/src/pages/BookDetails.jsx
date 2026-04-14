import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Download, ArrowLeft, BookOpen, User, Book as BookIcon } from 'lucide-react';

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/books/${id}`);
        setBook(res.data);
      } catch (err) {
        console.error("Error fetching book details", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  const handleDownload = () => {
    if (book?.file_path) {
      const link = document.createElement('a');
      link.href = `http://localhost:5000/uploads/${book.file_path}`;
      link.download = `${book.title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert("Download not available.");
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-[60vh] text-slate-400 animate-pulse text-xl">
      Loading book contents...
    </div>
  );

  if (!book) return (
    <div className="text-center py-20">
      <h2 className="text-2xl font-bold text-white mb-4">Book not found</h2>
      <Link to="/" className="btn btn-primary">Back to Home</Link>
    </div>
  );

  return (
    <div className="animate-fade pb-20">
      <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-indigo-400 mb-8 transition-colors group">
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back to Library
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-[350px,1fr] gap-12 items-start mb-16">
        {/* Left: Cover */}
        <div className="glass p-2 rounded-[2rem] overflow-hidden shadow-2xl">
          <img 
            src={book.cover_image ? `http://localhost:5000/uploads/${book.cover_image}` : 'https://via.placeholder.com/350x500?text=No+Cover'} 
            alt={book.title} 
            className="w-full h-auto rounded-[1.8rem] shadow-inner"
          />
        </div>

        {/* Right: Metadata */}
        <div className="flex flex-col h-full">
          <div className="flex-1">
            <span className="text-sm font-bold text-indigo-400 uppercase tracking-[0.2em] bg-indigo-500/10 px-4 py-1.5 rounded-full border border-indigo-500/20">
              {book.genre_name}
            </span>
            <h1 className="text-5xl font-bold text-white mt-6 mb-4 tracking-tighter leading-tight uppercase">
              {book.title}
            </h1>
            
            <div className="flex flex-wrap gap-6 mb-8">
              <div className="flex items-center gap-2 text-slate-400">
                <User size={18} className="text-indigo-500" />
                <span className="font-semibold">{book.publisher || 'Independent Publisher'}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <BookIcon size={18} className="text-indigo-500" />
                <span className="font-semibold">Digital Edition</span>
              </div>
            </div>

            <p className="text-lg text-slate-400 leading-relaxed max-w-2xl whitespace-pre-wrap italic border-l-4 border-indigo-500/30 pl-6 py-2">
              {book.description || 'No detailed description available for this premium title.'}
            </p>
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <button onClick={handleDownload} className="btn btn-primary px-10 py-4 h-auto text-lg shadow-xl shadow-indigo-500/20">
              <Download size={22} /> Download Book
            </button>
            <a href="#reader" className="btn glass px-10 py-4 h-auto text-lg text-indigo-400">
              <BookOpen size={22} /> Start Reading
            </a>
          </div>
        </div>
      </div>

      {/* PDF Reader Section */}
      <div id="reader" className="pt-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <BookOpen className="text-indigo-400" /> Interactive Reader
          </h2>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest bg-white/5 py-2 px-4 rounded-full border border-white/5">
            PDF Document
          </span>
        </div>
        
        <div className="glass rounded-[2.5rem] overflow-hidden border-2 border-white/5 aspect-[16/10] sm:aspect-video shadow-2xl relative bg-slate-900/40">
          {book.file_path ? (
            <iframe 
              src={`http://localhost:5000/uploads/${book.file_path}#toolbar=0`} 
              className="w-full h-full border-none"
              title={book.title}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 p-10 text-center">
              <BookOpen size={64} className="mb-4 opacity-20" />
              <p className="text-xl font-bold">PDF Reader Unavailable</p>
              <p className="text-sm mt-2">The source file for this book could not be found on the server.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
