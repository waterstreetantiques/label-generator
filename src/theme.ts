import { extendTheme, type ThemeConfig } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

// Theme configuration for dark mode with localStorage persistence
const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false, // Set to false to allow manual persistence
};

// Custom theme
const theme = extendTheme({
  config,
  styles: {
    global: (props) => ({
      body: {
        bg: mode('gray.50', 'gray.800')(props),
        color: mode('gray.800', 'white')(props),
      },
    }),
  },
});

export default theme; 
