import type { Meta, StoryObj } from "@storybook/react-vite";
import { BackButton } from "./BackButton";

const meta: Meta<typeof BackButton> = {
  title: "Components/BackButton",
  component: BackButton,
  tags: ["autodocs"],
  argTypes: {
    onClick: { action: "clicked" },
    className: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof BackButton>;

export const Primary: Story = {
  args: {
    label: "Primary Button",
  },
};

export const Secondary: Story = {
  args: {
    label: "Secondary Button",
    className: "secondary",
  },
};
