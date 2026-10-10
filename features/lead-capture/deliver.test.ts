import { afterEach, describe, expect, it, vi } from "vitest";

import { deliverLead, formatLead } from "./deliver";

const lead = {
  name: "Jane Doe",
  email: "jane@example.com",
  service: "renovation" as const,
  message: "Retrofit of a 1920s warehouse.",
};

const resendEnv = {
  RESEND_API_KEY: "re_test",
  LEAD_TO_EMAIL: "team@example.com",
  LEAD_FROM_EMAIL: "Website <web@example.com>",
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("formatLead", () => {
  it("renders a readable plain-text summary", () => {
    expect(formatLead(lead)).toBe(
      [
        "Name: Jane Doe",
        "Email: jane@example.com",
        "Phone: Not provided",
        "Project type: Renovation & Retrofit",
        "",
        "Retrofit of a 1920s warehouse.",
      ].join("\n"),
    );
  });
});

describe("deliverLead", () => {
  it("is not configured without a provider", async () => {
    expect(await deliverLead(lead, {})).toEqual({
      ok: false,
      reason: "not-configured",
    });
  });

  it("is not configured when Resend settings are incomplete", async () => {
    expect(
      await deliverLead(lead, { RESEND_API_KEY: "re_test" }),
    ).toMatchObject({ ok: false, reason: "not-configured" });
  });

  it("logs instead of emailing with the console driver", async () => {
    const info = vi.spyOn(console, "info").mockImplementation(() => {});
    expect(await deliverLead(lead, { LEAD_DELIVERY: "console" })).toEqual({
      ok: true,
    });
    expect(info).toHaveBeenCalledOnce();
  });

  it("refuses the console driver on Vercel production", async () => {
    expect(
      await deliverLead(lead, {
        LEAD_DELIVERY: "console",
        VERCEL_ENV: "production",
      }),
    ).toMatchObject({ ok: false, reason: "not-configured" });
  });

  it("sends the lead to Resend with reply-to and an idempotency key", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        new Response(JSON.stringify({ id: "email_123" }), { status: 200 }),
      );
    vi.stubGlobal("fetch", fetchMock);

    expect(await deliverLead(lead, resendEnv)).toEqual({
      ok: true,
      id: "email_123",
    });

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.resend.com/emails");
    expect(init.method).toBe("POST");
    expect(init.headers.Authorization).toBe("Bearer re_test");
    expect(init.headers["Idempotency-Key"]).toMatch(/^[a-f0-9]{64}$/);
    expect(JSON.parse(init.body)).toEqual({
      from: "Website <web@example.com>",
      to: ["team@example.com"],
      reply_to: "jane@example.com",
      subject: "New quote request from Jane Doe",
      text: formatLead(lead),
    });
  });

  it("treats a 2xx with an empty body as delivered", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response("", { status: 200 })),
    );
    expect(await deliverLead(lead, resendEnv)).toEqual({ ok: true });
  });

  it("uses a stable idempotency key per lead content", async () => {
    const fetchMock = vi
      .fn()
      .mockImplementation(async () => new Response("{}", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    await deliverLead(lead, resendEnv);
    await deliverLead(lead, resendEnv);
    await deliverLead({ ...lead, message: "A different project." }, resendEnv);

    const keys = fetchMock.mock.calls.map(
      ([, init]) => init.headers["Idempotency-Key"],
    );
    expect(keys[0]).toBe(keys[1]);
    expect(keys[2]).not.toBe(keys[0]);
  });

  it("ignores an empty LEAD_DELIVERY and falls back to Resend", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response("{}", { status: 200 })),
    );
    expect(
      await deliverLead(lead, { ...resendEnv, LEAD_DELIVERY: "" }),
    ).toEqual({ ok: true });
  });

  it("reports a provider error with its status", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response("{}", { status: 422 })),
    );
    expect(await deliverLead(lead, resendEnv)).toEqual({
      ok: false,
      reason: "provider-error",
      status: 422,
    });
  });

  it("reports a network error", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    expect(await deliverLead(lead, resendEnv)).toEqual({
      ok: false,
      reason: "network-error",
    });
  });
});
