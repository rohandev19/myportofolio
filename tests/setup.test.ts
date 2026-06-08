import { describe, it, expect } from "vitest";

describe("Test Environment Setup", () => {
  it("should have localStorage available", () => {
    expect(window.localStorage).toBeDefined();
    window.localStorage.setItem("test", "value");
    expect(window.localStorage.getItem("test")).toBe("value");
  });

  it("should have matchMedia mock available", () => {
    expect(window.matchMedia).toBeDefined();
    const media = window.matchMedia("(prefers-reduced-motion: no-preference)");
    expect(media.matches).toBe(true);
  });

  it("should have ResizeObserver available", () => {
    expect(ResizeObserver).toBeDefined();
    const observer = new ResizeObserver(() => {});
    expect(observer).toBeDefined();
    expect(observer.observe).toBeDefined();
    expect(observer.unobserve).toBeDefined();
    expect(observer.disconnect).toBeDefined();
  });
});
