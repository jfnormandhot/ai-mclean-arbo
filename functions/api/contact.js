const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });

async function createZohoDeskTicket(env, payload) {
  if (!env.ZOHO_DESK_ACCESS_TOKEN || !env.ZOHO_DESK_ORG_ID) {
    return false;
  }

  const subject =
    payload.language === "fr"
      ? `Nouvelle demande - ${payload.city}`
      : `New request - ${payload.city}`;

  const description = [
    `<p><strong>Name:</strong> ${payload.name}</p>`,
    `<p><strong>Email:</strong> ${payload.email}</p>`,
    `<p><strong>City:</strong> ${payload.city}</p>`,
    `<p><strong>Language:</strong> ${payload.language}</p>`,
    `<p><strong>Message:</strong><br>${payload.message.replace(/\n/g, "<br>")}</p>`,
  ].join("");

  const body = {
    subject,
    departmentId: env.ZOHO_DESK_DEPARTMENT_ID || undefined,
    contact: {
      firstName: payload.name,
      lastName: "Website lead",
      email: payload.email,
    },
    description,
    channel: "Web",
    status: "Open",
  };

  const response = await fetch("https://desk.zoho.com/api/v1/tickets", {
    method: "POST",
    headers: {
      Authorization: `Zoho-oauthtoken ${env.ZOHO_DESK_ACCESS_TOKEN}`,
      orgId: env.ZOHO_DESK_ORG_ID,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
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

    const ticketCreated = await createZohoDeskTicket(context.env, {
      name,
      email,
      city,
      message,
      language,
    });

    if (!ticketCreated) {
      console.log("Contact request received (Zoho Desk not configured):", {
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
