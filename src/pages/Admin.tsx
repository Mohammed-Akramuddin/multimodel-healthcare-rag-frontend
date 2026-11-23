import React, { useEffect, useState } from 'react';
import api from '../lib/api';
import { 
  ShieldAlert, 
  Users, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Database, 
  UserCheck, 
  Activity, 
  ShieldCheck,
  Building2,
  MapPin
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

interface SignupRequest {
  id: number;
  full_name: string;
  email: string;
  role: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

const Admin = () => {
  const [stats, setStats] = useState<any>(null);
  const [requests, setRequests] = useState<SignupRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const fetchAdminData = async () => {
    try {
      const [statsRes, requestsRes] = await Promise.all([
        api.get('/api/admin/stats'),
        api.get('/api/admin/signup-requests')
      ]);
      setStats(statsRes.data);
      setRequests(requestsRes.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch administrative data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleAction = async (id: number, action: 'approve' | 'reject') => {
    setActionLoading(id);
    try {
      await api.post(`/api/admin/signup-requests/${id}/${action}`, {});
      await fetchAdminData();
    } catch (err: any) {
      alert(err.response?.data?.detail || `Failed to ${action} practitioner request`);
    } finally {
      setActionLoading(null);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 md:p-10 space-y-6 animate-pulse text-text-muted">
        <div className="h-8 w-56 bg-surface rounded-xl mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[...Array(4)].map((_, i) => <div key={i} className="h-28 bg-surface rounded-2xl" />)}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-red-500 flex flex-col items-center justify-center min-h-[50vh]">
        <ShieldAlert size={44} className="mb-3" />
        <h2 className="font-heading text-lg font-bold">Administrative Permission Required</h2>
        <p className="text-xs text-text-muted mt-1">{error}</p>
        <button onClick={fetchAdminData} className="mt-4 px-5 py-2 bg-surface rounded-xl border border-border-main hover:bg-secondary/10 text-xs font-bold transition-all">
          Retry Fetch
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 space-y-8 pb-20 bg-background text-text-main min-h-screen">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-secondary uppercase tracking-widest">Administration</span>
            <span className="w-1 h-1 rounded-full bg-text-muted/30" />
            <span className="text-[11px] font-medium text-text-muted">Shell Biotech Hub</span>
          </div>
          <h1 className="font-heading text-2xl md:text-3xl font-black text-text-main tracking-tight mt-0.5">
            System Administration & Access Control
          </h1>
          <p className="text-text-muted mt-1 text-xs font-medium">Manage clinical practitioner credentials, user provisioning, and distribution telemetry.</p>
        </div>
        <div className="flex items-center gap-2.5 self-end md:self-auto bg-surface border border-border-main px-3.5 py-2 rounded-xl text-xs font-semibold text-text-muted shadow-xs">
          <Clock size={14} className="text-secondary" />
          <span>Last Sync: {new Date().toLocaleTimeString()}</span>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { name: 'Authorized Practitioners', value: stats?.total_users ?? 0, icon: Users, color: 'text-[#0b1f33] dark:text-[#5b8570]', bg: 'bg-[#0b1f33]/10 dark:bg-[#5b8570]/20' },
          { name: 'Registered Patient Charts', value: stats?.total_patients ?? 0, icon: UserCheck, color: 'text-[#496b5a]', bg: 'bg-[#496b5a]/10' },
          { name: 'Formulations & Docs', value: stats?.total_documents ?? 0, icon: FileText, color: 'text-[#2e6b47]', bg: 'bg-[#2e6b47]/10' },
          { name: 'Active Sessions (24h)', value: stats?.active_sessions ?? 0, icon: Activity, color: 'text-[#1f5582]', bg: 'bg-[#1f5582]/10' },
        ].map((stat, i) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="bg-surface border border-border-main rounded-2xl p-6 transition-all shadow-xs relative overflow-hidden"
          >
            <div className="relative z-10">
              <div className={cn("p-2.5 rounded-xl w-fit mb-3 shadow-inner", stat.bg)}>
                <stat.icon className={stat.color} size={20} />
              </div>
              <p className="text-text-muted text-[10px] font-bold uppercase tracking-wider">{stat.name}</p>
              <h3 className="font-heading text-2xl font-black text-text-main mt-1 tabular-nums">
                {stat.value}
              </h3>
            </div>
            <div className="absolute -right-3 -bottom-3 opacity-5">
              <stat.icon size={80} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Requests Table */}
      <div className="bg-surface border border-border-main rounded-2xl overflow-hidden shadow-sm">
        <div className="p-5 sm:p-6 border-b border-border-main flex flex-col sm:flex-row sm:items-center justify-between bg-secondary/5 gap-3">
          <div>
            <h2 className="font-heading text-lg font-black text-text-main flex items-center gap-2">
              <Database size={18} className="text-secondary" />
              Practitioner Authorization Requests
            </h2>
            <p className="text-xs text-text-muted mt-0.5 font-medium">Review and verify new hospital practitioners and clinic caregivers.</p>
          </div>
          <span className="w-fit px-3 py-1 bg-secondary/10 rounded-lg text-[10px] font-bold text-secondary uppercase tracking-wider border border-secondary/20">
            {requests.length} Requests Total
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px] text-sm">
            <thead>
              <tr className="bg-secondary/5 border-b border-border-main">
                <th className="px-6 py-3.5 text-[10px] font-bold text-text-muted uppercase tracking-[0.16em]">Practitioner Profile</th>
                <th className="px-6 py-3.5 text-[10px] font-bold text-text-muted uppercase tracking-[0.16em]">Role</th>
                <th className="px-6 py-3.5 text-[10px] font-bold text-text-muted uppercase tracking-[0.16em]">Requested On</th>
                <th className="px-6 py-3.5 text-[10px] font-bold text-text-muted uppercase tracking-[0.16em]">Status</th>
                <th className="px-6 py-3.5 text-[10px] font-bold text-text-muted uppercase tracking-[0.16em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-main">
              {requests.length > 0 ? (
                requests.map((request) => (
                  <tr key={request.id} className="hover:bg-secondary/5 transition-all group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0b1f33] to-[#496b5a] flex items-center justify-center text-white font-bold text-sm shadow-xs">
                          {request.full_name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-text-main group-hover:text-secondary transition-colors">{request.full_name}</p>
                          <p className="text-xs text-text-muted font-medium">{request.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-secondary/10 text-secondary text-[10px] font-bold rounded-md border border-secondary/20 uppercase tracking-wider">
                        {request.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-text-muted font-medium">
                      {new Date(request.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {request.status === 'pending' ? (
                        <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20 w-fit">
                          <Clock size={12} /> Pending Review
                        </span>
                      ) : request.status === 'approved' ? (
                        <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20 w-fit">
                          <CheckCircle2 size={12} /> Authorized
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-red-600 dark:text-red-400 text-[10px] font-bold uppercase tracking-wider bg-red-500/10 px-2.5 py-1 rounded-md border border-red-500/20 w-fit">
                          <XCircle size={12} /> Rejected
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {request.status === 'pending' ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleAction(request.id, 'approve')}
                            disabled={actionLoading === request.id}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleAction(request.id, 'reject')}
                            disabled={actionLoading === request.id}
                            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-text-muted italic">Processed</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-text-muted font-bold uppercase tracking-wider text-xs">
                    No pending practitioner requests in queue.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Admin;
