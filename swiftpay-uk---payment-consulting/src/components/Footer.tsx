
import React from "react";
import { Link } from "react-router-dom";
import { CreditCard } from "lucide-react";

export function Footer() {
  return (
    <footer className="py-10 border-t border-gray-100 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-gray-400">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-navy flex items-center justify-center">
            <CreditCard className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-gray-600">Phalam Payments UK</span>
          <span className="ml-2 whitespace-nowrap">© {new Date().getFullYear()}. All rights reserved.</span>
        </div>

        <div className="flex items-center gap-6">
          <Link to="/privacy-policy" className="hover:text-navy transition-colors">Privacy Policy</Link>
          <Link to="/terms-of-use" className="hover:text-navy transition-colors">Terms of Use</Link>
          <Link to="/cookie-policy" className="hover:text-navy transition-colors">Cookie Policy</Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-8 border-t border-gray-50">
        <p className="text-[10px] leading-loose text-gray-400 text-center uppercase tracking-widest max-w-4xl mx-auto">
          <strong>Full Legal Disclosure:</strong> Phalam Payments UK is an independent consultancy and systems integrator specializing in payment infrastructure.
          We are NOT a bank, financial institution, or licensed credit provider. We do not provide financial advice as defined by the FSMA 2000. 
          All merchant account services, card processing, and financial transactions are carried out exclusively by our FCA-regulated and authorised partners. 
          Our advisory services focus on technology selection, cost optimization, and systems implementation.
        </p>
      </div>
    </footer>
  );
}
