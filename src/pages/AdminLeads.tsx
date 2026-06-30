import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
  addDoc,
  deleteDoc,
  doc,
  writeBatch,
  serverTimestamp
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
  Users,
  FileText,
  Plus,
  Trash2,
  Check,
  Sparkles,
  BookOpen,
  Image as ImageIcon
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

interface AdminBlog {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: string;
  readTime: string;
  image?: string;
  author: string;
  createdAt: Timestamp;
}

const ADMIN_EMAIL = "shubhams.job@gmail.com";

const slugify = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, "")
    .replace(/ +/g, "-");
};

export default function AdminLeads() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<"leads" | "blogs">("leads");

  // Lead State
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(true);
  const [expandedLeadId, setExpandedLeadId] = useState<string | null>(null);
  const [leadSearchTerm, setLeadSearchTerm] = useState("");

  // Blog State
  const [blogs, setBlogs] = useState<AdminBlog[]>([]);
  const [loadingBlogs, setLoadingBlogs] = useState(true);
  const [showNewBlogForm, setShowNewBlogForm] = useState(false);
  const [blogSuccessMessage, setBlogSuccessMessage] = useState<string | null>(null);
  const [bootstrapping, setBootstrapping] = useState(false);

  // New Blog Form Fields
  const [blogTitle, setBlogTitle] = useState("");
  const [blogCategory, setBlogCategory] = useState("Card Machines");
  const [blogSummary, setBlogSummary] = useState("");
  const [blogContent, setBlogContent] = useState("");
  const [blogReadTime, setBlogReadTime] = useState("5 min read");
  const [blogImage, setBlogImage] = useState("");

  const [globalError, setGlobalError] = useState<string | null>(null);

  const isAdmin = currentUser?.email === ADMIN_EMAIL;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Sync leads from firestore
  useEffect(() => {
    if (currentUser && isAdmin) {
      setLoadingLeads(true);
      const q = query(collection(db, "leads"), orderBy("createdAt", "desc"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const leadsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Lead));
        setLeads(leadsData);
        setLoadingLeads(false);
      }, (err) => {
        console.error("Firestore leads issue:", err);
        setGlobalError("Secure leads collection is offline.");
        setLoadingLeads(false);
      });
      return () => unsubscribe();
    } else {
      setLeads([]);
      setLoadingLeads(false);
    }
  }, [currentUser, isAdmin]);

  // Sync blogs from firestore
  useEffect(() => {
    if (currentUser && isAdmin) {
      setLoadingBlogs(true);
      const q = query(collection(db, "blogs"), orderBy("createdAt", "desc"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const blogsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as AdminBlog));
        setBlogs(blogsData);
        setLoadingBlogs(false);
      }, (err) => {
        console.error("Firestore blogs query issue:", err);
        setLoadingBlogs(false);
      });
      return () => unsubscribe();
    } else {
      setBlogs([]);
      setLoadingBlogs(false);
    }
  }, [currentUser, isAdmin]);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error("Login authentication error:", err);
    }
  };

  const handleLogout = () => signOut(auth);

  // Filter Leads
  const filteredLeads = leads.filter(lead =>
    lead.name.toLowerCase().includes(leadSearchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(leadSearchTerm.toLowerCase()) ||
    lead.businessName?.toLowerCase().includes(leadSearchTerm.toLowerCase())
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

  // Submit Blog Post to Firebase
  const handleCreateBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogTitle || !blogSummary || !blogContent) {
      alert("Please complete the required Title, Summary, and Content fields.");
      return;
    }

    try {
      const data = {
        title: blogTitle,
        slug: slugify(blogTitle),
        summary: blogSummary,
        content: blogContent,
        category: blogCategory,
        readTime: blogReadTime,
        image: blogImage || "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80",
        author: "Shubham Garg",
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, "blogs"), data);

      setBlogSuccessMessage("Blog post published successfully!");
      // Reset Fields
      setBlogTitle("");
      setBlogSummary("");
      setBlogContent("");
      setBlogReadTime("5 min read");
      setBlogImage("");
      setShowNewBlogForm(false);

      setTimeout(() => setBlogSuccessMessage(null), 5000);
    } catch (err: any) {
      console.error("Create blog failure:", err);
      alert("Error publishing blog: " + err.message);
    }
  };

  const handleDeleteBlog = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${title}"?`)) {
      return;
    }
    try {
      await deleteDoc(doc(db, "blogs", id));
      setBlogSuccessMessage("Article deleted successfully.");
      setTimeout(() => setBlogSuccessMessage(null), 4000);
    } catch (err: any) {
      console.error("Delete blog failure:", err);
      alert("Error deleting article: " + err.message);
    }
  };

  // Autoseed Firestore database with three high-quality curated sample payment guides if needed
  const handleBootstrapBlogs = async () => {
    setBootstrapping(true);
    try {
      const batch = writeBatch(db);

      // Guides definitions
      const sampleGuides = [
        {
          title: "The Hidden Cost of Card Machine Contracts in the UK",
          slug: "hidden-cost-card-machine-contracts",
          category: "Card Machines",
          summary: "Merchant services contracts can be full of rolling rolling cages, auto-renew covenants, and stealthy non-compliance fine fees. Learn how to verify your real effective rate.",
          readTime: "5 min read",
          author: "Shubham Garg",
          image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80",
          content: `
            <h2>The Merchant Contract Trap: What UK Small Businesses Need to Know</h2>
            <p>Independent retailers across the United Kingdom face a highly saturated and sometimes predatory merchant services market. While leading payment application companies tout incredibly low rates (like 0.4% for debit cards), the real effective rate that hits your bank account statement is often double or triple that amount.</p>

            <p>This comprehensive guide details the most common hidden fees and how you can shield your retail shop from long-term, expensive lock-in terms.</p>

            <h3>1. The Difference Between Premium Rates and Hidden Fees</h3>
            <p>When you sign up for card terminals, the agent typically writes down your "MMSC" (Minimum Monthly Service Charge) and the debit/credit transaction rates. However, when the monthly bill arrives, you may notice a string of mysterious, automated line item charges:</p>
            <ul>
              <li><strong>PCI-DSS Non-Compliance Fee (&pound;30–&pound;45/m):</strong> Charged if you fail to compile or renew your annual self-assessment questionnaire.</li>
              <li><strong>Authorisation Fees (&pound;0.03–&pound;0.05 per call):</strong> Independent of the percentage-rate fee, this is charged for every communication check.</li>
              <li><strong>Terminal Hire Lease Costs:</strong> Often billed by a secondary finance broker rather than your acquirer, making it legally impossible to cancel without massive penalties.</li>
            </ul>

            <h3>2. The Multi-Year Leasing Agreement Cage</h3>
            <p>Be extremely wary of any agreement requiring you to lease standard card machines for 36, 48, or even 60 months. In the modern fintech era, you should never be locked into long-term hardware leases. Most modern processors offer rolling monthly, or 12-month agreements with outright hardware purchases or accessible rolling rentals.</p>

            <h3>3. Our Recommendations for Retail Shops</h3>
            <p>To keep your physical tills performing optimally without leaking cash:</p>
            <ol>
              <li>Inspect your terminal billing logs quarterly.</li>
              <li>Insist on receiving pricing under the <strong>Interchange Plus Plus (IC++)</strong> model for complete margin transparency.</li>
              <li>Request a professional statement audit before committing to any card terminal vendor.</li>
            </ol>
          `
        },
        {
          title: "Optimising Online Checkout & Squeezing Payment Gateway Fees",
          slug: "optimise-checkout-payment-gateway-fees",
          category: "Digital Gateways",
          summary: "Frictional online checkouts drive up cart abandonment ratios. We explore modern alternative rails, API card vaults, and smart 3D-Secure transaction routing.",
          readTime: "7 min read",
          author: "Shubham Garg",
          image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
          content: `
            <h2>Frictionless Digital Checkout Architectures</h2>
            <p>An average online checkout suffers a cart abandonment rate exceeding 69%. While many online businesses assume that high dropoffs are simply typical shopper behavior, the technical configuration of your e-commerce gateway plays a massive role in whether card transaction logs are authorized or declined.</p>

            <p>By making conscious, developer-centric optimizations to your payment integration stack, you can elevate checkout authorization margins and significantly reduce your merchant processing rates.</p>

            <h3>1. Advanced Payment Orchestration Systems</h3>
            <p>Rather than relying on a single payment processor to manage your entire transaction history, modern enterprise operations deploy <strong>Payment Orchestration Platforms (POPs)</strong>. A POP acts as an intelligent smart-routing controller:</p>
            <ul>
              <li>Routes and dispatches transaction logs based on regional card authorization standards.</li>
              <li>Provides a fallback gateway if your main processor encounters a temporary API connection outage.</li>
              <li>Mitigates decline rates by retrying soft card declines instantly through alternate checkout networks.</li>
            </ul>
          `
        },
        {
          title: "Demystifying PCI DSS Compliance and Stealth Statement Penalties",
          slug: "demystifying-pci-compliance-fees",
          category: "Audits & Integrity",
          summary: "Are those £30 monthly charges on your merchant statement really mandatory? Learn how to self-certify safely and stop paying non-compliance fines.",
          readTime: "4 min read",
          author: "Shubham Garg",
          image: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80",
          content: `
            <h2>The Truth About PCI Compliance Charges</h2>
            <p>If you take a close look at your merchant statements, you might find a recurring charge listed as "PCI Non-Compliance Fee" or "PCI Admin Fee." This charge is typically &pound;30, &pound;40, or even more per card machine, billed monthly until compliance is resolved.</p>
            <p>Identify your SAQ, self-certify through portal guides, and watch those non-compliance lines fall to zero!</p>
          `
        }
      ];

      for (const guide of sampleGuides) {
        const newDocRef = doc(collection(db, "blogs"));
        batch.set(newDocRef, {
          ...guide,
          createdAt: serverTimestamp()
        });
      }

      await batch.commit();
      setBlogSuccessMessage("Seeding complete! 3 sample guides added to Firestore.");
      setTimeout(() => setBlogSuccessMessage(null), 5000);
    } catch (err: any) {
      console.error("Bootstrap failure:", err);
      alert("Could not seed data: " + err.message);
    } finally {
      setBootstrapping(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 pt-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100"
        >
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-navy">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-navy mb-2">Admin Portal</h1>
          <p className="text-gray-500 mb-8 text-sm">Please sign in with your authorized admin account to manage leads and publish blogs.</p>
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 pt-28">
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
    <div className="min-h-screen bg-gray-50 pt-28 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Portal Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-navy flex items-center gap-3">
              Phalam Payments
              <span className="text-xs font-mono bg-navy/5 text-navy/65 px-2.5 py-1 rounded-full border border-navy/10 uppercase tracking-tight">Admin Console</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">Logged in as: <strong className="text-navy">{currentUser.email}</strong></p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white hover:bg-red-50 text-xs sm:text-sm font-semibold text-red-650 rounded-xl transition-all shadow-sm"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Success Alert */}
        <AnimatePresence>
          {blogSuccessMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-green-50 text-green-700 border border-green-200 rounded-2xl p-4 mb-6 flex items-center gap-2.5 text-sm font-semibold"
            >
              <Check className="w-5 h-5 text-green-600 shrink-0" />
              {blogSuccessMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tab Navigation Row */}
        <div className="flex border-b border-gray-200 mb-8 gap-1.5">
          <button
            onClick={() => setActiveTab("leads")}
            className={cn(
              "px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2",
              activeTab === "leads"
                ? "border-navy text-navy"
                : "border-transparent text-gray-400 hover:text-navy"
            )}
          >
            <Users className="w-4 h-4" />
            Lead Enquiries ({leads.length})
          </button>
          <button
            onClick={() => setActiveTab("blogs")}
            className={cn(
              "px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2",
              activeTab === "blogs"
                ? "border-navy text-navy"
                : "border-transparent text-gray-400 hover:text-navy"
            )}
          >
            <BookOpen className="w-4 h-4" />
            Blog Publisher ({blogs.length})
          </button>
        </div>

        {/* TAB 1: LEADS MANAGEMENT */}
        {activeTab === "leads" && (
          <div>
            {/* Stats & Search */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="md:col-span-1 bg-white p-5 rounded-2xl border border-gray-150 shadow-sm flex flex-col justify-center">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Enquiries</p>
                <p className="text-3xl font-bold text-navy">{leads.length}</p>
              </div>
              <div className="md:col-span-3 relative flex items-center">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search lead repository..."
                  value={leadSearchTerm}
                  onChange={(e) => setLeadSearchTerm(e.target.value)}
                  className="w-full h-12 bg-white border border-gray-250 rounded-2xl pl-12 pr-4 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-navy/10 transition-all shadow-sm"
                />
              </div>
            </div>

            <div className="flex justify-end mb-4">
              <button
                onClick={downloadLeads}
                disabled={leads.length === 0}
                className="flex items-center gap-2 px-4 py-2.5 bg-navy text-white hover:brightness-110 disabled:opacity-50 text-xs sm:text-sm font-semibold rounded-xl shadow-md transition-all"
              >
                <Download className="w-4 h-4" />
                Export Leads CSV
              </button>
            </div>

            {/* Lead Table / Box */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
              {loadingLeads ? (
                <div className="p-12 text-center">
                  <div className="w-8 h-8 border-4 border-navy border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-sm text-gray-500">Querying secure lead logs...</p>
                </div>
              ) : filteredLeads.length === 0 ? (
                <div className="p-12 text-center text-gray-450 text-sm">
                  No enquiries parsed matching selection search.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-150">
                        <th className="px-6 py-4 text-[10px] font-bold text-gray-405 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-gray-405 uppercase tracking-wider">Client</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-gray-405 uppercase tracking-wider">Business</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-gray-405 uppercase tracking-wider">Service</th>
                        <th className="px-6 py-4"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredLeads.map((lead) => (
                        <React.Fragment key={lead.id}>
                          <tr
                            onClick={() => setExpandedLeadId(expandedLeadId === lead.id ? null : lead.id)}
                            className={cn(
                              "group cursor-pointer hover:bg-gray-50 transition-colors",
                              expandedLeadId === lead.id && "bg-blue-50/20"
                            )}
                          >
                            <td className="px-6 py-4 text-xs font-mono text-gray-400">
                              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{lead.createdAt?.toDate ? lead.createdAt.toDate().toLocaleDateString("en-GB") : "Pending"}</span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-col">
                                <span className="font-semibold text-navy text-xs sm:text-sm">{lead.name}</span>
                                <span className="text-[11px] sm:text-xs text-gray-400 font-mono">{lead.email}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-xs sm:text-sm text-gray-700 font-medium">{lead.businessName || "Sole Trade / Individual"}</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="inline-block px-2.5 py-1 text-[9px] font-bold uppercase rounded-full bg-navy/5 text-navy border border-navy/10">
                                {lead.solutionInterest || "General inquiry"}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              {expandedLeadId === lead.id ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                            </td>
                          </tr>

                          <AnimatePresence>
                            {expandedLeadId === lead.id && (
                              <tr>
                                <td colSpan={5} className="bg-gray-50/20 px-6 py-6 border-b border-gray-100">
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                  >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                      {/* Left block */}
                                      <div className="space-y-4">
                                        <h4 className="text-[10px] font-bold text-navy uppercase tracking-widest border-b pb-2">Client Details</h4>
                                        <div className="space-y-2 text-xs sm:text-sm">
                                          <div><span className="text-gray-400 inline-block w-24">Full Name:</span> <strong className="text-navy">{lead.name}</strong></div>
                                          <div><span className="text-gray-400 inline-block w-24">Email:</span> <a href={`mailto:${lead.email}`} className="text-blue-600 underline font-medium">{lead.email}</a></div>
                                          {lead.phone && <div><span className="text-gray-400 inline-block w-24">Phone:</span> <a href={`tel:${lead.phone}`} className="hover:underline text-navy font-semibold">{lead.phone}</a></div>}
                                        </div>
                                      </div>

                                      {/* Right block */}
                                      <div className="space-y-4">
                                        <h4 className="text-[10px] font-bold text-navy uppercase tracking-widest border-b pb-2">Technical Profile</h4>
                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                          <div><span className="text-gray-400 block">Company Scale</span><strong>{lead.businessSize || "N/A"}</strong></div>
                                          <div><span className="text-gray-400 block">Estimated Turnover</span><strong>{lead.monthlyTurnover || "N/A"}</strong></div>
                                          <div><span className="text-gray-400 block">Referral Channel</span><strong>{lead.howHeard || "Direct Search"}</strong></div>
                                          <div><span className="text-gray-400 block">Lead Source</span><strong>{lead.source || "Main Site"}</strong></div>
                                        </div>
                                      </div>

                                      {/* Message block */}
                                      <div className="md:col-span-2 space-y-2">
                                        <h4 className="text-[10px] font-bold text-navy uppercase tracking-widest flex items-center gap-1.5"><MessageSquare className="w-3.5 h-3.5" />Message details</h4>
                                        <div className="bg-white border border-gray-150 p-4 rounded-xl text-xs sm:text-sm leading-relaxed text-gray-650">
                                          {lead.message || "No custom query text provided."}
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
        )}

        {/* TAB 2: BLOG PUBLISHER */}
        {activeTab === "blogs" && (
          <div className="space-y-8">

            {/* Header controls inside Blogs tab */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-150 shadow-sm">
              <div>
                <h3 className="font-bold text-navy text-lg flex items-center gap-2"><BookOpen className="w-5 h-5 text-gold" /> Publishing Dashboard</h3>
                <p className="text-xs text-gray-500 mt-1">Manage, draft, delete and publish real-time educational articles for Phalam Payments readers.</p>
              </div>

              <div className="flex gap-2.5 w-full sm:w-auto">
                {blogs.length === 0 && (
                  <button
                    onClick={handleBootstrapBlogs}
                    disabled={bootstrapping}
                    className="flex justify-center items-center gap-2 px-4 py-2.5 bg-gold text-navy hover:brightness-110 disabled:opacity-50 text-xs sm:text-sm font-bold rounded-xl shadow-sm transition-all"
                  >
                    <Sparkles className="w-4 h-4 shrink-0" />
                    {bootstrapping ? "Writing..." : "Bootstrap 3 Demo Guides"}
                  </button>
                )}

                <button
                  onClick={() => setShowNewBlogForm(!showNewBlogForm)}
                  className="w-full sm:w-auto flex justify-center items-center gap-2 px-4 py-2.5 bg-navy text-white hover:brightness-110 text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all"
                >
                  <Plus className="w-4 h-4 shrink-0" />
                  {showNewBlogForm ? "Cancel Creation" : "Write New Post"}
                </button>
              </div>
            </div>

            {/* NEW BLOG DRAFTING FORM */}
            <AnimatePresence>
              {showNewBlogForm && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <form onSubmit={handleCreateBlog} className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-md space-y-6">
                    <h3 className="font-display font-bold text-navy text-xl border-b pb-3">New Blog Article Draft</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1.5Col">
                        <label className="text-xs font-bold text-navy block">Article Title <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Navigating Card Machine Contracts in 2026"
                          value={blogTitle}
                          onChange={(e) => setBlogTitle(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-navy/15 text-navy font-semibold"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-bold text-navy block mb-1">Category</label>
                          <select
                            value={blogCategory}
                            onChange={(e) => setBlogCategory(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-navy/15 text-navy"
                          >
                            <option value="Card Machines">Card Machines</option>
                            <option value="Digital Gateways">Digital Gateways</option>
                            <option value="Audits & Integrity">Audits & Integrity</option>
                            <option value="General Info">General Info</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-xs font-bold text-navy block mb-1">Reading Duration</label>
                          <input
                            type="text"
                            placeholder="e.g. 5 min read"
                            value={blogReadTime}
                            onChange={(e) => setBlogReadTime(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-navy/15 text-navy"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-navy block">Introduction Excerpt / Summary <span className="text-red-500">*</span></label>
                      <textarea
                        required
                        rows={2}
                        maxLength={250}
                        placeholder="Provide a 1-2 sentence scannable preview describing this post. Perfect for SEO descriptions."
                        value={blogSummary}
                        onChange={(e) => setBlogSummary(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-navy/15 text-navy leading-relaxed"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-navy block flex justify-between">
                        <span>Cover Image URL (Optional)</span>
                        <span className="text-[10px] text-gray-400 font-normal">Supports Unsplash, Pexels etc.</span>
                      </label>
                      <div className="relative">
                        <ImageIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                        <input
                          type="url"
                          placeholder="https://images.unsplash.com/photo-..."
                          value={blogImage}
                          onChange={(e) => setBlogImage(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-navy/15 text-navy"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-navy block flex justify-between">
                        <span>Main Content Body (supports paragraph structural tags) <span className="text-red-500">*</span></span>
                        <span className="text-[10px] text-gold font-semibold">HTML headers &lt;h3&gt;, &lt;p&gt;, &lt;ul&gt; are fully accepted</span>
                      </label>
                      <textarea
                        required
                        rows={12}
                        placeholder={`<h2>Guide Title Here</h2>\n<p>Begin writing the core body paragraphs. Make it helpful, insightful, and factual.</p>\n\n<h3>Key Requirements to Review</h3>\n<ul>\n  <li>Itemization rules</li>\n  <li>PCI SAQ questionnaire</li>\n</ul>`}
                        value={blogContent}
                        onChange={(e) => setBlogContent(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-navy/15 text-navy font-mono leading-relaxed"
                      />
                    </div>

                    <div className="pt-4 border-t flex flex-col sm:flex-row justify-end items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setShowNewBlogForm(false)}
                        className="w-full sm:w-auto px-5 py-2.5 border border-gray-200 text-gray-500 font-bold rounded-xl text-xs sm:text-sm hover:bg-gray-50 transition-all text-center"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="w-full sm:w-auto px-6 py-2.5 bg-navy text-white font-bold rounded-xl text-xs sm:text-sm hover:brightness-110 flex items-center justify-center gap-2 shadow-md transition-all"
                      >
                        <Check className="w-4 h-4" /> Publish Blog Live
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ACTIVE BLOG POST LISTS */}
            <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm">
              <h4 className="font-bold text-navy text-base mb-6 pb-2 border-b">Active Articles Repository ({blogs.length})</h4>

              {loadingBlogs ? (
                <div className="py-12 text-center text-gray-450">
                  <div className="w-8 h-8 border-4 border-navy border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                  <p className="text-xs">Querying database content indexes...</p>
                </div>
              ) : blogs.length === 0 ? (
                <div className="py-12 bg-gray-50/55 border border-dashed rounded-2xl text-center">
                  <FileText className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm font-semibold">Your live blog collection is empty.</p>
                  <p className="text-xs text-gray-400 mt-1">Click "Bootstrap 3 Demo Guides" above to instantly populate the site with high-quality payment articles!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {blogs.map((post) => (
                    <div
                      key={post.id}
                      className="group p-4 bg-gray-50 hover:bg-navy/5 border border-gray-150 hover:border-navy/10 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-white rounded-xl border overflow-hidden shrink-0 shadow-sm relative">
                          {post.image ? (
                            <img src={post.image} alt="Cover image preview" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-navy/5 text-navy flex items-center justify-center font-bold text-sm">SG</div>
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                            <span className="px-2.5 py-0.5 bg-navy/5 text-navy uppercase text-[9px] font-extrabold rounded-full tracking-tight border border-navy/10">{post.category}</span>
                            <span className="text-[10px] text-gray-400 font-mono flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {post.readTime}</span>
                          </div>
                          <h5 className="font-bold text-navy text-sm sm:text-base leading-snug">{post.title}</h5>
                          <p className="text-gray-500 text-[11px] sm:text-xs mt-1.5 line-clamp-1">{post.summary}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 self-end md:self-center shrink-0">
                        <a
                          href="/blog"
                          target="_blank"
                          className="px-3.5 py-2 hover:bg-white border rounded-xl text-xs font-semibold text-gray-500 hover:text-navy hover:border-navy/10 tracking-tight transition-all"
                        >
                          View Site
                        </a>
                        <button
                          onClick={() => handleDeleteBlog(post.id, post.title)}
                          className="p-2 text-gray-400 hover:text-red-650 hover:bg-red-50 rounded-xl transition-all"
                          title="Delete Post"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
