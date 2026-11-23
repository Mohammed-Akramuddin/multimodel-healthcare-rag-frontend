import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import {
  User,
  Mail,
  Shield,
  Lock,
  Bell,
  Moon,
  Smartphone,
  Globe,
  Save,
  CheckCircle2,
  Building2,
  MapPin
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

const Settings = () => {
  const { user } = useAuth();
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 800);
  };

  return (
    <div className="p-6 md:p-10 space-y-8 pb-20 max-w-4xl mx-auto bg-background text-text-main min-h-screen">
      <header>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-secondary uppercase tracking-widest">Configuration</span>
          <span className="w-1 h-1 rounded-full bg-text-muted/30" />
          <span className="text-[11px] font-medium text-text-muted">Practitioner Account</span>
        </div>
        <h1 className="font-heading text-2xl md:text-3xl font-black text-text-main tracking-tight mt-0.5">
          Practitioner Profile & System Settings
        </h1>
        <p className="text-text-muted mt-1 text-xs font-medium">Manage clinical identification, regional preferences, and security settings.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Navigation Sidebar */}
        <div className="space-y-1.5">
          {[
            { name: 'Profile Identity', icon: User, active: true },
            { name: 'Security & Access', icon: Lock, active: false },
            { name: 'Notifications', icon: Bell, active: false },
            { name: 'Display Theme', icon: Moon, active: false },
          ].map((tab) => (
            <button
              key={tab.name}
              className={cn(
                "w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl font-bold transition-all text-xs uppercase tracking-wider text-left cursor-pointer",
                tab.active
                  ? "bg-[#0b1f33] text-white shadow-xs dark:bg-secondary"
                  : "text-text-muted hover:bg-secondary/10 hover:text-secondary"
              )}
            >
              <tab.icon size={16} />
              {tab.name}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="md:col-span-2 space-y-6">
          <motion.form
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            onSubmit={handleSave}
            className="bg-surface border border-border-main rounded-2xl p-6 sm:p-8 shadow-xs space-y-5"
          >
            <div className="flex items-center gap-3.5 mb-2">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#0b1f33] to-[#496b5a] flex items-center justify-center text-lg font-black text-white shadow-xs">
                {user?.full_name?.charAt(0) || 'S'}
              </div>
              <div>
                <h3 className="font-heading text-base font-bold text-text-main">Shell Biotech Practitioner Record</h3>
                <p className="text-[11px] text-secondary font-semibold uppercase tracking-wider mt-0.5">Verified Medical Staff</p>
              </div>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-text-main uppercase tracking-wider">Full Legal Name</label>
                <div className="relative group">
                  <User size={16} className="absolute left-3.5 top-3 text-text-muted group-focus-within:text-secondary transition-colors" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-background border border-border-main rounded-xl px-3.5 py-2.5 pl-10 text-text-main focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Registered Email</label>
                <div className="relative group">
                  <Mail size={16} className="absolute left-3.5 top-3 text-text-muted" />
                  <input
                    type="email"
                    disabled
                    value={user?.email || ''}
                    className="w-full bg-background/50 border border-border-main rounded-xl px-3.5 py-2.5 pl-10 text-text-muted cursor-not-allowed font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Clinical Role</label>
                <div className="relative group">
                  <Shield size={16} className="absolute left-3.5 top-3 text-text-muted" />
                  <input
                    type="text"
                    disabled
                    value={user?.role?.toUpperCase() || ''}
                    className="w-full bg-background/50 border border-border-main rounded-xl px-3.5 py-2.5 pl-10 text-text-muted cursor-not-allowed font-medium tracking-wider"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <p className="text-[10px] text-text-muted font-medium">
                Identity details certified with Shell Biotech network.
              </p>
              <button
                type="submit"
                disabled={isSaving}
                className="bg-[#0b1f33] hover:bg-[#16324f] dark:bg-secondary dark:hover:bg-secondary-light text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-xs text-xs uppercase tracking-wider disabled:opacity-50 cursor-pointer"
              >
                {isSaving ? (
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : showSuccess ? (
                  <CheckCircle2 size={16} />
                ) : (
                  <Save size={16} />
                )}
                {isSaving ? 'Saving...' : showSuccess ? 'Saved' : 'Save Profile'}
              </button>
            </div>
          </motion.form>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-surface border border-border-main rounded-xl p-5 space-y-2 shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-secondary/10 rounded-lg text-secondary">
                  <Smartphone size={16} />
                </div>
                <h4 className="font-heading text-text-main font-bold text-xs uppercase tracking-wider">Active Device</h4>
              </div>
              <p className="text-xs text-text-muted font-medium">Verified Chrome practitioner session active.</p>
            </div>

            <div className="bg-surface border border-border-main rounded-xl p-5 space-y-2 shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-secondary/10 rounded-lg text-secondary">
                  <MapPin size={16} />
                </div>
                <h4 className="font-heading text-text-main font-bold text-xs uppercase tracking-wider">Hub Location</h4>
              </div>
              <p className="text-xs text-text-muted font-medium">Hyderabad, Telangana (IST UTC+05:30).</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
