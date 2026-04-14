import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Book, Tag, Info, Trash2, Save, Upload, Edit2, X, Check } from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('books');
  const [genres, setGenres] = useState([]);
  const [books, setBooks] = useState([]);
  const [siteInfo, setSiteInfo] = useState({});
  const [loading, setLoading] = useState(true);

  // Form states
  const [newGenre, setNewGenre] = useState('');
  const [newBook, setNewBook] = useState({ title: '', publisher: '', genre_id: '', description: '', cover_image: null, book_file: null });
  const [imagePreview, setImagePreview] = useState(null);
  const [pdfName, setPdfName] = useState('');
  const [editingGenre, setEditingGenre] = useState(null); // { id, name }
  const [editingBook, setEditingBook] = useState(null); // book object

  const token = localStorage.getItem('token');
  const config = { headers: { authorization: token } };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const gRes = await axios.get('https://api.portorey.my.id/api/genres');
      const bRes = await axios.get('https://api.portorey.my.id/api/books');
      const iRes = await axios.get('https://api.portorey.my.id/api/info');
      setGenres(gRes.data);
      setBooks(bRes.data);
      setSiteInfo(iRes.data);
    } catch (err) {
      console.error("Error fetching dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddGenre = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://api.portorey.my.id/api/genres', { name: newGenre }, config);
      setNewGenre('');
      fetchData();
    } catch (err) { alert("Error adding genre"); }
  };

  const handleUpdateGenre = async (id, name) => {
    try {
      await axios.put(`https://api.portorey.my.id/api/genres/${id}`, { name }, config);
      setEditingGenre(null);
      fetchData();
    } catch (err) { alert("Error updating genre"); }
  };

  const handleDeleteGenre = async (id) => {
    if (!window.confirm("Are you sure you want to delete this genre? If it's linked to books, deletion might fail.")) return;
    try {
      await axios.delete(`https://api.portorey.my.id/api/genres/${id}`, config);
      fetchData();
    } catch (err) { alert("Error deleting genre. It might be in use by books."); }
  };

  const handleDeleteBook = async (id) => {
    if (!window.confirm("Delete this book permanently?")) return;
    try {
      await axios.delete(`https://api.portorey.my.id/api/books/${id}`, config);
      fetchData();
    } catch (err) { alert("Error deleting book"); }
  };

  const handleEditBook = (book) => {
    setEditingBook(book);
    setNewBook({
      title: book.title,
      publisher: book.publisher || '',
      genre_id: book.genre_id || '',
      description: book.description || '',
      cover_image: null,
      book_file: null
    });
    setImagePreview(`https://api.portorey.my.id/uploads/${book.cover_image}`);
    setPdfName(book.file_path || '');
    // Scroll to form on mobile
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', newBook.title);
    formData.append('publisher', newBook.publisher);
    formData.append('genre_id', newBook.genre_id);
    formData.append('description', newBook.description);
    if (newBook.cover_image) formData.append('cover_image', newBook.cover_image);
    if (newBook.book_file) formData.append('book_file', newBook.book_file);

    try {
      if (editingBook) {
        await axios.put(`https://api.portorey.my.id/api/books/${editingBook.id}`, formData, {
          headers: config.headers
        });
        setEditingBook(null);
      } else {
        await axios.post('https://api.portorey.my.id/api/books', formData, {
          headers: config.headers
        });
      }
      setNewBook({ title: '', publisher: '', genre_id: '', description: '', cover_image: null, book_file: null });
      setImagePreview(null);
      setPdfName('');
      fetchData();
    } catch (err) { alert(`Error ${editingBook ? 'updating' : 'adding'} book`); }
  };

  const handleUpdateInfo = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://api.portorey.my.id/api/info', siteInfo, config);
      alert("Information updated!");
    } catch (err) { alert("Error updating info"); }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewBook({ ...newBook, cover_image: file });
    setImagePreview(URL.createObjectURL(file));
  };

  return (
    <div className="animate-fade">
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tighter">Admin Dashboard</h1>
        <p className="text-slate-400 mt-1 text-lg">Manage your library content and configuration</p>
      </header>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-white/5 pb-4">
        {[
          { id: 'books', name: 'Books', icon: Book },
          { id: 'genres', name: 'Genres', icon: Tag },
          { id: 'info', name: 'Web Info', icon: Info }
        ].map(tab => (
          <button
            key={tab.id}
            className={`btn px-5 py-2.5 text-sm transition-all whitespace-nowrap ${activeTab === tab.id ? 'btn-primary' : 'glass hover:bg-white/5'}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <tab.icon size={18} /> {tab.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20 text-slate-400 animate-pulse bg-white/5 rounded-3xl border border-dashed border-white/10">
          Loading dashboard data...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr,400px] gap-8 items-start">

          {/* Main Area */}
          <div className="glass p-6 sm:p-10 rounded-3xl order-2 lg:order-1">
            {activeTab === 'books' && (
              <div>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <Book className="text-indigo-400" /> Book List
                </h2>
                <div className="space-y-3">
                  {books.map(book => (
                    <div key={book.id} className="group flex items-center gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.05] transition-all">
                      <img
                        src={`https://api.portorey.my.id/uploads/${book.cover_image}`}
                        alt=""
                        className="w-12 h-16 object-cover rounded-md shadow-lg group-hover:scale-105 transition-transform"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-white truncate group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{book.title}</h4>
                        <p className="text-sm text-slate-500 mt-0.5 truncate uppercase tracking-widest font-semibold text-[0.7rem]">
                          {book.genre_name} <span className="mx-1 text-slate-700">|</span> {book.publisher}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all">
                        <button onClick={() => handleEditBook(book)} className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-indigo-400 hover:bg-white/10 transition-all translate-y-2 lg:translate-x-4 lg:translate-y-0 lg:group-hover:translate-x-0">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDeleteBook(book.id)} className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-red-400 hover:bg-white/10 transition-all translate-y-2 lg:translate-x-4 lg:translate-y-0 lg:group-hover:translate-x-0">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {books.length === 0 && <p className="text-slate-500 italic py-10 text-center">No books available yet.</p>}
                </div>
              </div>
            )}

            {activeTab === 'genres' && (
              <div>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <Tag className="text-indigo-400" /> Genre List
                </h2>
                <div className="flex flex-wrap gap-3">
                  {genres.map(genre => (
                    <div key={genre.id} className="glass px-4 py-2 rounded-xl flex items-center gap-3 hover:bg-white/5 transition-all border-white/5 group">
                      {editingGenre?.id === genre.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            className="bg-slate-800 border-none rounded px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-indigo-500 w-24"
                            value={editingGenre.name}
                            onChange={(e) => setEditingGenre({ ...editingGenre, name: e.target.value })}
                            autoFocus
                          />
                          <button onClick={() => handleUpdateGenre(genre.id, editingGenre.name)} className="text-emerald-400 hover:text-emerald-300">
                            <Check size={14} />
                          </button>
                          <button onClick={() => setEditingGenre(null)} className="text-slate-400 hover:text-white">
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <>
                          <Tag size={14} className="text-indigo-400" />
                          <span className="font-medium text-sm">{genre.name}</span>
                          <div className="flex items-center gap-1.5 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity ml-2 border-l border-white/10 pl-2">
                            <button onClick={() => setEditingGenre({ id: genre.id, name: genre.name })} className="text-slate-400 hover:text-indigo-400 transition-colors">
                              <Edit2 size={14} />
                            </button>
                            <button onClick={() => handleDeleteGenre(genre.id)} className="text-slate-400 hover:text-red-400 transition-colors">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'info' && (
              <form onSubmit={handleUpdateInfo} className="space-y-6">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <Info className="text-indigo-400" /> Site Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-400 ml-1">Site Title</label>
                    <input type="text" className="input-field m-0" value={siteInfo.site_title || ''} onChange={(e) => setSiteInfo({ ...siteInfo, site_title: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-400 ml-1">Contact Email</label>
                    <input type="email" className="input-field m-0" value={siteInfo.contact_email || ''} onChange={(e) => setSiteInfo({ ...siteInfo, contact_email: e.target.value })} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-400 ml-1">About Us Description</label>
                  <textarea rows="6" className="input-field m-0 resize-none" value={siteInfo.about_us || ''} onChange={(e) => setSiteInfo({ ...siteInfo, about_us: e.target.value })}></textarea>
                </div>

                <button type="submit" className="btn btn-primary w-full sm:w-auto px-10">
                  <Save size={18} /> Save Changes
                </button>
              </form>
            )}
          </div>

          {/* Sidebar Area (Quick Add) */}
          <aside className="space-y-6 order-1 lg:order-2">
            {activeTab === 'books' && (
              <div className="glass p-6 sm:p-8 rounded-3xl sticky top-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold flex items-center gap-2 tracking-tight">
                    {editingBook ? <Edit2 size={20} className="text-indigo-400" /> : <Plus size={20} className="text-indigo-400" />}
                    {editingBook ? 'Edit Book' : 'Add New Book'}
                  </h3>
                  {editingBook && (
                    <button
                      onClick={() => {
                        setEditingBook(null);
                        setNewBook({ title: '', publisher: '', genre_id: '', description: '', cover_image: null, book_file: null });
                        setImagePreview(null);
                        setPdfName('');
                      }}
                      className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-white"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
                <form onSubmit={handleAddBook} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-widest">Cover Image</label>
                    <div className="group relative aspect-[4/3] bg-white/[0.03] border-2 border-dashed border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center transition-all hover:border-indigo-500/50 hover:bg-indigo-500/5 overflow-hidden">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover rounded-xl" />
                      ) : (
                        <div className="text-center transition-transform group-hover:scale-110">
                          <Upload size={32} className="mx-auto mb-2 text-slate-600 group-hover:text-indigo-400" />
                          <p className="text-xs text-slate-500 group-hover:text-slate-300">Choose Premium Cover</p>
                        </div>
                      )}
                      <input type="file" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-widest">Book Title</label>
                    <input type="text" placeholder="Book Title" className="input-field m-0" value={newBook.title} onChange={(e) => setNewBook({ ...newBook, title: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-widest">Publisher Name</label>
                    <input type="text" placeholder="Publisher Name" className="input-field m-0" value={newBook.publisher} onChange={(e) => setNewBook({ ...newBook, publisher: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-widest">Genre</label>
                    <select
                      className="input-field m-0 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M5%207.5L10%2012.5L15%207.5%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-[position:right_1.25rem_center] bg-no-repeat"
                      value={newBook.genre_id}
                      onChange={(e) => setNewBook({ ...newBook, genre_id: e.target.value })}
                      required
                    >
                      <option value="" className="bg-slate-900">Select Genre</option>
                      {genres.map(g => <option key={g.id} value={g.id} className="bg-slate-900">{g.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-widest">Description</label>
                    <textarea placeholder="Brief description..." rows="3" className="input-field m-0 resize-none" value={newBook.description} onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}></textarea>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-widest">Book PDF Source</label>
                    <div className="relative">
                      <div className={`p-4 rounded-xl border transition-all flex items-center gap-3 ${pdfName ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' : 'bg-white/[0.03] border-white/10 text-slate-500 shadow-inner'}`}>
                        <Upload size={18} />
                        <span className="text-xs font-medium truncate flex-1">{pdfName || 'Upload PDF Document'}</span>
                      </div>
                      <input
                        type="file"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          setNewBook({ ...newBook, book_file: file });
                          setPdfName(file?.name || '');
                        }}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        accept=".pdf"
                      />
                    </div>
                  </div>

                   <button type="submit" className={`w-full btn py-4 shadow-xl ${editingBook ? 'btn-primary' : 'btn-primary'}`}>
                    {editingBook ? <Check size={20} /> : <Plus size={20} />} 
                    {editingBook ? 'Update Book' : 'Publishing Book'}
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'genres' && (
              <div className="glass p-6 sm:p-8 rounded-3xl sticky top-8 animate-fade">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Tag size={20} className="text-indigo-400" /> New Genre
                </h3>
                <form onSubmit={handleAddGenre} className="space-y-4">
                  <input type="text" placeholder="Genre Name" className="input-field m-0" value={newGenre} onChange={(e) => setNewGenre(e.target.value)} required />
                  <button type="submit" className="w-full btn btn-primary shadow-xl">
                    <Plus size={20} /> Create Genre
                  </button>
                </form>
              </div>
            )}
          </aside>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
