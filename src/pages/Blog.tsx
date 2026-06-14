import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot 
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { SEO } from "../components/SEO";
import { SEO_DATA } from "../lib/seoData";
import { 
  BookOpen, 
  Clock, 
  User, 
  ArrowLeft, 
  Search, 
  Calendar, 
  ChevronRight, 
  CheckCircle,
  FileText,
  DollarSign,
  TrendingUp,
  ShieldCheck
} from "lucide-react";

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  summary: string;
  category: string;
  readTime: string;
  image?: string;
  author: string;
  createdAt: any; // Timestamp or date string
}

// 3 High-Quality Native Guides to ensure a rich immediate reading catalog if Firestore is unseeded
const FALLBACK_POSTS: BlogPost[] = [
  {
    id: "premium-guide-1",
    title: "The Hidden Cost of Card Machine Contracts in the UK",
    slug: "hidden-cost-card-machine-contracts",
    category: "Card Machines",
    summary: "Merchant services contracts can be full of rolling rolling cages, auto-renew covenants, and stealthy non-compliance fine fees. Learn how to verify your real effective rate.",
    readTime: "5 min read",
    author: "Shubham Garg",
    createdAt: { toDate: () => new Date("2026-05-12T10:00:00Z") },
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80",
    content: `
      <h2>The Merchant Contract Trap: What UK Small Businesses Need to Know</h2>
      <p>Independent retailers across the United Kingdom face a highly saturated and sometimes predatory merchant services market. While leading payment application companies tout incredibly low rates (like 0.4% for debit cards), the real effective rate that hits your bank account statement is often double or triple that amount.</p>
      
      <p>This comprehensive guide details the most common hidden fees and how you can shield your retail shop from long-term, expensive lock-in terms.</p>

      <h3>1. The Difference Between Premium Rates and Hidden Fees</h3>
      <p>When you sign up for card terminals, the agent typically writes down your "MMSC" (Minimum Monthly Service Charge) and the debit/credit transaction rates. However, when the monthly bill arrives, you may notice a string of mysterious, automated line item charges:</p>
      <ul>
        <li><strong>PCI-DSS Non-Compliance Fee (&pound;30–&pound;45/m):</strong> Charged if you fail to compile or renew your annual self-assessment security questionnaire.</li>
        <li><strong>Authorisation Fees (&pound;0.03–&pound;0.05 per call):</strong> Independent of the percentage-rate fee, this is charged for every communication check.</li>
        <li><strong>Terminal Hire Lease Costs:</strong> Often billed by a secondary finance broker rather than your acquirer, making it legally impossible to cancel without massive penalties.</li>
      </ul>

      <h3>2. The Multi-Year Leasing Agreement Cage</h3>
      <p>Be extremely wary of any agreement requiring you to lease standard card machines for 36, 48, or even 60 months. In the modern fintech era, you should never be locked into long-term hardware leases. Most modern processors offer rolling monthly, or 12-month agreements with outright hardware purchases or accessible rolling rentals.</p>

      <blockquote>
        "An experienced payment consultant in your corner can quickly separate the legitimate interchange charges from redundant service markups, saving you up to 40% in monthly overheads."
      </blockquote>

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
    id: "premium-guide-2",
    title: "Optimising Online Checkout & Squeezing Payment Gateway Fees",
    slug: "optimise-checkout-payment-gateway-fees",
    category: "Digital Gateways",
    summary: "Frictional online checkouts drive up cart abandonment ratios. We explore modern alternative rails, API card vaults, and smart 3D-Secure transaction routing.",
    readTime: "7 min read",
    author: "Shubham Garg",
    createdAt: { toDate: () => new Date("2026-05-28T14:30:00Z") },
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

      <h3>2. Reducing Checkout Form Obstacles</h3>
      <p>Every additional field on your checkout screen degrades conversion rate metrics. To capture digital transactions efficiently:</p>
      <ul>
        <li>Implement <strong>Apple Pay and Google Pay express sheets</strong>. These bypass standard payment details entirely, allowing shoppers to complete physical checkout sequences in under 3 seconds.</li>
        <li>Ensure your checkout utilizes <strong>inline card validations</strong> and floating layout card frames to build instant consumer trust.</li>
        <li>Incorporate modern <strong>Open Banking rails</strong>. This enables instant bank-to-bank account payments, entirely bypassing card processing fees for high-ticket items.</li>
      </ul>

      <h3>3. Gateway API Strategy Checklist</h3>
      <p>Before launching a large developer audit, ask your processing providers:</p>
      <ul>
        <li>Do we have local card vault tokenization schemas?</li>
        <li>Can we leverage local acquiring networks across Europe and the US to optimize conversion currencies?</li>
        <li>Are we utilizing intelligent 3D-Secure (3DS2) thresholds to fast-track low-risk shoppers?</li>
      </ul>
    `
  },
  {
    id: "premium-guide-3",
    title: "Demystifying PCI DSS Compliance and Stealth Statement Penalties",
    slug: "demystifying-pci-compliance-fees",
    category: "Audits & Integrity",
    summary: "Are those £30 monthly charges on your merchant statement really mandatory? Learn how to self-certify safely and stop paying non-compliance fines.",
    readTime: "4 min read",
    author: "Shubham Garg",
    createdAt: { toDate: () => new Date("2026-06-05T09:15:00Z") },
    image: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80",
    content: `
      <h2>The Truth About PCI Compliance Charges</h2>
      <p>If you take a close look at your merchant statements, you might find a recurring charge listed as "PCI Non-Compliance Fee" or "PCI Admin Fee." This charge is typically &pound;30, &pound;40, or even more per card machine, billed monthly until compliance is resolved.</p>
      
      <p>Many busy merchant owners write this off as an inevitable cost of accepting card terminal payments in the UK. This is a costly misconception: PCI compliance fees are entirely avoidable.</p>

      <h3>1. What is PCI DSS?</h3>
      <p>The <strong>Payment Card Industry Data Security Standard (PCI DSS)</strong> is a critical set of security specifications formulated by major card brands (Visa, Mastercard, Amex) to protect cardholder information and prevent payment systems breaches. Every business processing cards must keep their technical systems aligned with these rules.</p>

      <h3>2. Why Are You Being Charged a Non-Compliance Penalty?</h3>
      <p>When you start a new merchant services account, your processor expects you to complete a brief security self-assessment questionnaire (SAQ). If you do not fill out this secure web form, after a grace period of 30 to 60 days, the processor automatically begins levying monthly non-compliance fines.</p>
      <p>This is extremely profitable for the processing entities, so they are rarely proactive about reminding business owners to complete their forms.</p>

      <h3>3. Three Steps to Wipe Out Compliance Penalties</h3>
      <p>Stop letting merchant companies drain your account. Follow this quick checklist to claim your compliance status:</p>
      <ol>
        <li><strong>Identify Your SAQ Type:</strong> For physical, stand-alone card terminals (PDQ machines), you typically only need code level <strong>SAQ-B-IP</strong>, which is a straightforward 20-minute form.</li>
        <li><strong>Utilize Security Portal Assistants:</strong> Log into your card processor's portal and use their built-in guide wizard helper.</li>
        <li><strong>Verify Cancellation:</strong> Once your compliance is registered, check your subsequent merchant statements to verify that the compliance fee has successfully fallen to &pound;0.00.</li>
      </ol>
    `
  }
];

