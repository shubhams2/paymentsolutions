import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";

export function LeadCaptureModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const forceTest = params.get("test_popup") === "true";

    // Detect if we are in development/preview env (everything except production website)
    const isProduction = window.location.hostname === "phalampayments.co.uk" || window.location.hostname === "www.phalampayments.co.uk";

    // Prevent showing if already completed or dismissed
    const hasDismissed = sessionStorage.getItem("lead_popup_dismissed") === "true";
    const hasSubmitted = localStorage.getItem("lead_popup_submitted") === "true";

    if (isProduction && !forceTest && (hasDismissed || hasSubmitted)) {
      console.log("Phalam Payments Popup: Suppressed in production due to user settings.");
      return;
    }

    console.log("Phalam Payments: Scroll Tracker activated! (Scroll down 150px to trigger the quote modal)");

    const checkScroll = () => {
      const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      // Trigger modal when scrolled 150px or more
      if (scrollPosition > 150) {
        console.log("Phalam Payments: Scroll threshold met (Position:", scrollPosition + "px). Displaying quote modal.");
        setIsOpen(true);
        window.removeEventListener("scroll", checkScroll);
      }
    };

    // Check immediately on mount in case the page is already scrolled
    checkScroll();

    window.addEventListener("scroll", checkScroll);
    return () => window.removeEventListener("scroll", checkScroll);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    // Use sessionStorage so the user can easily test and see it again on refresh!
    sessionStorage.setItem("lead_popup_dismissed", "true");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Validate name and phone
    if (!name.trim()) {
      setValidationError("Please enter your name.");
      return;
    }

    // Simple UK phone validation check: must contain digits, spaces or symbols and be at least 7 chars
    const phoneRegex = /^[\d\s\-+()]{7,20}$/;
    if (!phone.trim()) {
      setValidationError("Please enter your phone number.");
      return;
    }
    if (!phoneRegex.test(phone.trim())) {
      setValidationError("Please enter a valid phone number.");
      return;
    }

    setIsSubmitting(true);

    // Generate clean dummy email info for integration with backend which requests email
    const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, "");
    const generatedEmail = `${cleanName || "lead"}-${Date.now()}@no-email.phalampayments-lead.co.uk`;

    try {
      // 1. Direct Firestore Save
      await addDoc(collection(db, "leads"), {
        name: name.trim(),
        phone: phone.trim(),
        email: generatedEmail,
        source: "scroll_popup",
        createdAt: serverTimestamp(),
      });

      // 2. Api Backend Lead processing & Notifications
      try {
        const response = await fetch("/functions/leads", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            phone: phone.trim(),
            email: generatedEmail,
            source: "scroll_popup",
          }),
        });
        if (!response.ok) {
          console.warn("Cloudflare Pages Function request failed in LeadCaptureModal:", response.status);
        }
      } catch (fetchErr) {
        console.warn("Warning: Cloudflare Pages Function '/functions/leads' request failed in LeadCaptureModal:", fetchErr);
      }

      setIsSuccess(true);
      localStorage.setItem("lead_popup_submitted", "true");
    } catch (error: any) {
      console.error("Popup lead submission error:", error);
      setValidationError("There was an issue processing your request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div id="scroll-lead-popup-container" className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Translucent Backdrop Blur Blur styling */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
            className="relative bg-white w-full max-w-[500px] rounded-[24px] shadow-2xl p-8 sm:p-10 text-slate-800 z-10 overflow-hidden border border-slate-100"
          >
            {/* Close button X */}
            <button
              onClick={handleClose}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 transition-colors p-1.5 hover:bg-slate-50 rounded-full cursor-pointer"
              aria-label="Close quote modal"
            >
              <X className="w-5 h-5" />
            </button>

            {!isSuccess ? (
              <div className="flex flex-col">
                {/* Visual Label */}
                <span className="text-violet-600 font-semibold text-xs uppercase tracking-widest mb-1.5 block">
                  Limited Time Quote
                </span>

                {/* Heading */}
                <h3 className="font-sans font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight leading-tight mb-2">
                  Get a Free Card Machine Quote
                </h3>

                {/* Subtitle */}
                <p className="text-slate-500 font-normal text-sm sm:text-[15px] leading-relaxed mb-6">
                  Compare rates from top UK providers, tailored to your business.
                </p>

                {/* Error Banner */}
                {validationError && (
                  <div className="mb-4 bg-rose-50 border border-rose-100 text-rose-600 text-xs px-3.5 py-2.5 rounded-lg font-medium">
                    {validationError}
                  </div>
                )}

                {/* Grab form input */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={isSubmitting}
                      className="w-full px-5 py-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 text-[15px] sm:text-[16px] text-slate-900 bg-white placeholder-slate-400 transition-all outline-none"
                    />
                  </div>

                  <div>
                    <input
                      type="tel"
                      placeholder="Phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      disabled={isSubmitting}
                      className="w-full px-5 py-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 text-[15px] sm:text-[16px] text-slate-900 bg-white placeholder-slate-400 transition-all outline-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-2 bg-[#6366f1] hover:bg-[#5254eb] disabled:bg-violet-400 text-white font-semibold text-[16px] sm:text-lg py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all relative overflow-hidden active:scale-[0.99] cursor-pointer"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Calculating...
                      </div>
                    ) : (
                      <>
                        Get My Free Quote
                        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </button>
                </form>

                {/* Footer Subtext */}
                <p className="text-slate-400 text-xs text-center mt-5 flex items-center justify-center gap-1.5 font-normal">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                  Free service. No spam. Your data stays private.
                </p>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center text-center py-6"
              >
                <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                </div>
                <h3 className="font-sans font-extrabold text-2xl text-slate-900 tracking-tight leading-tight mb-2">
                  Quote Request Received!
                </h3>
                <p className="text-slate-500 font-normal text-sm sm:text-[15px] leading-relaxed max-w-sm mb-6">
                  Thank you, <strong className="text-slate-800 font-semibold">{name}</strong>. A payment systems analyst will review top UK rates and call you at <strong className="text-slate-800 font-semibold">{phone}</strong> within 24 hours.
                </p>
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-sm transition-colors cursor-pointer"
                >
                  Done
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
