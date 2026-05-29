import { render } from "@testing-library/react";
import { parseContent } from "./parseContent";

const renderContent = (text: string) => {
  const { container } = render(<span>{parseContent(text)}</span>);
  return container;
};

describe("parseContent", () => {
  describe("plain text", () => {
    it("returns plain text unchanged", () => {
      const container = renderContent("Hello world");
      expect(container.textContent).toBe("Hello world");
    });

    it("returns an empty string unchanged", () => {
      const container = renderContent("");
      expect(container.textContent).toBe("");
    });
  });

  describe("bold marker **text**", () => {
    it("wraps **text** in a <strong> tag", () => {
      const container = renderContent("Click **Enquire Now** to begin");
      const strong = container.querySelector("strong");
      expect(strong).toBeInTheDocument();
      expect(strong?.textContent).toBe("Enquire Now");
    });

    it("preserves surrounding text outside the bold marker", () => {
      const container = renderContent("Click **Enquire Now** to begin");
      expect(container.textContent).toBe("Click Enquire Now to begin");
    });

    it("handles multiple bold markers in one string", () => {
      const container = renderContent("**Bold one** and **bold two**");
      const strongs = container.querySelectorAll("strong");
      expect(strongs).toHaveLength(2);
      expect(strongs[0].textContent).toBe("Bold one");
      expect(strongs[1].textContent).toBe("bold two");
    });

    it("does not wrap text with a single asterisk", () => {
      const container = renderContent("Not *bold* text");
      expect(container.querySelector("strong")).not.toBeInTheDocument();
      expect(container.textContent).toBe("Not *bold* text");
    });
  });

  describe("link marker [text](href)", () => {
    it("renders a link with the correct href", () => {
      const container = renderContent(
        "Contact [hello@aso-wa.com](mailto:hello@aso-wa.com)",
      );
      const anchor = container.querySelector("a");
      expect(anchor).toBeInTheDocument();
      expect(anchor?.getAttribute("href")).toBe("mailto:hello@aso-wa.com");
    });

    it("renders a link with the correct display text", () => {
      const container = renderContent(
        "Contact [hello@aso-wa.com](mailto:hello@aso-wa.com)",
      );
      const anchor = container.querySelector("a");
      expect(anchor?.textContent).toBe("hello@aso-wa.com");
    });

    it("preserves surrounding text outside the link marker", () => {
      const container = renderContent(
        "Contact [hello@aso-wa.com](mailto:hello@aso-wa.com) for help",
      );
      expect(container.textContent).toBe("Contact hello@aso-wa.com for help");
    });
  });

  describe("combined markers", () => {
    it("handles bold and a link in the same string", () => {
      const container = renderContent(
        "Use **PayPal** or contact [hello@aso-wa.com](mailto:hello@aso-wa.com)",
      );
      expect(container.querySelector("strong")?.textContent).toBe("PayPal");
      expect(container.querySelector("a")?.textContent).toBe(
        "hello@aso-wa.com",
      );
      expect(container.textContent).toBe(
        "Use PayPal or contact hello@aso-wa.com",
      );
    });

    it("handles multiple bold markers alongside a link", () => {
      const container = renderContent(
        "**Damage**: resolve directly. Contact [hello@aso-wa.com](mailto:hello@aso-wa.com) if unresolved",
      );
      const strongs = container.querySelectorAll("strong");
      const anchor = container.querySelector("a");
      expect(strongs).toHaveLength(1);
      expect(strongs[0].textContent).toBe("Damage");
      expect(anchor?.getAttribute("href")).toBe("mailto:hello@aso-wa.com");
    });
  });
});
