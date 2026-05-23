
import React from "react";
import { motion } from "motion/react";

export default function CookiePolicy() {
  return (
    <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-display text-4xl font-bold text-navy mb-8">Cookie Policy</h1>
        <div className="prose prose-slate max-w-none text-gray-600 space-y-6">
          <p>Last updated: May 16, 2026</p>
          <p>
            This Cookie Policy explains how SwiftPay UK uses cookies and similar technologies 
            on our website.
          </p>
          
          <h2 className="text-2xl font-bold text-navy mt-10">1. What Are Cookies?</h2>
          <p>
            Cookies are small text files that are stored on your computer or mobile device when 
            you visit a website. They are widely used to make websites work or work more 
            efficiently, as well as to provide information to the owners of the site.
          </p>
          
          <h2 className="text-2xl font-bold text-navy mt-10">2. How We Use Cookies</h2>
          <p>
            We use cookies for the following purposes:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Strictly Necessary:</strong> Required for the operation of our site.</li>
            <li><strong>Performance/Analytical:</strong> Allow us to recognise and count the number of visitors and see how visitors move around our site.</li>
            <li><strong>Functionality:</strong> Used to recognise you when you return to our site.</li>
          </ul>
          
          <h2 className="text-2xl font-bold text-navy mt-10">3. Types of Cookies We Use</h2>
          <p>
            Our site may use both session cookies (which expire once you close your web browser) 
            and persistent cookies (which stay on your device until they expire or you delete them).
          </p>
          
          <h2 className="text-2xl font-bold text-navy mt-10">4. Managing Cookies</h2>
          <p>
            You can block cookies by activating the setting on your browser that allows you to 
            refuse the setting of all or some cookies. However, if you use your browser settings 
            to block all cookies, you may not be able to access all or parts of our website.
          </p>
          
          <h2 className="text-2xl font-bold text-navy mt-10">5. More Information</h2>
          <p>
            For more information about cookies, including how to see what cookies have been set 
            and how to manage and delete them, visit <a href="https://www.aboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-navy underline">www.aboutcookies.org</a>.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
