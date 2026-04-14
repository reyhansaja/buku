import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Download, BookOpen, Search } from 'lucide-react';

const Home = () => {
  const { id } = useParams();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchBooks();
  }, [id]);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const url = id
        ? `https://api.portorey.my.id/api/books?genre_id=${id}`
        : 'https://api.portorey.my.id/api/books';


      const res = await axios.get(url);
      setBooks(res.data);
    } catch (err) {
      console.error("Error fetching books", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.publisher?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade">
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="flex-1 min-w-[300px]">
          <h1 className="text-[clamp(2.5rem,6vw,4rem)] font-bold leading-tight mb-2 tracking-tighter">
            {id ? `Genre: ${books[0]?.genre_name || 'Books'}` : 'Discover Library'}
          </h1>
          <p className="text-slate-400 text-lg sm:text-xl">Explore our curated collection of premium e-books.</p>
        </div>

        <div className="relative flex-1 max-w-lg w-full">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={22} />
          <input
            type="text"
            placeholder="Search titles or publishers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-14 h-14 text-lg"
          />
        </div>
      </header>

      {loading ? (
        <div className="flex justify-center items-center py-20 text-slate-400 animate-pulse text-lg">Loading books...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">

          {filteredBooks.map((book) => (
            <div key={book.id} className="group flex flex-row bg-slate-900/40 rounded-3xl overflow-hidden border border-white/5 transition-all duration-500 hover:border-indigo-500/50 hover:shadow-[0_20px_50px_-12px_rgba(99,102,241,0.2)]">
              <div className="w-[100px] sm:w-[160px] lg:w-[180px] shrink-0 overflow-hidden bg-black/20 flex items-center justify-center">
                <img
                  src={book.cover_image ? `https://api.portorey.my.id/uploads/${book.cover_image}` : 'https://via.placeholder.com/200x300?text=No+Cover'}
                  alt={book.title}
                  className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              <div className="flex-1 p-4 sm:p-6 lg:p-8 flex flex-col">

                <div className="flex-1">
                  <span className="text-[0.7rem] font-bold text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-2 py-1 rounded-md">
                    {book.genre_name}
                  </span>
                  <h3 className="mt-4 text-2xl font-bold text-white tracking-tight line-clamp-2 group-hover:text-indigo-400 transition-colors uppercase">
                    {book.title}
                  </h3>
                  <p className="mt-3 text-slate-400 text-sm leading-relaxed line-clamp-4">
                    {book.description || 'No description available for this book. Explore the library to find more interesting reads.'}
                  </p>
                </div>

                <div className="mt-8 flex items-center gap-3">
                  <Link
                    to={`/book/${book.id}`}
                    className="flex-1 btn glass py-3 font-bold text-indigo-400"
                  >
                    Lihat
                  </Link>
                  <Link
                    to={`/book/${book.id}`}
                    className="flex-1 btn btn-primary py-3 font-bold"
                  >
                    Baca
                  </Link>
                </div>
              </div>
            </div>
          ))}
          {filteredBooks.length === 0 && (
            <div className="col-span-full py-20 text-center text-slate-500 text-lg italic bg-white/5 rounded-3xl border border-dashed border-white/10">
              No books found in this category.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
