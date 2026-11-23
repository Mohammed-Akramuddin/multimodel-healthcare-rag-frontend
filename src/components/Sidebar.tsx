import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { 
  LayoutDashboard, 
  Users, 
  MessageSquare, 
  ShieldCheck, 
  LogOut, 
  Activity,
  Settings,
  ShieldAlert,
  Menu,
  X,
  Sun,
  Moon,
  Sparkles,
  MapPin
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: 'Overview', path: '/', icon: LayoutDashboard, roles: ['admin', 'doctor', 'nurse'] },
    { name: 'My Care Portal', path: `/patients/${user?.patient_profile_id || 1}`, icon: Activity, roles: ['patient'] }, 
    { name: 'Patient Registry', path: '/patients', icon: Users, roles: ['admin', 'doctor'] },
    { name: 'Clinical Assistant', path: '/assistant', icon: MessageSquare, roles: ['admin', 'doctor', 'nurse', 'patient'] },
    { name: 'Security Audit', path: '/audit', icon: ShieldCheck, roles: ['admin'] },
    { name: 'Admin Control', path: '/admin', icon: ShieldAlert, roles: ['admin'] },
    { name: 'Settings', path: '/settings', icon: Settings, roles: ['doctor', 'nurse', 'patient'] },
  ];

  const filteredItems = menuItems.filter(item => item.roles.includes(user?.role || ''));

  const NavContent = () => (
    <>
      <div className="p-6 pb-4 border-b border-subtle">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 bg-white border border-[#d9ddda] rounded-xl flex items-center justify-center p-1.5 shadow-sm group-hover:border-secondary transition-all">
              <img 
                src="/shellbiotech_logo.png" 
                alt="Shell Biotech Logo" 
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-black text-lg tracking-tight text-text-main group-hover:text-secondary transition-colors">
                  SHELL BIOTECH
                </span>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-secondary">
                Healthcare & AI Portal
              </p>
            </div>
          </Link>
          <button onClick={() => setIsOpen(false)} className="lg:hidden p-2 text-text-muted hover:text-primary transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Institution Badge */}
        <div className="mt-4 px-3 py-2 bg-secondary/10 border border-secondary/20 rounded-xl flex items-center gap-2">
          <MapPin size={12} className="text-secondary flex-shrink-0" />
          <span className="text-[10px] font-semibold text-secondary tracking-tight truncate">
            Hyderabad · Est. 2013
          </span>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1.5 mt-4 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-text-muted">
          Clinical Navigation
        </div>
        {filteredItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={() => setIsOpen(false)}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative font-semibold text-sm",
              location.pathname === item.path 
                ? "bg-[#0b1f33] text-white shadow-md shadow-[#0b1f33]/15 dark:bg-secondary dark:text-white" 
                : "text-text-muted hover:bg-secondary/10 hover:text-secondary"
            )}
          >
            <item.icon size={19} className={cn(
              "transition-transform duration-200 group-hover:scale-105",
              location.pathname === item.path ? "text-white" : "text-text-muted group-hover:text-secondary"
            )} />
            <span>{item.name}</span>
            {location.pathname === item.path && (
              <motion.div 
                layoutId="active-pill"
                className="absolute right-2 w-1.5 h-4 bg-emerald-400 rounded-full"
              />
            )}
          </Link>
        ))}
      </nav>

      <div className="p-5 border-t border-subtle bg-surface/50 space-y-3">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-surface border border-subtle hover:bg-secondary/10 hover:border-secondary/30 transition-all duration-200 group"
        >
          <div className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-wider text-text-muted group-hover:text-secondary">
            {theme === 'dark' ? <Moon size={15} /> : <Sun size={15} />}
            {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
          </div>
          <div className="w-8 h-4 bg-secondary/20 rounded-full relative transition-colors shadow-inner">
            <motion.div 
              animate={{ x: theme === 'dark' ? 16 : 2 }}
              className="absolute top-0.5 w-3 h-3 bg-secondary rounded-full shadow-sm"
            />
          </div>
        </button>

        {/* Profile */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-surface border border-subtle shadow-xs">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#0b1f33] to-[#496b5a] flex items-center justify-center text-xs font-black text-white shadow-inner">
            {user?.full_name?.charAt(0) ?? 'S'}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-bold truncate text-text-main">{user?.full_name || 'Staff'}</p>
            <p className="text-[10px] font-semibold text-secondary uppercase tracking-wider leading-none mt-1">{user?.role}</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-text-muted hover:text-red-600 hover:bg-red-500/10 rounded-xl transition-all duration-200 font-bold text-xs uppercase tracking-wider border border-transparent hover:border-red-500/20"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Mobile Hamburger Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button 
          onClick={() => setIsOpen(true)}
          className="p-2.5 bg-surface border border-subtle rounded-xl text-text-main shadow-lg"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* Sidebar UI */}
      <aside className={cn(
        "fixed inset-y-0 left-0 w-72 bg-surface text-text-main flex flex-col border-r border-subtle shadow-xl z-50 transition-transform duration-300 lg:static lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <NavContent />
      </aside>
    </>
  );
};

export default Sidebar;
