import React, { useEffect, useState } from 'react';
import api from '../lib/api';
import { 
  Activity, 
  Clock, 
  Filter, 
  Search, 
  ShieldCheck, 
  AlertCircle, 
  Database, 
  ArrowRight, 
  Tag 
} from 'lucide-react';
import { motion } from 'framer-motion';

interface AuditLog {
  id: number;
  user_id: number | null;
  action: string;
  resource_type: string;
  resource_id: number | null;
  details: any;
  created_at: string;
}

const Audit = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await api.get('/api/audit/?limit=50');
        setLogs(res.data);
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Failed to fetch audit logs');
      } finally {
        setIsLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const formatTime = (iso: string) => {
    return new Date(iso).toLocaleString();
  };

  const filteredLogs = logs.filter(l => 
    l.action.toLowerCase().includes(search.toLowerCase()) ||
    l.resource_type.toLowerCase().includes(search.toLowerCase()) ||
    (l.details?.email && l.details.email.toLowerCase().includes(search.toLowerCase()))
  );

  if (isLoading) {
    return (
      <div className="p-6 md:p-10 space-y-6 animate-pulse text-text-muted">
        <div className="h-8 w-56 bg-surface rounded-xl mb-4" />
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => <div key={i} className="h-14 bg-surface rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 space-y-6 h-screen md:h-[calc(100vh-2rem)] flex flex-col pb-24 md:pb-0 bg-background text-text-main">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-secondary uppercase tracking-widest">Compliance Vault</span>
          <h1 className="font-heading text-2xl md:text-3xl font-black text-text-main tracking-tight mt-0.5">
            Security & Clinical Access Audit
          </h1>
          <p className="text-text-muted mt-1 text-xs font-medium">Real-time immutable log of all clinical chart accesses and data modifications.</p>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto bg-surface border border-border-main px-3.5 py-2 rounded-xl text-xs font-bold text-secondary shadow-xs">
          <ShieldCheck size={16} className="text-secondary" />
          <span>Compliance Status: Verified Healthy</span>
        </div>
      </header>

      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 text-text-muted" size={18} />
          <input
            type="text"
            placeholder="Search activity events, emails, or resources..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface border border-border-main rounded-xl pl-11 pr-4 py-2.5 text-xs sm:text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary transition-all font-medium placeholder:text-text-muted/40 shadow-xs"
          />
        </div>
        <button className="bg-surface border border-border-main text-text-muted p-2.5 rounded-xl hover:text-secondary hover:border-secondary/40 transition-all shadow-xs cursor-pointer">
          <Filter size={18} />
        </button>
      </div>

      <div className="bg-surface border border-border-main rounded-2xl overflow-hidden flex-1 flex flex-col shadow-xs min-h-0">
        <div className="overflow-auto flex-1">
          <table className="w-full text-left border-collapse min-w-[700px] text-xs">
            <thead className="sticky top-0 bg-surface z-10">
              <tr className="bg-secondary/5 border-b border-border-main">
                <th className="px-5 py-3.5 font-bold text-text-muted uppercase tracking-wider">Action Event</th>
                <th className="px-5 py-3.5 font-bold text-text-muted uppercase tracking-wider">Resource Type</th>
                <th className="px-5 py-3.5 font-bold text-text-muted uppercase tracking-wider">Timestamp</th>
                <th className="px-5 py-3.5 font-bold text-text-muted uppercase tracking-wider">Trace ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-main">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-secondary/5 transition-colors group cursor-default">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary font-bold">
                          <Activity size={13} />
                        </div>
                        <div>
                          <p className="font-bold text-text-main group-hover:text-secondary transition-colors uppercase tracking-tight">
                            {log.action.replace(/_/g, ' ')}
                          </p>
                          {log.details?.email && (
                            <p className="text-[10px] text-text-muted font-mono">{log.details.email}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5 text-text-muted">
                        <Tag size={12} className="text-secondary" />
                        <span className="font-medium">
                          {log.resource_type} {log.resource_id ? `(#${log.resource_id})` : ''}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5 text-text-muted">
                        <Clock size={12} />
                        <span>{formatTime(log.created_at)}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="font-mono text-[10px] text-text-muted px-2 py-0.5 bg-background rounded-md border border-border-main">
                        SB-LOG-{log.id}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-5 py-16 text-center text-text-muted font-bold uppercase tracking-wider text-xs">
                    No matching audit records in the registry.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-3 bg-secondary/5 border-t border-border-main text-center">
          <p className="text-[10px] text-text-muted font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5">
            <Database size={11} className="text-secondary" /> Shell Biotech Telemetry Vault · Tamper Evident
          </p>
        </div>
      </div>
    </div>
  );
};

export default Audit;
