import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, Heading, Text, VStack, useToast } from '@chakra-ui/react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';

export const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const { setUser } = useAuth();

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      navigate('/form');
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to sign in with Google',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxW="container.sm" py={10}>
      <VStack spacing={8}>
        <Heading>Label Generator</Heading>
        <Button
          colorScheme="blue"
          size="lg"
          width="full"
          onClick={handleGoogleLogin}
          isLoading={isLoading}
          leftIcon={<Box as="span" className="material-icons">login</Box>}
        >
          Sign in with Google
        </Button>
      </VStack>
    </Container>
  );
};
