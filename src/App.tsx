import React from 'react';
import { ChakraProvider, Box, Image, Container, HStack, Button, useColorModeValue, VStack } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/Login';
import { ProductForm } from './pages/ProductForm';
import { AdminPage } from './pages/AdminPage';
import { NotFound } from './pages/NotFound';
import { ColorModeToggle } from './components/ColorModeToggle';
import theme from './theme';
import WorkOrderForm from './pages/WorkOrderForm';

const AppHeader = () => {
  const headerBg = useColorModeValue('white', 'gray.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const logoClass = useColorModeValue('logo-light', 'logo-dark');
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <Box bg={headerBg} borderBottom="1px" borderColor={borderColor} shadow="sm">
      <Container maxW="container.xl" py={{ base: 2, md: 4 }}>
        <VStack spacing={{ base: 3, md: 0 }} align="stretch">
          {/* Desktop Layout */}
          <HStack justify="space-between" align="center" display={{ base: 'none', md: 'flex' }}>
            <HStack spacing={4} align="center">
              <Image
                src="/label-generator/logo.png"
                alt="Logo"
                height="50px"
                objectFit="contain"
                className={logoClass}
              />
              {user && (
                <HStack spacing={2}>
                  <Button
                    as={Link}
                    to="/admin"
                    variant={isActive('/admin') ? 'solid' : 'ghost'}
                    colorScheme={isActive('/admin') ? 'blue' : 'gray'}
                    size="sm"
                  >
                    Admin
                  </Button>
                  <Button
                    as={Link}
                    to="/form"
                    variant={isActive('/form') ? 'solid' : 'ghost'}
                    colorScheme={isActive('/form') ? 'blue' : 'gray'}
                    size="sm"
                  >
                    Product Form
                  </Button>
                  <Button
                    as={Link}
                    to="/work-order"
                    variant={isActive('/work-order') ? 'solid' : 'ghost'}
                    colorScheme={isActive('/work-order') ? 'blue' : 'gray'}
                    size="sm"
                  >
                    Work Order
                  </Button>
                </HStack>
              )}
            </HStack>
            <ColorModeToggle />
          </HStack>

          {/* Mobile Layout */}
          <VStack spacing={3} display={{ base: 'flex', md: 'none' }}>
            <HStack justify="space-between" align="center" width="full">
              <Image
                src="/label-generator/logo.png"
                alt="Logo"
                height="40px"
                objectFit="contain"
                className={logoClass}
              />
              <ColorModeToggle />
            </HStack>
            {user && (
              <HStack spacing={1} width="full" justify="center" flexWrap="wrap">
                <Button
                  as={Link}
                  to="/admin"
                  variant={isActive('/admin') ? 'solid' : 'ghost'}
                  colorScheme={isActive('/admin') ? 'blue' : 'gray'}
                  size="xs"
                  fontSize="xs"
                  px={2}
                >
                  Admin
                </Button>
                <Button
                  as={Link}
                  to="/form"
                  variant={isActive('/form') ? 'solid' : 'ghost'}
                  colorScheme={isActive('/form') ? 'blue' : 'gray'}
                  size="xs"
                  fontSize="xs"
                  px={2}
                >
                  Product Form
                </Button>
                <Button
                  as={Link}
                  to="/work-order"
                  variant={isActive('/work-order') ? 'solid' : 'ghost'}
                  colorScheme={isActive('/work-order') ? 'blue' : 'gray'}
                  size="xs"
                  fontSize="xs"
                  px={2}
                >
                  Work Order
                </Button>
              </HStack>
            )}
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
};

function App() {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <Router basename="/label-generator">
          <AppHeader />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/form"
              element={
                <ProtectedRoute>
                  <ProductForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/work-order"
              element={
                <ProtectedRoute>
                  <WorkOrderForm />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/admin" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;
