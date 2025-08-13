import { render, screen, fireEvent } from "@testing-library/react";
import { BackButton } from "./BackButton";

describe("BackButton", () => {
  it("renders without crashing", () => {
    render(<BackButton />);
    const button = screen.getByRole("button", { name: /back/i });
    expect(button).toBeInTheDocument();
  });

  it("has the default class 'back-button'", () => {
    render(<BackButton />);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("back-button");
  });

  it("appends extra className if provided", () => {
    render(<BackButton className="secondary" />);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("back-button");
  });

  it("calls onClick handler when clicked", () => {
    const onClickMock = jest.fn();
    render(<BackButton onClick={onClickMock} />);
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(onClickMock).toHaveBeenCalledTimes(1);
  });

  it("has correct aria-label attribute", () => {
    render(<BackButton />);
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-label", "Back");
  });
});
