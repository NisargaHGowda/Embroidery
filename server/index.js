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

import nodemailer from "nodemailer";

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = Number(process.env.SMTP_PORT || "587");
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_FROM = process.env.SMTP_FROM;
const SMTP_SECURE = process.env.SMTP_SECURE === "true";

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

const sendEmail = async ({ to, subject, text }) => {
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !SMTP_FROM) {
    throw new Error("SMTP env missing");
  }

  const transport = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_SECURE,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  await transport.sendMail({
    from: SMTP_FROM,
    to,
    subject,
    text,
  });
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
      `/rest/v1/users?id=eq.${order.user_id}&select=email`
    );
    const user = users?.[0];

    const results = {
      emailSent: false,
    };

    if (user?.email) {
      await sendEmail({
        to: user.email,
        subject: "Order placed successfully",
        text: `Your order ${order.id.slice(0, 8)} has been placed. We will notify you when it is delivered.`,
      });
      results.emailSent = true;
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
