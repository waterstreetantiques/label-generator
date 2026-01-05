import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Input,
  Select,
  Textarea,
  VStack,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { WorkOrderLabel } from '../components/WorkOrderLabel';
import printLabelStyles from '../printLabelStyles';

const initialState = {
  isPurchased: true,
  name: '',
  phone: '',
  invoice: '',
  dateOfPurchase: '',
  estimatedCompletion: '',
  scopeOfWork: '',
  location: '',
  whoShouldRepair: '',
  isPickup: true,
  isDelivery: false,
  deliveryDate: '',
  deliveryLocation: '',
};

const repairPeople = [
  'Tech 1',
  'Tech 2',
  'Tech 3',
  // Add more as needed
];

const locations = [
  'Showroom',
  'Warehouse',
  'Repair Area',
  // Add more as needed
];

const WorkOrderForm = () => {
  const [form, setForm] = useState(initialState);
  const { user } = useAuth();
  const toast = useToast();
  const boxBg = useColorModeValue('white', 'gray.700');
  const headingColor = useColorModeValue('gray.800', 'white');
  const labelRef = useRef<HTMLDivElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let fieldValue: string | boolean = value;
    if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
      fieldValue = e.target.checked;
    }
    setForm((prev) => ({
      ...prev,
      [name]: fieldValue,
    }));
  };

  const handleCheckbox = () => {
    setForm((prev) => ({
      ...initialState,
      isPurchased: !prev.isPurchased,
    }));
  };

  const handleFulfillmentChange = (field: 'isPickup' | 'isDelivery') => {
    setForm((prev) => ({
      ...prev,
      isPickup: field === 'isPickup',
      isDelivery: field === 'isDelivery',
      // Clear delivery fields when switching to pickup
      ...(field === 'isPickup' && { deliveryDate: '', deliveryLocation: '' }),
    }));
  };

  const handlePrint = () => {
    if (!labelRef.current) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast({
        title: 'Error',
        description: 'Please allow popups for this site',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const labelContent = labelRef.current.innerHTML;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print Label</title>
          <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
          <style>
            ${printLabelStyles}
          </style>
        </head>
        <body>
          ${labelContent}
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              };
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'work-orders'), {
        ...form,
        createdAt: new Date(),
        userEmail: user?.email || null,
      });
      toast({
        title: 'Success',
        description: 'Work order submitted',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      handlePrint();
      setForm(initialState);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to submit work order',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="container.lg" py={10}>
      <VStack spacing={8}>
        <Box width="full" p={8} borderWidth={1} borderRadius={8} boxShadow="lg">
          <VStack spacing={4} align="stretch">
            <form onSubmit={handleSubmit}>
              <VStack spacing={6}>
                {/* Work Order Type */}
                <Heading size="md" alignSelf="flex-start">Work Order Type</Heading>
                <FormControl display="flex" alignItems="center">
                  <Checkbox isChecked={form.isPurchased} onChange={handleCheckbox} mr={2}>
                    Purchased Item
                  </Checkbox>
                  <Checkbox isChecked={!form.isPurchased} onChange={handleCheckbox}>
                    Item on the Floor
                  </Checkbox>
                </FormControl>

                <Divider />

                {form.isPurchased ? (
                  <>
                    {/* Customer Information */}
                    <Heading size="md" alignSelf="flex-start">Customer Information</Heading>
                    <HStack spacing={4} width="full">
                      <FormControl isRequired>
                        <FormLabel>Name</FormLabel>
                        <Input name="name" value={form.name} onChange={handleChange} />
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel>Phone #</FormLabel>
                        <Input name="phone" value={form.phone} onChange={handleChange} />
                      </FormControl>
                    </HStack>

                    <HStack spacing={4} width="full">
                      <FormControl isRequired>
                        <FormLabel>Invoice #</FormLabel>
                        <Input name="invoice" value={form.invoice} onChange={handleChange} />
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel>Date of Purchase</FormLabel>
                        <Input type="date" name="dateOfPurchase" value={form.dateOfPurchase} onChange={handleChange} />
                      </FormControl>
                    </HStack>

                    <Divider />

                    {/* Fulfillment Method */}
                    <Heading size="md" alignSelf="flex-start">Fulfillment</Heading>
                    <HStack spacing={8} justify="flex-start">
                      <Checkbox
                        isChecked={form.isPickup}
                        onChange={() => handleFulfillmentChange('isPickup')}
                      >
                        Pick up
                      </Checkbox>
                      <Checkbox
                        isChecked={form.isDelivery}
                        onChange={() => handleFulfillmentChange('isDelivery')}
                      >
                        Delivery
                      </Checkbox>
                    </HStack>

                    {form.isDelivery && (
                      <VStack spacing={4} width="full">
                        <FormControl isRequired>
                          <FormLabel>Date of Delivery</FormLabel>
                          <Input
                            type="date"
                            name="deliveryDate"
                            value={form.deliveryDate}
                            onChange={handleChange}
                          />
                        </FormControl>
                        <FormControl isRequired>
                          <FormLabel>Location of Delivery</FormLabel>
                          <Textarea
                            name="deliveryLocation"
                            value={form.deliveryLocation}
                            onChange={handleChange}
                            placeholder="Enter delivery address"
                          />
                        </FormControl>
                      </VStack>
                    )}

                    <Divider />

                    {/* Work Details */}
                    <Heading size="md" alignSelf="flex-start">Work Details</Heading>
                    <FormControl>
                      <FormLabel>Estimated Date of Completion</FormLabel>
                      <Input type="date" name="estimatedCompletion" value={form.estimatedCompletion} onChange={handleChange} />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>Scope of Work</FormLabel>
                      <Textarea name="scopeOfWork" value={form.scopeOfWork} onChange={handleChange} />
                    </FormControl>
                  </>
                ) : (
                  <>
                    {/* Location Information */}
                    <Heading size="md" alignSelf="flex-start">Location Information</Heading>
                    <HStack spacing={4} width="full">
                      <FormControl isRequired>
                        <FormLabel>Location</FormLabel>
                        <Input name="location" value={form.location} onChange={handleChange} placeholder="Enter location" />
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel>Who Should Repair</FormLabel>
                        <Input name="whoShouldRepair" value={form.whoShouldRepair} onChange={handleChange} placeholder="Enter person name" />
                      </FormControl>
                    </HStack>

                    <Divider />

                    {/* Work Details */}
                    <Heading size="md" alignSelf="flex-start">Work Details</Heading>
                    <FormControl isRequired>
                      <FormLabel>Scope of Work</FormLabel>
                      <Textarea name="scopeOfWork" value={form.scopeOfWork} onChange={handleChange} />
                    </FormControl>
                  </>
                )}

                <Divider />

                <HStack spacing={4} width="full" pt={4}>
                  <Button
                    type="submit"
                    colorScheme="blue"
                    flex={1}
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
          <div ref={labelRef} style={{
            width: '4in',
            height: '6in',
            padding: '0.25in',
            backgroundColor: 'white',
            position: 'relative',
            overflow: 'hidden',
            boxSizing: 'border-box'
          }}>
            <WorkOrderLabel data={{
              id: '',
              isPurchased: form.isPurchased,
              name: form.name,
              phone: form.phone,
              invoice: form.invoice,
              dateOfPurchase: form.dateOfPurchase,
              location: form.location,
              whoShouldRepair: form.whoShouldRepair,
              scopeOfWork: form.scopeOfWork,
              estimatedCompletion: form.estimatedCompletion,
              completed: false,
              createdAt: { toDate: () => new Date() },
              userEmail: user?.email || undefined,
              isPickup: form.isPickup,
              isDelivery: form.isDelivery,
              deliveryDate: form.deliveryDate,
              deliveryLocation: form.deliveryLocation,
            }} />
          </div>
        </div>
      </VStack>
    </Container>
  );
};

export default WorkOrderForm;
