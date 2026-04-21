const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });

async function sendWithResend(env, payload) {
  if (!env.RESEND_API_KEY || !env.CONTACT_TO_EMAIL || !env.CONTACT_FROM_EMAIL) {
    return false;
  }

  const subject =
    payload.language === "fr"
      ? "Nouvelle demande - Canopée Arboriculture"
      : "New request - Canopee Arboriculture";

  const text = [
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `City: ${payload.city}`,
    `Language: ${payload.language}`,
    "",
    "Message:",
    payload.message,
  ].join("\n");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env.CONTACT_FROM_EMAIL,
      to: [env.CONTACT_TO_EMAIL],
      reply_to: payload.email,
      subject,
      text,
    }),
  });

  return response.ok;
}

export async function onRequestPost(context) {
  try {
    const contentType = context.request.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return json({ error: "Invalid content type" }, 415);
    }

    const body = await context.request.json();
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    const city = String(body.city || "").trim();
    const message = String(body.message || "").trim();
    const website = String(body.website || "").trim();
    const language = body.language === "en" ? "en" : "fr";

    if (website) {
      return json({ ok: true });
    }

    if (!name || !email || !city || !message) {
      return json({ error: "Missing required fields" }, 400);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return json({ error: "Invalid email address" }, 400);
    }

    const delivered = await sendWithResend(context.env, {
      name,
      email,
      city,
      message,
      language,
    });

    if (!delivered) {
      console.log("Contact request received (email provider not configured):", {
        name,
        email,
        city,
        language,
      });
    }

    return json({ ok: true });
  } catch (error) {
    console.error("Contact form error", error);
    return json({ error: "Unexpected server error" }, 500);
  }
}
