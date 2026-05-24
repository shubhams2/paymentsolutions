
import React from "react";
import { motion } from "motion/react";

export default function PrivacyPolicy() {
  return (
    <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-display text-4xl font-bold text-navy mb-4">Privacy Policy</h1>
        <p className="text-gray-500 mb-8">Last Updated: May 2026</p>
        
        <div className="prose prose-slate max-w-none text-gray-600 space-y-8 leading-relaxed">
          <p>
            This Privacy Policy explains how <strong>Phalam Payments UK</strong> ("we", "our", or "us") collects, uses, shares, and protects your personal data when you visit our website, use our portal, or fill out our "Get in Touch" and consultation scheduling forms.
          </p>
          <p>
            We operate strictly within the United Kingdom and process all personal data in full compliance with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.
          </p>

          <section>
            <h2 className="text-2xl font-bold text-navy mb-4">1. The Controller of Your Data</h2>
            <p>For the purpose of UK data protection laws, the data controller is:</p>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mt-2">
              <p><strong>Business Name:</strong> Phalam Payments UK</p>
              <p><strong>Contact Email:</strong> hello@phalampayments.co.uk</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-navy mb-4">2. The Information We Collect</h2>
            <p>When you interact with our landing page or portal to enquire about payment solutions, we may collect the following information:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li><strong>Identity Data:</strong> First name, last name, and business role/title.</li>
              <li><strong>Contact Data:</strong> Business email address and telephone number.</li>
              <li><strong>Commercial Data:</strong> Trading business name, business type/sector, and estimated monthly card turnover or volume.</li>
              <li><strong>Technical Data:</strong> IP address, browser type, and interaction data via our website portal.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-navy mb-4">3. How and Why We Use Your Personal Data</h2>
            <p className="mb-4">We will only use your personal data when the law allows us to. Under the UK GDPR, we rely on the following legal bases to process your information:</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="p-3 font-bold text-navy">Data Type</th>
                    <th className="p-3 font-bold text-navy">What We Use It For</th>
                    <th className="p-3 font-bold text-navy">Legal Basis (UK GDPR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="p-3">Contact & Commercial Data</td>
                    <td className="p-3">To review your merchant setup, evaluate options, and contact you for a technical consultation.</td>
                    <td className="p-3">Performance of a Contract (Taking steps at your request before entering into a contract).</td>
                  </tr>
                  <tr>
                    <td className="p-3">Identity & Contact Data</td>
                    <td className="p-3">To route your information securely via automated tools (like Google AI Studio/SMTP relays) to send you dynamic email confirmation alerts.</td>
                    <td className="p-3">Legitimate Interests (Administering our business and responding efficiently to your requests).</td>
                  </tr>
                  <tr>
                    <td className="p-3">Marketing Updates</td>
                    <td className="p-3">To send you industry insights, lower tariff alerts, or product updates (only if you opt-in).</td>
                    <td className="p-3">Consent (Clear, affirmative choice via an un-ticked checkbox).</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-navy mb-4">4. Who We Share Your Data With</h2>
            <p>We do not sell, rent, or trade your data to third parties for marketing purposes. However, to fulfill your request for payment infrastructure, we may share your data with:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li><strong>Regulated Processing Partners:</strong> Fully authorised, FCA-regulated payment networks and processors (e.g., Stripe, Worldpay, Revolut) explicitly to secure a processing quote for your business.</li>
              <li><strong>Technical Service Providers:</strong> Secure cloud hosting, form management, and infrastructure tools (including Google AI Studio cloud environments and verified SMTP email relays) to process your data safely.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-navy mb-4">5. International Data Transfers</h2>
            <p>
              We prioritize storing your data within the UK or European Economic Area (EEA). If any technical infrastructure tools route information outside the UK (for example, to secure US-based cloud servers used by AI platforms), we ensure strict data safety measures are active. This includes using UK-approved Standard Contractual Clauses (SCCs) to guarantee bank-grade privacy protection.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-navy mb-4">6. Data Security</h2>
            <p>
              We have put in place robust security measures to prevent your personal data from being accidentally lost, used, altered, disclosed, or accessed in an unauthorised way. This includes forcing secure HTTPS/SSL encryption across our entire website portal. Data transmitted via our AI infrastructure is handled using secure server-side API environments.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-navy mb-4">7. How Long We Keep Your Data</h2>
            <p>
              We will only retain your personal data for as long as necessary to fulfill the purposes we collected it for, including for the purposes of satisfying any legal, accounting, or reporting requirements. Typically, if no formal consulting relationship is established, client lead details are securely deleted after 12 months.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-navy mb-4">8. Your Legal Rights</h2>
            <p>Under the UK GDPR, you have rights regarding your personal data, which include:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2 font-medium">
              <li><strong>The Right of Access:</strong> You can ask for a copy of the personal data we hold about you.</li>
              <li><strong>The Right to Rectification:</strong> You can ask us to correct inaccurate data.</li>
              <li><strong>The Right to Erasure:</strong> You can ask us to delete your data ("The Right to be Forgotten").</li>
              <li><strong>The Right to Object/Restrict:</strong> You can object to us processing your data or ask us to stop sending marketing communication.</li>
            </ul>
            <p className="mt-4">
              To exercise any of these rights, please contact us immediately at <strong>hello@phalampayments.co.uk</strong>. If you are unhappy with how we handle your data, you have the right to lodge a complaint with the Information Commissioner’s Office (ICO) (www.ico.org.uk).
            </p>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
