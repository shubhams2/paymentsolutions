import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { CreditCard, Menu, X } from "lucide-react";
import { cn } from "../lib/utils";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../lib/firebase";

const navLinks = [
  { name: "Retail Solutions", href: "/retail-consulting" },
  { name: "E-Commerce Gateway", href: "/ecommerce-consulting" },
  { name: "Compare Rates", href: "/compare" },
  { name: "Knowledge Hub", href: "/blog" },
  { name: "Why Us", href: "/#why-us" },
  { name: "How It Works", href: "/#how-it-works" },
  { name: "Contact", href: "/#contact" },
];

export function Header() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const ADMIN_EMAIL = "shubhams.job@gmail.com";
  const isAdmin = currentUser?.email === ADMIN_EMAIL;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = (href: string) => {
    setIsMenuOpen(false);
    if (href.startsWith("/#")) {
      const id = href.split("#")[1];
      if (location.pathname === "/") {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      } else {
        // Redirect to homepage anchor
        window.location.href = href;
      }
    }
  };

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      isScrolled ? "bg-white shadow-sm py-4" : "bg-white/95 py-6"
    )}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          <Link to="/" className="flex items-center gap-2 group">
            <img src="/logo.svg" alt="Phalam Payments UK Logo" className="w-10 h-10 object-contain group-hover:scale-105 transition-transform" />
            <div className="leading-tight">
              <span className="font-display font-bold text-lg text-navy">Phalam Payments</span>
              <span className="font-inter font-semibold text-lg text-gold ml-0.5"> UK</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const isAnchor = link.href.startsWith("/#");

              if (!isAnchor) {
                return (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="text-sm font-medium text-gray-600 hover:text-navy transition-colors"
                  >
                    {link.name}
                  </Link>
                );
              }

              return (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-sm font-medium text-gray-600 hover:text-navy transition-colors"
                  onClick={(e) => {
                    if (location.pathname === "/") {
                      e.preventDefault();
                      handleLinkClick(link.href);
                    }
                  }}
                >
                  {link.name}
                </a>
              );
            })}
            <Link
              to="/#contact"
              className="ml-2 inline-flex items-center px-5 py-2 text-sm font-semibold text-white rounded-lg bg-navy hover:brightness-110 transition-all"
              onClick={(e) => {
                if (location.pathname === "/") {
                  e.preventDefault();
                  handleLinkClick("/#contact");
                }
              }}
            >
              Get in Touch
            </Link>
          </nav>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-navy"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 md:hidden bg-white pt-24 px-4 overflow-y-auto"
          >
            <div className="space-y-4">
              {navLinks.map((link) => {
                const isAnchor = link.href.startsWith("/#");

                if (!isAnchor) {
                  return (
                    <Link
                      key={link.name}
                      to={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="block text-2xl font-bold text-navy py-4 border-b border-gray-100"
                    >
                      {link.name}
                    </Link>
                  );
                }

                return (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => {
                      if (location.pathname === "/") {
                        e.preventDefault();
                      }
                      handleLinkClick(link.href);
                    }}
                    className="block text-2xl font-bold text-navy py-4 border-b border-gray-100"
                  >
                    {link.name}
                  </a>
                );
              })}
              <Link
                to="/#contact"
                onClick={(e) => {
                  if (location.pathname === "/") {
                    e.preventDefault();
                  }
                  handleLinkClick("/#contact");
                }}
                className="block w-full bg-navy text-white text-center py-5 rounded-xl font-bold text-lg mt-8"
              >
                Get a Free Consultation
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
