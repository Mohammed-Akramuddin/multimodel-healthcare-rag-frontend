import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { useAuth } from '../hooks/useAuth';
import { 
  ArrowLeft, 
  FileText, 
  Upload, 
  Calendar, 
  Clock, 
  User as UserIcon, 
  Activity, 
  ShieldCheck, 
  Plus, 
  ChevronRight, 
  Download, 
  Image as ImageIcon, 
  Shield, 
  StickyNote, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  FolderLock, 
  Fingerprint,
  Building2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import HealthScene from '../components/HealthScene';

const PatientDetail = () => {
  const { id } = useParams();
  const { isAdmin, user: currentUser } = useAuth();
  const [patient, setPatient] = useState<any>(null);
  const [docs, setDocs] = useState<any[]>([]);
  const [images, setImages] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Edit Form State
  const [fullName, setFullName] = useState('');
  const [externalId, setExternalId] = useState('');
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Access Grant State
  const [grantUserId, setGrantUserId] = useState('');
  const [grantLevel, setGrantLevel] = useState('read');
  const [isGranting, setIsGranting] = useState(false);

  // Upload State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadCaption, setUploadCaption] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [pRes, dRes, iRes] = await Promise.all([
        api.get(`/api/patients/${id}`),
        api.get(`/api/documents/?patient_id=${id}`),
        api.get(`/api/images/?patient_id=${id}`)
      ]);
      setPatient(pRes.data);
      setFullName(pRes.data.full_name || '');
      setExternalId(pRes.data.external_id || '');
      setNotes(pRes.data.notes || '');
      setDocs(dRes.data);
      setImages(iRes.data);

      if (isAdmin) {
        const uRes = await api.get('/api/users/');
        setUsers(uRes.data.filter((u: any) => u.role === 'doctor' || u.role === 'nurse'));
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load patient clinical data');
    } finally {
      setIsLoading(false);
    }
  }, [id, isAdmin]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await api.patch(`/api/patients/${id}/`, {
        full_name: fullName.trim(),
        external_id: externalId.trim(),
        notes: notes.trim()
      });
      setPatient(res.data);
      alert('Patient chart updated successfully');
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to update record');
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) return;

    const isImage = ['.png', '.jpg', '.jpeg', '.webp', '.dcm'].some(ext => uploadFile.name.toLowerCase().endsWith(ext));
    if (isImage && !uploadCaption.trim()) {
      alert('Clinical description is required for imaging files.');
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('patient_id', id!);
      formData.append('file', uploadFile);
      if (isImage) {
        formData.append('caption', uploadCaption.trim());
        await api.post('/api/images/', formData);
      } else {
        await api.post('/api/documents/', formData);
      }
      setIsUploadModalOpen(false);
      setUploadFile(null);
      setUploadCaption('');
      await fetchData();
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleGrantAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!grantUserId) return;
    setIsGranting(true);
    try {
      await api.post(`/api/patients/${id}/access/`, {
        user_id: parseInt(grantUserId),
        access_level: grantLevel
      });
      setGrantUserId('');
      alert('Practitioner access provisioned successfully');
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to grant access');
    } finally {
      setIsGranting(false);
    }
  };

  if (isLoading) return <div className="p-12 text-center text-text-muted font-bold uppercase tracking-wider text-xs animate-pulse">Synchronizing Shell Biotech Chart...</div>;
  if (!patient || error) return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 p-8 rounded-2xl max-w-md text-center shadow-lg">
        <AlertCircle size={40} className="mx-auto mb-3" />
        <h2 className="font-heading text-lg font-black uppercase tracking-tight">Access Restricted</h2>
        <p className="text-xs font-medium mt-1">{error || 'Reference ID error.'}</p>
        <Link to="/patients" className="inline-block mt-6 bg-[#0b1f33] text-white px-5 py-2.5 rounded-xl font-bold uppercase tracking-wider text-xs">Return to Registry</Link>
      </div>
    </div>
  );

  const canWrite = isAdmin || patient.can_write;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 md:p-10 space-y-8 pb-20 relative overflow-hidden bg-background text-text-main"
    >
      <div className="absolute inset-0 bg-mesh opacity-40 z-0 pointer-events-none" />
      
      <div className="absolute top-0 right-0 w-[400px] h-[400px] -mr-32 -mt-20 opacity-10 pointer-events-none">
        <HealthScene type="heart" />
      </div>

      <motion.header 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between relative z-10 gap-6"
      >
        <div className="flex items-center gap-4">
          <Link to="/patients" className="p-3 bg-surface border border-border-main rounded-xl text-text-muted hover:text-secondary hover:border-secondary/40 shadow-xs flex items-center justify-center transition-all">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-heading text-2xl md:text-3xl font-black tracking-tight text-text-main">{patient.full_name}</h1>
              <div className={cn(
                "px-3 py-1 text-[10px] font-bold rounded-full border uppercase tracking-wider",
                canWrite ? "bg-secondary/10 text-secondary border-secondary/20" : "bg-[#0b1f33]/10 text-[#0b1f33] border-[#0b1f33]/20"
              )}>
                {canWrite ? 'Read-Write Access' : 'Read-Only Mode'}
              </div>
            </div>
            <p className="text-text-muted font-medium text-xs flex items-center gap-2 mt-1">
               <Fingerprint size={13} className="text-secondary" /> 
               <span className="font-mono font-bold text-text-main">{patient.external_id}</span> 
               <span className="opacity-30">|</span> Shell Biotech Clinical Reference
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {canWrite && (
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsUploadModalOpen(true)}
              className="bg-[#0b1f33] hover:bg-[#16324f] dark:bg-secondary dark:hover:bg-secondary-light text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-sm text-xs uppercase tracking-wider cursor-pointer"
            >
              <Upload size={16} />
              Injest Records / Scans
            </motion.button>
          )}
        </div>
      </motion.header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        <div className="lg:col-span-2 space-y-8">
          {/* Patient Form */}
          <motion.form 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleSave} 
            className="bg-surface border border-border-main rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm relative overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-border-main pb-4">
               <h3 className="font-heading text-lg font-black flex items-center gap-2.5 text-text-main">
                  <div className="p-2 bg-secondary/10 rounded-xl">
                    <StickyNote size={18} className="text-secondary" />
                  </div>
                  Sequence Identity & Notes
               </h3>
               {!canWrite && (
                  <div className="flex items-center gap-1.5 bg-secondary/10 text-secondary px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-secondary/20">
                    <Shield size={12} /> Immutable Chart
                  </div>
               )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider ml-1">Patient Legal Full Name</label>
                <div className="relative group">
                  <UserIcon className="absolute left-3.5 top-3 text-text-muted group-focus-within:text-secondary transition-colors" size={17} />
                  <input
                    type="text"
                    disabled={!canWrite}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-surface border border-border-main rounded-xl px-3.5 py-2.5 pl-10 text-text-main focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary transition-all font-medium text-sm disabled:opacity-60"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider ml-1">MRN / Clinical Identifier</label>
                <div className="relative group">
                  <Fingerprint className="absolute left-3.5 top-3 text-text-muted group-focus-within:text-secondary transition-colors" size={17} />
                  <input
                    type="text"
                    disabled={!canWrite}
                    value={externalId}
                    onChange={(e) => setExternalId(e.target.value)}
                    className="w-full bg-surface border border-border-main rounded-xl px-3.5 py-2.5 pl-10 text-text-main focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary transition-all font-mono font-medium text-sm disabled:opacity-60"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider ml-1">
                Clinical Formulations, Diagnosis & Care Notes
              </label>
              <textarea
                rows={4}
                disabled={!canWrite}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Prescribed pharmaceutical formulations, lab parameters, treatment timeline..."
                className="w-full bg-surface border border-border-main rounded-xl p-3.5 text-text-main focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary transition-all font-medium text-sm disabled:opacity-60 resize-none"
              />
            </div>

            {canWrite && (
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-[#0b1f33] hover:bg-[#16324f] dark:bg-secondary dark:hover:bg-secondary-light text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isSaving ? 'Updating...' : 'Save Chart Details'}
                </button>
              </div>
            )}
          </motion.form>

          {/* Clinical Documents List */}
          <div className="bg-surface border border-border-main rounded-2xl p-6 sm:p-8 shadow-sm">
            <h3 className="font-heading text-lg font-black text-text-main mb-4 flex items-center gap-2">
              <FileText size={18} className="text-secondary" />
              Ingested Clinical Documents ({docs.length})
            </h3>
            {docs.length > 0 ? (
              <div className="space-y-3">
                {docs.map((doc) => (
                  <div key={doc.id} className="p-4 bg-background border border-border-main rounded-xl flex items-center justify-between hover:border-secondary/30 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-secondary/10 rounded-lg text-secondary">
                        <FileText size={18} />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-text-main">{doc.filename}</p>
                        <p className="text-[11px] text-text-muted mt-0.5">
                          Status: <span className="text-secondary font-semibold uppercase">{doc.status}</span>
                        </p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-secondary/10 text-secondary text-[10px] font-bold rounded-full border border-secondary/20 uppercase tracking-wider">
                      RAG Ready
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-text-muted font-medium py-4 text-center">No clinical text documents ingested yet.</p>
            )}
          </div>

          {/* Medical Images List */}
          <div className="bg-surface border border-border-main rounded-2xl p-6 sm:p-8 shadow-sm">
            <h3 className="font-heading text-lg font-black text-text-main mb-4 flex items-center gap-2">
              <ImageIcon size={18} className="text-secondary" />
              Medical Imaging Studies ({images.length})
            </h3>
            {images.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {images.map((img) => (
                  <div key={img.id} className="p-4 bg-background border border-border-main rounded-xl space-y-2">
                    <div className="flex items-center gap-2 text-text-main font-bold text-xs">
                      <ImageIcon size={15} className="text-secondary" />
                      <span className="truncate">{img.filename}</span>
                    </div>
                    {img.caption && (
                      <p className="text-xs text-text-muted font-medium italic">"{img.caption}"</p>
                    )}
                    <span className="inline-block px-2.5 py-0.5 bg-secondary/10 text-secondary text-[10px] font-bold rounded-md">
                      Modal Context Indexed
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-text-muted font-medium py-4 text-center">No diagnostic imaging files uploaded.</p>
            )}
          </div>
        </div>

        {/* Right Sidebar: Practitioner Access Control (Admin) & Assistant Shortcut */}
        <div className="space-y-6">
          {isAdmin && (
            <div className="bg-surface border border-border-main rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-heading text-base font-black text-text-main flex items-center gap-2">
                <FolderLock size={18} className="text-secondary" />
                Provision Clinical Access
              </h3>
              <p className="text-xs text-text-muted font-medium">
                Grant attending clinicians access to this patient chart.
              </p>
              <form onSubmit={handleGrantAccess} className="space-y-3">
                <select
                  value={grantUserId}
                  onChange={(e) => setGrantUserId(e.target.value)}
                  className="w-full bg-surface border border-border-main rounded-xl px-3 py-2 text-text-main text-xs font-medium focus:ring-2 focus:ring-secondary/40 focus:border-secondary"
                  required
                >
                  <option value="">Select Practitioner...</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>{u.full_name} ({u.role})</option>
                  ))}
                </select>

                <select
                  value={grantLevel}
                  onChange={(e) => setGrantLevel(e.target.value)}
                  className="w-full bg-surface border border-border-main rounded-xl px-3 py-2 text-text-main text-xs font-medium focus:ring-2 focus:ring-secondary/40 focus:border-secondary"
                >
                  <option value="read">Read Only</option>
                  <option value="write">Read & Write</option>
                </select>

                <button
                  type="submit"
                  disabled={isGranting}
                  className="w-full bg-[#0b1f33] hover:bg-[#16324f] dark:bg-secondary dark:hover:bg-secondary-light text-white py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isGranting ? 'Granting...' : 'Authorize Clinician'}
                </button>
              </form>
            </div>
          )}

          {/* Clinical Assistant Quick Launch */}
          <div className="bg-gradient-to-br from-[#0b1f33] to-[#496b5a] rounded-2xl p-6 text-white shadow-md space-y-3">
            <h4 className="font-heading text-lg font-black">Shell Biotech RAG Q&A</h4>
            <p className="text-xs text-white/85 leading-relaxed font-medium">
              Query {patient.full_name}'s full chart history, lab findings, and pharmaceutical records using Med-Gemini.
            </p>
            <button
              onClick={() => navigate('/assistant')}
              className="bg-white text-[#0b1f33] px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-emerald-50 transition-all cursor-pointer"
            >
              Consult Assistant
            </button>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {isUploadModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsUploadModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-surface border border-border-main rounded-2xl p-6 shadow-2xl relative z-10 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-border-main">
                <h3 className="font-heading text-base font-black text-text-main">Upload Clinical Asset</h3>
                <button onClick={() => setIsUploadModalOpen(false)} className="text-text-muted hover:text-text-main">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleFileUpload} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-text-main uppercase tracking-wider">Select File</label>
                  <input
                    type="file"
                    required
                    onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                    className="w-full bg-surface border border-border-main rounded-xl p-2.5 text-xs text-text-main"
                  />
                  <p className="text-[10px] text-text-muted">Allowed: PDF, DOCX, TXT, PNG, JPG, WEBP, DCM</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-text-main uppercase tracking-wider">Clinical Caption (Required for scans)</label>
                  <input
                    type="text"
                    value={uploadCaption}
                    onChange={(e) => setUploadCaption(e.target.value)}
                    placeholder="e.g. Chest X-Ray PA View - Normal cardiac contour"
                    className="w-full bg-surface border border-border-main rounded-xl px-3 py-2 text-text-main text-xs focus:ring-2 focus:ring-secondary/40 focus:border-secondary"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsUploadModalOpen(false)}
                    className="px-4 py-2 text-text-muted hover:text-text-main text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUploading}
                    className="bg-[#0b1f33] hover:bg-[#16324f] dark:bg-secondary dark:hover:bg-secondary-light text-white px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider disabled:opacity-50"
                  >
                    {isUploading ? 'Uploading & Chunking...' : 'Upload Asset'}
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

export default PatientDetail;
