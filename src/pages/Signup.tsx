import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { 
  Stethoscope, 
  KeyRound, 
  Mail, 
  AlertCircle, 
  User as UserIcon, 
  Shield,
  ArrowRight,
  CheckCircle2,
  Activity,
  MapPin,
  Building2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import HealthScene from '../components/HealthScene';

const ChevronDown = ({ className, size }: { className?: string, size?: number }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="m6 9 6 6 6-6"/>
  </svg>
);

const Signup = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('doctor');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setError(null);
    setIsSubmitting(true);
    
    try {
      await register(fullName, email, role, password);
      setIsSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Registration failed early. Please contact system admin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Shell Biotech Hero Image Background */}
      <div 
        className="absolute inset-0 z-0 opacity-20 mix-blend-multiply dark:mix-blend-screen"
        style={{ 
          backgroundImage: 'url("/shellbiotech_hero.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-tr from-background via-background/90 to-[#0b1f33]/15 z-0" />

      {/* 3D Scene Background */}
      <div className="absolute top-0 right-0 w-[450px] h-[450px] opacity-15 pointer-events-none z-0">
        <HealthScene type="dna" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl z-10"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 bg-white border border-[#d9ddda] rounded-2xl flex items-center justify-center p-2 shadow-sm">
            <img 
              src="/shellbiotech_logo.png" 
              alt="Shell Biotech Logo" 
              className="max-h-full max-w-full object-contain"
            />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-black text-text-main tracking-tight">SHELL BIOTECH</h1>
            <p className="text-secondary font-bold text-xs uppercase tracking-wider mt-0.5">Clinical Access & Role Management</p>
          </div>
        </div>

        <div className="glass-panel rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden border border-border-main">
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.div
                key="signup-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="font-heading text-xl font-bold text-text-main">Request Practitioner Provisioning</h2>
                  <p className="text-text-muted text-xs mt-1 font-medium">
                    Shell Biotech validates all healthcare provider credentials for institutional distribution.
                  </p>
                </div>

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 shadow-xs"
                  >
                    <AlertCircle size={16} />
                    <span>{error}</span>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-text-main uppercase tracking-wider ml-1">Practitioner Legal Name</label>
                    <div className="relative group">
                      <UserIcon className="absolute left-4 top-3 text-text-muted group-focus-within:text-secondary transition-colors" size={17} />
                      <input
                        type="text"
                        required
                        placeholder="Dr. R. Sharma"
                        className="w-full bg-surface border border-border-main rounded-xl px-4 py-3 pl-11 text-text-main focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary transition-all font-medium placeholder:text-text-muted/40 text-sm shadow-xs"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-text-main uppercase tracking-wider ml-1">Hospital / Institutional Email</label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-3 text-text-muted group-focus-within:text-secondary transition-colors" size={17} />
                      <input
                        type="email"
                        required
                        placeholder="doctor@apollohealth.org"
                        className="w-full bg-surface border border-border-main rounded-xl px-4 py-3 pl-11 text-text-main focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary transition-all font-medium placeholder:text-text-muted/40 text-sm shadow-xs"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-text-main uppercase tracking-wider ml-1">Secure Passkey</label>
                      <div className="relative group">
                        <KeyRound className="absolute left-4 top-3 text-text-muted group-focus-within:text-secondary transition-colors" size={17} />
                        <input
                          type="password"
                          required
                          placeholder="••••••••"
                          className="w-full bg-surface border border-border-main rounded-xl px-4 py-3 pl-11 text-text-main focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary transition-all font-medium placeholder:text-text-muted/40 text-sm shadow-xs"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-text-main uppercase tracking-wider ml-1">Requested Specialty Role</label>
                      <div className="relative group">
                        <Shield className="absolute left-4 top-3 text-text-muted group-focus-within:text-secondary transition-colors" size={17} />
                        <select
                          className="w-full bg-surface border border-border-main rounded-xl px-4 py-3 pl-11 text-text-main focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary transition-all font-medium appearance-none cursor-pointer text-sm shadow-xs"
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                        >
                          <option value="doctor">Attending Physician (Doctor)</option>
                          <option value="nurse">Clinical Nurse / Caregiver</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-3.5 text-text-muted pointer-events-none" size={15} />
                      </div>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#0b1f33] hover:bg-[#16324f] dark:bg-secondary dark:hover:bg-secondary-light text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-[#0b1f33]/20 disabled:opacity-50 mt-3 text-sm uppercase tracking-wider cursor-pointer"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Submit Clinical Authorization Request
                        <ArrowRight size={17} />
                      </>
                    )}
                  </motion.button>
                </form>

                <div className="pt-4 border-t border-subtle text-center">
                  <p className="text-xs text-text-muted font-medium">
                    Already registered with Shell Biotech? <Link to="/login" className="text-secondary font-bold hover:underline ml-1">Sign in</Link>
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="success-message"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-10 flex flex-col items-center text-center space-y-6"
              >
                <div className="w-20 h-20 bg-secondary/20 rounded-2xl flex items-center justify-center border border-secondary/40 text-secondary shadow-lg">
                  <CheckCircle2 size={44} />
                </div>
                <div>
                  <h3 className="font-heading text-2xl font-black text-text-main">Authorization Requested</h3>
                  <p className="text-text-muted mt-2 text-xs font-medium max-w-sm">
                    Your practitioner profile has been submitted to Shell Biotech administration for regulatory review.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-secondary uppercase tracking-wider bg-secondary/10 px-5 py-2.5 rounded-full border border-secondary/20">
                  <Activity size={14} className="animate-pulse" />
                  Redirecting to Sign In...
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-8 flex items-center justify-center gap-6 text-[10px] font-bold text-text-subtle uppercase tracking-widest">
           <span className="flex items-center gap-1.5"><Shield size={12} className="text-secondary" /> AES-256 Vault</span>
           <span className="flex items-center gap-1.5"><Activity size={12} className="text-secondary" /> Audit Verified</span>
           <span className="flex items-center gap-1.5"><Building2 size={12} className="text-secondary" /> Hyderabad Network</span>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
