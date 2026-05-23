import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import nodemailer from "nodemailer";
import admin from "firebase-admin";
import { getFirestore as getFirestoreAdmin } from "firebase-admin/firestore";
import fs from "fs";

dotenv.config();

// Load Firebase Config
let firebaseConfig: any = null;
try {
  const configPath = path.join(process.cwd(), "firebase-applet-config.json");
  if (fs.existsSync(configPath)) {
    firebaseConfig = JSON.parse(fs.readFileSync(configPath, "utf8"));
  }
} catch (error) {
  console.error("Failed to load firebase-applet-config.json:", error);
}

const projectId = process.env.FIREBASE_PROJECT_ID || firebaseConfig?.projectId;
const databaseId = firebaseConfig?.firestoreDatabaseId;

// Initialize Firebase Admin once
if (projectId) {
  try {
    if (admin.apps.length === 0) {
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        projectId: projectId,
      });
      console.log(`[Firebase] Admin initialized for project: ${projectId}`);
    }
  } catch (error: any) {
    console.error(`[Firebase] Admin initialization failed: ${error.message}`);
  }
} else {
  console.warn("[Firebase] Project ID missing from environment and config. Firestore will not work.");
}

const db = (function() {
  if (!projectId) return null;
  const app = admin.apps[0];
  
  const dbId = (databaseId === "(default)" || !databaseId) ? undefined : databaseId;
  
  try {
    console.log(`[Firebase] Initializing Firestore. Project: ${projectId}, Database: ${dbId || "(default)"}`);
    return getFirestoreAdmin(app, dbId);
  } catch (e: any) {
    console.error(`[Firebase] Fatal Firestore init error: ${e.message}`);
    return null;
  }
})();

function getFirestoreInstance() {
  if (!db) {
    throw new Error("Firestore not initialized.");
  }
  return db;
}

// Lazy initialization for nodemailer
let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (!transporter) {
    const config = {
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT) || 587,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    };

    if (!config.host || !config.auth.user || !config.auth.pass) {
      console.warn("Email configuration missing. Emails will be logged to console instead.");
      return null;
    }
    transporter = nodemailer.createTransport(config);
  }
  return transporter;
}

