import React, { useEffect, useState } from 'react';
import api from '../lib/api';
import { useAuth } from '../hooks/useAuth';
import { 
  Search, 
  Plus, 
  Filter, 
  MoreHorizontal,
  ChevronRight,
  UserPlus,
  X,
  FileText,
  Fingerprint,
  Activity,
  CheckCircle2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';
import HealthScene from '../components/HealthScene';

const Patients = () => {
  const { isMedicalStaff, isAdmin } = useAuth();
  const [patients, setPatients] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [fullName, setFullName] = useState('');
  const [externalId, setExternalId] = useState('');
  const [condition, setCondition] = useState('');
  const [gender, setGender] = useState('Other');
  const [dob, setDob] = useState('');
  const [notes, setNotes] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  const fetchPatients = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/api/patients/');
      setPatients(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
    if (location.state?.openAddModal && isMedicalStaff) {
      setIsAddModalOpen(true);
      window.history.replaceState({}, document.title);
    }
  }, [location, isMedicalStaff]);

  const handleAddPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;
    
    setIsSaving(true);
    try {
      const res = await api.post('/api/patients/', {
        full_name: fullName.trim(),
        external_id: externalId.trim() || `SB-${Math.floor(Math.random() * 10000)}`,
        condition: condition.trim() || 'General Clinical Observation',
        gender,
        dob,
        notes: notes.trim()
      });
      setIsAddModalOpen(false);
      setFullName('');
      setExternalId('');
      setCondition('');
      setDob('');
      setNotes('');
      await fetchPatients();
      navigate(`/patients/${res.data.id}`);
    } catch (err) {
      console.error(err);
      alert('Failed to create patient record in registry');
    } finally {
      setIsSaving(false);
    }
  };

  const filteredPatients = patients.filter(p => 
    (p.full_name || '').toLowerCase().includes(search.toLowerCase()) || 
    (p.external_id || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 md:p-10 space-y-8 relative overflow-hidden pb-20 bg-background text-text-main min-h-screen"
    >
      <div className="absolute top-0 right-0 w-[400px] h-[400px] -mr-32 -mt-20 opacity-10 pointer-events-none">
        <HealthScene type="dna" />
      </div>

      <header className="flex flex-col sm:flex-row sm:items-center justify-between relative z-10 gap-5">
        <div>
          <span className="text-[11px] font-bold text-secondary uppercase tracking-widest">Clinical Registry</span>
          <h1 className="font-heading text-3xl font-black tracking-tight text-text-main mt-0.5">
            Patient & Healthcare Records
          </h1>
          <p className="text-text-muted mt-1 text-xs font-medium">
            Managed medical charts, pharmaceutical history, and access control for Shell Biotech practitioners.
          </p>
        </div>
        {isMedicalStaff && (
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsAddModalOpen(true)}
            className="w-full sm:w-auto bg-[#0b1f33] hover:bg-[#16324f] dark:bg-secondary dark:hover:bg-secondary-light text-white px-6 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-sm text-xs uppercase tracking-wider cursor-pointer"
          >
            <UserPlus size={18} />
            Draft Patient Chart
          </motion.button>
        )}
      </header>

      <div className="flex items-center gap-4 relative z-10">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-3.5 text-text-muted group-focus-within:text-secondary transition-colors" size={19} />
          <input
            type="text"
            placeholder="Search by patient name, MRN, or clinical ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface border border-border-main rounded-xl pl-12 pr-5 py-3 text-text-main focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary transition-all font-medium placeholder:text-text-muted/40 text-sm shadow-xs"
          />
        </div>
        <button className="bg-surface border border-border-main text-text-muted p-3 rounded-xl hover:text-secondary hover:border-secondary/40 transition-all shadow-xs cursor-pointer">
          <Filter size={19} />
        </button>
      </div>

      <div className="bg-surface border border-border-main rounded-2xl overflow-hidden shadow-sm relative z-10">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[850px]">
          <thead>
            <tr className="bg-secondary/5 border-b border-border-main">
              <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-[0.16em]">Patient Name</th>
              <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-[0.16em]">System Identifier</th>
              {isAdmin ? (
                <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-[0.16em]">Assigned Practitioner</th>
              ) : (
                <>
                  <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-[0.16em]">Clinical Condition</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-[0.16em]">Gender</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-[0.16em]">DOB</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-[0.16em] text-right">Actions</th>
                </>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-main text-sm">
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={isAdmin ? 3 : 6} className="px-6 py-6 bg-surface/50"></td>
                </tr>
              ))
            ) : filteredPatients.length > 0 ? (
              filteredPatients.map((patient, idx) => (
                <motion.tr 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  key={patient.id} 
                  className="hover:bg-secondary/5 transition-colors group cursor-default"
                >
                  <td className="px-6 py-4">
                    <Link to={`/patients/${patient.id}`} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0b1f33] to-[#496b5a] flex items-center justify-center text-white font-bold shadow-xs group-hover:scale-105 transition-transform text-sm">
                        {(patient.full_name || '?').charAt(0)}
                      </div>
                      <span className="font-bold group-hover:text-secondary transition-colors text-text-main">
                        {patient.full_name}
                      </span>
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <span className="text-xs font-mono font-semibold text-text-muted">{patient.external_id}</span>
                       {!isAdmin && patient.can_write && (
                         <span className="px-2 py-0.5 bg-secondary/10 text-secondary text-[9px] font-bold rounded-md border border-secondary/20 uppercase tracking-wider">
                           Read-Write
                         </span>
                       )}
                    </div>
                  </td>
                  {isAdmin ? (
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-secondary/10 text-secondary text-xs font-semibold rounded-full border border-secondary/20">
                        {patient.doctor_assigned || 'Unassigned'}
                      </span>
                    </td>
                  ) : (
                    <>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-secondary/10 text-secondary text-xs font-semibold rounded-full border border-secondary/20">
                          {patient.condition || 'General Care'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-text-muted">{patient.gender}</td>
                      <td className="px-6 py-4 text-xs font-medium text-text-muted">{patient.dob || '—'}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link 
                            to={`/patients/${patient.id}`}
                            className="p-2 text-text-muted hover:text-secondary hover:bg-secondary/10 rounded-lg transition-all"
                          >
                            <ChevronRight size={18} />
                          </Link>
                        </div>
                      </td>
                    </>
                  )}
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan={isAdmin ? 3 : 6} className="px-6 py-16 text-center text-text-muted font-bold uppercase tracking-wider text-xs">
                  No patient clinical records found matching criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      </div>

      {/* Add Patient Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-lg bg-surface border border-border-main rounded-2xl p-6 sm:p-8 shadow-2xl relative z-10 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 border-b border-border-main mb-5">
                <div>
                  <h3 className="font-heading text-lg font-black text-text-main">Draft Clinical Patient Chart</h3>
                  <p className="text-xs text-text-muted font-medium">Record into Shell Biotech hospital registry</p>
                </div>
                <button onClick={() => setIsAddModalOpen(false)} className="p-1.5 text-text-muted hover:text-text-main rounded-lg cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleAddPatient} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-text-main uppercase tracking-wider">Patient Full Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Ramesh Reddy"
                    className="w-full bg-surface border border-border-main rounded-xl px-3.5 py-2.5 text-text-main focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary transition-all font-medium text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-text-main uppercase tracking-wider">MRN / Sequence ID</label>
                    <input
                      type="text"
                      value={externalId}
                      onChange={(e) => setExternalId(e.target.value)}
                      placeholder="SB-1049"
                      className="w-full bg-surface border border-border-main rounded-xl px-3.5 py-2.5 text-text-main focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary transition-all font-medium text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-text-main uppercase tracking-wider">Gender</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full bg-surface border border-border-main rounded-xl px-3.5 py-2.5 text-text-main focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary transition-all font-medium text-sm"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-text-main uppercase tracking-wider">Primary Condition</label>
                    <input
                      type="text"
                      value={condition}
                      onChange={(e) => setCondition(e.target.value)}
                      placeholder="e.g. Hypertension, Diabetes"
                      className="w-full bg-surface border border-border-main rounded-xl px-3.5 py-2.5 text-text-main focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary transition-all font-medium text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-text-main uppercase tracking-wider">Date of Birth</label>
                    <input
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full bg-surface border border-border-main rounded-xl px-3.5 py-2.5 text-text-main focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary transition-all font-medium text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-text-main uppercase tracking-wider">Clinical Notes & Formulations</label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Patient presentation, therapeutic course, or prescribed formulations..."
                    className="w-full bg-surface border border-border-main rounded-xl px-3.5 py-2.5 text-text-main focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary transition-all font-medium text-sm resize-none"
                  />
                </div>

                <div className="pt-3 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2.5 text-text-muted hover:text-text-main text-xs font-bold uppercase tracking-wider"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="bg-[#0b1f33] hover:bg-[#16324f] dark:bg-secondary dark:hover:bg-secondary-light text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50"
                  >
                    {isSaving ? 'Creating...' : 'Register Patient'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Patients;
