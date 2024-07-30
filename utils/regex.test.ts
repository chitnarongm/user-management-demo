import { EMAIL_REGEX } from "./regex";

describe("EMAIL_REGEX", () => {
  it("should verify email correctly", () => {
    expect(EMAIL_REGEX.test("")).toBe(false);
    expect(EMAIL_REGEX.test(null as any)).toBe(false);
    expect(EMAIL_REGEX.test(undefined as any)).toBe(false);

    expect(EMAIL_REGEX.test("a")).toBe(false);
    expect(EMAIL_REGEX.test("a@")).toBe(false);
    expect(EMAIL_REGEX.test("a@a")).toBe(false);
    expect(EMAIL_REGEX.test("a@a.")).toBe(false);
    expect(EMAIL_REGEX.test("@a.com")).toBe(false);
    expect(EMAIL_REGEX.test("a.com")).toBe(false);
    expect(EMAIL_REGEX.test(".com")).toBe(false);

    expect(EMAIL_REGEX.test("test@test.com")).toBe(true);
    expect(EMAIL_REGEX.test("TEST@TEST.com")).toBe(true);
    expect(EMAIL_REGEX.test("Test@Test.com")).toBe(true);
    expect(EMAIL_REGEX.test("123@123.com")).toBe(true);
    expect(EMAIL_REGEX.test("Test.123@Test.com")).toBe(true);
    expect(EMAIL_REGEX.test("Test_123@Test.com")).toBe(true);
    expect(EMAIL_REGEX.test("Test_123@Test.com")).toBe(true);
    expect(EMAIL_REGEX.test("A-Za-z0-9!#$%&'*+/=?^_{|}~-@mail.com")).toBe(true);
  });
});
