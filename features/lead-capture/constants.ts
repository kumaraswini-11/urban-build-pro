// Shared by the client form and the server. Keep this module free of zod
// (and other server-only code) so it doesn't pull it into the browser bundle.

export const SERVICE_OPTIONS = [
  { value: "residential", label: "Residential Build" },
  { value: "commercial", label: "Commercial Development" },
  { value: "renovation", label: "Renovation & Retrofit" },
  { value: "consultation", label: "Project Consultation" },
] as const;

/** Hidden spam trap. Named to avoid browser/password-manager autofill. */
export const HONEYPOT_FIELD = "hp_ref";

/** Must match the keys of quoteSchema in schema.ts. */
export type QuoteField = "name" | "email" | "phone" | "service" | "message";

export type QuoteFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<QuoteField, string>>;
  /** Submitted values, echoed back so the form keeps them after an error. */
  fields?: Partial<Record<QuoteField, string>>;
  /** Increments on every submission; used to reset the form after success. */
  attempt: number;
};

export const initialQuoteFormState: QuoteFormState = {
  status: "idle",
  attempt: 0,
};
