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
        {
          "@type": "Thing",
          "name": "Payment Gateway",
          "sameAs": [
            "https://en.wikipedia.org/wiki/Payment_gateway",
            "https://www.wikidata.org/wiki/Q2065313"
          ]
        },
        {
          "@type": "Thing",
          "name": "Payment Terminal (PDQ and Card Machines)",
          "sameAs": [
            "https://en.wikipedia.org/wiki/Payment_terminal",
            "https://www.wikidata.org/wiki/Q1056525"
          ]
        },
        {
          "@type": "Thing",
          "name": "Merchant Services",
          "sameAs": [
            "https://en.wikipedia.org/wiki/Merchant_services",
            "https://www.wikidata.org/wiki/Q6818779"
          ]
        },
        {
          "@type": "Thing",
          "name": "Point of Sale Systems (POS)",
          "sameAs": [
            "https://en.wikipedia.org/wiki/Point_of_sale",
            "https://www.wikidata.org/wiki/Q796245"
          ]
        },
        {
          "@type": "Thing",
          "name": "PCI DSS Compliance Standards",
          "sameAs": [
            "https://en.wikipedia.org/wiki/Payment_Card_Industry_Data_Security_Standard",
            "https://www.wikidata.org/wiki/Q1053424"
          ]
        },
        {
          "@type": "Thing",
          "name": "Transaction Fee Optimization and Merchant Audits",
          "sameAs": "https://en.wikipedia.org/wiki/Merchant_account"
        }
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
      "description": "Independent UK payment consulting for retail shops and large e-commerce sites. We review contracts, lower card machine fees, and optimize online gateways.",
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
  },

  blog: {
    title: "Expert Payment Industry Insights & Guides | Phalam Payments UK",
    description: "Read expert merchant research, technical guides, contract audits, and point-of-sale comparisons from independent payment consultants at Phalam Payments.",
    schema: {
      "@context": "https://schema.org",
      "@type": "Blog",
      "name": "Phalam Payments Knowledge Hub",
      "description": "Expert advice, guides, regulatory news, and tech reviews in the merchant services and payment space.",
      "publisher": {
        "@type": "ProfessionalService",
        "name": "Phalam Payments",
        "url": "https://phalampayments.co.uk"
      },
      "inLanguage": "en-GB"
    }
  }
} as const;
