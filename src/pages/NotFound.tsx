import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
} from '@chakra-ui/react';

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container maxW="container.md" py={20}>
      <VStack spacing={8} textAlign="center">
        <Box>
          <Heading size="4xl" color="gray.300">
            404
          </Heading>
          <Heading size="lg" mt={4}>
            Page Not Found
          </Heading>
          <Text fontSize="lg" color="gray.600" mt={4}>
            The page you're looking for doesn't exist or has been moved.
          </Text>
        </Box>

        <HStack spacing={4}>
          <Button onClick={() => navigate('/')} colorScheme="blue" size="lg">
            Go to Dashboard
          </Button>
          <Button onClick={() => navigate('/form')} colorScheme="gray" size="lg">
            Create Order
          </Button>
        </HStack>
      </VStack>
    </Container>
  );
};
