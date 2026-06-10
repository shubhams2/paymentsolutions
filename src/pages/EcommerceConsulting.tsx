import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Building2, 
  Terminal, 
  Cpu, 
  Globe2, 
  CheckCircle, 
  Zap, 
  ChevronRight,
  Sparkles
} from "lucide-react";
import { SEO } from "../components/SEO";
import { SEO_DATA } from "../lib/seoData";
import { ScheduleModal } from "../components/ScheduleModal";

export default function EcommerceConsulting() {
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);

  return (
    <div className="pt-28 bg-gradient-to-b from-blue-50/50 via-white to-white min-h-screen">
      <SEO 
        title={SEO_DATA.ecommerce.title} 
        description={SEO_DATA.ecommerce.description} 
        schema={SEO_DATA.ecommerce.schema} 
      />

      {/* Hero Section */}
      <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 mb-6 border border-blue-100">
            <Building2 className="w-3.5 h-3.5" /> High-Volume E-Commerce Gateway Consulting
          </span>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-navy tracking-tight max-w-4xl mx-auto mb-6">
            Optimize Your Digital Checkout & <span className="text-gold">Squeeze Gateway Fees</span>
          </h1>
          <p className="text-gray-500 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Helping enterprise and scaling online stores audits API transaction fees, deploy multi-currency card vaults, and integrate custom developer-centric payment routing mechanics to mitigate cart abandonments.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => setIsScheduleOpen(true)}
              className="px-8 py-4 bg-navy hover:bg-gold hover:text-navy text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              Request Gateway Fee Audit <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href="#tech-spec"
              className="px-8 py-4 bg-white hover:bg-gray-50 text-navy font-semibold rounded-xl border border-gray-200 transition-all duration-300 flex items-center justify-center gap-2"
            >
              Explore Solutions Portfolio
            </a>
          </div>
        </motion.div>
      </section>

      {/* Technical Focus Highlight */}
      <section id="tech-spec" className="py-20 bg-navy text-white rounded-[2.5rem] overflow-hidden mx-4 my-8 relative">
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl translate-x-1/3 -translate-y-1/2"></div>
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase bg-gold/20 text-gold rounded-md border border-gold/30">
                AEO Coded Infrastructure
              </span>
              <h2 className="font-display text-3xl font-bold mt-4 mb-6 leading-tight">Advanced Developer Auditing & Tech Orchestrations</h2>
              <p className="text-blue-100/80 mb-6 text-sm sm:text-base leading-relaxed">
                As independent systems integrators, we evaluate API configurations, optimize 3D-Secure dropoffs, and integrate robust alternative payment mechanisms (such as Apple Pay, Google Pay, and Open Banking APIs) into your custom e-commerce templates.
              </p>
              
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-gold/20 flex items-center justify-center text-gold shrink-0 mt-0.5">
                    <CheckCircle className="w-3.5 h-3.5" />
                  </div>
                  <p className="text-sm text-blue-100/90"><strong className="text-white">Smart Payment Routing:</strong> Dynamically dispatch transaction logs based on regional authorization levels.</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-gold/20 flex items-center justify-center text-gold shrink-0 mt-0.5">
                    <CheckCircle className="w-3.5 h-3.5" />
                  </div>
                  <p className="text-sm text-blue-100/90"><strong className="text-white">API Level Optimization:</strong> Eliminate checkout friction using highly optimized drop-in SDK card fields.</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-6 font-mono text-xs text-blue-100/80 shadow-2xl relative">
              <div className="absolute top-4 right-4 flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/80"></span>
              </div>
              <div className="flex gap-2 text-gray-500 mb-4 border-b border-white/5 pb-2">
                <Terminal className="w-4 h-4" />
                <span>phalampayments-api-audit.json</span>
              </div>
              <p className="text-gold">// Performance analysis parameters</p>
              <p className="mt-2 text-green-400">"audit_type": "Payment Gateway API Friction Analysis",</p>
              <p className="text-green-400">"status_check": "PCI-DSS Compliant Integration Checks",</p>
              <p className="text-green-400">"cart_abandonment_relevance": "High",</p>
              <p className="text-green-400">"optimised_routing": ["Stripe", "Adyen", "Revolut Business"],</p>
              <p className="mt-4 text-gold">// Target Outcomes:</p>
              <p className="text-blue-300">"declined_rate_mitigation": "-14.7%",</p>
              <p className="text-blue-300">"avg_merchant_cost_reduction": "28.5%",</p>
              <p className="text-blue-300">"authorized_transaction_uplift": "+4.2%"</p>
              <p className="mt-4 text-gray-400 text-[10px]">// Independent analysis completed by Shubham Garg, Managing Consultant</p>
            </div>
          </div>
        </div>
      </section>

      {/* Corporate Solutions Portfolio */}
      <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-xs font-bold uppercase tracking-widest text-gold mb-2">Our Capabilities</p>
          <h2 className="font-display text-4xl font-bold text-navy">E-Commerce Merchant Capabilities</h2>
          <p className="text-gray-500 text-sm max-w-md mx-auto mt-2">Connecting UK and worldwide digital sales flows with optimal technology layers.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:translate-y-[-4px] transition-transform duration-300">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-navy flex items-center justify-center mb-6">
              <Globe2 className="w-6 h-6" />
            </div>
            <h3 className="font-display font-semibold text-xl text-navy mb-3">Multi-Currency Collection</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Bypass high exchange conversion rates. Configure custom multi-currency settlements with local accounts across Euro, USD, and Pound sterling.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:translate-y-[-4px] transition-transform duration-300">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-navy flex items-center justify-center mb-6">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="font-display font-semibold text-xl text-navy mb-3">Modular SDK Integrations</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Drop-in custom inline payment form layouts. No complex redirect schemes, ensuring frictionless mobile experiences and brand consistency.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:translate-y-[-4px] transition-transform duration-300">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-navy flex items-center justify-center mb-6">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-display font-semibold text-xl text-navy mb-3">Smart Fraud Scrubbing</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Implement customized risk control thresholds, checking fraud markers proactively to reduce costly chargebacks and merchant penalties.
            </p>
          </div>
        </div>
      </section>

      {/* Appointment Popup Modal */}
      <ScheduleModal isOpen={isScheduleOpen} onClose={() => setIsScheduleOpen(false)} />
    </div>
  );
}
