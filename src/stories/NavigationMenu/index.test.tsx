import { render, screen, fireEvent } from "@testing-library/react";
import NavigationMenu from ".";

describe("NavigationMenu", () => {
  const mockToggle = jest.fn();

  // test("snapshot", () => {
  //   const { container } = render(
  //     <NavigationMenu toggleDarkMode={mockToggle} darkMode={false} />
  //   );
  //   expect(container).toMatchSnapshot();
  // });

  test("renders desktop menu", () => {
    render(<NavigationMenu toggleDarkMode={mockToggle} darkMode={false} />);
    expect(screen.getByTestId("desktop-menu")).toBeInTheDocument();
  });

  test("renders hamburger button", () => {
    render(<NavigationMenu toggleDarkMode={mockToggle} darkMode={false} />);
    expect(screen.getByTestId("menu-button")).toBeInTheDocument();
  });

  test("shows mobile menu after hamburger is clicked", () => {
    render(<NavigationMenu toggleDarkMode={mockToggle} darkMode={false} />);
    const hamburgerButton = screen.getByTestId("menu-button");

    fireEvent.click(hamburgerButton);

    expect(screen.getByTestId("mobile-menu")).toBeInTheDocument();
  });

  test('closes mobile menu when "X" is clicked inside it', () => {
    render(<NavigationMenu toggleDarkMode={mockToggle} darkMode={false} />);

    // Open the menu
    fireEvent.click(screen.getByTestId("menu-button"));
    expect(screen.getByTestId("mobile-menu")).toBeInTheDocument();

    // Click the close button (labeled X)
    const closeButton = screen.getByText("X");
    fireEvent.click(closeButton);

    // Mobile menu should now be gone
    expect(screen.queryByTestId("mobile-menu")).not.toBeInTheDocument();
  });

  // test("calls toggleDarkMode when dark mode button is clicked", () => {
  //   render(<NavigationMenu toggleDarkMode={mockToggle} darkMode={false} />);

  //   const toggleBtn = screen.getByText(/Toggle Theme/i);
  //   fireEvent.click(toggleBtn);

  //   expect(mockToggle).toHaveBeenCalledTimes(1);
  // });
});