const CATEGORIES = ["All", "Card Machines", "Digital Gateways", "Audits & Integrity"];

export default function Blog() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    // Read from Firestore & fallback to static native blogs if empty
    const q = query(collection(db, "blogs"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const posts = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title,
            slug: data.slug || doc.id,
            content: data.content,
            summary: data.summary,
            category: data.category || "General",
            readTime: data.readTime || "5 min read",
            image: data.image || "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80",
            author: data.author || "Shubham Garg",
            createdAt: data.createdAt || { toDate: () => new Date() }
          } as BlogPost;
        });
        setBlogs(posts);
      } else {
        // Fallback
        setBlogs(FALLBACK_POSTS);
      }
      setLoading(false);
    }, (error) => {
      console.warn("Firestore collection lookup failed, reverting to cached resources:", error);
      setBlogs(FALLBACK_POSTS);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredPosts = blogs.filter(post => {
    const matchesCategory = selectedCategory === "All" || post.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatDate = (dateObj: any) => {
    if (!dateObj) return "";
    try {
      if (typeof dateObj.toDate === "function") {
        return dateObj.toDate().toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric"
        });
      }
      return new Date(dateObj).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric"
      });
    } catch (e) {
      return "";
    }
  };

  // Determine page title for SEO based on active post view
  const pageTitle = selectedPost 
    ? `${selectedPost.title} | Phalam Payments UK` 
    : SEO_DATA.blog.title;
  const pageDesc = selectedPost 
    ? selectedPost.summary 
    : SEO_DATA.blog.description;

  return (
    <div className="pt-28 pb-20 bg-gradient-to-b from-blue-50/40 via-white to-white min-h-screen">
      <SEO 
        title={pageTitle} 
        description={pageDesc} 
        schema={SEO_DATA.blog.schema} 
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <AnimatePresence mode="wait">
          {!selectedPost ? (
            // LIST VIEW
            <motion.div
              key="list-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
            >
              {/* Header Title Section */}
              <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-gold/10 text-gold mb-4 border border-gold/20">
                  <BookOpen className="w-3.5 h-3.5" /> Phalam Payments Knowledge Hub
                </span>
                <h1 className="font-display text-4xl sm:text-5xl font-bold text-navy tracking-tight mb-4">
                  Merchant Fee Guides & <span className="text-gold">Payments Strategy</span>
                </h1>
                <p className="text-gray-500 text-base sm:text-lg leading-relaxed">
                  Independent guides, transparent audits, and point-of-sale breakdowns curated by our senior advisors to guide your business away from predatory rolling terms.
                </p>
              </div>

              {/* Filtering Controls Row */}
              <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-12">
                <div className="flex flex-wrap gap-2 w-full md:w-auto">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 ${
                        selectedCategory === cat
                          ? "bg-navy text-white shadow-md shadow-navy/10"
                          : "bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-navy"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-xs sm:text-sm bg-gray-50 border border-gray-150 rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-navy/15 transition-all text-navy"
                  />
                </div>
              </div>

              {/* Blog Post Grid */}
              {loading ? (
                <div className="py-20 text-center">
                  <div className="w-10 h-10 border-4 border-navy border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-sm text-gray-500">Querying technical content archive...</p>
                </div>
              ) : filteredPosts.length === 0 ? (
                <div className="py-20 text-center bg-gray-50/50 rounded-3xl border border-dashed border-gray-250">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">No guides match your active parameters.</p>
                  <p className="text-xs text-gray-400 mt-1">Try selecting 'All' categories or modifying your query term.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {filteredPosts.map((post, idx) => (
                    <motion.article
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => setSelectedPost(post)}
                      className="group bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col h-full"
                    >
                      {/* Image Frame */}
                      <div className="relative h-48 overflow-hidden bg-gray-100">
                        <img 
                          src={post.image} 
                          alt={post.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                        <span className="absolute top-4 left-4 bg-navy/90 backdrop-blur-md text-white text-[10px] font-bold uppercase py-1 px-2.5 rounded-full border border-white/10 shadow-md">
                          {post.category}
                        </span>
                      </div>

                      {/* Info Body */}
                      <div className="p-6 flex flex-col flex-grow">
                        <div className="flex items-center gap-3 text-[11px] font-medium text-gray-400 mb-3">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" /> {formatDate(post.createdAt)}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> {post.readTime}
                          </span>
                        </div>

                        <h3 className="font-display font-bold text-lg leading-snug text-navy group-hover:text-gold transition-colors mb-3">
                          {post.title}
                        </h3>

                        <p className="text-gray-500 text-xs sm:text-sm line-clamp-3 mb-6 leading-relaxed">
                          {post.summary}
                        </p>

                        <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-navy/5 text-navy flex items-center justify-center text-[10px] font-bold font-display uppercase border border-navy/10">
                              SG
                            </div>
                            <span className="text-[11px] font-medium text-gray-600">{post.author}</span>
                          </div>
                          
                          <span className="text-xs font-semibold text-navy flex items-center gap-1 group-hover:translate-x-1.5 transition-transform duration-300">
                            Read Article <ChevronRight className="w-3.5 h-3.5 text-gold" />
                          </span>
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            // ARTICLE DETAIL VIEW
            <motion.div
              key="detail-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="max-w-4xl mx-auto bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden"
            >
              {/* Detail Banner */}
              <div className="relative h-64 md:h-96 w-full bg-gray-900">
                <img 
                  src={selectedPost.image} 
                  alt={selectedPost.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover opacity-80" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                
                {/* Back Link Button */}
                <button
                  onClick={() => setSelectedPost(null)}
                  className="absolute top-6 left-6 md:top-8 md:on-8 inline-flex items-center gap-2 px-4 py-2 bg-white/95 text-navy hover:bg-gold hover:text-navy text-xs md:text-sm font-semibold rounded-xl shadow-lg transition-all duration-300 backdrop-blur-sm"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Knowledge Hub
                </button>

                <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10 md:right-10 text-white">
                  <span className="inline-block bg-gold text-navy text-[10px] sm:text-xs font-bold uppercase py-1 px-3 rounded-full mb-3 shadow-md">
                    {selectedPost.category}
                  </span>
                  <h1 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl text-white mb-4 leading-tight tracking-tight">
                    {selectedPost.title}
                  </h1>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-white/90">
                    <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {formatDate(selectedPost.createdAt)}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-white/40"></span>
                    <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {selectedPost.readTime}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-white/40"></span>
                    <span className="flex items-center gap-1.5"><User className="w-4 h-4" /> By {selectedPost.author}</span>
                  </div>
                </div>
              </div>

              {/* Article Content Layout */}
              <div className="p-6 md:p-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                  
                  {/* Left Column - Main Body Text */}
                  <div className="lg:col-span-2 space-y-6">
                    <p className="text-gray-500 font-medium text-base md:text-lg border-l-4 border-gold pl-4 leading-relaxed mb-8 italic">
                      "{selectedPost.summary}"
                    </p>

                    <div 
                      className="prose prose-blue max-w-none text-gray-700 space-y-5 text-sm sm:text-base leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: selectedPost.content }}
                    />
                  </div>

                  {/* Right Column - Side Banner Widgets */}
                  <div className="lg:col-span-1 space-y-8">
                    
                    {/* Consulting Widget */}
                    <div className="bg-gradient-to-br from-navy via-navy to-blue-950 p-6 rounded-3xl text-white relative overflow-hidden shadow-lg">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 rounded-full blur-2xl"></div>
                      <h4 className="font-display font-semibold text-lg mb-3 flex items-center gap-1.5 text-white">
                        <ShieldCheck className="w-5 h-5 text-gold" /> Need Fee Protection?
                      </h4>
                      <p className="text-white/80 text-xs sm:text-sm leading-relaxed mb-6">
                        Don't let merchant accounts lock your business into costly terms with auto-renew clauses. Let our independent payment consultants inspect your statements for absolute rate transparency.
                      </p>
                      
                      <ul className="space-y-3 mb-6 text-xs text-white/90">
                        <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-gold shrink-0" /> Free Statement Analysis</li>
                        <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-gold shrink-0" /> True IC++ Comparisons</li>
                        <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-gold shrink-0" /> Zero Obligations</li>
                      </ul>

                      <a
                        href="/#contact"
                        className="block w-full py-2.5 bg-gold text-center text-navy font-bold rounded-xl text-xs hover:bg-white transition-all duration-300"
                      >
                        Enquire Safely Today
                      </a>
                    </div>

                    {/* About Shubham Garg */}
                    <div className="bg-gray-50 p-6 rounded-3xl border border-gray-150">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Lead Advisor</p>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-navy text-white flex items-center justify-center font-bold text-sm font-display shadow-sm">
                          SG
                        </div>
                        <div>
                          <h5 className="font-semibold text-navy text-sm">Shubham Garg</h5>
                          <p className="text-[10px] text-gray-500">Managing Payment Advisor</p>
                        </div>
                      </div>
                      <p className="text-gray-500 text-xs leading-relaxed">
                        Helping brick-and-mortar retail shops and high-volume e-commerce platforms secure efficient checkout experiences without hidden contract traps.
                      </p>
                    </div>

                  </div>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-100 flex justify-between items-center">
                  <button
                    onClick={() => setSelectedPost(null)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-navy hover:text-gold transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4 text-gold" /> Return to all guides
                  </button>
                  <span className="text-[11px] font-mono text-gray-400">Published from verified independent consultancy archives</span>
                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
