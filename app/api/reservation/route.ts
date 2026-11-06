import { siteConfig } from "@/config/site";
import { parseDateInput } from "@/data/hours";
import { formatPrice } from "@/data/menu";
import {
  readReservationPayload,
  type ReservationPayload,
} from "@/lib/reservation-request";

/**
 * Envoi vers l'e-mail du restaurant.
 * Resend ou Web3Forms si une clé est présente, sinon FormSubmit
 * qui écrit directement à l'adresse du restaurant.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, message: "Demande illisible." }, { status: 400 });
  }

  const parsed = readReservationPayload(body);
  if (!parsed.ok) {
    return Response.json({ ok: false, message: parsed.message }, { status: 400 });
  }

  try {
    const delivered = await deliverReservation(parsed.value);
    return Response.json({ ok: true, delivered });
  } catch {
    return Response.json(
      { ok: false, message: "L'envoi a échoué. Réessayez ou appelez le restaurant." },
      { status: 502 }
    );
  }
}

function reservationText(data: ReservationPayload) {
  const date = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "Europe/Paris",
  }).format(parseDateInput(data.date));

  const lines = [
    data.mode === "emporter"
      ? `Nouvelle commande à emporter — ${siteConfig.name}`
      : `Nouvelle demande de table — ${siteConfig.name}`,
    "",
    `Nom : ${data.name}`,
    `Téléphone : ${data.phone}`,
    `E-mail : ${data.email}`,
    `Confirmation souhaitée : ${data.contact === "sms" ? "SMS" : "E-mail"}`,
    `Date : ${date}`,
    `Service : ${data.service === "midi" ? "Midi" : "Soir"}`,
  ];

  if (data.mode === "table") {
    lines.push(`Convives : ${data.guests}`);
  } else {
    lines.push("", "Commande :");
    for (const item of data.items) {
      lines.push(`- ${item.qty} × ${item.name} — ${formatPrice(item.price * item.qty)}`);
    }
    lines.push("", `Total : ${formatPrice(data.total)}`);
  }

  return lines.join("\n");
}

async function deliverReservation(data: ReservationPayload) {
  if (process.env.RESEND_API_KEY && process.env.RESEND_FROM) {
    await sendWithResend(data);
    return true;
  }
  if (process.env.WEB3FORMS_ACCESS_KEY) {
    await sendWithWeb3Forms(data);
    return true;
  }
  await sendWithFormSubmit(data);
  return true;
}

async function sendWithResend(data: ReservationPayload) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM,
      to: [siteConfig.email],
      reply_to: data.email,
      subject: emailSubject(data),
      text: reservationText(data),
    }),
  });

  if (!response.ok) {
    throw new Error("Resend a refusé l'envoi.");
  }
}

async function sendWithWeb3Forms(data: ReservationPayload) {
  const response = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      access_key: process.env.WEB3FORMS_ACCESS_KEY,
      subject: emailSubject(data),
      from_name: data.name,
      email: data.email,
      phone: data.phone,
      message: reservationText(data),
    }),
  });

  const result = (await response.json().catch(() => null)) as { success?: boolean } | null;
  if (!response.ok || result?.success === false) {
    throw new Error("Web3Forms a refusé l'envoi.");
  }
}

function emailSubject(data: ReservationPayload) {
  return data.mode === "emporter"
    ? `Commande à emporter — ${data.name}`
    : `Demande de table — ${data.name}`;
}

async function sendWithFormSubmit(data: ReservationPayload) {
  const response = await fetch(
    `https://formsubmit.co/ajax/${encodeURIComponent(siteConfig.email)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        phone: data.phone,
        _subject: emailSubject(data),
        _template: "box",
        _captcha: "false",
        message: reservationText(data),
      }),
    }
  );

  const result = (await response.json().catch(() => null)) as { success?: string | boolean } | null;
  const accepted = result?.success === true || result?.success === "true";
  if (!response.ok || !accepted) {
    throw new Error("L'e-mail n'a pas pu être envoyé.");
  }
}
