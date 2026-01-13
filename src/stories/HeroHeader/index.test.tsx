import { render } from "@testing-library/react";
import HeroHeader from ".";

describe("HeroHeader component", () => {
  it("renders with login class", () => {
    const { container } = render(<HeroHeader pageType="login" />);
    expect(container.firstChild).toHaveClass(
      "hero-header",
      "hero-header--login"
    );
  });

  it("renders with register class", () => {
    const { container } = render(<HeroHeader pageType="register" />);
    expect(container.firstChild).toHaveClass(
      "hero-header",
      "hero-header--register"
    );
  });
});
