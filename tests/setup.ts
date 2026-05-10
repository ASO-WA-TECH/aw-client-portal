import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import "@testing-library/jest-dom/vitest";

vi.mock("../src/Services/Auth/firebase", () => ({
  auth: {
    currentUser: null,
    onAuthStateChanged: vi.fn(),
  },
  default: {},
}));

vi.mock("../src/Services/Auth/AuthContext", () => ({
  useAuth: () => ({
    currentUser: null,
    login: vi.fn(),
    logout: vi.fn(),
    signup: vi.fn(),
  }),
}));

globalThis.jest = vi;

afterEach(() => {
  cleanup();
});