async function sendConfirmationEmail(to: string, name: string, turnover?: string, phone?: string) {
  const businessName = "SwiftPay UK";
  const websiteLink = "https://swiftpayuk.co.uk";
  
  const subject = `${businessName} – Your Payment Technology Audit Request`;
  
  const htmlContent = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">
      <p>Hi ${name},</p>
      <p>Thank you for reaching out to <strong>${businessName}</strong>. We have successfully received your request for a tailored payment technology review.</p>
      <p>As an independent consulting partner, our goal is simple: to audit your current configuration and connect your business with the most cost-effective, secure, and modern payment infrastructure available on the market.</p>
      <p>Because we are entirely independent, we don’t force you into a single system. We work directly with leading, FCA-regulated UK and global networks to find the exact configuration that fits your business model.</p>
      
      <h3 style="color: #1a4aa8; margin-top: 25px;">What happens next?</h3>
      <ul style="padding-left: 20px;">
        <li style="margin-bottom: 10px;"><strong>Initial Analysis:</strong> We are currently reviewing your trading profile and estimated monthly card turnover (<strong>${turnover || "Not provided"}</strong>).</li>
        <li style="margin-bottom: 10px;"><strong>Consultation Call:</strong> A specialist from our team will contact you within 1 business day via <strong>${to}${phone ? ' or ' + phone : ''}</strong> to discuss your tailored integration options (including POS hardware, Payment Links, or Open Banking solutions).</li>
      </ul>
      
      <p>In the meantime, if you have any additional notes or specific hardware requirements you would like to add, simply reply directly to this email.</p>
      <p>We look forward to optimizing your checkout experience.</p>
      
      <p style="margin-top: 30px;">Kind regards,</p>
      <p>
        <strong>SwiftPay UK Team</strong><br>
        Independent Payment Technology Consultants<br>
        <a href="${websiteLink}" style="color: #1a4aa8; text-decoration: none;">${websiteLink}</a>
      </p>
      
      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
      
      <p style="font-size: 11px; color: #888; border-left: 3px solid #eee; padding-left: 10px; font-style: italic;">
        <strong>Legal Footer Disclaimer:</strong><br>
        ${businessName} is an independent payment technology consultancy and systems integrator. We are not a bank or an FCA-regulated financial institution. All merchant accounts, card processing services, and financial transactions are provided exclusively by our fully authorized and regulated partner networks.
      </p>
    </div>
  `;

  const mailOptions = {
    from: process.env.EMAIL_FROM || `${businessName} <hello@swiftpayuk.co.uk>`,
    to,
    subject,
    html: htmlContent,
  };

  const client = getTransporter();
  if (client) {
    try {
      await client.sendMail(mailOptions);
      console.log(`Confirmation email sent to ${to}`);
    } catch (e) {
      console.error("Error sending confirmation email:", e);
    }
  } else {
    console.log("--- MOCK EMAIL ---");
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log("------------------");
  }
}

async function sendAdminNotification(leadData: any) {
  const mailOptions = {
    from: process.env.EMAIL_FROM || "SwiftPay UK <hello@swiftpayuk.co.uk>",
    to: process.env.ADMIN_EMAIL || process.env.EMAIL_FROM || "admin@swiftpayuk.co.uk",
    subject: "NEW LEAD: ChatBot enquiry received",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #0d2f6e;">
        <h2 style="color: #1a4aa8;">New ChatBot Lead</h2>
        <p>A new enquiry has been captured via the AI assistant:</p>
        <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; border: 1px solid #eee;">
          <p><strong>Name:</strong> ${leadData.name}</p>
          <p><strong>Email:</strong> ${leadData.email}</p>
          <p><strong>Phone:</strong> ${leadData.phone || "Not provided"}</p>
          <p><strong>Business:</strong> ${leadData.businessName || "Not provided"}</p>
          <p><strong>Source:</strong> ChatBot Assistant</p>
        </div>
        <p>Please follow up with the lead as soon as possible.</p>
      </div>
    `,
  };

  const client = getTransporter();
  if (client) {
    try {
      await client.sendMail(mailOptions);
    } catch (e) {
      console.error("Error sending admin notification mail (chatbot):", e);
    }
  } else {
    console.log("--- MOCK ADMIN NOTIFICATION ---");
    console.log(`To: ${mailOptions.to}`);
    console.log(`Subject: ${mailOptions.subject}`);
    console.log(`Lead: ${leadData.name} (${leadData.email})`);
    console.log("------------------------------");
  }
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

import { FunctionDeclaration, Type } from "@google/genai";

const submitLeadTool: FunctionDeclaration = {
  name: "submitLead",
  description: "Registers a user's contact information for a follow-up consultation or payment audit.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      name: { type: Type.STRING, description: "The full name of the contact person" },
      email: { type: Type.STRING, description: "The email address for contact" },
      phone: { type: Type.STRING, description: "The phone number (optional)" },
      businessName: { type: Type.STRING, description: "The name of the business (optional)" },
      monthlyTurnover: { type: Type.STRING, description: "The estimated monthly card turnover (optional)" },
    },
    required: ["name", "email"]
  }
};


