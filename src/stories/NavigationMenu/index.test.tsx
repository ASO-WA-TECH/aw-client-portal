import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import NavigationMenu from ".";
import * as AuthContext from "../../Services/Auth/AuthContext";

describe("NavigationMenu", () => {
  const mockToggle = jest.fn();

  beforeEach(() => {
    jest.spyOn(AuthContext, "useAuth").mockReturnValue({
      currentUser: null,
      logout: jest.fn(),
      login: jest.fn(),
      signup: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders desktop menu", () => {
    render(
      <MemoryRouter>
        <NavigationMenu toggleDarkMode={mockToggle} darkMode={false} />
      </MemoryRouter>,
    );
    expect(screen.getByTestId("desktop-menu")).toBeInTheDocument();
  });

  test("renders home link", () => {
    render(
      <MemoryRouter>
        <NavigationMenu toggleDarkMode={mockToggle} darkMode={false} />
      </MemoryRouter>,
    );
    expect(screen.getByText(/Home/i)).toBeInTheDocument();
  });
});
