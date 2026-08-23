"use server";

import { db } from "@/db";
import { subscriber } from "@/db/schema";

export type SubscribeState = { status: "idle" | "success" | "error"; message?: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function subscribeToNewsletter(
  _prevState: SubscribeState,
  formData: FormData,
): Promise<SubscribeState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!email || !EMAIL_RE.test(email)) {
    return { status: "error", message: "Please enter a valid email address." };
  }

  try {
    await db.insert(subscriber).values({ email });
  } catch (err) {
    if ((err as { code?: string })?.code !== "ER_DUP_ENTRY") {
      console.error("Newsletter subscribe failed:", err);
      return { status: "error", message: "Something went wrong. Please try again in a moment." };
    }
  }

  return { status: "success", message: "Thanks for subscribing!" };
}
