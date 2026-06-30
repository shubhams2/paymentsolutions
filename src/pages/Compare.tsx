import React, { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "motion/react";
import {
  Calculator,
  Check,
  HelpCircle,
  TrendingDown,
  ArrowRight,
  ShieldCheck,
  Zap,
  Clock,
  AlertCircle,
  Percent,
  ChevronDown,
  Building,
  UserCheck
} from "lucide-react";
import { SEO } from "../components/SEO";
import { SEO_DATA } from "../lib/seoData";
import { ScheduleModal } from "../components/ScheduleModal";

// Define Provider Interface
interface ProviderData {
  id: string;
  name: string;
  logoBg: string;
  terminalType: string;
  monthlyRental: number;
  monthlyRentalPromo: string;
  contractTerm: string;
  settlement: string;
  rates: {
    personalDebit: number;
    personalCredit: number;
    businessDebit: number;
    businessCredit: number;
    amex: number;
  };
  refundFee: number;
  cnpFee: string;
  cnpFeePercent: number; // Surcharge or flat rate for calculation
  cnpIsSurcharge: boolean;
  intlFee: string;
  minBilling: number;
  authFee: number; // in pence
  pros: string[];
  cons: string[];
  bestFor: string;
}

const PROVIDERS: ProviderData[] = [
  {
    id: "clover",
    name: "Clover by Fiserv (Partner Panel)",
    logoBg: "bg-navy",
    terminalType: "Wi-Fi & 4G SIM Android",
    monthlyRental: 15.00,
    monthlyRentalPromo: "Half rental (£7.50) for first 6 months (until 31/Mar/27)",
    contractTerm: "18 Months Contract",
    settlement: "Next Working Day Settlement (Free of charge)",
    rates: {
      personalDebit: 0.29,
      personalCredit: 0.50,
      businessDebit: 1.10,
      businessCredit: 1.20,
      amex: 2.00,
    },
    refundFee: 0.30,
    cnpFee: "+0.30% Auth Surcharge (e.g. Credit F2F 0.5% goes to 0.8%)",
    cnpFeePercent: 0.30,
    cnpIsSurcharge: true,
    intlFee: "Up to 1.80%",
    minBilling: 20.00,
    authFee: 2.0, // 2.0 pence
    pros: [
      "Extremely low processing rates for Personal Debit (0.29%) & Credit (0.50%)",
      "Free next working day settlement is standard",
      "First 6 months terminal rental cut in half",
      "Very stable and secure global platform"
    ],
    cons: [
      "£20 monthly minimum billing clause applies",
      "2p per transaction authorisation fee"
    ],
    bestFor: "Established high-volume retail businesses looking for industry-low rates.",
  },
  {
    id: "tyl",
    name: "Tyl by NatWest",
    logoBg: "bg-blue-600",
    terminalType: "Wi-Fi & 4G SIM Card Terminal",
    monthlyRental: 9.99,
    monthlyRentalPromo: "Standard rental fee, no initial setup charges",
    contractTerm: "12 Months Contract",
    settlement: "Next Business Day for NatWest customers (Free)",
    rates: {
      personalDebit: 1.10,
      personalCredit: 1.10,
      businessDebit: 1.40,
      businessCredit: 1.95,
      amex: 2.10,
    },
    refundFee: 0.20,
    cnpFee: "1.35% Flat Processing Rate",
    cnpFeePercent: 1.35,
    cnpIsSurcharge: false,
    intlFee: "Up to 2.50%",
    minBilling: 10.00,
    authFee: 1.0, // 1.0 pence
    pros: [
      "Low monthly terminal lease hire (£9.99/mo)",
      "Shorter 12-month commitment standard term",
      "Flat rate for personal cards prevents dynamic pricing billing surprises",
      "Backed by a major trusted UK High Street Bank"
    ],
    cons: [
      "Debit rates are slightly higher than Clover or Elavon",
      "Includes small 1p auth fee"
    ],
    bestFor: "Medium retail shops demanding low overhead and quick setup.",
  },
  {
    id: "elavon",
    name: "Elavon (Premium Partner)",
    logoBg: "bg-indigo-900",
    terminalType: "Android Intelligent Terminal (Wi-Fi/4G)",
    monthlyRental: 19.50,
    monthlyRentalPromo: "Standard enterprise hardware, setup included",
    contractTerm: "12 Months Contract",
    settlement: "Next Business Day Settlement (Free)",
    rates: {
      personalDebit: 0.59,
      personalCredit: 0.89,
      businessDebit: 1.35,
      businessCredit: 1.85,
      amex: 1.95,
    },
    refundFee: 0.25,
    cnpFee: "+0.25% Surcharge fee for manual/online entries",
    cnpFeePercent: 0.25,
    cnpIsSurcharge: true,
    intlFee: "Up to 1.75%",
    minBilling: 15.00,
    authFee: 1.5, // 1.5 pence
    pros: [
      "The absolute lowest Personal Debit (0.59%) and Personal Credit (0.89%) rates",
      "Short 12-month contractual term availability",
      "Full integration support with modern hospitality and retail till points",
      "Fast next day settlement is complimentary"
    ],
    cons: [
      "Slightly higher terminal rental (£19.50/mo)",
      "Highest authorisation fee (1.5p/txn)"
    ],
    bestFor: "High-volume retailers and busy restaurants where volume offsets rental costs.",
  },
  {
    id: "zettle",
    name: "Zettle by PayPal",
    logoBg: "bg-orange-500",
    terminalType: "Bluetooth Smart Reader (No contract, up-front buy)",
    monthlyRental: 0.00,
    monthlyRentalPromo: "No monthly rental fees, buy reader once for ~£29-£149",
    contractTerm: "No Contract (Cancel anytime)",
    settlement: "1 - 2 Business Days (Free of charge)",
    rates: {
      personalDebit: 1.75,
      personalCredit: 1.75,
      businessDebit: 1.75,
      businessCredit: 1.75,
      amex: 1.75,
    },
    refundFee: 0.00,
    cnpFee: "2.50% Flat Rate via App Links",
    cnpFeePercent: 2.50,
    cnpIsSurcharge: false,
    intlFee: "Flat 2.50% including UK conversion",
    minBilling: 0.00,
    authFee: 0.0, // 0 pence
    pros: [
      "Zero monthly fixed fees, perfect for start-ups",
      "No contract restrictions or early exit penalty fees",
      "No authorisation fees or statement upkeep costs",
      "Unified flat 1.75% rate simplifies tracking"
    ],
    cons: [
      "Very expensive for businesses doing over £2,500/month",
      "Longer settlement time of 1-2 working days"
    ],
    bestFor: "New start-ups, mobile merchants, or part-time businesses with low turnover.",
  }
];

export default function Compare() {
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [selectedForm, setSelectedForm] = useState<"general" | "lead">("general");
  const [searchParams] = useSearchParams();

  const getParam = (key: string, fallback: number) => {
    const val = searchParams.get(key);
    if (val === null || val === "") return fallback;
    const num = Number(val);
    return isNaN(num) ? fallback : num;
  };

  // Inputs for Dynamic Fee Calculation
  const [monthlyTurnover, setMonthlyTurnover] = useState<number>(() => getParam("turnover", 5000));
  const [avgTicketSize, setAvgTicketSize] = useState<number>(() => getParam("ticket", 20));
  const [cnpPercent, setCnpPercent] = useState<number>(() => getParam("cnp", 10)); // Card Not Present / Online payments %
  const [monthlyRefunds, setMonthlyRefunds] = useState<number>(() => getParam("refunds", 5));

  // Card distribution volume shares (normalized dynamically to equal 100%)
  const [pDebitShare, setPDebitShare] = useState<number>(() => getParam("pdebit", 45));
  const [pCreditShare, setPCreditShare] = useState<number>(() => getParam("pcredit", 25));
  const [bDebitShare, setBDebitShare] = useState<number>(() => getParam("bdebit", 15));
  const [bCreditShare, setBCreditShare] = useState<number>(() => getParam("bcredit", 10));
  const [amexShare, setAmexShare] = useState<number>(() => getParam("amex", 5));

  // Compute normalized values for rendering & calculations
  const totalShare = Math.max(1, pDebitShare + pCreditShare + bDebitShare + bCreditShare + amexShare);
  const pDebitPercent = (pDebitShare / totalShare) * 100;
  const pCreditPercent = (pCreditShare / totalShare) * 100;
  const bDebitPercent = (bDebitShare / totalShare) * 100;
  const bCreditPercent = (bCreditShare / totalShare) * 100;
  const amexPercent = (amexShare / totalShare) * 100;

  // Compute calculated values per provider
  const calculatedFees = useMemo(() => {
    const totalTransactions = Math.max(1, Math.round(monthlyTurnover / avgTicketSize));

    return PROVIDERS.map((prov) => {
      // 1. Transaction volume by categories
      const pDebitVol = monthlyTurnover * (pDebitPercent / 100);
      const pCreditVol = monthlyTurnover * (pCreditPercent / 100);
      const bDebitVol = monthlyTurnover * (bDebitPercent / 100);
      const bCreditVol = monthlyTurnover * (bCreditPercent / 100);
      const amexVol = monthlyTurnover * (amexPercent / 100);

      // 2. Base processing rates
      const pDebitFee = pDebitVol * (prov.rates.personalDebit / 100);
      const pCreditFee = pCreditVol * (prov.rates.personalCredit / 100);
      const bDebitFee = bDebitVol * (prov.rates.businessDebit / 100);
      const bCreditFee = bCreditVol * (prov.rates.businessCredit / 100);
      const amexFee = amexVol * (prov.rates.amex / 100);

      let baseProcessingTotal = pDebitFee + pCreditFee + bDebitFee + bCreditFee + amexFee;

      // 3. Card Not Present (CNP / Phone / Virtual) Additional fee
      const cnpVolume = monthlyTurnover * (cnpPercent / 100);
      let cnpAdditionalFee = 0;
      if (prov.cnpIsSurcharge) {
        // Multiplies additional percentage onto CNP Volume
        cnpAdditionalFee = cnpVolume * (prov.cnpFeePercent / 100);
      } else {
        // Flat replacement: calculate difference or compute flatly
        const blendedStandardRate = (
          (pDebitVol * prov.rates.personalDebit) +
          (pCreditVol * prov.rates.personalCredit) +
          (bDebitVol * prov.rates.businessDebit) +
          (bCreditVol * prov.rates.businessCredit) +
          (amexVol * prov.rates.amex)
        ) / Math.max(1, monthlyTurnover); // blended rate in %

        const standardCnpContribution = cnpVolume * (blendedStandardRate / 100);
        const uniqueCnpFlatFee = cnpVolume * (prov.cnpFeePercent / 100);
        cnpAdditionalFee = Math.max(0, uniqueCnpFlatFee - standardCnpContribution);
      }

      // 4. Authorisation Fee
      const authFeeTotal = totalTransactions * (prov.authFee / 100);

      // Combine processing, CNP, and auth fees for Minimum Billing calculations
      const coreRunningFees = baseProcessingTotal + cnpAdditionalFee + authFeeTotal;

      // 5. Apply Minimum Billing verification
      let finalRunningFees = coreRunningFees;
      let minBillingApplied = false;
      if (prov.minBilling > 0 && coreRunningFees < prov.minBilling) {
        finalRunningFees = prov.minBilling;
        minBillingApplied = true;
      }

      // 6. Monthly terminal rental
      const baseRental = prov.monthlyRental;

      // 7. Refunds charge
      const refundsTotal = monthlyRefunds * prov.refundFee;

      // Total Monthly charges
      const grandTotalMonthly = baseRental + finalRunningFees + refundsTotal;
      const effectiveRate = monthlyTurnover > 0 ? (grandTotalMonthly / monthlyTurnover) * 100 : 0;

      return {
        providerId: prov.id,
        providerName: prov.name,
        transactions: totalTransactions,
        pDebitFee,
        pCreditFee,
        bDebitFee,
        bCreditFee,
        amexFee,
        baseProcessingTotal,
        cnpAdditionalFee,
        authFeeTotal,
        runningFeesBeforeMinBill: coreRunningFees,
        finalRunningFees,
        minBillingApplied,
        baseRental,
        refundsTotal,
        grandTotalMonthly,
        effectiveRate
      };
    });
  }, [monthlyTurnover, avgTicketSize, pDebitPercent, pCreditPercent, bDebitPercent, bCreditPercent, amexPercent, cnpPercent, monthlyRefunds]);

  // Find the cheapest calculated provider
  const cheapestProviderId = useMemo(() => {
    let rawCheapestId = PROVIDERS[0].id;
    let minCost = Infinity;
    calculatedFees.forEach((fee) => {
      if (fee.grandTotalMonthly < minCost) {
        minCost = fee.grandTotalMonthly;
        rawCheapestId = fee.providerId;
      }
    });
    return rawCheapestId;
  }, [calculatedFees]);

  return (
    <div className="pt-24 bg-gradient-to-b from-gray-50 via-white to-gray-50 min-h-screen">
      <SEO
        title="Compare UK Card Machine Providers | Phalam Payments UK"
        description="Dynamic comparison of Clover, Tyl, Elavon, and Zettle terminal costs. Put your monthly turnover in our calculator to accurately compare real merchant fees."
        schema={{
          "@context": "https://schema.org",
          "@type": "ProductCollection",
          "name": "UK Merchant Payment Terminal Price Comparison",
          "description": "Comparison audit tool detailing transaction rates, rental costs, and auth structures for small businesses in Britain.",
          "offers": {
            "@type": "AggregateOffer",
            "priceCurrency": "GBP",
            "lowPrice": "0.00",
            "highPrice": "19.50",
            "offerCount": "4"
          }
        }}
      />

      {/* Header Overview */}
      <section className="py-14 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-navy/10 text-navy mb-4 border border-navy/20">
            <Calculator className="w-3.5 h-3.5" /> Live Partner Panel Comparison
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-navy tracking-tight max-w-3xl mx-auto mb-4">
            Compare Card Machines & <span className="text-gold">Real Processing Fees</span>
          </h1>
          <p className="text-gray-500 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Avoid hidden contract clauses and inflated minimum statements. Use our interactive estimator to calculate exactly how much you would pay with major providers side-by-side.
          </p>
        </motion.div>
      </section>

      {/* Interactive Tool Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* LEFT: Estimator Controls Card */}
          <div className="lg:col-span-4 bg-navy text-white p-6 sm:p-7 rounded-3xl shadow-xl flex flex-col gap-5 sticky top-28 border border-navy">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="w-5 h-5 text-gold" />
                <h3 className="font-display font-bold text-xl">Merchant Cost Calculator</h3>
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
                  max="1000"
                  step="5"
                  value={avgTicketSize}
                  onChange={(e) => setAvgTicketSize(Number(e.target.value))}
                  className="w-full accent-gold bg-[#153a7e] rounded-lg appearance-none h-1.5 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-blue-200/50 mt-1 font-mono font-semibold">
                  <span>£5</span>
                  <span>£250</span>
                  <span>£500</span>
                  <span>£1000</span>
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
                    <span className="text-blue-100 text-[11px]">Personal UK Debit <span className="text-gold font-medium font-mono">0.29%</span></span>
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
                    <span className="text-blue-100 text-[11px]">Personal UK Credit <span className="text-gold font-medium font-mono">0.5%</span></span>
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
                    <span className="text-blue-100 text-[11px]">Business Debit <span className="text-gold font-medium font-mono">1.1%</span></span>
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
                    <span className="text-blue-100 text-[11px]">Business Credit Card <span className="text-gold font-medium font-mono">1.2%</span></span>
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
                    <label htmlFor="cnp-percent">CNP (Online)</label>
                    <span className="text-gold font-mono">{cnpPercent}%</span>
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
                    <label htmlFor="refunds">Refunds/Mo</label>
                    <span className="text-gold font-mono">{monthlyRefunds}</span>
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

            <div className="bg-[#031d4b] p-4 rounded-2xl flex items-start gap-2.5 border border-blue-900/40 text-blue-100 text-xs">
              <ShieldCheck className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-white text-xs block mb-0.5">Need a detailed billing breakdown?</strong>
                Upload a current paper merchant processing statement to our experts for a meticulous, fee-by-fee saving comparison audit.
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedForm("general");
                setIsScheduleOpen(true);
              }}
              className="w-full py-3.5 bg-gold hover:bg-white text-navy font-bold rounded-xl transition-all duration-300 text-sm flex items-center justify-center gap-2 shadow-md group"
            >
              Get Free Custom Statement Audit
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* RIGHT: Dynamic Multi-Provider Comparison Grid */}
          <div className="lg:col-span-8 flex flex-col gap-6">

            {/* Recommendation banner depending on turnover range */}
            <div className="bg-gold/10 border border-gold/30 rounded-3xl p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gold/20 flex items-center justify-center text-yellow-700 flex-shrink-0">
                <Percent className="w-6 h-6" />
              </div>
              <div className="text-sm">
                <h4 className="font-bold text-navy font-display mb-0.5">
                  AI-Assisted Partner Guidance
                </h4>
                <p className="text-gray-600 leading-relaxed text-xs">
                  {monthlyTurnover < 2500 ? (
                    <span>Based on your Low Monthly Turnover (<strong>£{monthlyTurnover.toLocaleString()}</strong>), pay-as-you-go terminals (like <strong>Zettle</strong>) are recommended as they avoid minimum billing statements and monthly rental commitments altogether.</span>
                  ) : (
                    <span>Based on your High Monthly Turnover (<strong>£{monthlyTurnover.toLocaleString()}</strong>), standard terminal rentals with low interchange fees (like <strong>Clover by Fiserv</strong> or <strong>Elavon</strong>) save you significant money compared to flat-rate 1.75% models.</span>
                  )}
                </p>
              </div>
            </div>

            {/* Calculations Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {calculatedFees.map((calc, idx) => {
                const provInfo = PROVIDERS.find(p => p.id === calc.providerId)!;
                const isCheapest = calc.providerId === cheapestProviderId;

                return (
                  <div
                    key={calc.providerId}
                    className={`bg-white rounded-3xl border p-6 transition-all relative flex flex-col justify-between ${
                      isCheapest
                        ? "border-gold ring-2 ring-gold/40 shadow-md"
                        : "border-gray-100 hover:border-gray-300 shadow-sm"
                    }`}
                  >
                    {isCheapest && (
                      <span className="absolute -top-3.5 left-6 px-3 py-1 bg-gold text-navy font-bold text-[10px] uppercase rounded-full tracking-wider shadow-sm flex items-center gap-1">
                        <Zap className="w-3 h-3 fill-navy" /> Cheapest Monthly Rate
                      </span>
                    )}

                    <div>
                      {/* Name Header */}
                      <div className="flex items-center gap-2.5 mb-4">
                        <div className={`w-8 h-8 rounded-lg ${provInfo.logoBg} flex items-center justify-center text-white font-extrabold text-sm shadow-sm font-mono`}>
                          {provInfo.name[0]}
                        </div>
                        <div>
                          <h4 className="font-bold text-navy text-sm font-display leading-tight">{provInfo.name}</h4>
                          <span className="text-[10px] font-mono text-gray-400 font-medium inline-block">{provInfo.contractTerm}</span>
                        </div>
                      </div>

                      {/* Display estimated Total */}
                      <div className="bg-gray-50 rounded-2xl p-4 mb-4 text-center">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1">Estimated Monthly Cost</span>
                        <div className="flex items-baseline justify-center gap-1">
                          <span className="text-2xl font-bold font-mono text-navy">£{calc.grandTotalMonthly.toFixed(2)}</span>
                          <span className="text-xs text-gray-400">/mo</span>
                        </div>
                        <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-1 font-mono">
                          Effective card rate: {calc.effectiveRate.toFixed(2)}%
                        </span>
                      </div>

                      {/* Sub-charges breakdown */}
                      <div className="space-y-2 text-xs border-b border-gray-100 pb-4 mb-4">
                        <div className="flex justify-between text-gray-500">
                          <span>Terminal Hire Rental</span>
                          <span className="font-mono text-navy font-semibold">£{calc.baseRental.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-500">
                          <span>Base Processing Fees</span>
                          <span className="font-mono text-navy font-semibold">£{calc.baseProcessingTotal.toFixed(2)}</span>
                        </div>
                        {calc.cnpAdditionalFee > 0 && (
                          <div className="flex justify-between text-gray-500">
                            <span>CNP / Online Fee</span>
                            <span className="font-mono text-navy font-semibold">£{calc.cnpAdditionalFee.toFixed(2)}</span>
                          </div>
                        )}
                        {calc.authFeeTotal > 0 && (
                          <div className="flex justify-between text-gray-500">
                            <span>Auth Fees ({provInfo.authFee}p/txn)</span>
                            <span className="font-mono text-navy font-semibold">£{calc.authFeeTotal.toFixed(2)}</span>
                          </div>
                        )}
                        {calc.refundsTotal > 0 && (
                          <div className="flex justify-between text-gray-500">
                            <span>Refund Charges</span>
                            <span className="font-mono text-navy font-semibold">£{calc.refundsTotal.toFixed(2)}</span>
                          </div>
                        )}
                        {calc.minBillingApplied && (
                          <div className="flex justify-between text-yellow-600 bg-yellow-50/50 p-1 rounded font-medium text-[10px]">
                            <span>Min Billing Applied</span>
                            <span>Topped to £{provInfo.minBilling.toFixed(2)}</span>
                          </div>
                        )}
                      </div>

                      {/* Summary Text Best For */}
                      <p className="text-xs text-gray-500 leading-relaxed italic mb-4">
                        <strong>Ideal for:</strong> {provInfo.bestFor}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedForm("lead");
                        setIsScheduleOpen(true);
                      }}
                      className="w-full py-2.5 border border-navy/20 hover:border-gold hover:bg-gold/5 text-navy font-bold rounded-xl transition-all duration-300 text-xs flex items-center justify-center gap-1 group"
                    >
                      Enquire For Special Rates <ChevronDown className="w-3.5 h-3.5 text-navy group-hover:translate-y-0.5 transition-transform" />
                    </button>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </section>

      {/* Structured Comparison Specifications Matrix */}
      <section className="bg-white border-y border-gray-100 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-navy">Detailed Hardware & Fee Specifications</h2>
            <p className="text-gray-500 text-sm max-w-lg mx-auto mt-2">See exactly how individual parameters align across each provider in our panel.</p>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-gray-100 shadow-sm">
            <table className="w-full text-left border-collapse bg-white">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="py-4 px-6">Specification</th>
                  {PROVIDERS.map(p => (
                    <th key={p.id} className="py-4 px-6 text-navy font-bold">{p.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-100">
                <tr>
                  <td className="py-4 px-6 font-semibold text-navy">Terminal Connection Range</td>
                  {PROVIDERS.map(p => (
                    <td key={p.id} className="py-4 px-6 text-gray-600 text-xs">{p.terminalType}</td>
                  ))}
                </tr>
                <tr>
                  <td className="py-4 px-6 font-semibold text-navy">Monthly Terminal Hire (excl VAT)</td>
                  {PROVIDERS.map(p => (
                    <td key={p.id} className="py-4 px-6 text-gray-600 text-xs font-mono">
                      {p.monthlyRental === 0 ? "None - Buy Reader" : `£${p.monthlyRental.toFixed(2)}/mo`}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-4 px-6 font-semibold text-navy">Interim Promotions</td>
                  {PROVIDERS.map(p => (
                    <td key={p.id} className="py-4 px-6 text-gray-500 text-xs italic">{p.monthlyRentalPromo}</td>
                  ))}
                </tr>
                <tr>
                  <td className="py-4 px-6 font-semibold text-navy">Personal UK Debit Interchange</td>
                  {PROVIDERS.map(p => (
                    <td key={p.id} className="py-4 px-6 font-semibold text-navy text-xs font-mono">{p.rates.personalDebit}%</td>
                  ))}
                </tr>
                <tr>
                  <td className="py-4 px-6 font-semibold text-navy">Personal UK Credit Interchange</td>
                  {PROVIDERS.map(p => (
                    <td key={p.id} className="py-4 px-6 font-semibold text-navy text-xs font-mono">{p.rates.personalCredit}%</td>
                  ))}
                </tr>
                <tr>
                  <td className="py-4 px-6 font-semibold text-navy">Business UK Debit card</td>
                  {PROVIDERS.map(p => (
                    <td key={p.id} className="py-4 px-6 text-gray-600 text-xs font-mono">{p.rates.businessDebit}%</td>
                  ))}
                </tr>
                <tr>
                  <td className="py-4 px-6 font-semibold text-navy">Business UK Credit card</td>
                  {PROVIDERS.map(p => (
                    <td key={p.id} className="py-4 px-6 text-gray-600 text-xs font-mono">{p.rates.businessCredit}%</td>
                  ))}
                </tr>
                <tr>
                  <td className="py-4 px-6 font-semibold text-navy">Amex Cards</td>
                  {PROVIDERS.map(p => (
                    <td key={p.id} className="py-4 px-6 text-gray-600 text-xs font-mono">{p.rates.amex}%</td>
                  ))}
                </tr>
                <tr>
                  <td className="py-4 px-6 font-semibold text-navy">Refunds Processing Rate</td>
                  {PROVIDERS.map(p => (
                    <td key={p.id} className="py-4 px-6 text-gray-600 text-xs font-mono">{p.refundFee === 0 ? "Free" : `${p.refundFee * 100}p per txn`}</td>
                  ))}
                </tr>
                <tr>
                  <td className="py-4 px-6 font-semibold text-navy">Card Not Present & Virtual</td>
                  {PROVIDERS.map(p => (
                    <td key={p.id} className="py-4 px-6 text-gray-500 text-xs">{p.cnpFee}</td>
                  ))}
                </tr>
                <tr>
                  <td className="py-4 px-6 font-semibold text-navy">International Surcharges</td>
                  {PROVIDERS.map(p => (
                    <td key={p.id} className="py-4 px-6 text-gray-600 text-xs">{p.intlFee}</td>
                  ))}
                </tr>
                <tr>
                  <td className="py-4 px-6 font-semibold text-navy">Minimum Monthly Billing</td>
                  {PROVIDERS.map(p => (
                    <td key={p.id} className="py-4 px-6 text-gray-600 text-xs font-mono">
                      {p.minBilling === 0 ? "None" : `£${p.minBilling.toFixed(2)}`}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-4 px-6 font-semibold text-navy">Complimentary Settlements</td>
                  {PROVIDERS.map(p => (
                    <td key={p.id} className="py-4 px-6 text-gray-500 text-[11px] leading-snug">{p.settlement}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Pros and Cons Highlights Section */}
      <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl font-bold text-navy">Strategic Pros & Cons Analysis</h2>
          <p className="text-gray-500 text-sm max-w-lg mx-auto mt-2">Evaluate the operational strengths and compromise requirements before committing.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {PROVIDERS.map((p) => (
            <div key={p.id} className="bg-white border border-gray-100 p-8 rounded-3xl shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <div className={`w-8 h-8 rounded-lg ${p.logoBg} flex items-center justify-center text-white font-extrabold text-sm`}>
                    {p.name[0]}
                  </div>
                  <h3 className="font-display font-bold text-lg text-navy">{p.name}</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Pros Column */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-3 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Strengths
                    </h4>
                    <ul className="space-y-2.5 text-xs text-gray-600 leading-normal">
                      {p.pros.map((pro, i) => (
                        <li key={i} className="flex gap-2 items-start">
                          <span className="text-emerald-500 font-bold">&#8212;</span>
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Cons Column */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-3 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> Considerations
                    </h4>
                    <ul className="space-y-2.5 text-xs text-gray-600 leading-normal">
                      {p.cons.map((con, i) => (
                        <li key={i} className="flex gap-2 items-start">
                          <span className="text-amber-500 font-bold">&#8212;</span>
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-5 border-t border-gray-50 flex items-center justify-between">
                <span className="text-xs text-navy font-semibold">{p.contractTerm}</span>
                <button
                  onClick={() => {
                    setSelectedForm("general");
                    setIsScheduleOpen(true);
                  }}
                  className="text-xs font-bold text-navy hover:text-gold flex items-center gap-1.5 transition-colors"
                >
                  Onboard With Panelist <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Final Statement Audit Banner CTA */}
      <section className="bg-navy py-16 text-white text-center rounded-t-[3rem] relative overflow-hidden">
        <div className="absolute top-0 left-1/2 w-96 h-96 bg-gold/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <h2 className="font-display text-2xl sm:text-3xl font-bold mb-4">Unsure About Your Real Interchange Rates?</h2>
          <p className="text-blue-100/80 mb-8 max-w-xl mx-auto text-xs sm:text-sm">
            Merchant bills are intentionally written in a confusing mix of interchange fees, scheme fees, compliance penalties, and authorisation rates. We will review it free of charge.
          </p>
          <button
            onClick={() => {
              setSelectedForm("general");
              setIsScheduleOpen(true);
            }}
            className="px-8 py-3.5 bg-gold hover:bg-white text-navy font-bold rounded-xl transition-all duration-300 text-sm"
          >
            Send My Merchant Statement For Audit
          </button>
        </div>
      </section>

      <ScheduleModal
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
      />
    </div>
  );
}
