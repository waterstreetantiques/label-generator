import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  useToast,
  Container,
  Textarea,
  HStack,
  Checkbox,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Divider,
} from '@chakra-ui/react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useReactToPrint } from 'react-to-print';
import { Label } from '../components/Label';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../config/firebase';
import { signOut } from 'firebase/auth';

interface ItemPurchased {
  itemNumber: string;
  description: string;
  qty: string;
}

interface ProductData {
  firstName: string;
  lastName: string;
  invoiceNumber: string;
  dateOfPurchase: string;
  isPickup: boolean;
  isDelivery: boolean;
  estimatedPickupDate: string;
  deliveryDate: string;
  deliveryAddress: string;
  itemsPurchased: ItemPurchased[];
}

export const ProductForm = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<ProductData>({
    firstName: 'John',
    lastName: 'Smith',
    invoiceNumber: 'INV-2024-001',
    dateOfPurchase: '2024-01-15',
    isPickup: true,
    isDelivery: false,
    estimatedPickupDate: '2024-01-20',
    deliveryDate: '',
    deliveryAddress: '',
    itemsPurchased: [
      { itemNumber: 'ITM-001', description: 'Wooden Dining Table', qty: '1' },
      { itemNumber: 'ITM-002', description: 'Leather Office Chair', qty: '2' },
      { itemNumber: 'ITM-003', description: 'Steel Bookshelf', qty: '1' }
    ],
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const labelRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => labelRef.current,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await addDoc(collection(db, 'documents'), {
        ...formData,
        createdAt: new Date(),
      });
      toast({
        title: 'Success',
        description: 'Order added successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      handlePrint();
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to add order',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (field: 'isPickup' | 'isDelivery') => {
    setFormData(prev => ({
      ...prev,
      isPickup: field === 'isPickup',
      isDelivery: field === 'isDelivery',
      // Clear opposite fields when switching
      ...(field === 'isPickup' && { deliveryDate: '', deliveryAddress: '' }),
      ...(field === 'isDelivery' && { estimatedPickupDate: '' }),
    }));
  };

  const handleItemChange = (index: number, field: keyof ItemPurchased, value: string) => {
    setFormData(prev => ({
      ...prev,
      itemsPurchased: prev.itemsPurchased.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      itemsPurchased: [...prev.itemsPurchased, { itemNumber: '', description: '', qty: '' }],
    }));
  };

  const removeItem = (index: number) => {
    if (formData.itemsPurchased.length > 1) {
      setFormData(prev => ({
        ...prev,
        itemsPurchased: prev.itemsPurchased.filter((_, i) => i !== index),
      }));
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to sign out',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="container.lg" py={10}>
      <VStack spacing={8}>
        <HStack width="full" justify="space-between">
          <Heading>Label Generator</Heading>
          <Button onClick={handleLogout} leftIcon={<Box as="span" className="material-icons">logout</Box>}>
            Sign Out
          </Button>
        </HStack>
        <Box width="full" p={8} borderWidth={1} borderRadius={8} boxShadow="lg">
          <VStack spacing={4} align="stretch">
            <form onSubmit={handleSubmit}>
              <VStack spacing={6}>
                {/* Customer Information */}
                <Heading size="md" alignSelf="flex-start">Customer Information</Heading>
                <HStack spacing={4} width="full">
                  <FormControl isRequired>
                    <FormLabel>First Name</FormLabel>
                    <Input
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Last Name</FormLabel>
                    <Input
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                  </FormControl>
                </HStack>

                <HStack spacing={4} width="full">
                  <FormControl isRequired>
                    <FormLabel>Invoice #</FormLabel>
                    <Input
                      name="invoiceNumber"
                      value={formData.invoiceNumber}
                      onChange={handleChange}
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Date of Purchase</FormLabel>
                    <Input
                      name="dateOfPurchase"
                      type="date"
                      value={formData.dateOfPurchase}
                      onChange={handleChange}
                    />
                  </FormControl>
                </HStack>

                <Divider />

                {/* Fulfillment Method */}
                <Heading size="md" alignSelf="flex-start">Fulfillment Method</Heading>
                <HStack spacing={8}>
                  <Checkbox
                    isChecked={formData.isPickup}
                    onChange={() => handleCheckboxChange('isPickup')}
                  >
                    Pick Up
                  </Checkbox>
                  <Checkbox
                    isChecked={formData.isDelivery}
                    onChange={() => handleCheckboxChange('isDelivery')}
                  >
                    Delivery
                  </Checkbox>
                </HStack>

                {formData.isPickup && (
                  <FormControl isRequired>
                    <FormLabel>Estimated Pick Up Date</FormLabel>
                    <Input
                      name="estimatedPickupDate"
                      type="date"
                      value={formData.estimatedPickupDate}
                      onChange={handleChange}
                    />
                  </FormControl>
                )}

                {formData.isDelivery && (
                  <VStack spacing={4} width="full">
                    <FormControl isRequired>
                      <FormLabel>Delivery Date</FormLabel>
                      <Input
                        name="deliveryDate"
                        type="date"
                        value={formData.deliveryDate}
                        onChange={handleChange}
                      />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>Delivery Address</FormLabel>
                      <Textarea
                        name="deliveryAddress"
                        value={formData.deliveryAddress}
                        onChange={handleChange}
                        placeholder="Enter full delivery address"
                      />
                    </FormControl>
                  </VStack>
                )}

                <Divider />

                {/* Items Purchased */}
                <VStack spacing={4} width="full">
                  <HStack width="full" justify="space-between">
                    <Heading size="md">Items Purchased</Heading>
                    <Button onClick={addItem} size="sm" colorScheme="blue">
                      Add Item
                    </Button>
                  </HStack>

                  <Table variant="simple" size="sm">
                    <Thead>
                      <Tr>
                        <Th>Item Number</Th>
                        <Th>Description</Th>
                        <Th>Qty</Th>
                        <Th width="50px">Action</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {formData.itemsPurchased.map((item, index) => (
                        <Tr key={index}>
                          <Td>
                            <Input
                              size="sm"
                              value={item.itemNumber}
                              onChange={(e) => handleItemChange(index, 'itemNumber', e.target.value)}
                              placeholder="Item #"
                            />
                          </Td>
                          <Td>
                            <Input
                              size="sm"
                              value={item.description}
                              onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                              placeholder="Description"
                            />
                          </Td>
                          <Td>
                            <Input
                              size="sm"
                              type="number"
                              value={item.qty}
                              onChange={(e) => handleItemChange(index, 'qty', e.target.value)}
                              placeholder="Qty"
                              width="80px"
                            />
                          </Td>
                          <Td>
                            <IconButton
                              aria-label="Remove item"
                              icon={<Box as="span" className="material-icons">delete</Box>}
                              size="sm"
                              colorScheme="red"
                              variant="ghost"
                              onClick={() => removeItem(index)}
                              isDisabled={formData.itemsPurchased.length === 1}
                            />
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </VStack>

                <Divider />

                <HStack spacing={4} width="full" pt={4}>
                  <Button
                    type="submit"
                    colorScheme="blue"
                    flex={1}
                    isLoading={loading}
                  >
                    Save & Print
                  </Button>
                  <Button
                    onClick={handlePrint}
                    colorScheme="green"
                    flex={1}
                  >
                    Print Label
                  </Button>
                </HStack>
              </VStack>
            </form>
          </VStack>
        </Box>
        <div style={{ display: 'none' }}>
          <div ref={labelRef}>
            <Label data={formData} />
          </div>
        </div>
      </VStack>
    </Container>
  );
};
