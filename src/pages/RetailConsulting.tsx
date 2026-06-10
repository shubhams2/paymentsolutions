import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Store, 
  CreditCard, 
  AlertTriangle, 
  CheckCircle, 
  ShieldCheck, 
  ChevronRight, 
  Flame, 
  HelpCircle,
  FileSpreadsheet
} from "lucide-react";
import { SEO } from "../components/SEO";
import { SEO_DATA } from "../lib/seoData";
import { ScheduleModal } from "../components/ScheduleModal";

export default function RetailConsulting() {
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);

  return (
    <div className="pt-28 bg-gradient-to-b from-blue-50/50 via-white to-white min-h-screen">
      <SEO 
        title={SEO_DATA.retail.title} 
        description={SEO_DATA.retail.description} 
        schema={SEO_DATA.retail.schema} 
      />

      {/* Hero Section */}
      <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-gold/10 text-gold mb-6 border border-gold/20">
            <Store className="w-3.5 h-3.5" /> High Street Retail & Hospitality Specialist
          </span>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-navy tracking-tight max-w-4xl mx-auto mb-6">
            Stop Overpaying for Your <span className="text-gold">Card Machines</span> & Terminal Fees
          </h1>
          <p className="text-gray-500 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            We audit your merchant statements, bypass predatory rolling contracts, and connect your physical shop with robust, next-generation Android PDQ terminals at the lowest possible rates.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => setIsScheduleOpen(true)}
              className="px-8 py-4 bg-navy hover:bg-gold hover:text-navy text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              Book Free Statement Audit <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href="#traps"
              className="px-8 py-4 bg-white hover:bg-gray-50 text-navy font-semibold rounded-xl border border-gray-200 transition-all duration-300 flex items-center justify-center gap-2"
            >
              Read common contract traps
            </a>
          </div>
        </motion.div>
      </section>

      {/* Traps Warning Section */}
      <section id="traps" className="py-16 bg-red-50/50 border-y border-red-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h2 className="font-display text-2xl font-bold text-navy">UK Retailers Beware: The 3 Merchant Contract Traps</h2>
            </div>
            <div className="space-y-6 text-gray-700">
              <div className="bg-white p-5 rounded-2xl border border-red-100/80 shadow-sm">
                <p className="font-bold text-red-700 mb-1">1. The 3-to-4 Year Terminal Rental Lock-in</p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Many ISOs lease standard card machines on independent 36 or 48-month agreements that are practically impossible to break, even if your business shuts down or you switch processors.
                </p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-red-100/80 shadow-sm">
                <p className="font-bold text-red-700 mb-1">2. Ballooning PCI Compliance & Admin Charges</p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Hidden fees such as "Non-Compliance charges" (&pound;30+ per month), portal fees, and account upkeep costs stealthily inflate your effective card processing rate far past your agreed headline rate.
                </p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-red-100/80 shadow-sm">
                <p className="font-bold text-red-700 mb-1">3. Auto-Renewing Roller Clausing</p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Failing to send a written notice exactly 92 days before the contract boundary frequently auto-renews your fee schedule for another consecutive 12 to 24 months.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions / Features Grid */}
      <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-xs font-bold uppercase tracking-widest text-gold mb-2">Our Solutions</p>
          <h2 className="font-display text-3xl font-bold text-navy">Honest, Low-Cost Retail Payments</h2>
          <p className="text-gray-500 text-sm max-w-md mx-auto mt-2">We provide objective comparison and clear onboarding without hidden hooks.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-navy flex items-center justify-center mb-6">
              <CreditCard className="w-6 h-6" />
            </div>
            <h3 className="font-display font-semibold text-xl text-navy mb-3">Modern Countertop Smart PDQ</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">
              Lightning-fast Wi-Fi, Ethernet, and Dual-Sim 4G fallbacks. Never drop a sale due to internet outage.
            </p>
            <ul className="space-y-2 text-xs font-medium text-navy/80">
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-gold" /> Integrated Android POS</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-gold" /> Digital e-Receipts via SMS/Email</li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-navy flex items-center justify-center mb-6">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <h3 className="font-display font-semibold text-xl text-navy mb-3">Free Statement Audits</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">
              Send us your merchant bills. Our senior independent payment consultants list every hidden charge for you.
            </p>
            <ul className="space-y-2 text-xs font-medium text-navy/80">
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-gold" /> Clear cost transparency</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-gold" /> 48-hour analytical breakdown</li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-navy flex items-center justify-center mb-6">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-display font-semibold text-xl text-navy mb-3">Ethical Contract Terms</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">
              We guide you strictly toward rolling agreements, short terms, or no-monthly-fee models.
            </p>
            <ul className="space-y-2 text-xs font-medium text-navy/80">
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-gold" /> No hidden multi-year system leases</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-gold" /> Objective, client-aligned recommendations</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Secondary Dynamic CTA */}
      <section className="bg-navy py-16 text-white text-center rounded-t-[2.5rem] relative overflow-hidden">
        <div className="absolute top-0 left-1/2 w-96 h-96 bg-gold/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <h2 className="font-display text-2xl sm:text-3xl font-bold mb-4">Ready to Optimize Your Till Point?</h2>
          <p className="text-blue-100/80 mb-8 max-w-xl mx-auto text-sm sm:text-base">
            Get an experienced independent payment consultant in your corner. Arrange your complimentary analysis session today.
          </p>
          <button
            onClick={() => setIsScheduleOpen(true)}
            className="px-8 py-3.5 bg-gold hover:bg-white text-navy font-bold rounded-xl transition-all duration-300"
          >
            Arrange Technical Consulting Room
          </button>
        </div>
      </section>

      {/* Appointment Popup Modal */}
      <ScheduleModal isOpen={isScheduleOpen} onClose={() => setIsScheduleOpen(false)} />
    </div>
  );
}
