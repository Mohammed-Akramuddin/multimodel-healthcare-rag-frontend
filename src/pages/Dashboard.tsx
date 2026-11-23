import React, { useEffect, useState } from 'react';
import api from '../lib/api';
import { 
  Users, 
  FileText, 
  Activity, 
  Clock, 
  TrendingUp,
  ArrowUpRight,
  ChevronRight,
  ShieldCheck,
  Zap,
  Building2,
  MapPin,
  Stethoscope,
  Info
} from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { cn } from '../lib/utils';
import { useAuth } from '../hooks/useAuth';
import HealthScene from '../components/HealthScene';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [recentPatients, setRecentPatients] = useState<any[]>([]);
  const [trendsData, setTrendsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, patientsRes, trendsRes] = await Promise.all([
          api.get('/api/admin/stats').catch(() => ({ data: { total_patients: 0, total_users: 0, total_documents: 0, active_sessions: 0 } })),
          api.get('/api/patients/'),
          api.get('/api/admin/trends').catch(() => ({ data: [] }))
        ]);
        setStats(statsRes.data);
        setRecentPatients(patientsRes.data.slice(0, 3));
        setTrendsData(trendsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const isPatient = user?.role === 'patient';

  const statCards = [
    { 
      name: isPatient ? 'My Health Records' : 'Total Patients Registered', 
      value: stats?.total_patients || 0, 
      icon: Users, 
      color: 'text-[#0b1f33] dark:text-[#5b8570]', 
      bg: 'bg-[#0b1f33]/10 dark:bg-[#5b8570]/20',
      border: 'hover:border-[#0b1f33]/40 dark:hover:border-[#5b8570]/40'
    },
    { 
      name: isPatient ? 'My Clinical Documents' : 'Formulations & Clinical Notes', 
      value: stats?.total_documents || 0, 
      icon: FileText, 
      color: 'text-[#496b5a]', 
      bg: 'bg-[#496b5a]/10',
      border: 'hover:border-[#496b5a]/40'
    },
    { 
      name: 'Active Clinical Sessions', 
      value: stats?.active_sessions || 0, 
      icon: Activity, 
      color: 'text-[#2e6b47]', 
      bg: 'bg-[#2e6b47]/10',
      border: 'hover:border-[#2e6b47]/40'
    },
    { 
      name: 'Institutional Telemetry', 
      value: '99.98%', 
      icon: ShieldCheck, 
      color: 'text-[#1f5582]', 
      bg: 'bg-[#1f5582]/10',
      border: 'hover:border-[#1f5582]/40'
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="p-6 md:p-10 space-y-8 relative overflow-hidden bg-background min-h-screen text-text-main">
      {/* Shell Biotech Hero Watermark Asset */}
      <div 
        className="absolute top-0 right-0 w-[650px] h-[650px] -mr-32 -mt-24 opacity-15 pointer-events-none mix-blend-multiply dark:mix-blend-screen"
        style={{ 
          backgroundImage: 'url("/shellbiotech_hero.png")',
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      {/* Mesh Background */}
      <div className="absolute inset-0 bg-mesh opacity-60 z-0 pointer-events-none" />

      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between relative z-10 gap-6"
      >
        <div className="flex items-center gap-5">
           <div className="w-14 h-14 bg-white border border-[#d9ddda] rounded-2xl flex items-center justify-center p-2 shadow-sm">
             <img 
               src="/shellbiotech_logo.png" 
               alt="Shell Biotech Logo" 
               className="max-h-full max-w-full object-contain"
             />
           </div>
           <div>
              <div className="flex items-center gap-2">
                <span className="font-heading text-xs font-black uppercase tracking-widest text-secondary">Shell Biotech</span>
                <span className="w-1 h-1 rounded-full bg-text-muted/30" />
                <span className="text-[11px] font-semibold text-text-muted">Hyderabad Network</span>
              </div>
              <h1 className="font-heading text-3xl md:text-4xl font-black tracking-tight text-text-main">
                {isPatient ? 'Patient Clinical Portal' : 'Clinical & Distribution Overview'}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-text-muted font-medium text-xs">
                  Signed in as <span className="text-secondary font-bold">{user?.full_name || 'Healthcare Practitioner'}</span>
                </span>
                <span className="w-1 h-1 rounded-full bg-text-muted/30" />
                <span className="px-2.5 py-0.5 bg-secondary/10 border border-secondary/20 rounded-full text-[10px] font-bold uppercase tracking-wider text-secondary">
                  {user?.role}
                </span>
              </div>
           </div>
        </div>
        <div className="hidden sm:flex items-center gap-3 bg-surface border border-border-main px-4 py-2.5 rounded-xl shadow-xs">
           <Clock size={15} className="text-secondary" />
           <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
             Telemetry: Connected
           </span>
           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>
      </motion.header>

      {/* Institutional Operational Notice */}
      <div className="relative z-10 p-4 bg-secondary/10 border-l-4 border-secondary rounded-xl flex items-start gap-3 shadow-xs">
        <Info size={18} className="text-secondary flex-shrink-0 mt-0.5" />
        <div className="text-xs text-text-main font-medium leading-relaxed">
          <strong className="text-text-main font-bold">Operational Note:</strong> Shell Biotech manages pharmaceutical sourcing, regulatory verification, marketing representation, and institutional hospital distribution across healthcare facilities.
        </div>
      </div>

      {/* Stats Cards */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 relative z-10"
      >
        {statCards.map((stat) => (
          <motion.div
            key={stat.name}
            variants={item}
            className={cn(
              "group relative overflow-hidden bg-surface border border-border-main rounded-2xl p-6 transition-all duration-300 shadow-sm hover:shadow-md",
              stat.border
            )}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={cn("p-3 rounded-xl shadow-inner", stat.bg)}>
                <stat.icon className={stat.color} size={24} />
              </div>
              <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                <TrendingUp size={13} />
                Active
              </div>
            </div>
            <div>
              <p className="text-text-muted text-[11px] font-bold uppercase tracking-wider mb-1">{stat.name}</p>
              <h3 className="font-heading text-3xl font-black tracking-tight tabular-nums text-text-main">
                {loading ? <span className="animate-pulse opacity-40 text-xl">Loading...</span> : stat.value}
              </h3>
            </div>
            <div className="absolute bottom-0 right-0 p-3 opacity-5 group-hover:opacity-15 transition-opacity">
               <stat.icon size={64} />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.99 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 space-y-8"
        >
          {!isPatient && (
            <div className="bg-surface border border-border-main rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                  <h2 className="font-heading text-xl font-black text-text-main flex items-center gap-3">
                    <div className="p-2 bg-secondary/10 rounded-xl border border-secondary/20">
                      <Activity size={20} className="text-secondary" />
                    </div>
                    Clinical Activity Velocity
                  </h2>
                  <p className="text-text-muted text-xs mt-1 font-medium">Daily healthcare throughput, diagnostic consultations, and patient visits</p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#0b1f33] dark:bg-[#5b8570]" />
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Visits</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#496b5a]" />
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Registry Intake</span>
                  </div>
                </div>
              </div>
              <div className="h-[320px] w-full">
                {loading ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-12 h-12 border-3 border-secondary/20 border-t-secondary rounded-full animate-spin" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendsData}>
                      <defs>
                        <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0b1f33" stopOpacity={0.6}/>
                          <stop offset="95%" stopColor="#0b1f33" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorPatients" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#496b5a" stopOpacity={0.6}/>
                          <stop offset="95%" stopColor="#496b5a" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.06} vertical={false} />
                      <XAxis 
                        dataKey="name" 
                        stroke="currentColor" 
                        opacity={0.4}
                        fontSize={11} 
                        fontWeight={600}
                        tickLine={false} 
                        axisLine={false} 
                        dy={12}
                      />
                      <YAxis 
                        stroke="currentColor" 
                        opacity={0.4}
                        fontSize={11} 
                        fontWeight={600}
                        tickLine={false} 
                        axisLine={false} 
                        dx={-12}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'var(--surface)', 
                          border: '1px solid var(--border-main)', 
                          borderRadius: '12px',
                          padding: '12px 16px',
                          boxShadow: '0 10px 25px rgba(0,0,0,0.08)'
                        }}
                        itemStyle={{ fontSize: '11px', fontWeight: 700 }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="visits" 
                        stroke="#0b1f33" 
                        fillOpacity={1} 
                        fill="url(#colorVisits)" 
                        strokeWidth={3} 
                        animationDuration={1500}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="patients" 
                        stroke="#496b5a" 
                        fillOpacity={1} 
                        fill="url(#colorPatients)" 
                        strokeWidth={3} 
                        animationDuration={1500}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          )}

          {/* Recent Patients Table / Cards */}
          <div className="bg-surface border border-border-main rounded-2xl overflow-hidden shadow-sm relative">
            <div className="p-6 border-b border-border-main flex items-center justify-between">
              <div>
                <h2 className="font-heading text-xl font-black text-text-main">{isPatient ? 'My Health Records' : 'Recent Case Updates'}</h2>
                <p className="text-text-muted text-xs mt-0.5 font-medium">
                  {isPatient ? 'Verified records in Shell Biotech clinical system' : 'Recent diagnostic registrations and telemetry events'}
                </p>
              </div>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                onClick={() => navigate('/patients')}
                className="group px-3 py-1.5 bg-secondary/10 hover:bg-secondary text-secondary hover:text-white rounded-xl transition-all border border-secondary/20 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span>View Full Registry</span>
                <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </motion.button>
            </div>
            <div className="divide-y divide-border-main">
              {recentPatients.length > 0 ? recentPatients.map((patient, idx) => (
                <motion.div 
                  key={patient.id} 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + (idx * 0.05) }}
                  onClick={() => navigate(`/patients/${patient.id}`)}
                  className="p-5 flex items-center justify-between hover:bg-secondary/5 transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0b1f33] to-[#496b5a] flex items-center justify-center text-white font-black text-base shadow-xs group-hover:scale-105 transition-transform">
                      {(patient.full_name || '?').charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-heading text-base font-bold text-text-main group-hover:text-secondary transition-colors">{patient.full_name}</h4>
                      <p className="text-[11px] text-text-muted flex items-center gap-2 mt-0.5 font-medium">
                        <span className="font-mono text-secondary font-bold">{patient.external_id || 'ID::UNSET'}</span>
                        <span className="w-1 h-1 rounded-full bg-text-muted/30" />
                        <span>{patient.condition || 'General Care'}</span>
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="px-3 py-1 bg-secondary/10 text-secondary text-[10px] font-bold rounded-full border border-secondary/20 uppercase tracking-wider">
                      Verified Active
                    </span>
                  </div>
                </motion.div>
              )) : (
                <div className="p-12 text-center text-text-muted font-bold uppercase tracking-wider text-xs">
                  No recent patient cases recorded.
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Right Column: Pulse Actions & AI Box */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6 relative z-10"
        >
          {/* Quick Actions */}
          <div className="bg-surface border border-border-main rounded-2xl p-6 shadow-sm">
            <h2 className="font-heading text-lg font-black mb-5 flex items-center gap-2.5 text-text-main">
               <Zap size={18} className="text-secondary" />
               Clinical Actions
            </h2>
            <div className="space-y-3">
              {!isPatient && (
                <button 
                  onClick={() => navigate('/patients', { state: { openAddModal: true } })}
                  className="w-full flex items-center justify-between p-4 bg-[#0b1f33] hover:bg-[#16324f] dark:bg-secondary dark:hover:bg-secondary-light text-white rounded-xl transition-all font-bold text-xs uppercase tracking-wider shadow-sm group cursor-pointer"
                >
                  <span>New Patient Chart</span>
                  <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              )}
              <button 
                onClick={() => navigate('/patients')}
                className="w-full flex items-center justify-between p-4 bg-surface hover:bg-secondary/10 border border-border-main rounded-xl transition-all font-bold text-xs uppercase tracking-wider text-text-main group cursor-pointer"
              >
                <span>{isPatient ? 'Lab Formulations' : 'Ingest Clinical Documents'}</span>
                <FileText size={18} className="text-secondary" />
              </button>
              {isAdmin && (
                <button 
                  onClick={() => navigate('/audit')}
                  className="w-full flex items-center justify-between p-4 bg-surface hover:bg-secondary/10 border border-border-main rounded-xl transition-all font-bold text-xs uppercase tracking-wider text-text-main group cursor-pointer"
                >
                  <span>Security Audit Log</span>
                  <ShieldCheck size={18} className="text-emerald-600 dark:text-emerald-400" />
                </button>
              )}
            </div>
          </div>

          {/* AI Reasoning Box */}
          <motion.div 
            whileHover={{ scale: 1.01 }}
            onClick={() => navigate('/assistant')}
            className="bg-gradient-to-br from-[#0b1f33] via-[#16324f] to-[#496b5a] rounded-2xl p-6 text-white relative overflow-hidden shadow-lg group cursor-pointer"
          >
            <div className="absolute top-0 right-0 w-full h-full opacity-20 group-hover:opacity-30 transition-opacity">
              <HealthScene type="heart" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-white/15 backdrop-blur-md rounded-xl">
                  <Zap size={20} className="text-white fill-white animate-pulse" />
                </div>
                <h3 className="font-heading text-xl font-black tracking-tight">Shell Biotech AI</h3>
              </div>
              <p className="text-xs text-white/90 mb-6 font-medium leading-relaxed">
                Context-aware multimodal clinical reasoning and pharmaceutical documentation synthesis.
              </p>
              <button className="bg-white text-[#0b1f33] px-5 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all hover:bg-emerald-50 uppercase tracking-wider">
                Open Assistant
              </button>
            </div>
          </motion.div>

          {/* Regional Hub Info */}
          <div className="bg-surface border border-border-main rounded-2xl p-6 shadow-sm">
            <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-4">
              Regional Operations Hub
            </h3>
            <div className="space-y-3.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-text-muted font-medium">Distribution Network</span>
                <span className="font-bold text-secondary">Telangana State</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-muted font-medium">Registered Office</span>
                <span className="font-bold text-text-main">Hyderabad – 501505</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-muted font-medium">Clinical RAG Engine</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">Online & Synchronized</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* 3D Flow Decoration */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-24 opacity-10 pointer-events-none z-0">
          <HealthScene type="dna" />
      </div>
    </div>
  );
};

export default Dashboard;
