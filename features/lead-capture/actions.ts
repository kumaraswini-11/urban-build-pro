"use server";

import { CONTACT_INFO } from "@/lib/constants";

import { deliverLead } from "./deliver";
import {
  HONEYPOT_FIELD,
  type QuoteField,
  type QuoteFormState,
  quoteSchema,
} from "./schema";

const FIELDS: QuoteField[] = ["name", "email", "phone", "service", "message"];

const SUCCESS_MESSAGE =
  "Thank you — your request has been received. Our team will contact you within 24 hours.";

/**
 * Server Action behind the quote form. Treat it as a public endpoint:
 * everything is re-validated here, whatever the browser checked.
 */
export async function submitQuote(
  previous: QuoteFormState,
  formData: FormData,
): Promise<QuoteFormState> {
  // The previous state round-trips through the client, so don't trust it.
  const attempt =
    (Number.isSafeInteger(previous?.attempt) ? previous.attempt : 0) + 1;
  const fields = Object.fromEntries(
    FIELDS.map((field) => {
      const value = formData.get(field);
      return [field, typeof value === "string" ? value : ""];
    }),
  ) as Record<QuoteField, string>;

  // Honeypot: real visitors never see or fill this field (its name avoids
  // browser autofill). Bots get the normal success message so they don't
  // learn they were filtered.
  if (formData.get(HONEYPOT_FIELD)) {
    console.info("[lead-capture] honeypot tripped");
    return { status: "success", message: SUCCESS_MESSAGE, attempt };
  }

  const parsed = quoteSchema.safeParse(fields);
  if (!parsed.success) {
    const fieldErrors: QuoteFormState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as QuoteField;
      fieldErrors[field] ??= issue.message;
    }
    return {
      status: "error",
      message: "Please check the highlighted fields.",
      fieldErrors,
      fields,
      attempt,
    };
  }

  const result = await deliverLead(parsed.data);
  if (!result.ok) {
    // No personal data in logs: the reason and status are enough to debug.
    console.error("[lead-capture] delivery failed", {
      reason: result.reason,
      status: result.status,
    });
    return {
      status: "error",
      message: `We couldn't send your request just now. Please call us on ${CONTACT_INFO.phone} or email ${CONTACT_INFO.email}.`,
      fields,
      attempt,
    };
  }

  return { status: "success", message: SUCCESS_MESSAGE, attempt };
}
