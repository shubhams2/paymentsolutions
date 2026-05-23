
import React from "react";
import { motion } from "motion/react";

export default function TermsOfUse() {
  return (
    <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-display text-4xl font-bold text-navy mb-8">Terms of Use</h1>
        <div className="prose prose-slate max-w-none text-gray-600 space-y-6">
          <p>Last updated: May 16, 2026</p>
          <p>
            Welcome to SwiftPay UK. By accessing or using our website, you agree to comply with 
            and be bound by these Terms of Use.
          </p>
          
          <h2 className="text-2xl font-bold text-navy mt-10">1. Acceptance of Terms</h2>
          <p>
            By using this website, you confirm that you accept these terms and that you agree 
            to comply with them. If you do not agree to these terms, you must not use our website.
          </p>
          
          <h2 className="text-2xl font-bold text-navy mt-10">2. Intellectual Property</h2>
          <p>
            We are the owner or the licensee of all intellectual property rights in our website, 
            and in the material published on it. Those works are protected by copyright laws 
            and treaties around the world.
          </p>
          
          <h2 className="text-2xl font-bold text-navy mt-10">3. Information Accuracy</h2>
          <p>
            The content on our website is provided for general information only. It is not 
            intended to amount to advice on which you should rely. Although we make reasonable 
            efforts to update the information on our site, we make no representations, warranties 
            or guarantees that the content on our website is accurate, complete or up to date.
          </p>
          
          <h2 className="text-2xl font-bold text-navy mt-10">4. Limitation of Liability</h2>
          <p>
            To the extent permitted by law, we will not be liable for any loss or damage 
            (including indirect or consequential loss) arising from your use of this website.
          </p>
          
          <h2 className="text-2xl font-bold text-navy mt-10">5. Governing Law</h2>
          <p>
            These terms shall be governed by and construed in accordance with the laws of 
            England and Wales.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
