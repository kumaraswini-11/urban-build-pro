import { describe, expect, it } from "vitest";

import { quoteSchema } from "./schema";

const valid = {
  name: "Jane Doe",
  email: "jane@example.com",
  phone: "",
  service: "",
  message: "We need a 3-storey office fit-out.",
};

describe("quoteSchema", () => {
  it("accepts a valid request and drops empty optional fields", () => {
    const result = quoteSchema.parse(valid);
    expect(result).toEqual({
      name: "Jane Doe",
      email: "jane@example.com",
      message: "We need a 3-storey office fit-out.",
    });
  });

  it("accepts optional phone and project type when provided", () => {
    const result = quoteSchema.parse({
      ...valid,
      phone: "+1 (212) 555-8900",
      service: "commercial",
    });
    expect(result.phone).toBe("+1 (212) 555-8900");
    expect(result.service).toBe("commercial");
  });

  it("treats whitespace-only optional fields as empty", () => {
    const result = quoteSchema.parse({ ...valid, phone: "   ", service: " " });
    expect(result.phone).toBeUndefined();
    expect(result.service).toBeUndefined();
  });

  const LINE_SEPARATOR = String.fromCharCode(0x2028);
  const CRLF = String.fromCharCode(13, 10);

  it.each([
    ["name", { name: "J" }, "full name"],
    ["name", { name: `Jane${LINE_SEPARATOR}Bcc: x@y.z` }, "single line"],
    ["email", { email: `jane@example.com${CRLF}Bcc: x@y.z` }, "valid email"],
    ["name", { name: "Jane\r\nBcc: x@y.z" }, "single line"],
    ["email", { email: "not-an-email" }, "valid email"],
    ["phone", { phone: "call me" }, "valid phone"],
    ["service", { service: "demolition" }, "project type"],
    ["message", { message: "Hi" }, "a little more"],
  ])("rejects an invalid %s", (field, override, expected) => {
    const result = quoteSchema.safeParse({ ...valid, ...override });
    expect(result.success).toBe(false);
    const issue = result.error?.issues.find((i) => i.path[0] === field);
    expect(issue?.message.toLowerCase()).toContain(expected);
  });
});
