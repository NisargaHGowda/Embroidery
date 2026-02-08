import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ ok: true, service: "embroidery-api" });
});

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

const SUPABASE_URL =
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_ANON_KEY =
  process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM = process.env.RESEND_FROM;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

// 🔍 DEBUG SMTP ENV (TEMPORARY)
console.log("SMTP HOST:", SMTP_HOST);
console.log("SMTP USER:", SMTP_USER);
console.log("SMTP PASS LENGTH:", SMTP_PASS?.length);
console.log("SMTP FROM:", SMTP_FROM);
console.log("SMTP SECURE:", SMTP_SECURE);


const supabaseRest = async (path, { method = "GET", body } = {}) => {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }

  const res = await fetch(`${SUPABASE_URL}${path}`, {
    method,
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Supabase REST error: ${res.status} ${text}`);
  }

  return res.json();
};

const verifyAdmin = async (accessToken) => {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_ANON_KEY");
  }

  const authRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!authRes.ok) {
    return null;
  }

  const authUser = await authRes.json();
  const rows = await supabaseRest(
    `/rest/v1/users?id=eq.${authUser.id}&select=is_admin`
  );
  return rows?.[0]?.is_admin ? authUser : null;
};

const sendEmail = async ({ to, subject, text, html }) => {
  if (!RESEND_API_KEY || !RESEND_FROM) {
    throw new Error("Resend env missing");
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: RESEND_FROM,
      to,
      subject,
      text,
      html,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Resend API error: ${res.status} ${errText}`);
  }
};

const BRAND_NAME = "Nature Embroidery";
const BRAND_COLOR = "#7C3AED";
const CONTACT_EMAIL = "saralahh84@gmail.com";
const CONTACT_PHONE = "8722258273";
const CONTACT_WHATSAPP = "8722258273";
const WEBSITE_URL = "https://natureembroidery.vercel.app";

const renderEmailLayout = ({ title, message, meta, details }) => `
  <div style="font-family: Arial, sans-serif; background:#f6f7fb; padding:24px;">
    <div style="max-width:560px; margin:0 auto; background:#ffffff; border-radius:10px; overflow:hidden; border:1px solid #e8e8ef;">
      <div style="background:${BRAND_COLOR}; color:#fff; padding:16px 20px; font-size:18px; font-weight:bold;">
        ${BRAND_NAME}
      </div>
      <div style="padding:20px; color:#1f2937;">
        <h2 style="margin:0 0 12px 0; font-size:20px;">${title}</h2>
        <p style="margin:0 0 16px 0; font-size:14px; line-height:1.6;">${message}</p>
        ${meta ? `<div style="padding:12px; background:#f3f4f6; border-radius:8px; font-size:13px;">${meta}</div>` : ""}
        ${details ? `<div style="margin-top:12px;">${details}</div>` : ""}
      </div>
      <div style="padding:14px 20px; background:#fafafa; color:#6b7280; font-size:12px; line-height:1.6;">
        <div style="margin-bottom:8px; color:#374151; font-weight:bold;">Contact</div>
        <div>Email: ${CONTACT_EMAIL}</div>
        <div>Phone/WhatsApp: ${CONTACT_WHATSAPP}</div>
        <div>Website: ${WEBSITE_URL}</div>
        <div style="margin-top:8px;">Thank you for choosing ${BRAND_NAME}. If you did not place this order, please contact our support team.</div>
      </div>
    </div>
  </div>
`;

