
import React, { useEffect, useState } from "react";
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot,
  Timestamp 
} from "firebase/firestore";
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged,
  User,
  signOut
} from "firebase/auth";
import { db, auth } from "../lib/firebase";
import { motion, AnimatePresence } from "motion/react";
import { 
  ShieldCheck, 
  Lock, 
  LogOut, 
  Search, 
  Clock, 
  User as UserIcon,
  Mail,
  Phone,
  Building2,
  Briefcase,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Download,
  Users
} from "lucide-react";
import { cn } from "../lib/utils";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  businessName?: string;
  businessSize?: string;
  monthlyTurnover?: string;
  solutionInterest?: string;
  howHeard?: string;
  message?: string;
  createdAt: Timestamp;
}

const ADMIN_EMAIL = "shubhams.job@gmail.com";

export default function AdminLeads() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const isAdmin = currentUser?.email === ADMIN_EMAIL;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (currentUser && isAdmin) {
      setLoading(true);
      const q = query(collection(db, "leads"), orderBy("createdAt", "desc"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const leadsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Lead));
        setLeads(leadsData);
        setLoading(false);
      }, (err) => {
        console.error("Firestore error:", err);
        setError("Permission denied. You must be an authorized admin.");
        setLoading(false);
      });
      return () => unsubscribe();
    } else if (currentUser && !isAdmin) {
      setError("Unauthorized access. Admin privileges required.");
      setLoading(false);
    } else if (!currentUser) {
      setLeads([]);
      setLoading(false);
    }
  }, [currentUser, isAdmin]);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  const handleLogout = () => signOut(auth);

  const filteredLeads = leads.filter(lead => 
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.businessName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const downloadLeads = () => {
    const headers = ["Date", "Name", "Email", "Phone", "Business", "Size", "Turnover", "Interest", "Channel", "Message"];
    const csvContent = [
      headers.join(","),
      ...leads.map(l => [
        l.createdAt?.toDate().toLocaleDateString() || "",
        `"${l.name}"`,
        `"${l.email}"`,
        `"${l.phone || ""}"`,
        `"${l.businessName || ""}"`,
        `"${l.businessSize || ""}"`,
        `"${l.monthlyTurnover || ""}"`,
        `"${l.solutionInterest || ""}"`,
        `"${l.howHeard || ""}"`,
        `"${l.message?.replace(/"/g, '""') || ""}"`
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `phalampayments_leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 pt-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100"
        >
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-navy">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-navy mb-2">Admin Portal</h1>
          <p className="text-gray-500 mb-8 text-sm">Please sign in with your authorized admin account to view enquiries.</p>
          <button
            onClick={handleLogin}
            className="w-full py-3.5 bg-navy text-white font-bold rounded-lg hover:brightness-110 flex items-center justify-center gap-3 transition-all"
          >
            <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
            Sign in with Google
          </button>
        </motion.div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 pt-24">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-red-100">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-red-600">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-navy mb-2">Access Denied</h1>
          <p className="text-gray-500 mb-8 text-sm">Your account ({currentUser.email}) is not authorized to access this section.</p>
          <button
            onClick={handleLogout}
            className="w-full py-3.5 border-2 border-gray-100 text-gray-600 font-bold rounded-lg hover:bg-gray-50 transition-all"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-navy flex items-center gap-3">
              Lead Enquiries
              <span className="text-xs font-mono bg-navy/5 text-navy/60 px-2 py-1 rounded border border-navy/10 uppercase tracking-tighter">Admin</span>
            </h1>
            <p className="text-sm text-gray-500 mt-1">Manage and respond to incoming business leads.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={downloadLeads}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 shadow-sm"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Stats & Search */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="md:col-span-1 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Enquiries</p>
            <p className="text-2xl font-bold text-navy">{leads.length}</p>
          </div>
          <div className="md:col-span-3 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text"
              placeholder="Search by name, email or business..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-full bg-white border border-gray-200 rounded-xl pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-navy/10 transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Lead Table */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="w-8 h-8 border-4 border-navy border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-sm text-gray-500">Fetching leads from secure storage...</p>
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-400">No enquiries found matching your search.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Client</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Business</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Service</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredLeads.map((lead) => (
                    <React.Fragment key={lead.id}>
                      <tr 
                        onClick={() => setExpandedId(expandedId === lead.id ? null : lead.id)}
                        className={cn(
                          "group cursor-pointer hover:bg-gray-50/80 transition-colors",
                          expandedId === lead.id && "bg-blue-50/30"
                        )}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
                            <Clock className="w-3 h-3" />
                            {lead.createdAt?.toDate().toLocaleDateString() || "Unknown"}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-semibold text-navy text-sm">{lead.name}</span>
                            <span className="text-xs text-gray-500">{lead.email}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-700">{lead.businessName || "Individual"}</span>
                            <span className="text-[10px] text-gray-400">{lead.businessSize || "N/A"}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                            lead.solutionInterest ? "bg-navy/5 text-navy" : "bg-gray-100 text-gray-400"
                          )}>
                            {lead.solutionInterest || "General"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {expandedId === lead.id ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-navy" />}
                        </td>
                      </tr>
                      
                      <AnimatePresence>
                        {expandedId === lead.id && (
                          <tr>
                            <td colSpan={5} className="bg-gray-50/30 px-6 py-8 border-b border-gray-100">
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                              >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                  <div className="space-y-6">
                                    <h4 className="text-xs font-bold text-navy uppercase tracking-widest border-b border-navy/10 pb-2">Contact Details</h4>
                                    <div className="grid grid-cols-1 gap-4">
                                      <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-gray-400">
                                          <UserIcon className="w-4 h-4" />
                                        </div>
                                        <div>
                                          <p className="text-[9px] text-gray-400 uppercase font-bold">Full Name</p>
                                          <p className="text-sm text-navy font-semibold">{lead.name}</p>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-gray-400">
                                          <Mail className="w-4 h-4" />
                                        </div>
                                        <div>
                                          <p className="text-[9px] text-gray-400 uppercase font-bold">Email</p>
                                          <a href={`mailto:${lead.email}`} className="text-sm text-navy font-semibold hover:underline">{lead.email}</a>
                                        </div>
                                      </div>
                                      {lead.phone && (
                                        <div className="flex items-center gap-3">
                                          <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-gray-400">
                                            <Phone className="w-4 h-4" />
                                          </div>
                                          <div>
                                            <p className="text-[9px] text-gray-400 uppercase font-bold">Phone</p>
                                            <a href={`tel:${lead.phone}`} className="text-sm text-navy font-semibold hover:underline">{lead.phone}</a>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  <div className="space-y-6">
                                    <h4 className="text-xs font-bold text-navy uppercase tracking-widest border-b border-navy/10 pb-2">Business Information</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <p className="text-[9px] text-gray-400 uppercase font-bold mb-1">Company</p>
                                        <div className="flex items-center gap-2">
                                          <Building2 className="w-3.5 h-3.5 text-gray-400" />
                                          <span className="text-sm font-semibold text-navy">{lead.businessName || "Individual Contractor"}</span>
                                        </div>
                                      </div>
                                      <div>
                                        <p className="text-[9px] text-gray-400 uppercase font-bold mb-1">Scale</p>
                                        <div className="flex items-center gap-2">
                                          <Users className="w-3.5 h-3.5 text-gray-400" />
                                          <span className="text-sm font-semibold text-navy">{lead.businessSize || "Private"}</span>
                                        </div>
                                      </div>
                                      <div>
                                        <p className="text-[9px] text-gray-400 uppercase font-bold mb-1">Turnover</p>
                                        <div className="flex items-center gap-2">
                                          <ShieldCheck className="w-3.5 h-3.5 text-gray-400" />
                                          <span className="text-sm font-semibold text-navy">{lead.monthlyTurnover || "N/A"}</span>
                                        </div>
                                      </div>
                                      <div>
                                        <p className="text-[9px] text-gray-400 uppercase font-bold mb-1">Product Area</p>
                                        <div className="flex items-center gap-2">
                                          <Briefcase className="w-3.5 h-3.5 text-gray-400" />
                                          <span className="text-sm font-semibold text-navy">{lead.solutionInterest || "General Inquiry"}</span>
                                        </div>
                                      </div>
                                      <div>
                                        <p className="text-[9px] text-gray-400 uppercase font-bold mb-1">Lead Source</p>
                                        <div className="flex items-center gap-2">
                                          <Search className="w-3.5 h-3.5 text-gray-400" />
                                          <span className="text-sm font-semibold text-navy">{lead.howHeard || "Direct"}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="md:col-span-2 space-y-3 mt-4">
                                    <div className="flex items-center gap-2 text-xs font-bold text-navy uppercase tracking-widest">
                                      <MessageSquare className="w-4 h-4" /> Message / Notes
                                    </div>
                                    <div className="bg-white border border-gray-100 rounded-xl p-4 text-sm text-gray-600 leading-relaxed shadow-inner">
                                      {lead.message || "No specific message provided."}
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            </td>
                          </tr>
                        )}
                      </AnimatePresence>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

