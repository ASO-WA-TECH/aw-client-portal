import { render, screen } from "@testing-library/react";
import ListingDisplayImage from "./ListingDisplayImage";

describe("ListingDisplayImage", () => {
  const defaultProps = {
    imageUrl: "https://placehold.co/600x600",
    title: "Test Title",
    subtitle: "50.00",
    listingId: "12345",
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

  it('renders the price and "Per day" correctly', () => {
    render(<ListingDisplayImage {...defaultProps} />);

    const subtitleElement = screen.getByText(/50.00 GBP/i);
    expect(subtitleElement).toBeInTheDocument();

    const perDayElement = screen.getByText(/Per day/i);
    expect(perDayElement).toBeInTheDocument();
  });

  it("renders the correct link URL using the listingId", () => {
    render(<ListingDisplayImage {...defaultProps} />);
    const linkElement = screen.getByRole("link");
    expect(linkElement).toHaveAttribute("href", "listing/12345");
  });
});
