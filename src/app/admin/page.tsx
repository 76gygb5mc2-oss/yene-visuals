'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  Trash2,
  LogIn,
  LogOut,
  Star,
  Image as ImageIcon,
  X,
  Check,
  Camera,
  Loader2,
  Edit3,
  Calendar,
  Clock,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  CheckCircle,
  XCircle,
  LayoutGrid,
  Users,
  HardDrive,
  TrendingUp,
  Eye,
  ChevronRight,
  Sparkles,
  Shield,
} from 'lucide-react';

interface Photo {
  id: string;
  filename: string;
  originalName: string;
  category: string;
  title: string;
  url: string;
  width: number;
  height: number;
  size: number;
  featured: boolean;
  createdAt: string;
}

const CATEGORIES = [
  'Portraits',
  'Weddings',
  'Graduations',
  'Couples',
  'Events',
  'Fashion',
  'Lifestyle',
  'Commercial',
];

interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  sessionType: string;
  date: string;
  location: string;
  budget: string;
  notes: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

const statusConfig = {
  pending: { icon: Clock, color: 'bg-amber-500/10 text-amber-400 border-amber-500/20', label: 'Pending', dot: 'bg-amber-400' },
  confirmed: { icon: CheckCircle, color: 'bg-blue-500/10 text-blue-400 border-blue-500/20', label: 'Confirmed', dot: 'bg-blue-400' },
  completed: { icon: Check, color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', label: 'Completed', dot: 'bg-emerald-400' },
  cancelled: { icon: XCircle, color: 'bg-red-500/10 text-red-400 border-red-500/20', label: 'Cancelled', dot: 'bg-red-400' },
};

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [uploadCategory, setUploadCategory] = useState('Portraits');
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadFeatured, setUploadFeatured] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState<'photos' | 'bookings'>('photos');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchPhotos = useCallback(async () => {
    try {
      const res = await fetch('/api/photos');
      const data = await res.json();
      setPhotos(data.photos || []);
    } catch {
      console.error('Failed to fetch photos');
    }
  }, []);

  const fetchBookings = useCallback(async () => {
    try {
      const res = await fetch('/api/bookings');
      const data = await res.json();
      setBookings(data.bookings || []);
    } catch {
      console.error('Failed to fetch bookings');
    }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('yv-admin-token');
    if (saved) setToken(saved);
    fetchPhotos();
    fetchBookings();

    // Hide root layout nav/footer on admin page
    const rootNav = document.querySelector('body > div > div > nav, body > div nav');
    const rootMain = document.querySelector('body > div > div > main');
    if (rootNav) (rootNav as HTMLElement).style.display = 'none';
    if (rootMain) {
      (rootMain as HTMLElement).style.padding = '0';
      (rootMain as HTMLElement).style.margin = '0';
    }
    document.body.style.background = '#0a0a0b';

    return () => {
      if (rootNav) (rootNav as HTMLElement).style.display = '';
      if (rootMain) {
        (rootMain as HTMLElement).style.padding = '';
        (rootMain as HTMLElement).style.margin = '';
      }
      document.body.style.background = '';
    };
  }, [fetchPhotos, fetchBookings]);

  // Simulate upload progress
  useEffect(() => {
    if (uploading) {
      setUploadProgress(0);
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) { clearInterval(interval); return 90; }
          return prev + Math.random() * 15;
        });
      }, 200);
      return () => clearInterval(interval);
    } else {
      setUploadProgress(0);
    }
  }, [uploading]);

  const login = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (res.ok) {
        setToken(data.token);
        localStorage.setItem('yv-admin-token', data.token);
        setPassword('');
        setSuccess('Welcome back!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Login failed');
      }
    } catch {
      setError('Connection error');
    }
    setLoading(false);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('yv-admin-token');
  };

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0 || !token) return;

    setUploading(true);
    setError('');
    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      formData.append('photos', files[i]);
    }
    formData.append('category', uploadCategory);
    formData.append('title', uploadTitle);
    formData.append('featured', uploadFeatured.toString());

    try {
      const res = await fetch('/api/photos', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setUploadProgress(100);
        setTimeout(() => {
          setSuccess(data.message);
          setUploadTitle('');
          setUploadFeatured(false);
          fetchPhotos();
          setTimeout(() => setSuccess(''), 3000);
        }, 300);
      } else {
        if (res.status === 401) {
          logout();
          setError('Session expired. Please log in again.');
        } else {
          setError(data.error || 'Upload failed');
        }
      }
    } catch {
      setError('Upload failed');
    }
    setUploading(false);
  };

  const handleDelete = async (id: string) => {
    if (!token || !confirm('Delete this photo?')) return;
    try {
      const res = await fetch(`/api/photos?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setSuccess('Photo deleted');
        fetchPhotos();
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch {
      setError('Delete failed');
    }
  };

  const handleUpdate = async (id: string) => {
    if (!token) return;
    try {
      const res = await fetch('/api/photos', {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, title: editTitle, category: editCategory }),
      });
      if (res.ok) {
        setEditingId(null);
        setSuccess('Photo updated');
        fetchPhotos();
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch {
      setError('Update failed');
    }
  };

  const toggleFeatured = async (photo: Photo) => {
    if (!token) return;
    try {
      await fetch('/api/photos', {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: photo.id, featured: !photo.featured }),
      });
      fetchPhotos();
    } catch {
      setError('Update failed');
    }
  };

  const updateBookingStatus = async (id: string, status: string) => {
    if (!token) return;
    try {
      const res = await fetch('/api/bookings', {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        setSuccess('Booking updated');
        fetchBookings();
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch {
      setError('Update failed');
    }
  };

  const deleteBookingItem = async (id: string) => {
    if (!token || !confirm('Delete this booking?')) return;
    try {
      const res = await fetch(`/api/bookings?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setSuccess('Booking deleted');
        fetchBookings();
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch {
      setError('Delete failed');
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleUpload(e.dataTransfer.files);
  };

  const filteredPhotos =
    selectedCategory === 'All'
      ? photos
      : photos.filter((p) => p.category === selectedCategory);

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const pendingBookings = bookings.filter((b) => b.status === 'pending').length;

  // ─── Login Screen ─────────────────────────────────────────────
  if (!token) {
    return (
      <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center p-6 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/8 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/8 rounded-full blur-[120px]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-sm relative z-10"
        >
          <div className="bg-[#141416]/80 backdrop-blur-2xl rounded-3xl p-10 border border-white/[0.06] shadow-2xl shadow-black/40">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center mx-auto mb-5">
                <Shield className="w-7 h-7 text-white/80" />
              </div>
              <h1 className="text-2xl font-semibold text-white tracking-tight">
                Admin Access
              </h1>
              <p className="text-white/40 text-sm mt-1.5">Yene Visuals Dashboard</p>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-3">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && password && login()}
                placeholder="Enter password"
                className="w-full px-4 py-3.5 rounded-xl bg-white/[0.06] border border-white/[0.08] focus:border-white/20 focus:bg-white/[0.08] focus:outline-none transition-all text-white placeholder:text-white/25 text-sm"
              />
              <button
                onClick={login}
                disabled={loading || !password}
                className="w-full py-3.5 rounded-xl bg-white text-[#0a0a0b] font-semibold text-sm hover:bg-white/90 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <LogIn className="w-4 h-4" />
                )}
                Sign In
              </button>
            </div>

            <p className="text-center text-white/20 text-xs mt-6">
              Default: <code className="bg-white/[0.06] px-2 py-0.5 rounded text-white/40">yenevisuals2024</code>
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  // ─── Admin Dashboard ──────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white">
      {/* Sidebar + Main Layout */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="fixed left-0 top-0 bottom-0 w-[260px] bg-[#111113] border-r border-white/[0.06] flex flex-col z-50 max-lg:hidden">
          {/* Brand */}
          <div className="p-6 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-white/15 to-white/5 border border-white/10 flex items-center justify-center">
                <Camera className="w-4 h-4 text-white/80" />
              </div>
              <div>
                <h1 className="text-sm font-semibold text-white">Yene Visuals</h1>
                <p className="text-[10px] text-white/30 uppercase tracking-widest">Studio</p>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 space-y-1">
            <button
              onClick={() => setActiveTab('photos')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'photos'
                  ? 'bg-white/[0.08] text-white'
                  : 'text-white/40 hover:text-white/70 hover:bg-white/[0.04]'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              Photos
              <span className="ml-auto text-xs bg-white/[0.08] px-2 py-0.5 rounded-full">{photos.length}</span>
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'bookings'
                  ? 'bg-white/[0.08] text-white'
                  : 'text-white/40 hover:text-white/70 hover:bg-white/[0.04]'
              }`}
            >
              <Calendar className="w-4 h-4" />
              Bookings
              {pendingBookings > 0 && (
                <span className="ml-auto flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <span className="text-xs text-amber-400">{pendingBookings}</span>
                </span>
              )}
            </button>
          </nav>

          {/* Bottom */}
          <div className="p-4 space-y-2 border-t border-white/[0.06]">
            <a
              href="/"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-white/40 hover:text-white/70 hover:bg-white/[0.04] transition-all"
            >
              <Eye className="w-4 h-4" />
              View Live Site
              <ChevronRight className="w-3 h-3 ml-auto" />
            </a>
            <button
              onClick={logout}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-white/40 hover:text-red-400 hover:bg-red-500/5 transition-all"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-[260px] min-h-screen">
          {/* Mobile Header */}
          <header className="lg:hidden sticky top-0 z-50 bg-[#111113]/90 backdrop-blur-xl border-b border-white/[0.06]">
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-white/60" />
                <span className="text-sm font-semibold">Yene Visuals</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('photos')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium ${activeTab === 'photos' ? 'bg-white/10 text-white' : 'text-white/40'}`}
                >
                  Photos
                </button>
                <button
                  onClick={() => setActiveTab('bookings')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium relative ${activeTab === 'bookings' ? 'bg-white/10 text-white' : 'text-white/40'}`}
                >
                  Bookings
                  {pendingBookings > 0 && <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400" />}
                </button>
                <a href="/" className="p-2 text-white/40 hover:text-white"><Eye className="w-4 h-4" /></a>
                <button onClick={logout} className="p-2 text-white/40 hover:text-red-400"><LogOut className="w-4 h-4" /></button>
              </div>
            </div>
          </header>

          <div className="p-6 lg:p-8 max-w-[1400px]">
            {/* Top bar with greeting */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">
                  {activeTab === 'photos' ? 'Photo Manager' : 'Appointment Schedule'}
                </h2>
                <p className="text-white/30 text-sm mt-1">
                  {activeTab === 'photos'
                    ? `${photos.length} photos • ${formatSize(photos.reduce((s, p) => s + p.size, 0))} total`
                    : `${bookings.length} bookings • ${pendingBookings} pending`
                  }
                </p>
              </div>
            </div>

            {/* Alerts */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.98 }}
                  className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/15 text-red-400 text-sm flex items-center justify-between"
                >
                  <span className="flex items-center gap-2"><XCircle className="w-4 h-4" />{error}</span>
                  <button onClick={() => setError('')} className="hover:text-red-300"><X className="w-4 h-4" /></button>
                </motion.div>
              )}
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.98 }}
                  className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/15 text-emerald-400 text-sm flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  {success}
                </motion.div>
              )}
            </AnimatePresence>

            {/* ═══ PHOTOS TAB ═══ */}
            {activeTab === 'photos' && (
              <>
                {/* Stats Row */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
                  {[
                    { label: 'Total Photos', value: photos.length, icon: ImageIcon, accent: 'from-blue-500/20 to-blue-600/5' },
                    { label: 'Featured', value: photos.filter((p) => p.featured).length, icon: Star, accent: 'from-amber-500/20 to-amber-600/5' },
                    { label: 'Categories', value: new Set(photos.map(p => p.category)).size, icon: LayoutGrid, accent: 'from-purple-500/20 to-purple-600/5' },
                    { label: 'Storage', value: formatSize(photos.reduce((sum, p) => sum + p.size, 0)), icon: HardDrive, accent: 'from-emerald-500/20 to-emerald-600/5' },
                  ].map((stat) => (
                    <motion.div
                      key={stat.label}
                      whileHover={{ scale: 1.02, y: -2 }}
                      className={`relative overflow-hidden bg-gradient-to-br ${stat.accent} rounded-2xl p-5 border border-white/[0.06]`}
                    >
                      <stat.icon className="w-5 h-5 text-white/30 mb-3" />
                      <p className="text-2xl font-bold text-white tracking-tight">{stat.value}</p>
                      <p className="text-xs text-white/40 mt-0.5">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Upload Section */}
                <div className="bg-[#141416] rounded-2xl border border-white/[0.06] mb-8 overflow-hidden">
                  <div className="p-6 pb-4 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                      <Upload className="w-4 h-4 text-white/40" />
                      Upload Photos
                    </h3>
                  </div>

                  <div className="px-6 pb-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <select
                        value={uploadCategory}
                        onChange={(e) => setUploadCategory(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.08] text-sm text-white focus:border-white/20 focus:outline-none transition-all"
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c} value={c} className="bg-[#1a1a1c] text-white">{c}</option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={uploadTitle}
                        onChange={(e) => setUploadTitle(e.target.value)}
                        placeholder="Title (optional)"
                        className="w-full px-4 py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.08] text-sm text-white placeholder:text-white/20 focus:border-white/20 focus:outline-none transition-all"
                      />
                      <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.08] cursor-pointer hover:bg-white/[0.08] transition-all">
                        <input
                          type="checkbox"
                          checked={uploadFeatured}
                          onChange={(e) => setUploadFeatured(e.target.checked)}
                          className="rounded border-white/20 bg-white/10 text-amber-500"
                        />
                        <Star className="w-3.5 h-3.5 text-amber-400" />
                        <span className="text-sm text-white/60">Featured</span>
                      </label>
                    </div>
                  </div>

                  {/* Drop Zone */}
                  <div className="px-6 pb-6">
                    <div
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`relative border border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all group ${
                        dragActive
                          ? 'border-white/30 bg-white/[0.06]'
                          : 'border-white/[0.08] hover:border-white/15 hover:bg-white/[0.03]'
                      }`}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => handleUpload(e.target.files)}
                        className="hidden"
                      />
                      {uploading ? (
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-full max-w-xs">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs text-white/40">Uploading...</span>
                              <span className="text-xs text-white/60 font-medium">{Math.round(uploadProgress)}%</span>
                            </div>
                            <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                              <motion.div
                                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                                initial={{ width: '0%' }}
                                animate={{ width: `${uploadProgress}%` }}
                                transition={{ duration: 0.3 }}
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center group-hover:bg-white/[0.08] group-hover:border-white/15 transition-all">
                            <Upload className="w-5 h-5 text-white/30 group-hover:text-white/60 transition-colors" />
                          </div>
                          <div>
                            <p className="text-sm text-white/60 font-medium">
                              Drop photos here or <span className="text-white/80 underline underline-offset-2">browse</span>
                            </p>
                            <p className="text-xs text-white/25 mt-1">
                              JPG, PNG, WebP • Auto-optimized on upload
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Photo Library */}
                <div className="bg-[#141416] rounded-2xl border border-white/[0.06] overflow-hidden">
                  <div className="p-6 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <h3 className="text-sm font-semibold text-white">
                      Library <span className="text-white/30 font-normal ml-1">{filteredPhotos.length}</span>
                    </h3>
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* View toggle */}
                      <div className="flex bg-white/[0.06] rounded-lg p-0.5 mr-2">
                        <button
                          onClick={() => setViewMode('grid')}
                          className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white/50'}`}
                        >
                          <LayoutGrid className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setViewMode('list')}
                          className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white/50'}`}
                        >
                          <TrendingUp className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {/* Category filters */}
                      <button
                        onClick={() => setSelectedCategory('All')}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                          selectedCategory === 'All'
                            ? 'bg-white text-[#0a0a0b]'
                            : 'text-white/30 hover:text-white/60 hover:bg-white/[0.06]'
                        }`}
                      >
                        All
                      </button>
                      {CATEGORIES.map((c) => (
                        <button
                          key={c}
                          onClick={() => setSelectedCategory(c)}
                          className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                            selectedCategory === c
                              ? 'bg-white text-[#0a0a0b]'
                              : 'text-white/30 hover:text-white/60 hover:bg-white/[0.06]'
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="px-6 pb-6">
                    {filteredPhotos.length === 0 ? (
                      <div className="text-center py-16">
                        <ImageIcon className="w-12 h-12 text-white/10 mx-auto mb-3" />
                        <p className="text-white/30 text-sm">No photos yet</p>
                      </div>
                    ) : viewMode === 'grid' ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                        {filteredPhotos.map((photo) => (
                          <motion.div
                            key={photo.id}
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="group relative rounded-xl overflow-hidden bg-white/[0.04] aspect-square"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={photo.url.replace('.jpeg', '_thumb.jpeg')}
                              alt={photo.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              loading="lazy"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                if (target.src.includes('_thumb')) target.src = photo.url;
                              }}
                            />

                            {/* Hover overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                              <div className="absolute bottom-0 left-0 right-0 p-3">
                                {editingId === photo.id ? (
                                  <div className="space-y-2">
                                    <input
                                      type="text"
                                      value={editTitle}
                                      onChange={(e) => setEditTitle(e.target.value)}
                                      className="w-full px-2 py-1 rounded-lg bg-white/15 text-white text-xs backdrop-blur placeholder:text-white/40"
                                      placeholder="Title"
                                    />
                                    <select
                                      value={editCategory}
                                      onChange={(e) => setEditCategory(e.target.value)}
                                      className="w-full px-2 py-1 rounded-lg bg-white/15 text-white text-xs backdrop-blur"
                                    >
                                      {CATEGORIES.map((c) => (
                                        <option key={c} value={c} className="text-black">{c}</option>
                                      ))}
                                    </select>
                                    <div className="flex gap-1.5">
                                      <button
                                        onClick={() => handleUpdate(photo.id)}
                                        className="flex-1 py-1 rounded-lg bg-emerald-500 text-white text-xs font-medium"
                                      >
                                        Save
                                      </button>
                                      <button
                                        onClick={() => setEditingId(null)}
                                        className="flex-1 py-1 rounded-lg bg-white/15 text-white text-xs"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <>
                                    <p className="text-white text-xs font-medium truncate">{photo.title}</p>
                                    <p className="text-white/40 text-[10px] mt-0.5">{photo.category} • {formatSize(photo.size)}</p>
                                  </>
                                )}
                              </div>

                              {editingId !== photo.id && (
                                <div className="absolute top-2 right-2 flex gap-1">
                                  <button
                                    onClick={() => toggleFeatured(photo)}
                                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                                      photo.featured
                                        ? 'bg-amber-500 text-white'
                                        : 'bg-black/40 backdrop-blur text-white/70 hover:bg-amber-500 hover:text-white'
                                    }`}
                                  >
                                    <Star className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      setEditingId(photo.id);
                                      setEditTitle(photo.title);
                                      setEditCategory(photo.category);
                                    }}
                                    className="w-7 h-7 rounded-lg bg-black/40 backdrop-blur text-white/70 hover:bg-blue-500 hover:text-white flex items-center justify-center transition-all"
                                  >
                                    <Edit3 className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(photo.id)}
                                    className="w-7 h-7 rounded-lg bg-black/40 backdrop-blur text-white/70 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              )}
                            </div>

                            {/* Featured badge */}
                            {photo.featured && (
                              <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-amber-500/90 text-white text-[10px] font-semibold flex items-center gap-1">
                                <Star className="w-2.5 h-2.5" />
                                Featured
                              </div>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      /* List view */
                      <div className="space-y-1">
                        {filteredPhotos.map((photo) => (
                          <motion.div
                            key={photo.id}
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="group flex items-center gap-4 p-3 rounded-xl hover:bg-white/[0.04] transition-all"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={photo.url.replace('.jpeg', '_thumb.jpeg')}
                              alt={photo.title}
                              className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                              loading="lazy"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                if (target.src.includes('_thumb')) target.src = photo.url;
                              }}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-white truncate">{photo.title}</p>
                              <p className="text-xs text-white/30">{photo.category} • {formatSize(photo.size)} • {photo.width}×{photo.height}</p>
                            </div>
                            {photo.featured && <Star className="w-4 h-4 text-amber-400 flex-shrink-0" />}
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => toggleFeatured(photo)} className="p-1.5 rounded-lg hover:bg-white/10"><Star className="w-3.5 h-3.5 text-white/40" /></button>
                              <button
                                onClick={() => {
                                  setEditingId(photo.id);
                                  setEditTitle(photo.title);
                                  setEditCategory(photo.category);
                                }}
                                className="p-1.5 rounded-lg hover:bg-white/10"
                              >
                                <Edit3 className="w-3.5 h-3.5 text-white/40" />
                              </button>
                              <button onClick={() => handleDelete(photo.id)} className="p-1.5 rounded-lg hover:bg-red-500/20"><Trash2 className="w-3.5 h-3.5 text-red-400" /></button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* ═══ BOOKINGS TAB ═══ */}
            {activeTab === 'bookings' && (
              <div className="space-y-6">
                {/* Quick Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    { label: 'Total', value: bookings.length, icon: Users, accent: 'from-blue-500/20 to-blue-600/5' },
                    { label: 'Pending', value: bookings.filter(b => b.status === 'pending').length, icon: Clock, accent: 'from-amber-500/20 to-amber-600/5' },
                    { label: 'Confirmed', value: bookings.filter(b => b.status === 'confirmed').length, icon: CheckCircle, accent: 'from-emerald-500/20 to-emerald-600/5' },
                    { label: 'Completed', value: bookings.filter(b => b.status === 'completed').length, icon: Check, accent: 'from-purple-500/20 to-purple-600/5' },
                  ].map((stat) => (
                    <div key={stat.label} className={`bg-gradient-to-br ${stat.accent} rounded-2xl p-5 border border-white/[0.06]`}>
                      <stat.icon className="w-5 h-5 text-white/30 mb-3" />
                      <p className="text-2xl font-bold text-white tracking-tight">{stat.value}</p>
                      <p className="text-xs text-white/40 mt-0.5">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* Bookings List */}
                {bookings.length === 0 ? (
                  <div className="bg-[#141416] rounded-2xl border border-white/[0.06] p-16 text-center">
                    <Calendar className="w-12 h-12 text-white/10 mx-auto mb-3" />
                    <p className="text-white/30 text-sm">No bookings yet</p>
                    <p className="text-white/15 text-xs mt-1">They&apos;ll appear here when clients book sessions</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {bookings
                      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                      .map((booking) => {
                        const statusInfo = statusConfig[booking.status];
                        const StatusIcon = statusInfo.icon;
                        return (
                          <motion.div
                            key={booking.id}
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-[#141416] rounded-2xl border border-white/[0.06] overflow-hidden hover:border-white/[0.10] transition-all"
                          >
                            <div className="p-6">
                              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                                {/* Client Info */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                                      <span className="text-sm font-semibold text-white/80">
                                        {booking.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                      </span>
                                    </div>
                                    <div>
                                      <h3 className="font-semibold text-white">{booking.name}</h3>
                                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-medium border ${statusInfo.color}`}>
                                        <StatusIcon className="w-3 h-3" />
                                        {statusInfo.label}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2 text-sm">
                                    <div className="flex items-center gap-2 text-white/40">
                                      <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                                      <a href={`mailto:${booking.email}`} className="hover:text-white/70 truncate transition-colors">{booking.email}</a>
                                    </div>
                                    <div className="flex items-center gap-2 text-white/40">
                                      <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                                      <a href={`tel:${booking.phone}`} className="hover:text-white/70 transition-colors">{booking.phone}</a>
                                    </div>
                                    <div className="flex items-center gap-2 text-white/40">
                                      <Camera className="w-3.5 h-3.5 flex-shrink-0" />
                                      <span className="text-white/60">{booking.sessionType}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-white/40">
                                      <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                                      <span>{booking.date ? new Date(booking.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : 'TBD'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-white/40">
                                      <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                                      <span>{booking.location || 'TBD'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-white/40">
                                      <DollarSign className="w-3.5 h-3.5 flex-shrink-0" />
                                      <span>{booking.budget || 'Not specified'}</span>
                                    </div>
                                  </div>

                                  {booking.notes && (
                                    <div className="mt-4 p-3 bg-white/[0.03] rounded-xl border border-white/[0.06] text-sm text-white/40">
                                      <p className="text-[10px] text-white/20 uppercase tracking-widest font-medium mb-1">Notes</p>
                                      {booking.notes}
                                    </div>
                                  )}

                                  <p className="text-[10px] text-white/15 mt-3 uppercase tracking-wider">
                                    Submitted {new Date(booking.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })}
                                  </p>
                                </div>

                                {/* Actions */}
                                <div className="flex lg:flex-col gap-2 flex-shrink-0">
                                  {booking.status === 'pending' && (
                                    <button
                                      onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium hover:bg-blue-500/20 transition-all"
                                    >
                                      <CheckCircle className="w-3.5 h-3.5" />
                                      Confirm
                                    </button>
                                  )}
                                  {booking.status === 'confirmed' && (
                                    <button
                                      onClick={() => updateBookingStatus(booking.id, 'completed')}
                                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium hover:bg-emerald-500/20 transition-all"
                                    >
                                      <Check className="w-3.5 h-3.5" />
                                      Complete
                                    </button>
                                  )}
                                  {(booking.status === 'pending' || booking.status === 'confirmed') && (
                                    <button
                                      onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium hover:bg-red-500/20 transition-all"
                                    >
                                      <XCircle className="w-3.5 h-3.5" />
                                      Cancel
                                    </button>
                                  )}
                                  <button
                                    onClick={() => deleteBookingItem(booking.id)}
                                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.06] text-white/30 text-xs font-medium hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400 transition-all"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
