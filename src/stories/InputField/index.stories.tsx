import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { InputField } from ".";
import type { InputFieldProps } from ".";

const meta: Meta<typeof InputField> = {
  title: "Components/InputField",
  component: InputField,
  tags: ["autodocs"],
  argTypes: {
    value: { control: "text" },
    handleChange: { action: "changed" },
    label: { control: "text" },
    placeholder: { control: "text" },
    isReadOnly: { control: "boolean" },
    darkMode: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof InputField>;

const Template = (args: InputFieldProps) => {
  const [value, setValue] = useState(args.value || "");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    args.handleChange?.(event);
  };

  return (
    <InputField {...args} value={value} handleChange={handleInputChange} />
  );
};

export const Default: Story = {
  render: Template,
  args: {
    value: "",
    label: "Title",
    placeholder: "name of the outfit.",
    isReadOnly: false,
  },
};

export const Filled: Story = {
  render: Template,
  args: {
    ...Default.args,
    value: "Yoruba Agbada",
  },
};

export const ReadOnly: Story = {
  render: Template,
  args: {
    ...Filled.args,
    isReadOnly: true,
  },
};

export const WithValidation: Story = {
  render: () => {
    const [value, setValue] = useState("");
    const [error, setError] = useState<string | null>(null);

    const validate = (val: string) => {
      if (!val) return "This field is required";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val))
        return console.log("working");
      return null;
    };

    return (
      <InputField
        label="Email"
        value={value}
        handleChange={(e) => {
          setValue(e.target.value);
          setError(null);
        }}
        onBlur={() => setError(validate(value))}
        placeholder="Enter your email"
        required
        errorMessage={error}
        type="text"
      />
    );
  },
};
