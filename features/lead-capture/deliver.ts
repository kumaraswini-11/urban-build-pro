import "server-only";

import { createHash } from "node:crypto";

import { type QuoteInput, SERVICE_OPTIONS } from "./schema";

export type DeliveryResult =
  | { ok: true; id?: string }
  | {
      ok: false;
      reason: "not-configured" | "provider-error" | "network-error";
      status?: number;
    };

type DeliveryEnv = Readonly<Record<string, string | undefined>>;

const RESEND_ENDPOINT = "https://api.resend.com/emails";

export function formatLead(lead: QuoteInput): string {
  const service =
    SERVICE_OPTIONS.find((option) => option.value === lead.service)?.label ??
    "Not specified";
  return [
    `Name: ${lead.name}`,
    `Email: ${lead.email}`,
    `Phone: ${lead.phone ?? "Not provided"}`,
    `Project type: ${service}`,
    "",
    lead.message,
  ].join("\n");
}

/**
 * Sends a validated quote request to the team (D-005).
 *
 * Drivers:
 * - "resend" (default when RESEND_API_KEY is set): emails LEAD_TO_EMAIL.
 * - "console" (LEAD_DELIVERY=console): logs instead of emailing, for local
 *   development and e2e tests; refused on Vercel production.
 * Anything else is "not-configured", and the caller shows an honest error.
 */
export async function deliverLead(
  lead: QuoteInput,
  env: DeliveryEnv = process.env,
): Promise<DeliveryResult> {
  const driver =
    env.LEAD_DELIVERY || (env.RESEND_API_KEY ? "resend" : undefined);

  if (driver === "console") {
    if (env.VERCEL_ENV === "production") {
      return { ok: false, reason: "not-configured" };
    }
    console.info(
      "[lead-capture] console driver: lead logged, NOT emailed\n%s",
      formatLead(lead),
    );
    return { ok: true };
  }

  const { RESEND_API_KEY, LEAD_TO_EMAIL, LEAD_FROM_EMAIL } = env;
  if (
    driver !== "resend" ||
    !RESEND_API_KEY ||
    !LEAD_TO_EMAIL ||
    !LEAD_FROM_EMAIL
  ) {
    return { ok: false, reason: "not-configured" };
  }

  // Identical resubmissions (double clicks, retries) are de-duplicated by
  // Resend for 24 hours.
  const idempotencyKey = createHash("sha256")
    .update(JSON.stringify(lead))
    .digest("hex");

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
        "Idempotency-Key": idempotencyKey,
      },
      body: JSON.stringify({
        from: LEAD_FROM_EMAIL,
        to: [LEAD_TO_EMAIL],
        reply_to: lead.email,
        subject: `New quote request from ${lead.name}`,
        text: formatLead(lead),
      }),
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      return { ok: false, reason: "provider-error", status: response.status };
    }
    // Any 2xx means the email was accepted, even if the body is not JSON.
    const data = (await response.json().catch(() => ({}))) as { id?: string };
    return { ok: true, id: data.id };
  } catch {
    return { ok: false, reason: "network-error" };
  }
}
