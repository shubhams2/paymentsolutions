/**
 * Cloudflare Pages Function - Backend Lead Processor
 * Path: /functions/leads.ts
 *
 * This handler accepts a POST request, retrieves the Zoho App Password from
 * Environment Variables, dynamically obtains the account ID from Zoho's accounts
 * endpoint (extracting accountId from response.data[0].accountId), and pushes
 * a branded HTML email confirmation directly using Zoho's official REST API.
 * Included additional header: X-COM-ZOHO-MAIL-OWNER set to sales@phalampayments.co.uk
 */

interface Env {
  ZOHO_APP_PASSWORD?: string;
}

interface RequestContext {
  request: Request;
  env: Env;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-COM-ZOHO-MAIL-OWNER",
};

/**
 * Handle OPTIONS preflight requests cleanly on Cloudflare Pages
 */
export async function onRequestOptions(): Promise<Response> {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

/**
 * Handle POST request for submission of client leads
 */
export async function onRequestPost({ request, env }: RequestContext): Promise<Response> {
  // Handle OPTIONS preflight within POST handler as well
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    // 1. Parse incoming JSON request data
    const { name, email, phone, source } = (await request.json()) as {
      name: string;
      email: string;
      phone: string;
      source?: string;
    };

    // Validate inputs
    if (!name || !email || !phone) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Missing required fields. Please ensure 'name', 'email', and 'phone' are provided.",
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 2. Retrieve the ZOHO_APP_PASSWORD environment variable
    const zohoAppPassword = env.ZOHO_APP_PASSWORD;
    if (!zohoAppPassword) {
      console.error("Cloudflare Error: ZOHO_APP_PASSWORD environment variable is not defined.");
      return new Response(
        JSON.stringify({
          success: false,
          error: "Cloudflare Environment Configuration Error: ZOHO_APP_PASSWORD is not set on the dashboard.",
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Prepare authorization and owner headers required by Zoho Mail API
    const authHeader = `Zoho-encauthtoken ${zohoAppPassword}`;
    const ownerHeader = "sales@phalampayments.co.uk";

    const commonHeaders = {
      "Authorization": authHeader,
      "X-COM-ZOHO-MAIL-OWNER": ownerHeader,
      "Accept": "application/json",
    };

    // 3. Step One: Contact Zoho accounts API to retrieve account details
    console.log("Contacting Zoho REST accounts endpoint to retrieve account ID...");
    const accountsResponse = await fetch("https://mail.zoho.com/api/accounts", {
      method: "GET",
      headers: commonHeaders,
    });

    if (!accountsResponse.ok) {
      const errorText = await accountsResponse.text();
      console.error(`Zoho GET accounts endpoint failed with status ${accountsResponse.status}: ${errorText}`);
      return new Response(
        JSON.stringify({
          success: false,
          error: `Zoho account validation failed. (Status: ${accountsResponse.status}). Details: ${errorText}`,
        }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 4. Safely extract accountId from the first element of 'data' array
    let accountId: string | null = null;
    try {
      const accountsData = (await accountsResponse.json()) as any;
      console.log("Fetched Zoho account representation structure successfully.");

      if (accountsData && Array.isArray(accountsData.data) && accountsData.data.length > 0) {
        accountId = accountsData.data[0].accountId;
      } else if (accountsData && accountsData.accountId) {
        accountId = accountsData.accountId; // Direct fallback
      } else if (accountsData && Array.isArray(accountsData.accounts) && accountsData.accounts.length > 0) {
        accountId = accountsData.accounts[0].accountId; // Sub-accounts fallback
      }
    } catch (parseErr: any) {
      console.error("Failed to parse accounts JSON response from Zoho:", parseErr);
      return new Response(
        JSON.stringify({
          success: false,
          error: `Failed to parse account representation from Zoho: ${parseErr.message}`,
        }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!accountId) {
      console.error("No valid accountId identified in Zoho Response.");
      return new Response(
        JSON.stringify({
          success: false,
          error: "Zoho accounts endpoint did not contain any valid accounts under data[0].accountId",
        }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Identified Zoho Account ID: ${accountId}`);

    // 5. Build transaction HTML email with legal signature
    const emailHtmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">
        <div style="background-color: #0d2f6e; padding: 25px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: bold; letter-spacing: 0.5px;">Phalam Payments</h1>
        </div>

        <div style="padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; background-color: #ffffff;">
          <p style="font-size: 16px;">Dear ${name},</p>

          <p style="font-size: 15px;">Thank you for getting in touch with <strong>Phalam Payments</strong>.</p>

          <p style="font-size: 15px;">We have successfully received your payment solution inquiry. One of our specialist independent payment technology consultants will review top UK merchant rates and contact you within 24 hours at <strong>${phone}</strong> or via this email address (<strong>${email}</strong>) to identify and arrange the best card terminals, POS registers, or QR-code integrations for your business operation.</p>

          <p style="font-size: 15px;">In the meantime, if you have any specific hardware requests or want to share details of current processing statements, please feel free to reply directly to this email.</p>

          <p style="font-size: 15px;">We look forward to optimizing your checkout cost architecture.</p>

          <p style="margin-top: 40px; margin-bottom: 5px; font-size: 14px; color: #555;">Kind regards,</p>

          <p style="margin: 0; font-size: 15px; color: #333;"><strong>Shubham Garg</strong></p>
          <p style="margin: 0 0 15px 0; font-size: 13px; color: #666;">Managing Consultant | Phalam Payments</p>

          <p style="margin: 0; font-size: 13px; color: #555; line-height: 1.5;">
            <strong>M:</strong> +44 7448 558053<br>
            <strong>E:</strong> <a href="mailto:sales@phalampayments.co.uk" style="color: #1a4aa8; text-decoration: none;">sales@phalampayments.co.uk</a><br>
            <strong>W:</strong> <a href="https://phalampayments.co.uk" style="color: #1a4aa8; text-decoration: none;">https://phalampayments.co.uk</a>
          </p>

          <p style="margin: 25px 0; font-size: 11px; color: #aaa; font-family: monospace; border-top: 1px solid #eeeeee; padding-top: 15px;">
            ----------------------------------------------------------------------<br>
            Independent Payment Technology Consultants & Systems Integrators<br>
            ----------------------------------------------------------------------
          </p>

          <p style="font-size: 10px; color: #888; border-left: 3px solid #0d2f6e; padding-left: 10px; font-style: italic; line-height: 1.5; margin: 0;">
            <strong>Legal Disclaimer:</strong> Phalam Payments is an independent technology consultancy. We are not a bank or an FCA-regulated financial institution. All merchant accounts, card processing services, and financial transactions are provided exclusively by our fully authorized and regulated partner networks.
          </p>
        </div>
      </div>
    `;

    // 6. Step Two: Dispatch POST message trigger using correct accountId
    const zohoMessageUrl = `https://mail.zoho.com/${accountId}/messages`;
    console.log(`Dispatching outbound email trigger via Zoho Mail URL: ${zohoMessageUrl}`);

    const mailBody = {
      fromAddress: "sales@phalampayments.co.uk",
      toAddress: email,
      subject: "Phalam Payments - We have received your inquiry",
      content: emailHtmlContent,
      mailFormat: "html",
    };

    const mailResponse = await fetch(zohoMessageUrl, {
      method: "POST",
      headers: {
        ...commonHeaders,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(mailBody),
    });

    if (!mailResponse.ok) {
      const errorText = await mailResponse.text();
      console.error(`Zoho Mail endpoint rejected request with status ${mailResponse.status}: ${errorText}`);
      return new Response(
        JSON.stringify({
          success: false,
          error: `Zoho Mail API rejected dispatch. (Status: ${mailResponse.status}). Details: ${errorText}`,
        }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const mailResponseData = (await mailResponse.json()) as any;
    console.log("Outbound HTML email dispatch successfully executed.");

    return new Response(
      JSON.stringify({
        success: true,
        message: "Confirmation email sent successfully via Zoho Mail API.",
        messageId: mailResponseData?.messageId || "dispatched",
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("Cloudflare Pages Function Exception:", err);
    return new Response(
      JSON.stringify({
        success: false,
        error: `Cloudflare Pages Serverless Exception: ${err.message || err}`,
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
}
