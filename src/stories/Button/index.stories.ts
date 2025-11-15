import type { Meta, StoryObj } from "@storybook/react-vite";
import { userEvent, within } from "@storybook/testing-library";
import { expect } from "@storybook/jest";

import { fn } from "storybook/test";

import Button from ".";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Components/Button",
  component: Button,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {},
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: { handleClick: fn() },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {
    text: "Button",
    color: "emeraldGreen",
    variant: "primary",
    type: "button",
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByTestId("button");

    await userEvent.click(button);

    // This works if `handleClick` is a Jest mock
    expect(args.handleClick).toHaveBeenCalledTimes(1);
  },
};

export const Secondary: Story = {
  args: {
    text: "Button",
    color: "emeraldGreen",
    variant: "secondary",
    type: "button",
  },
};

export const Tertiary: Story = {
  args: {
    text: "Button",
    color: "emeraldGreen",
    variant: "tertiary",
    type: "button",
  },
};

export const Disabled: Story = {
  args: {
    text: "Button",
    color: "emeraldGreen",
    variant: "tertiary",
    isDisabled: true,
    type: "button",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByTestId("button");

    expect(button).toBeDisabled();
  },
};
