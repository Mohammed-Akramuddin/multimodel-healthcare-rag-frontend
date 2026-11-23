import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../lib/api';
import { Shield, Lock, ShieldCheck, Mail, ArrowRight, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const res = await api.post('/api/auth/login', { email, password });
      const token = res.data.access_token;
      const userRes = await api.get('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      login(token, userRes.data);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.detail || err.response?.data?.message || 'Login failed. Please verify your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-background">
      {/* Shell Biotech Hero Background Image */}
      <div 
        className="absolute inset-0 z-0 opacity-25 mix-blend-multiply dark:mix-blend-screen pointer-events-none"
        style={{ 
          backgroundImage: 'url("/shellbiotech_hero.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/90 to-[#0b1f33]/15 z-0 pointer-events-none" />
      
      {/* Decorative Brand Tones */}
      <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] bg-[#0b1f33]/10 dark:bg-[#496b5a]/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] bg-[#496b5a]/15 blur-[130px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-lg glass-panel rounded-3xl p-8 sm:p-10 relative z-10 shadow-2xl border border-border-main"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-20 bg-white border border-[#d9ddda] rounded-2xl flex items-center justify-center p-2 mb-4 shadow-sm">
            <img 
              src="/shellbiotech_logo.png" 
              alt="Shell Biotech Logo" 
              className="max-h-full max-w-full object-contain"
            />
          </div>
          <h1 className="font-heading text-3xl font-black text-text-main tracking-tight text-center">
            SHELL BIOTECH
          </h1>
          <p className="text-secondary font-bold text-xs uppercase tracking-[0.2em] mt-1 text-center">
            Healthcare Distribution & Clinical AI Portal
          </p>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-text-muted font-medium">
            <MapPin size={13} className="text-secondary" />
            <span>Hyderabad, Telangana · Established 2013</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-text-main uppercase tracking-wider ml-1">
              Clinical / Institutional Email
            </label>
            <div className="relative group">
              <Mail className="absolute left-4 top-3.5 text-text-muted group-focus-within:text-secondary transition-colors" size={18} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface border border-border-main rounded-xl px-4 py-3.5 pl-11 text-text-main focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary transition-all font-medium placeholder:text-text-muted/40 text-sm shadow-xs"
                placeholder="Enter your registered email"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-text-main uppercase tracking-wider ml-1">
              Secure Password
            </label>
            <div className="relative group">
              <Lock className="absolute left-4 top-3.5 text-text-muted group-focus-within:text-secondary transition-colors" size={18} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface border border-border-main rounded-xl px-4 py-3.5 pl-11 text-text-main focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary transition-all font-medium placeholder:text-text-muted/40 text-sm shadow-xs"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2.5"
            >
              <Shield size={16} className="flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#0b1f33] hover:bg-[#16324f] dark:bg-secondary dark:hover:bg-secondary-light text-white font-bold py-3.5 rounded-xl transition-all shadow-md shadow-[#0b1f33]/20 disabled:opacity-50 flex items-center justify-center gap-2 text-sm uppercase tracking-wider cursor-pointer"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Sign In to Clinical Portal
                <ArrowRight size={17} />
              </>
            )}
          </motion.button>
        </form>

        <div className="mt-8 text-center space-y-4 pt-4 border-t border-subtle">
          <p className="text-xs text-text-muted font-medium">
            New healthcare practitioner?{' '}
            <Link to="/signup" className="text-secondary font-bold hover:underline ml-1">
              Request Clinical Access
            </Link>
          </p>
          <div className="flex items-center justify-center gap-2 text-[10px] text-text-subtle uppercase tracking-widest font-bold">
            <ShieldCheck size={13} className="text-secondary" /> 
            <span>AES-256 Secured · ISO & CDSCO Compliant</span>
          </div>
          <p className="text-[10px] text-text-subtle">
            © 2026 SHELL BIOTECH. Hyderabad – 501505, Telangana.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
