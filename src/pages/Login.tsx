import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  useToast,
  Grid,
  GridItem,
  Card,
  CardBody,
  Flex,
  Divider,
  useColorModeValue,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  IconButton
} from '@chakra-ui/react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';

export const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const { setUser } = useAuth();

  // Theme-aware colors
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const cardBg = useColorModeValue('white', 'gray.700');
  const headingColor = useColorModeValue('gray.800', 'white');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const iconBg = useColorModeValue('blue.100', 'blue.900');
  const iconColor = useColorModeValue('blue.600', 'blue.300');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const result = await signInWithEmailAndPassword(auth, email, password);
      setUser(result.user);
      navigate('/form');
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to sign in',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: 'inventory',
      title: 'Order Management',
      description: 'Track customer orders, delivery dates, and pickup schedules'
    },
    {
      icon: 'print',
      title: 'Label Generation',
      description: 'Generate and print professional labels for all orders'
    },
    {
      icon: 'admin_panel_settings',
      title: 'Admin Dashboard',
      description: 'View, edit, and manage all orders from one central location'
    },
    {
      icon: 'security',
      title: 'Secure Access',
      description: 'Protected authentication ensures only authorized users can access'
    }
  ];

  return (
    <Box minH="100vh" bg={bgColor}>
      <Container maxW="container.xl" py={12}>
        <VStack spacing={12}>
          {/* Hero Section */}
          <VStack spacing={6} textAlign="center" maxW="2xl">
            <Heading size="2xl" color={headingColor}>
              Label Generator
            </Heading>
            <Text fontSize="xl" color={textColor} lineHeight="tall">
              Streamline your order management and label printing process with our comprehensive business solution.
            </Text>
          </VStack>

          {/* Features Grid */}
          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={6} w="full">
            {features.map((feature, index) => (
              <GridItem key={index}>
                <Card
                  height="full"
                  shadow="sm"
                  _hover={{ shadow: 'md', transform: 'translateY(-2px)' }}
                  transition="all 0.2s"
                  bg={cardBg}
                >
                  <CardBody textAlign="center" p={6}>
                    <VStack spacing={4}>
                      <Flex
                        align="center"
                        justify="center"
                        w={12}
                        h={12}
                        bg={iconBg}
                        borderRadius="full"
                      >
                        <Box as="span" className="material-icons" color={iconColor} fontSize="24px">
                          {feature.icon}
                        </Box>
                      </Flex>
                      <Heading size="sm" color={headingColor}>
                        {feature.title}
                      </Heading>
                      <Text fontSize="sm" color={textColor} textAlign="center">
                        {feature.description}
                      </Text>
                    </VStack>
                  </CardBody>
                </Card>
              </GridItem>
            ))}
          </Grid>

          <Divider />

          {/* Login Section */}
          <VStack spacing={6} maxW="md" w="full">
            <VStack spacing={3} textAlign="center">
              <Heading size="lg" color={headingColor}>
                Ready to Get Started?
              </Heading>
              <Text color={textColor}>
                Sign in to access the dashboard
              </Text>
            </VStack>

            <form onSubmit={handleLogin} style={{ width: '100%' }}>
              <VStack spacing={4} w="full">
                <FormControl isRequired>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Password</FormLabel>
                  <InputGroup>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                    />
                    <InputRightElement>
                      <IconButton
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        icon={<Box as="span" className="material-icons">{showPassword ? 'visibility_off' : 'visibility'}</Box>}
                        variant="ghost"
                        onClick={() => setShowPassword(!showPassword)}
                      />
                    </InputRightElement>
                  </InputGroup>
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="blue"
                  size="lg"
                  width="full"
                  isLoading={isLoading}
                  leftIcon={<Box as="span" className="material-icons">login</Box>}
                  shadow="md"
                  _hover={{ shadow: 'lg', transform: 'translateY(-1px)' }}
                  transition="all 0.2s"
                >
                  Sign In
                </Button>
              </VStack>
            </form>

            <Text fontSize="sm" color={useColorModeValue('gray.500', 'gray.400')} textAlign="center">
              Secure authentication • Access restricted to authorized users
            </Text>
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
};
