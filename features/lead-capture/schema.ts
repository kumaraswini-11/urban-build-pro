import { z } from "zod";

export const SERVICE_OPTIONS = [
  { value: "residential", label: "Residential Build" },
  { value: "commercial", label: "Commercial Development" },
  { value: "renovation", label: "Renovation & Retrofit" },
  { value: "consultation", label: "Project Consultation" },
] as const;

const serviceValues = SERVICE_OPTIONS.map((option) => option.value) as [
  (typeof SERVICE_OPTIONS)[number]["value"],
  ...(typeof SERVICE_OPTIONS)[number]["value"][],
];

// Single-line fields end up in email headers (subject), so reject control
// characters and Unicode line/paragraph separators.
const singleLine = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Please keep this under ${max} characters.`)
    .regex(/^[^\p{Cc}\u2028\u2029]*$/u, "Please use a single line.");

// Optional form fields arrive as "" (or whitespace) when left empty.
const optional = <T extends z.ZodType>(schema: T) =>
  z.preprocess(
    (value) =>
      typeof value === "string" && value.trim() === "" ? undefined : value,
    schema.optional(),
  );

export const quoteSchema = z.object({
  name: singleLine(100).min(2, "Please enter your full name."),
  email: z
    .email("Please enter a valid email address.")
    .max(254, "Please enter a shorter email address."),
  phone: optional(
    z
      .string()
      .trim()
      .regex(/^[+\d\s().-]{7,30}$/, "Please enter a valid phone number."),
  ),
  service: optional(z.enum(serviceValues, "Please choose a project type.")),
  message: z
    .string()
    .trim()
    .min(
      10,
      "Tell us a little more about your project (at least 10 characters).",
    )
    .max(2000, "Please keep your message under 2,000 characters."),
});

/** Hidden spam trap. Named to avoid browser/password-manager autofill. */
export const HONEYPOT_FIELD = "hp_ref";

export type QuoteInput = z.infer<typeof quoteSchema>;
export type QuoteField = keyof QuoteInput;

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
