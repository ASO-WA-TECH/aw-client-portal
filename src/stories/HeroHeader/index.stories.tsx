import type { StoryFn } from "@storybook/react-vite";
import HeroHeader from ".";

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
  pageType: "authenticate";
}

const Template: StoryFn<HeroHeaderProps> = (args) => <HeroHeader {...args} />;

export const AuthenticationPage = Template.bind({});
AuthenticationPage.args = {
  pageType: "authenticate",
};
