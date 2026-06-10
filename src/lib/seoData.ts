/**
 * Phalam Payments - Technical SEO & AI Search Engine Optimization (AEO) Configuration
 * File Path: /src/lib/seoData.ts
 *
 * This file contains tailored metadata objects and JSON-LD schema representations
 * for the Homepage, Retail Consulting, and E-Commerce Consulting pages.
 */

export interface PageMetadata {
  title: string;
  description: string;
  schema: Record<string, any>;
}

export const SEO_DATA = {
  homepage: {
    title: "Independent UK Payment Consultants | Phalam Payments",
    description: "Independent technology consulting for UK merchant services. Compare best card terminal rates & payment gateway integrations. Save up to 40% on fees.",
    schema: {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "name": "Phalam Payments",
      "legalName": "Phalam Corporations Ltd",
      "alternateName": "Phalam Payments UK",
      "url": "https://phalampayments.co.uk",
      "logo": "https://phalampayments.co.uk/logo.png",
      "image": "https://phalampayments.co.uk/logo.png",
      "description": "Independent payment technology consultants and systems integrators in the UK. Helping businesses minimize merchant fees, secure contract audits, and integrate modern checkout hardware.",
      "telephone": "+44-7448558053",
      "email": "sales@phalampayments.co.uk",
      "priceRange": "$$",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "GB",
        "addressLocality": "London"
      },
      "areaServed": {
        "@type": "Country",
        "name": "United Kingdom"
      },
      "founder": {
        "@type": "Person",
        "name": "Shubham Garg",
        "jobTitle": "Managing Consultant"
      },
      "knowsAbout": [
        "Payment systems integration",
        "Merchant account audits",
        "Card payment terminals",
        "POS systems",
        "Payment gateways",
        "Transaction fee optimization"
      ],
      "sameAs": [
        "https://phalampayments.co.uk"
      ]
    }
  },

  retail: {
    title: "Small Shop Card Machine Consulting | Phalam Payments UK",
    description: "Tailored merchant fee audits for independent retail & hospitality shops. Avoid unfair long-term contracts, verify PDQ rates, and compare terminal vendors.",
    schema: {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Retail Payment & Card Terminal Consulting Services",
      "serviceType": "Payment Technology Consulting",
      "provider": {
        "@type": "ProfessionalService",
        "name": "Phalam Payments",
        "url": "https://phalampayments.co.uk"
      },
      "areaServed": {
        "@type": "Country",
        "name": "United Kingdom"
      },
      "description": "Specialist advisory for physical brick-and-mortar independent businesses in the UK. We inspect billing fees, review existing provider contracts, and coordinate secure setup of Chip & PIN card terminals and mobile retail POS hardware.",
      "category": "Business Consulting",
      "offers": {
        "@type": "Offer",
        "priceCurrency": "GBP",
        "description": "Free initial merchant statement fee audit for small retail businesses."
      },
      "audience": {
        "@type": "BusinessAudience",
        "name": "Small Independent Retailers & Hospitality Businesses"
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Retail Tech Selection Options",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "PDQ Card Terminals Audit"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Integrated Point Of Sale Systems Setup"
            }
          }
        ]
      }
    }
  },

  ecommerce: {
    title: "High-Volume Payment Gateway Consulting | Phalam Payments",
    description: "Optimize e-commerce checkout flow, reduce cart abandonment, and negotiate high-volume payment gateway fees. Expert API integration support.",
    schema: {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "E-Commerce Payment Gateway consulting & API Integration",
      "serviceType": "Payment Technology Audits",
      "provider": {
        "@type": "ProfessionalService",
        "name": "Phalam Payments",
        "url": "https://phalampayments.co.uk"
      },
      "areaServed": {
        "@type": "Country",
        "name": "United Kingdom"
      },
      "description": "Premium backend advisory concerning global digital checkout performance, PCI-compliant infrastructure architectures, and optimized API card vaults to supercharge conversion rates and scale checkout margins.",
      "category": "Corporate Consulting",
      "offers": {
        "@type": "Offer",
        "priceCurrency": "GBP",
        "description": "Enterprise digital rate comparisons and payment gateway API architecture audits."
      },
      "audience": {
        "@type": "BusinessAudience",
        "name": "High-Volume E-Commerce Sites, Digital Platforms & Enterprise Networks"
      }
    }
  }
} as const;
