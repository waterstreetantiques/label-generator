import React from 'react';
import { ChakraProvider, Box, Image, Container, HStack, useColorModeValue } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/Login';
import { ProductForm } from './pages/ProductForm';
import { AdminPage } from './pages/AdminPage';
import { NotFound } from './pages/NotFound';
import { ColorModeToggle } from './components/ColorModeToggle';
import theme from './theme';

const AppHeader = () => {
  const headerBg = useColorModeValue('white', 'gray.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const logoClass = useColorModeValue('logo-light', 'logo-dark');
  
  return (
    <Box bg={headerBg} borderBottom="1px" borderColor={borderColor} shadow="sm">
      <Container maxW="container.xl" py={4}>
        <HStack justify="space-between" align="center">
          <HStack spacing={4} align="center">
            <Image 
              src="/label-generator/logo.png" 
              alt="Logo" 
              height="50px"
              objectFit="contain"
              className={logoClass}
            />
          </HStack>
          <ColorModeToggle />
        </HStack>
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
            <Route path="/" element={<Navigate to="/admin" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;