async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Unified Leads/Booking Route
  app.post("/api/leads", async (req, res) => {
    try {
      const { 
        name, 
        email, 
        phone, 
        businessName, 
        businessSize, 
        monthlyTurnover,
        solutionInterest, 
        howHeard, 
        message, 
        marketingConsent,
        appointmentDate,
        appointmentTime,
        skipDbSave,
        source = "web_form"
      } = req.body;

      if (!email || !name) {
        return res.status(400).json({ error: "Missing email or name" });
      }

      // No database save, only email notifications
      console.log("Lead received:", { name, email, source });

      // Send confirmation email (async)
      sendConfirmationEmail(email, name, monthlyTurnover, phone).catch(console.error);
      
      // Send admin notification (async)
      const adminOptions = {
        from: process.env.EMAIL_FROM || "SwiftPay UK <hello@swiftpayuk.co.uk>",
        to: process.env.ADMIN_EMAIL || process.env.EMAIL_FROM || "admin@swiftpayuk.co.uk",
        subject: appointmentDate ? `NEW BOOKING: ${name} scheduled a consultation` : `NEW LEAD: Enquiry from ${name}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #0d2f6e;">
            <h2 style="color: #1a4aa8;">${appointmentDate ? "New Consultation Booking" : "New Website Enquiry"}</h2>
            <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; border: 1px solid #eee;">
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
              <p><strong>Business:</strong> ${businessName || "Not provided"}</p>
              <p><strong>Monthly Turnover:</strong> ${monthlyTurnover || "Not provided"}</p>
              ${appointmentDate ? `<p><strong>Appointment:</strong> ${appointmentDate} at ${appointmentTime}</p>` : ""}
              ${solutionInterest ? `<p><strong>Interest:</strong> ${solutionInterest}</p>` : ""}
              ${message ? `<p><strong>Message:</strong> ${message}</p>` : ""}
              <p><strong>Marketing Consent:</strong> ${marketingConsent ? "YES" : "NO"}</p>
              <p><strong>Source:</strong> ${source}</p>
            </div>
            <p>Please follow up with the lead as soon as possible via CRM or Email.</p>
          </div>
        `,
      };

      const client = getTransporter();
      if (client) {
        try {
          await client.sendMail(adminOptions);
        } catch (mailError) {
          console.error("Error sending admin notification mail:", mailError);
        }
      } else {
        console.log("--- MOCK ADMIN NOTIFICATION ---");
        console.log(`To: ${adminOptions.to}`);
        console.log(`Subject: ${adminOptions.subject}`);
        console.log("------------------------------");
      }

      res.json({ success: true });
    } catch (error: any) {
      console.error("Lead submission error:", error);
      res.status(500).json({ error: "Failed to process lead submission", details: error.message, stack: error.stack });
    }
  });

  // AI Chat Route
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history } = req.body;
      
      const chat = ai.chats.create({
        model: "gemini-3-flash-preview",
        config: {
          systemInstruction: "You are a customer support agent for SwiftPay UK. You are helpful, professional, and knowledgeable about payment solutions. SwiftPay is an independent consultancy helping UK businesses find the best card readers, POS, and QR code payments. \n\nIMPORTANT: If a user expresses interest in a consultation, audit, or want to speak with an expert, you should proactively ask for their Name, Email, and optionally Phone, Business Name, and Estimated Monthly Card Turnover. Once you have at least Name and Email, use the 'submitLead' tool to register their interest. After calling the tool, confirm to the user that their details have been received and a specialist will contact them within 24 hours.",
          tools: [{ functionDeclarations: [submitLeadTool] }]
        },
        history: history || [],
      });

      const response = await chat.sendMessage({ message });
      
      // Handle tool calls
      if (response.functionCalls) {
        for (const call of response.functionCalls) {
          if (call.name === "submitLead") {
            const leadData = call.args;
            console.log("ChatBot captured lead:", leadData);
            
            // Save to Database
            if (projectId) {
              try {
                const dbInstance = getFirestoreInstance();
                await dbInstance.collection("leads").add({
                  ...leadData,
                  source: "chatbot",
                  createdAt: admin.firestore.FieldValue.serverTimestamp(),
                });
                console.log("Chat lead saved to Firestore");
              } catch (dbError: any) {
                console.error("Chat lead save FAILED:", dbError.message);
                const toolResponse = await chat.sendMessage({
                  message: {
                    role: "user",
                    parts: [{
                      functionResponse: {
                        name: "submitLead",
                        response: { status: "error", message: `Database error: ${dbError.message}. We will still attempt to contact you via email.` }
                      }
                    }]
                  }
                } as any);
                return res.json({ text: toolResponse.text });
              }
            } else {
              console.log("MOCK DB SAVE: ", leadData);
            }
            
            // Send notifications (async)
            sendConfirmationEmail(leadData.email as string, leadData.name as string, leadData.monthlyTurnover as string, leadData.phone as string).catch(console.error);
            sendAdminNotification(leadData).catch(console.error);
            
            // Respond to the tool
            const toolResponse = await chat.sendMessage({
              message: {
                role: "user",
                parts: [{
                  functionResponse: {
                    name: "submitLead",
                    response: { status: "success", message: "Lead successfully recorded. An expert will reach out within 24 hours." }
                  }
                }]
              }
            } as any); // Use any because of slightly different type in sendMessage vs generateContent

            return res.json({ text: toolResponse.text });
          }
        }
      }

      res.json({ text: response.text });
    } catch (error) {
      console.error("Chat Error:", error);
      res.status(500).json({ error: "Failed to process chat message" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
