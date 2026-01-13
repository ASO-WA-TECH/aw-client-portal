import { render, screen } from "@testing-library/react";
import ListingDisplayImage from "./ListingDisplayImage";

describe("ListingDisplayImage", () => {
  const defaultProps = {
    imageUrl: "https://placehold.co/600x600",
    title: "Test Title",
    subtitle: "£ 50.00 GBP",
  };

  it("renders the image with the correct src and alt text", () => {
    render(<ListingDisplayImage {...defaultProps} />);
    const image = screen.getByRole("img", { name: /Test Title/i });
    expect(image).toHaveAttribute("src", defaultProps.imageUrl);
  });

  it("renders the title correctly", () => {
    render(<ListingDisplayImage {...defaultProps} />);
    const titleElement = screen.getByRole("heading", { name: /Test Title/i });
    expect(titleElement).toBeInTheDocument();
  });

  it('renders the subtitle and "Per day" correctly', () => {
    render(<ListingDisplayImage {...defaultProps} />);
    const subtitleElement = screen.getByText(/£ 50.00 GBP/i);
    expect(subtitleElement).toBeInTheDocument();
    const perDayElement = screen.getByText(/Per day/i);
    expect(perDayElement).toBeInTheDocument();
  });
});
