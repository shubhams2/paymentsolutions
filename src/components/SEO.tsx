import { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
  schema?: Record<string, any>;
}

export function SEO({ title, description, schema }: SEOProps) {
  useEffect(() => {
    // 1. Update document title
    document.title = title;

    // 2. Manage meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement("meta");
      metaDescription.setAttribute("name", "description");
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute("content", description);

    // 3. Manage JSON-LD Schema Script
    const existingScriptId = "aeo-jsonld-schema";
    let schemaScript = document.getElementById(existingScriptId);

    if (schemaScript) {
      schemaScript.remove(); // Remove pre-existing schema to avoid duplication across pages
    }

    if (schema) {
      schemaScript = document.createElement("script");
      schemaScript.setAttribute("type", "application/ld+json");
      schemaScript.setAttribute("id", existingScriptId);
      schemaScript.innerHTML = JSON.stringify(schema, null, 2);
      document.head.appendChild(schemaScript);
    }

    // Cleanup: restore or clean up when the component unmounts
    return () => {
      const scriptToRemove = document.getElementById(existingScriptId);
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [title, description, schema]);

  return null; // This is a layout-less utility component
}
