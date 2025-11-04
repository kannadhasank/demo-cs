import Footer from './Footer';

export default {
  title: 'Layout/Footer',
  component: Footer,
  parameters: {
    layout: 'fullscreen',
  },
};

export const Default = {
  args: {},
};

export const DarkTheme = {
  decorators: [
    (Story) => {
      document.documentElement.setAttribute('data-theme', 'dark');
      return <Story />;
    },
  ],
};
