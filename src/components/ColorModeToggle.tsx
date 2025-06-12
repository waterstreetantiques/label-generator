import React from 'react';
import { IconButton, useColorMode, useColorModeValue, Box } from '@chakra-ui/react';

export const ColorModeToggle: React.FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const icon = useColorModeValue('dark_mode', 'light_mode');

  return (
    <IconButton
      aria-label={`Switch to ${colorMode === 'light' ? 'dark' : 'light'} mode`}
      icon={<Box as="span" className="material-icons">{icon}</Box>}
      onClick={toggleColorMode}
      variant="ghost"
      size="md"
    />
  );
}; 
