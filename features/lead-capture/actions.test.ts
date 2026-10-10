import { beforeEach, describe, expect, it, vi } from "vitest";

import { submitQuote } from "./actions";
import { deliverLead } from "./deliver";
import { HONEYPOT_FIELD, initialQuoteFormState } from "./schema";

vi.mock("./deliver", () => ({ deliverLead: vi.fn() }));
const deliverMock = vi.mocked(deliverLead);

const form = (values: Record<string, string>) => {
  const data = new FormData();
  for (const [key, value] of Object.entries(values)) data.set(key, value);
  return data;
};

const valid = {
  name: "Jane Doe",
  email: "jane@example.com",
  phone: "",
  service: "",
  message: "We need a 3-storey office fit-out.",
};

beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(() => {});
  vi.spyOn(console, "info").mockImplementation(() => {});
});

describe("submitQuote", () => {
  it("delivers a valid request and confirms it", async () => {
    deliverMock.mockResolvedValue({ ok: true });

    const state = await submitQuote(initialQuoteFormState, form(valid));

    expect(deliverMock).toHaveBeenCalledWith({
      name: "Jane Doe",
      email: "jane@example.com",
      message: "We need a 3-storey office fit-out.",
    });
    expect(state).toMatchObject({ status: "success", attempt: 1 });
    expect(state.message).toMatch(/received/);
  });

  it("returns field errors and the submitted values without delivering", async () => {
    const state = await submitQuote(
      initialQuoteFormState,
      form({ ...valid, email: "nope", message: "Hi" }),
    );

    expect(deliverMock).not.toHaveBeenCalled();
    expect(state.status).toBe("error");
    expect(Object.keys(state.fieldErrors ?? {}).sort()).toEqual([
      "email",
      "message",
    ]);
    expect(state.fields).toMatchObject({ name: "Jane Doe", email: "nope" });
  });

  it("shows an honest error with contact fallbacks when delivery fails", async () => {
    deliverMock.mockResolvedValue({ ok: false, reason: "not-configured" });

    const state = await submitQuote(initialQuoteFormState, form(valid));

    expect(state.status).toBe("error");
    expect(state.message).toMatch(/call us/i);
    expect(state.fields?.message).toBe(valid.message);
  });

  it("silently drops honeypot submissions", async () => {
    const state = await submitQuote(
      initialQuoteFormState,
      form({ ...valid, [HONEYPOT_FIELD]: "spam" }),
    );

    expect(deliverMock).not.toHaveBeenCalled();
    expect(state.status).toBe("success");
  });

  it("does not trust a malformed previous state", async () => {
    deliverMock.mockResolvedValue({ ok: true });
    const state = await submitQuote(
      {
        status: "idle",
        attempt: "x",
      } as unknown as typeof initialQuoteFormState,
      form(valid),
    );
    expect(state.attempt).toBe(1);
  });

  it("counts attempts from the previous state", async () => {
    deliverMock.mockResolvedValue({ ok: true });
    const state = await submitQuote(
      { ...initialQuoteFormState, attempt: 4 },
      form(valid),
    );
    expect(state.attempt).toBe(5);
  });
});
