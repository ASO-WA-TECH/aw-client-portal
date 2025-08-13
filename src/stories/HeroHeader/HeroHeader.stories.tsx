import type { StoryFn } from "@storybook/react-vite";
import HeroHeader from "./HeroHeader";

export default {
  title: "Components/HeroHeader",
  component: HeroHeader,
  parameters: {
    layout: "fullscreen",
  },

  argTypes: {
    pageType: {
      control: { type: "select" },
      options: ["login", "register"],
    },
  },
};

interface HeroHeaderProps {
  pageType: "login" | "register";
}

const Template: StoryFn<HeroHeaderProps> = (args) => <HeroHeader {...args} />;

export const LoginPage = Template.bind({});
LoginPage.args = {
  pageType: "login",
};

export const RegisterPage = Template.bind({});
RegisterPage.args = {
  pageType: "register",
};
