import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

// Theme configuration for dark mode
const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: true, // Use system preference
};

// Custom theme
const theme = extendTheme({
  config,
  styles: {
    global: (props) => ({
      body: {
        bg: props.colorMode === 'dark' ? 'gray.800' : 'gray.50',
        color: props.colorMode === 'dark' ? 'white' : 'gray.800',
      },
    }),
  },
});

export default theme; 
