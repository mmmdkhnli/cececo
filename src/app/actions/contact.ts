"use server";

import { db } from "@/db";
import { contactMessage } from "@/db/schema";

export type SendMessageState = { status: "idle" | "success" | "error"; message?: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function sendContactMessage(
  _prevState: SendMessageState,
  formData: FormData,
): Promise<SendMessageState> {
  const fullName = String(formData.get("fullName") ?? "").trim();
  const organization = String(formData.get("organization") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const subject = String(formData.get("subject") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!fullName || !email || !EMAIL_RE.test(email) || !subject || !message) {
    return { status: "error", message: "Please fill in all required fields with a valid email address." };
  }

  try {
    await db.insert(contactMessage).values({
      fullName,
      organization: organization || null,
      email,
      subject,
      message,
    });
  } catch (err) {
    console.error("Contact message submission failed:", err);
    return { status: "error", message: "Something went wrong. Please try again in a moment." };
  }

  return { status: "success", message: "Thanks for reaching out — we'll get back to you soon." };
}
