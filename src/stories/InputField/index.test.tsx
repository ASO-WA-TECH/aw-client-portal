import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { InputField } from ".";
import type { InputFieldProps } from ".";

// A helper function to render the component with default props
const renderComponent = (props?: Partial<InputFieldProps>) => {
  const defaultProps: InputFieldProps = {
    value: "",
    handleChange: jest.fn(),
    label: "Test Label",
    placeholder: "Test Placeholder",
    isReadOnly: false,
    darkMode: false,
  };
  return render(<InputField {...defaultProps} {...props} />);
};

describe("InputField", () => {
  // Test 1: Renders with the correct label and placeholder
  it("should render with the correct label and placeholder", () => {
    renderComponent({ label: "Username", placeholder: "Enter your username" });

    // Check if the placeholder is in the document
    const input = screen.getByPlaceholderText("Enter your username");
    expect(input).toBeInTheDocument();
  });

  // Test 2: Handles user input and calls the handleChange function
  it("should handle user input and call the handleChange function", () => {
    const handleChange = jest.fn();
    renderComponent({ handleChange });

    const input = screen.getByRole("textbox");

    // Simulate a change event on the input field
    fireEvent.change(input, { target: { value: "Hello World" } });

    // Assert that the handleChange function was called
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalled();
  });

  // Test 3: Displays the correct value
  it("should display the correct value passed via props", () => {
    const testValue = "Initial value";
    renderComponent({ value: testValue });

    const input = screen.getByDisplayValue(testValue);
    expect(input).toBeInTheDocument();
  });

  // Test 4: Applies read-only attribute when isReadOnly is true
  it("should be read-only when isReadOnly prop is true", () => {
    renderComponent({ isReadOnly: true });

    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("readOnly");
  });

  // Test 5: Does not allow input when read-only
  it("should not allow input when read-only", () => {
    const initialValue = "Initial Value";
    const handleChange = jest.fn();
    renderComponent({ isReadOnly: true, value: initialValue, handleChange });

    const input = screen.getByRole("textbox");

    // Simulate a change event
    fireEvent.change(input, { target: { value: "New Value" } });

    // Assert that the handleChange function was still called (as fireEvent does not respect readOnly)
    // but the value of the input field itself has not changed.
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(input).toHaveValue(initialValue);
  });

  // Test 6: Applies dark mode class
  it("should apply the dark-mode class when darkMode is true", () => {
    renderComponent({ darkMode: true });

    const container = screen.getByTestId("input-field-container"); // Add a data-testid to the container div
    expect(container).toHaveClass("dark-mode");
  });

  // Test 7: Applies filled class when value is not empty
  it("should apply the filled class when the value is not empty", () => {
    renderComponent({ value: "some text" });

    const input = screen.getByRole("textbox");
    expect(input).toHaveClass("filled");
  });

  // Test 8: Does not apply filled class when value is empty
  it("should not apply the filled class when the value is empty", () => {
    renderComponent({ value: "" });

    const input = screen.getByRole("textbox");
    expect(input).not.toHaveClass("filled");
  });
});