const renderItemsTable = (items) => {
  if (!items || items.length === 0) return "";
  const rows = items
    .map(
      (it) => `
      <tr>
        <td style="padding:8px; border-bottom:1px solid #eee;">${it.design_code ?? "Unknown"}</td>
        <td style="padding:8px; border-bottom:1px solid #eee; text-align:right;">${it.quantity ?? 1}</td>
      </tr>
    `
    )
    .join("");
  return `
    <table style="width:100%; border-collapse:collapse; font-size:13px; margin-top:8px;">
      <thead>
        <tr>
          <th style="text-align:left; padding:8px; border-bottom:1px solid #eee;">Design</th>
          <th style="text-align:right; padding:8px; border-bottom:1px solid #eee;">Qty</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
};

app.post("/notify-order-delivered", async (req, res) => {
  try {
    const { orderId } = req.body || {};
    const authHeader = req.headers.authorization || "";
    const accessToken = authHeader.replace("Bearer ", "").trim();

    if (!orderId) {
      return res.status(400).json({ error: "orderId is required" });
    }
    if (!accessToken) {
      return res.status(401).json({ error: "Missing access token" });
    }

    const adminUser = await verifyAdmin(accessToken);
    if (!adminUser) {
      return res.status(403).json({ error: "Admin access required" });
    }

    const orders = await supabaseRest(
      `/rest/v1/orders?id=eq.${orderId}&select=id,status,user_id`
    );
    const order = orders?.[0];
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    if (order.status !== "delivered") {
      return res.status(400).json({ error: "Order is not delivered" });
    }

    const users = await supabaseRest(
      `/rest/v1/users?id=eq.${order.user_id}&select=email`
    );
    
    const user = users?.[0];

    const results = {
      emailSent: false,
    };

    if (user?.email) {
      await sendEmail({
        to: user.email,
        subject: "Your order has been delivered",
        text: `Your order ${order.id.slice(0, 8)} has been delivered. Thank you for shopping with us.`,
      });
      results.emailSent = true;
    }

    res.json({ ok: true, results });
  } catch (err) {
    console.error("Notify delivered error:", err);
    res.status(500).json({ error: "Failed to send notifications" });
  }
});

app.post("/notify-order-placed", async (req, res) => {
  try {
    const { orderId } = req.body || {};
    const authHeader = req.headers.authorization || "";
    const accessToken = authHeader.replace("Bearer ", "").trim();

    if (!orderId) {
      return res.status(400).json({ error: "orderId is required" });
    }
    if (!accessToken) {
      return res.status(401).json({ error: "Missing access token" });
    }

    const authRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!authRes.ok) {
      return res.status(401).json({ error: "Invalid access token" });
    }

    const authUser = await authRes.json();

    const orders = await supabaseRest(
      `/rest/v1/orders?id=eq.${orderId}&select=id,status,user_id`
    );
    const order = orders?.[0];
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    if (order.user_id !== authUser.id) {
      return res.status(403).json({ error: "Not your order" });
    }

    const users = await supabaseRest(
      `/rest/v1/users?id=eq.${order.user_id}&select=email,full_name`
    );
    const user = users?.[0];
    const items = await supabaseRest(
      `/rest/v1/order_items?order_id=eq.${order.id}&select=design_code,quantity`
    );

    const results = {
      emailSent: false,
      adminEmailSent: false,
    };

    if (user?.email) {
      const shortId = order.id.slice(0, 8);
      await sendEmail({
        to: user.email,
        subject: `Order ${shortId} placed successfully`,
        text: `Hello${user.full_name ? ` ${user.full_name}` : ""}, your order ${shortId} has been placed. We will notify you when it is delivered.`,
        html: renderEmailLayout({
          title: "Order Placed Successfully",
          message: `Hello${user.full_name ? ` ${user.full_name}` : ""}, thank you for your order. We have received it and will process it shortly.`,
          meta: `Order ID: <strong>${shortId}</strong><br/>Status: <strong>Order Placed</strong>`,
          details: renderItemsTable(items),
        }),
      });
      results.emailSent = true;
    }

    if (ADMIN_EMAIL) {
      const shortId = order.id.slice(0, 8);
      await sendEmail({
        to: ADMIN_EMAIL,
        subject: `New order ${shortId} placed`,
        text: `A new order ${shortId} was placed by user ${order.user_id}.`,
        html: renderEmailLayout({
          title: "New Order Placed",
          message: `A new order has been placed and is ready for review.`,
          meta: `Order ID: <strong>${shortId}</strong><br/>User ID: <strong>${order.user_id}</strong><br/>Customer Email: <strong>${user?.email ?? "N/A"}</strong>`,
          details: renderItemsTable(items),
        }),
      });
      results.adminEmailSent = true;
    }

    res.json({ ok: true, results });
  } catch (err) {
    console.error("Notify placed error:", err);
    res.status(500).json({ error: "Failed to send notifications" });
  }
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
