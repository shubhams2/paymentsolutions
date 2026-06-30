
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import {
  CreditCard,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Phone,
  Mail,
  Star,
  MessageSquare,
  Search,
  Rocket,
  Quote,
  Link2,
  Monitor,
  Banknote,
  Clock,
  Users,
  QrCode,
  UserCircle,
  Store,
  Building2,
  CalendarCheck,
  TrendingDown
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "../lib/utils";
import { ScheduleModal } from "../components/ScheduleModal";

import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import { SEO } from "../components/SEO";
import { SEO_DATA } from "../lib/seoData";

const leadSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^[\d\s\-+()]{7,20}$/, "Please enter a valid phone number").or(z.string().length(0)).optional(),
  businessName: z.string().optional(),
  businessSize: z.string().optional(),
  monthlyTurnover: z.string().optional(),
  solutionInterest: z.string().optional(),
  howHeard: z.string().optional(),
  message: z.string().optional(),
  marketingConsent: z.boolean(),
});

type LeadFormValues = z.infer<typeof leadSchema>;

export default function Home() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);

  // Inputs for Dynamic Fee Calculation
  const [monthlyTurnover, setMonthlyTurnover] = useState<number>(5000);
  const [avgTicketSize, setAvgTicketSize] = useState<number>(20);
  const [cnpPercent, setCnpPercent] = useState<number>(10);
  const [monthlyRefunds, setMonthlyRefunds] = useState<number>(5);

  // Card distribution volume shares (normalized dynamically to equal 100%)
  const [pDebitShare, setPDebitShare] = useState<number>(45);
  const [pCreditShare, setPCreditShare] = useState<number>(25);
  const [bDebitShare, setBDebitShare] = useState<number>(15);
  const [bCreditShare, setBCreditShare] = useState<number>(10);
  const [amexShare, setAmexShare] = useState<number>(5);

  // Compute normalized values for rendering
  const totalShare = Math.max(1, pDebitShare + pCreditShare + bDebitShare + bCreditShare + amexShare);
  const pDebitPercent = (pDebitShare / totalShare) * 100;
  const pCreditPercent = (pCreditShare / totalShare) * 100;
  const bDebitPercent = (bDebitShare / totalShare) * 100;
  const bCreditPercent = (bCreditShare / totalShare) * 100;
  const amexPercent = (amexShare / totalShare) * 100;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      marketingConsent: false
    }
  });

  const onSubmit = async (data: LeadFormValues) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      // Step A: Natively push the form inputs (data) to Firebase Firestore
      await addDoc(collection(db, "leads"), {
        ...data,
        source: "get_in_touch_form",
        createdAt: serverTimestamp(),
      });

      // Step B: Immediately after Firebase write, call local fetch POST to `/leads`
      try {
        const response = await fetch("/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...data,
            source: "get_in_touch_form",
          }),
        });
        if (!response.ok) {
          console.warn("Cloudflare Pages Function backup lead request failed with status:", response.status);
        }
      } catch (fetchErr) {
        console.warn("Warning: Cloudflare Pages Function '/leads' email trigger failed:", fetchErr);
        // Continue allowed by requirement
      }

      // Step C: Clear form, clear loading, set success
      reset();
      setIsSubmitting(false);
      setIsSubmitted(true);
    } catch (error: any) {
      console.error("Submission error:", error);
      setSubmitError(error.message || "There was an issue processing your request. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <SEO
        title={SEO_DATA.homepage.title}
        description={SEO_DATA.homepage.description}
        schema={SEO_DATA.homepage.schema}
      />
      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen flex items-center overflow-hidden pt-16" style={{ background: "linear-gradient(135deg, #0d2f6e 0%, #1a4aa8 60%, #0d2f6e 100%)" }}>
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full opacity-10" style={{ background: "radial-gradient(circle, #e8a800, transparent 70%)" }}></div>
        <div className="absolute -bottom-40 -left-20 w-[400px] h-[400px] rounded-full opacity-10" style={{ background: "radial-gradient(circle, white, transparent 70%)" }}></div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-7"
            >
              <div className="inline-flex items-center gap-2 bg-white/10 text-white text-xs font-semibold uppercase tracking-wider px-4 py-1.5 rounded-full mb-6">
                <ShieldCheck className="w-3.5 h-3.5 text-gold" />
                UK-Based Payment Consultancy
              </div>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Smarter Payment Solutions <span className="text-gold">for Your Business</span>
              </h1>
              <p className="text-blue-100 text-lg leading-relaxed mb-8 max-w-lg">
                Whether you need card payments, QR code checkouts, payment links or a full POS system — we guide UK merchants and individuals to the right solution, every time.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setIsScheduleOpen(true)}
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-base font-semibold text-navy-dark bg-gold rounded-lg transition-all shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Book a free Consultation <CalendarCheck className="w-4 h-4" />
                </button>
                <Link to="/compare" className="inline-flex items-center justify-center px-7 py-3.5 text-base font-semibold text-white border-2 border-white/40 rounded-lg hover:bg-white/10 transition-all">
                  Compare Rate Options
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-6">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-1.5 text-blue-100 text-sm cursor-default"
                >
                  <motion.div
                    whileHover={{ rotate: 15, scale: 1.2 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Star className="w-4 h-4 text-gold fill-gold" />
                  </motion.div>
                  FCA Regulated Partners
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-1.5 text-blue-100 text-sm cursor-default"
                >
                  <motion.div
                    whileHover={{ rotate: 15, scale: 1.2 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Star className="w-4 h-4 text-gold fill-gold" />
                  </motion.div>
                  No Hidden Fees
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-1.5 text-blue-100 text-sm cursor-default"
                >
                  <motion.div
                    whileHover={{ rotate: 15, scale: 1.2 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Star className="w-4 h-4 text-gold fill-gold" />
                  </motion.div>
                  24/7 UK Support
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-5 w-full"
            >
              <div className="bg-[#0b2447]/90 backdrop-blur-md text-white p-6 sm:p-7 rounded-3xl shadow-2xl flex flex-col gap-5 border border-white/10">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingDown className="text-gold w-5 h-5 animate-pulse" />
                    <h3 className="font-display font-bold text-xl text-white">Merchant Cost Calculator</h3>
                  </div>
                  <p className="text-blue-100/70 text-xs leading-relaxed">
                    Adjust parameters below to compute live processing calculations based on our partner panel's true contract rules, auth fees, and minimum statement variables.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Parameter: Monthly Turnover */}
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1 font-medium">
                      <label htmlFor="turnover" className="text-blue-50">Estimated Monthly Turnover</label>
                      <span className="text-gold font-mono font-bold text-base">£{monthlyTurnover.toLocaleString()}</span>
                    </div>
                    <input
                      id="turnover"
                      type="range"
                      min="500"
                      max="100000"
                      step="500"
                      value={monthlyTurnover}
                      onChange={(e) => setMonthlyTurnover(Number(e.target.value))}
                      className="w-full accent-gold bg-[#153a7e] rounded-lg appearance-none h-1.5 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-blue-200/50 mt-1 font-mono">
                      <span>£500</span>
                      <span>£10k</span>
                      <span>£50k</span>
                      <span>£100k</span>
                    </div>
                  </div>

                  {/* Parameter: Average Transaction Size */}
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1 font-medium">
                      <label htmlFor="ticket-size" className="text-blue-50">Average Transaction Size</label>
                      <span className="text-gold font-mono font-bold">£{avgTicketSize}</span>
                    </div>
                    <input
                      id="ticket-size"
                      type="range"
                      min="5"
                      max="200"
                      step="5"
                      value={avgTicketSize}
                      onChange={(e) => setAvgTicketSize(Number(e.target.value))}
                      className="w-full accent-gold bg-[#153a7e] rounded-lg appearance-none h-1.5 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-blue-200/50 mt-1 font-mono font-semibold">
                      <span>£5</span>
                      <span>£50</span>
                      <span>£100</span>
                      <span>£200</span>
                    </div>
                    <p className="text-[10px] text-blue-200/60 mt-1">
                      Average monthly volume: <strong className="text-white font-mono">{Math.round(monthlyTurnover / avgTicketSize)} txns</strong> (impacts auth charges).
                    </p>
                  </div>

                  {/* 5-way Card Type Distribution sliders */}
                  <div className="bg-[#07255a] p-3.5 rounded-2xl border border-blue-900/50 space-y-3">
                    <span className="text-[10px] text-blue-200/80 font-bold uppercase tracking-wider block mb-1">
                      Card Type Split (% of Turnover)
                    </span>

                    {/* Personal UK Debit */}
                    <div>
                      <div className="flex justify-between items-center text-xs mb-1">
                        <span className="text-blue-100 text-[11px]">Personal UK Debit <span className="text-gold font-medium font-mono">0.65%</span></span>
                        <span className="text-gold font-mono font-bold text-[11px]">{pDebitPercent.toFixed(0)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        value={pDebitShare}
                        onChange={(e) => setPDebitShare(Number(e.target.value))}
                        className="w-full accent-gold bg-[#153a7e] rounded appearance-none h-1 cursor-pointer"
                      />
                    </div>

                    {/* Personal UK Credit */}
                    <div>
                      <div className="flex justify-between items-center text-xs mb-1">
                        <span className="text-blue-100 text-[11px]">Personal UK Credit <span className="text-gold font-medium font-mono">0.95%</span></span>
                        <span className="text-gold font-mono font-bold text-[11px]">{pCreditPercent.toFixed(0)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        value={pCreditShare}
                        onChange={(e) => setPCreditShare(Number(e.target.value))}
                        className="w-full accent-gold bg-[#153a7e] rounded appearance-none h-1 cursor-pointer"
                      />
                    </div>

                    {/* Business Debit */}
                    <div>
                      <div className="flex justify-between items-center text-xs mb-1">
                        <span className="text-blue-100 text-[11px]">Business Debit <span className="text-gold font-medium font-mono">1.46%</span></span>
                        <span className="text-gold font-mono font-bold text-[11px]">{bDebitPercent.toFixed(0)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        value={bDebitShare}
                        onChange={(e) => setBDebitShare(Number(e.target.value))}
                        className="w-full accent-gold bg-[#153a7e] rounded appearance-none h-1 cursor-pointer"
                      />
                    </div>

                    {/* Business Credit Card */}
                    <div>
                      <div className="flex justify-between items-center text-xs mb-1">
                        <span className="text-blue-100 text-[11px]">Business Credit Card <span className="text-gold font-medium font-mono">2%</span></span>
                        <span className="text-gold font-mono font-bold text-[11px]">{bCreditPercent.toFixed(0)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        value={bCreditShare}
                        onChange={(e) => setBCreditShare(Number(e.target.value))}
                        className="w-full accent-gold bg-[#153a7e] rounded appearance-none h-1 cursor-pointer"
                      />
                    </div>

                    {/* Amex Cards */}
                    <div>
                      <div className="flex justify-between items-center text-xs mb-1">
                        <span className="text-blue-100 text-[11px]">Amex Cards <span className="text-gold font-medium font-mono">2%</span></span>
                        <span className="text-gold font-mono font-bold text-[11px]">{amexPercent.toFixed(0)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        value={amexShare}
                        onChange={(e) => setAmexShare(Number(e.target.value))}
                        className="w-full accent-gold bg-[#153a7e] rounded appearance-none h-1 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* CNP and Refunds Slider */}
                  <div className="grid grid-cols-2 gap-3 pb-1">
                    {/* CNP / Card Not Present */}
                    <div>
                      <div className="flex justify-between items-center text-xs mb-1 font-medium text-blue-100">
                        <label htmlFor="cnp-percent" className="text-[11px]">CNP (Online)</label>
                        <span className="text-gold font-mono text-[11px]">{cnpPercent}%</span>
                      </div>
                      <input
                        id="cnp-percent"
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        value={cnpPercent}
                        onChange={(e) => setCnpPercent(Number(e.target.value))}
                        className="w-full accent-gold bg-[#153a7e] rounded-lg appearance-none h-1 cursor-pointer"
                      />
                    </div>

                    {/* Monthly Refunds */}
                    <div>
                      <div className="flex justify-between items-center text-xs mb-1 font-medium text-blue-100">
                        <label htmlFor="refunds" className="text-[11px]">Refunds/Mo</label>
                        <span className="text-gold font-mono text-[11px]">{monthlyRefunds}</span>
                      </div>
                      <input
                        id="refunds"
                        type="range"
                        min="0"
                        max="50"
                        step="5"
                        value={monthlyRefunds}
                        onChange={(e) => setMonthlyRefunds(Number(e.target.value))}
                        className="w-full accent-gold bg-[#153a7e] rounded-lg appearance-none h-1 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                <Link
                  to={`/compare?turnover=${monthlyTurnover}&ticket=${avgTicketSize}&pdebit=${pDebitShare}&pcredit=${pCreditShare}&bdebit=${bDebitShare}&bcredit=${bCreditShare}&amex=${amexShare}&cnp=${cnpPercent}&refunds=${monthlyRefunds}`}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 font-display font-bold text-sm text-navy-dark bg-gold rounded-2xl hover:bg-gold/90 hover:scale-[1.02] shadow-md hover:shadow-lg transition-all text-center"
                >
                  Compare Rate Options <ArrowRight className="w-4.5 h-4.5" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Bar (Marquee) */}
      <div className="bg-white border-y border-gray-100 py-6 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 mb-3 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">We integrate your business with leading, FCA-regulated UK & global payment networks.</p>
        </div>
        <div className="relative overflow-hidden">
          <div className="animate-marquee flex gap-12 items-center whitespace-nowrap">
            {["Visa", "Mastercard", "Amex", "Stripe", "Square", "SumUp", "Worldpay", "Barclaycard", "PayPal"].map((brand, i) => (
              <span key={i} className="text-base font-bold text-gray-300 hover:text-gray-500 transition-colors cursor-default select-none shrink-0">{brand}</span>
            ))}
            {["Visa", "Mastercard", "Amex", "Stripe", "Square", "SumUp", "Worldpay", "Barclaycard", "PayPal"].map((brand, i) => (
              <span key={`clone-${i}`} className="text-base font-bold text-gray-300 hover:text-gray-500 transition-colors cursor-default select-none shrink-0">{brand}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Services Section */}
      <section id="services" className="py-20 md:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold uppercase tracking-widest text-gold mb-2">Our Services</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-navy mb-4">Payment Solutions Built for UK Businesses</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">From sole traders to multi-site merchants, we seamlessly connect your business to cost-effective payment infrastructure — quickly and tailored strictly to your operational needs.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Card Payments",
                desc: "Accept Visa, Mastercard and contactless payments in-store or on the go.",
                icon: CreditCard,
                tags: ["Contactless", "Chip & PIN", "Mobile PDQ"]
              },
              {
                title: "QR Code Payments",
                desc: "Let customers pay instantly by scanning a QR code — no app required.",
                icon: QrCode,
                tags: ["Instant Setup", "No Hardware", "Works on Any Phone"]
              },
              {
                title: "Payment Links",
                desc: "Send secure payment links via email, SMS or WhatsApp. Ideal for invoicing.",
                icon: Link2,
                tags: ["Send by Email / SMS", "No Website Needed", "Instant Collection"]
              },
              {
                title: "POS Systems",
                desc: "Full point-of-sale solutions for retail and hospitality with inventory management.",
                icon: Monitor,
                tags: ["Retail & Hospitality", "Multi-Location", "Cloud-Based"]
              }
            ].map((service, i) => (
              <motion.article
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group flex flex-col bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-5 group-hover:bg-navy group-hover:text-white transition-colors text-navy">
                  <service.icon className="w-6 h-6" />
                </div>
                <h3 className="font-display font-semibold text-lg text-navy mb-3">{service.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed flex-1">{service.desc}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {service.tags.map(tag => (
                    <span key={tag} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">{tag}</span>
                  ))}
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Who We Help Section */}
      <section className="py-20 md:py-28 bg-white border-y border-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-sm font-semibold uppercase tracking-widest text-gold mb-3">Tailored Experience</p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-navy mb-6">Expert Selection Support for Your Business Stage</h2>
            <div className="h-1 w-20 bg-gold mx-auto mb-8"></div>
            <p className="text-gray-500 text-lg leading-relaxed">
              Whether you're just starting out or managing a complex operation, our consultancy ensures your payment technology keeps pace with your growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: UserCircle,
                title: "Sole Traders",
                desc: "Low-fee mobile readers and simple payment links. Perfect for vendors, freelancers, and small shops needing agility.",
                features: ["Zero Monthly Fee Options", "Fast Setup", "Pay-as-you-go"]
              },
              {
                icon: Store,
                title: "High Street Retail",
                desc: "Next-gen, reliable smart POS countertop terminals. Robust hardware for high-volume transactions and staff management.",
                features: ["Integrated Inventories", "Dual-Network Sim", "24/7 Field Support"]
              },
              {
                icon: Building2,
                title: "Multi-Site Networks",
                desc: "Centralized digital reporting and cross-location setups for complex business structures and franchises.",
                features: ["Unified Reporting", "Enterprise SLAs", "Custom Integration"]
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative p-8 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:border-gold/30 transition-all duration-300"
              >
                <div className="w-16 h-16 rounded-2xl bg-blue-50 text-navy flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                  <item.icon className="w-8 h-8" />
                </div>
                <h3 className="font-display font-bold text-navy text-2xl mb-4">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-8">{item.desc}</p>
                <ul className="space-y-3 pt-6 border-t border-gray-50">
                  {item.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs font-semibold text-navy/70">
                      <CheckCircle2 className="w-3.5 h-3.5 text-gold" /> {feat}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section id="why-us" className="py-24 md:py-32 bg-navy relative overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-white rounded-full text-xs font-semibold uppercase tracking-widest mb-6">
                <ShieldCheck className="w-3 h-3 text-gold" />
                The Phalam Payments Edge
              </div>
              <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight">Expert Guidance, <span className="text-gold italic">Zero Pressure</span></h2>
              <p className="text-blue-100/70 text-lg leading-relaxed mb-10 max-w-xl">
                Navigating the UK payments landscape is complex. We simplify it. As independent consultants, we work for <strong className="text-white">you</strong> — not the banks or payment providers.
              </p>

              <div className="space-y-4 mb-10">
                {[
                  "No broker fees or hidden consultation costs",
                  "Direct access to FCA-regulated UK networks",
                  "Unbiased recommendations based on your data"
                ].map((point, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-gold/20 flex items-center justify-center shrink-0 mt-1">
                      <div className="w-2 h-2 bg-gold rounded-full"></div>
                    </div>
                    <span className="text-white font-medium">{point}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setIsScheduleOpen(true)}
                className="inline-flex items-center gap-3 px-8 py-4 text-base font-bold text-navy-dark bg-gold rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
              >
                Book a Free Discovery Call <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { title: "Independent Advice", desc: "We are provider-agnostic. Our only job is to find you the best fit for your specific operational scale.", icon: Users },
                { title: "Competitive Rates", desc: "We leverage our industry connections to negotiate and source the best market rates for you.", icon: Banknote },
                { title: "Fast Onboarding", desc: "We know time is money. Most of our recommended solutions go live within 48–72 hours.", icon: Clock },
                { title: "Regulated Partners", desc: "Security is paramount. All solutions are provided through authorised UK regulated entities.", icon: CheckCircle2 }
              ].map((reason, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center shrink-0 text-gold mb-5 group-hover:bg-gold group-hover:text-navy transition-all">
                    <reason.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg text-white mb-3 tracking-tight">{reason.title}</h3>
                  <p className="text-blue-100/60 text-sm leading-relaxed">{reason.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 md:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-gold mb-2">How It Works</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-navy mb-14">Simple. Fast. Hassle-Free.</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-10 left-[16.66%] right-[16.66%] h-px bg-blue-100" />
            {[
              { step: "01", title: "Tell Us About Your Business", desc: "Fill in our enquiry form or call us. We'll ask about your business needs.", icon: MessageSquare },
              { step: "02", title: "We Find the Best Fit", desc: "Our consultants analyse the market and present unbiased recommendations.", icon: Search },
              { step: "03", title: "You're Live & Taking Payments", desc: "Once you choose, we handle onboarding so you can start taking payments.", icon: Rocket }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="relative mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-navy flex items-center justify-center shadow-md z-10 relative text-white">
                    <item.icon className="w-8 h-8" />
                  </div>
                  <span className="absolute -top-4 -right-4 w-10 h-10 bg-gold rounded-full text-sm font-bold flex items-center justify-center text-navy shadow-[0_0_20px_rgba(251,191,36,0.4)] border-4 border-white z-30">
                    {item.step}
                  </span>
                </div>
                <h3 className="font-display font-semibold text-xl text-navy mb-3">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold uppercase tracking-widest text-gold mb-2">Client Stories</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-navy">Real Results for Real Businesses</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote: "Phalam Payments UK saved me hours of confusion. They helped me select and integrate a card reader and QR system from a regulated partner that's perfect for my café.",
                author: "James Hargreaves",
                role: "Owner, The Corner Bakery – Manchester",
                initials: "JH"
              },
              {
                quote: "The team sourced a payment link solution from a top provider that means I can take deposits from clients without any technical hassle.",
                author: "Priya Sharma",
                role: "Freelance Beauty Therapist – London",
                initials: "PS"
              },
              {
                quote: "We needed a unified POS system. Phalam Payments managed the selection and integration process with their partners across all four store sites.",
                author: "David Chen",
                role: "Director, Lotus Retail Group – Birmingham",
                initials: "DC"
              }
            ].map((t, i) => (
              <blockquote key={i} className="bg-white rounded-2xl p-6 shadow-sm flex flex-col">
                <Quote className="w-8 h-8 text-navy opacity-20 mb-4" />
                <p className="text-gray-600 text-sm leading-relaxed flex-1 mb-6 italic">"{t.quote}"</p>
                <div className="flex items-center gap-1 mb-4 text-gold">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-gold" />)}
                </div>
                <footer className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {t.initials}
                  </div>
                  <div>
                    <cite className="not-italic font-semibold text-sm block text-navy">{t.author}</cite>
                    <span className="text-gray-400 text-[10px]">{t.role}</span>
                  </div>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact" className="py-20 md:py-28 bg-white border-t border-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            <div className="lg:col-span-2">
              <p className="text-sm font-semibold uppercase tracking-widest text-gold mb-2">Get in Touch</p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-navy mb-5">Identify Your Ideal Payment Stack</h2>
              <p className="text-gray-500 text-base leading-relaxed mb-8">
                Submit your details and one of our UK specialists will be in touch within one business day. We provide expert technology selection support with no obligation.
              </p>

              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 text-navy">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-medium font-semibold uppercase tracking-wider">Phone</p>
                    <p className="text-sm font-semibold text-navy">+44-7448558053</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 text-navy">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-medium font-semibold uppercase tracking-wider">Email</p>
                    <p className="text-sm font-semibold text-navy">sales@phalampayments.co.uk</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 mb-4">
                <button
                  onClick={() => setIsScheduleOpen(true)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 text-base font-semibold text-navy-dark bg-gold rounded-lg transition-all shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Book a free consultation <CalendarCheck className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-6 bg-blue-50 border border-blue-100 rounded-xl p-5">
                <p className="text-xs font-semibold text-navy uppercase mb-2">We promise:</p>
                {[
                  "No spam — ever",
                  "Response within 1 business day",
                  "Free, no-obligation advice"
                ].map(text => (
                  <div key={text} className="flex items-center gap-2 text-xs text-navy/70 mt-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {text}
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="bg-gray-50 rounded-2xl p-6 md:p-8 border border-gray-100 shadow-xl shadow-gray-200/50">
              {!isSubmitted ? (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Full Name *</label>
                      <input
                        {...register("name")}
                        placeholder="e.g. Sarah Johnson"
                        className={cn(
                          "w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy focus:ring-offset-1 transition-all bg-white",
                          errors.name ? "border-red-500" : "border-gray-200"
                        )}
                      />
                      {errors.name && <p className="text-red-500 text-[10px] mt-1">{errors.name.message}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Email Address *</label>
                      <input
                        {...register("email")}
                        placeholder="you@yourbusiness.co.uk"
                        className={cn(
                          "w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy focus:ring-offset-1 transition-all bg-white",
                          errors.email ? "border-red-500" : "border-gray-200"
                        )}
                      />
                      {errors.email && <p className="text-red-500 text-[10px] mt-1">{errors.email.message}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Phone Number</label>
                      <input
                        {...register("phone")}
                        placeholder="+44 07700 000000"
                        className={cn(
                          "w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy bg-white",
                          errors.phone ? "border-red-500" : "border-gray-200"
                        )}
                      />
                      {errors.phone && <p className="text-red-500 text-[10px] mt-1">{errors.phone.message}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Business Name</label>
                      <input
                        {...register("businessName")}
                        placeholder="Your Business Ltd"
                        className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Business Size</label>
                      <select
                        {...register("businessSize")}
                        className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy bg-white"
                      >
                        <option value="">Select size</option>
                        <option value="Sole Trader">Sole Trader</option>
                        <option value="Small (2-10)">2-10 employees</option>
                        <option value="Medium (11-50)">11-50 employees</option>
                        <option value="Large (51+)">51+ employees</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Monthly Turnover</label>
                      <select
                        {...register("monthlyTurnover")}
                        className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy bg-white"
                      >
                        <option value="">Select turnover</option>
                        <option value="New Business">New Business / £0</option>
                        <option value="Under £5k">Under £5,000</option>
                        <option value="£5k - £20k">£5,000 - £20,000</option>
                        <option value="£20k - £50k">£20,000 - £50,000</option>
                        <option value="£50k - £100k">£50,000 - £100,000</option>
                        <option value="Over £100k">Over £100,000</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Interested In</label>
                      <select
                        {...register("solutionInterest")}
                        className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy bg-white"
                      >
                        <option value="">Select Interest</option>
                        <option value="Card Payments">Card Payments</option>
                        <option value="QR Code Payments">QR Code Payments</option>
                        <option value="Link Payments">Link Payments</option>
                        <option value="POS System">POS System</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">How Did You Hear About Us?</label>
                      <select
                        {...register("howHeard")}
                        className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy bg-white"
                      >
                        <option value="">Please select</option>
                        <option value="Google Search">Google Search</option>
                        <option value="Social Media">Social Media</option>
                        <option value="Referral">Referral / Word of Mouth</option>
                        <option value="LinkedIn">LinkedIn</option>
                        <option value="Online Advert">Online Advert</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Message</label>
                    <textarea
                      {...register("message")}
                      rows={4}
                      placeholder="Tell us a little about your business..."
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy bg-white resize-none"
                    />
                  </div>

                  <div className="flex items-start gap-3 py-1">
                    <div className="flex items-center h-5">
                      <input
                        id="marketingConsent"
                        type="checkbox"
                        {...register("marketingConsent")}
                        className="w-4 h-4 text-navy border-gray-300 rounded focus:ring-navy"
                      />
                    </div>
                    <label htmlFor="marketingConsent" className="text-[11px] text-gray-500 leading-tight">
                      I would like to receive occasional updates about payment technology and cost-saving tips via email. (Optional)
                    </label>
                  </div>

                  {submitError && <p className="text-red-500 text-xs">{submitError}</p>}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-navy text-white font-bold rounded-lg hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? "Sending..." : "Send My Enquiry →"}
                  </button>
                  <p className="mt-4 text-[10px] text-gray-400 text-center leading-relaxed">
                    By clicking submit, you agree to our Privacy Policy and consent to us contacting you regarding your payment technology inquiry.
                  </p>
                </form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-10"
                >
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-navy">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-navy mb-4">Enquiry Received</h3>
                  <p className="text-gray-500 text-sm mb-10 leading-relaxed">
                    Thank you for choosing Phalam Payments UK. A consultant will contact you shortly to arrange your free audit.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="text-gold font-bold text-xs uppercase tracking-widest hover:underline"
                  >
                    Send another enquiry
                  </button>
                </motion.div>
              )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <ScheduleModal isOpen={isScheduleOpen} onClose={() => setIsScheduleOpen(false)} />
    </div>
  );
}
