"use client";

import { useActionState, useEffect, useRef } from "react";

import { ConstructionButton } from "@/components/construction-button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

import { submitQuote } from "./actions";
import {
  HONEYPOT_FIELD,
  initialQuoteFormState,
  type QuoteField,
  SERVICE_OPTIONS,
} from "./constants";

const fieldClass =
  "h-14 rounded-none border-border text-foreground focus:border-primary";

// Prefixed ids so a second form on the page (e.g. a newsletter) can't clash.
const fieldId = (field: QuoteField) => `quote-${field}`;
const errorId = (field: QuoteField) => `quote-${field}-error`;

export function QuoteForm() {
  const [state, formAction, isPending] = useActionState(
    submitQuote,
    initialQuoteFormState,
  );
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  // After a submission, move focus to the first invalid field, or to the
  // confirmation so screen-reader and keyboard users land on the result.
  useEffect(() => {
    if (state.status === "idle") return;
    const firstInvalid = formRef.current?.querySelector<HTMLElement>(
      '[aria-invalid="true"]',
    );
    (firstInvalid ?? statusRef.current)?.focus();
  }, [state]);

  const error = (field: QuoteField) => state.fieldErrors?.[field];
  const fieldA11y = (field: QuoteField) => ({
    id: fieldId(field),
    "aria-invalid": Boolean(error(field)),
    "aria-describedby": error(field) ? errorId(field) : undefined,
  });

  return (
    <div>
      {/* Remount per submission: a success clears the form, an error
          restores the submitted values via defaultValue. */}
      <form
        key={state.attempt}
        ref={formRef}
        action={formAction}
        className="space-y-5"
      >
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Field label="Full name" field="name" error={error("name")}>
            <Input
              {...fieldA11y("name")}
              name="name"
              autoComplete="name"
              required
              defaultValue={state.fields?.name}
              className={fieldClass}
            />
          </Field>
          <Field label="Email address" field="email" error={error("email")}>
            <Input
              {...fieldA11y("email")}
              name="email"
              type="email"
              autoComplete="email"
              required
              defaultValue={state.fields?.email}
              className={fieldClass}
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Field
            label="Phone number"
            field="phone"
            optional
            error={error("phone")}
          >
            <Input
              {...fieldA11y("phone")}
              name="phone"
              type="tel"
              autoComplete="tel"
              defaultValue={state.fields?.phone}
              className={fieldClass}
            />
          </Field>
          <Field
            label="Project type"
            field="service"
            optional
            error={error("service")}
          >
            <Select
              name="service"
              defaultValue={state.fields?.service || undefined}
            >
              <SelectTrigger
                {...fieldA11y("service")}
                className={cn(fieldClass, "min-h-14 w-full")}
              >
                <SelectValue placeholder="Select a project type" />
              </SelectTrigger>
              <SelectContent>
                {SERVICE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>

        <Field
          label="Tell us about your project"
          field="message"
          error={error("message")}
        >
          <Textarea
            {...fieldA11y("message")}
            name="message"
            required
            minLength={10}
            maxLength={2000}
            defaultValue={state.fields?.message}
            className="min-h-[150px] resize-none rounded-none border-border text-foreground focus:border-primary"
          />
        </Field>

        {/* Spam trap: hidden from people and assistive tech, left for bots. */}
        <div
          aria-hidden="true"
          className="absolute -left-[10000px] h-px w-px overflow-hidden"
        >
          <label htmlFor={HONEYPOT_FIELD}>Leave this field empty</label>
          <input
            id={HONEYPOT_FIELD}
            name={HONEYPOT_FIELD}
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <div className="flex flex-col gap-4 pt-2 md:flex-row md:items-center">
          <ConstructionButton
            type="submit"
            label={isPending ? "Sending…" : "Send message"}
            disabled={isPending}
            className="w-full md:w-auto"
          />
          <p className="text-muted-foreground text-sm">
            We only use your details to respond to your enquiry.
          </p>
        </div>
      </form>

      {/* Outside the keyed form and always rendered, so the live region
          persists between submissions and announces reliably. */}
      <div
        ref={statusRef}
        role="status"
        tabIndex={-1}
        className="focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2"
      >
        {state.message && (
          <p
            className={cn(
              "mt-5 border-l-4 pl-4 text-sm",
              state.status === "error"
                ? "border-destructive text-destructive"
                : "border-primary text-foreground",
            )}
          >
            {state.message}
          </p>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  field,
  optional,
  error,
  children,
}: {
  label: string;
  field: QuoteField;
  optional?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={fieldId(field)}
        className="font-semibold text-foreground text-sm"
      >
        {label}
        {optional && (
          <span className="font-normal text-muted-foreground"> (optional)</span>
        )}
      </label>
      {children}
      {error && (
        <p id={errorId(field)} className="text-destructive text-sm">
          {error}
        </p>
      )}
    </div>
  );
}
