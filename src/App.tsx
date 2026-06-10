
import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { ChatWidget } from "./components/ChatWidget";
import { LeadCaptureModal } from "./components/LeadCaptureModal";
import Home from "./pages/Home";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfUse from "./pages/TermsOfUse";
import CookiePolicy from "./pages/CookiePolicy";
import AdminLeads from "./pages/AdminLeads";
import RetailConsulting from "./pages/RetailConsulting";
import EcommerceConsulting from "./pages/EcommerceConsulting";
import { useEffect } from "react";

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white font-inter selection:bg-navy selection:text-white flex flex-col">
        <ScrollToTop />
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/retail-consulting" element={<RetailConsulting />} />
            <Route path="/ecommerce-consulting" element={<EcommerceConsulting />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-use" element={<TermsOfUse />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />
            <Route path="/admin" element={<AdminLeads />} />
          </Routes>
        </main>
        <Footer />
        <ChatWidget />
        <LeadCaptureModal />
      </div>
    </BrowserRouter>
  );
}
