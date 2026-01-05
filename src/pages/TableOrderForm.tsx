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
  useToast,
} from '@chakra-ui/react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { TableOrderLabel } from '../components/TableOrderLabel';
import printLabelStyles from '../printLabelStyles';

const initialState = {
  name: '',
  phone: '',
  invoice: '',
  balDue: '',
  size: '',
  tableTopThickness: '',
  legStyle: '',
  wood: '',
  stainColor: '',
  distressing: 'None',
  sawMarks: false,
  handScrapped: false,
  breadboardEnds: false,
  extensions: false,
  otherNotes: '',
};

const TableOrderForm = () => {
  const [form, setForm] = useState(initialState);
  const { user } = useAuth();
  const toast = useToast();
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

  const handleCheckbox = (name: string, checked: boolean) => {
    setForm((prev) => ({
      ...prev,
      [name]: checked,
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
      await addDoc(collection(db, 'table-orders'), {
        ...form,
        createdAt: new Date(),
        userEmail: user?.email || null,
      });
      toast({
        title: 'Success',
        description: 'Table order submitted',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      handlePrint();
      setForm(initialState);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to submit table order',
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
                    <FormLabel>Invoice</FormLabel>
                    <Input name="invoice" value={form.invoice} onChange={handleChange} />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Bal Due</FormLabel>
                    <Input name="balDue" value={form.balDue} onChange={handleChange} />
                  </FormControl>
                </HStack>

                <Divider />

                {/* Specifications */}
                <Heading size="md" alignSelf="flex-start">Specifications</Heading>
                <HStack spacing={4} width="full">
                  <FormControl isRequired>
                    <FormLabel>Size</FormLabel>
                    <Input name="size" value={form.size} onChange={handleChange} />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Table Top Thickness</FormLabel>
                    <Input name="tableTopThickness" value={form.tableTopThickness} onChange={handleChange} />
                  </FormControl>
                </HStack>

                <HStack spacing={4} width="full">
                  <FormControl isRequired>
                    <FormLabel>Leg Style</FormLabel>
                    <Input name="legStyle" value={form.legStyle} onChange={handleChange} />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Wood</FormLabel>
                    <Input name="wood" value={form.wood} onChange={handleChange} />
                  </FormControl>
                </HStack>

                <Divider />

                {/* Finish */}
                <Heading size="md" alignSelf="flex-start">Finish</Heading>
                <FormControl isRequired>
                  <FormLabel>Stain Color</FormLabel>
                  <Input name="stainColor" value={form.stainColor} onChange={handleChange} />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Distressing</FormLabel>
                  <Select name="distressing" value={form.distressing} onChange={handleChange}>
                    <option value="None">None</option>
                    <option value="Mild">Mild</option>
                    <option value="Medium">Medium</option>
                    <option value="Heavy">Heavy</option>
                  </Select>
                </FormControl>

                {form.distressing !== 'None' && (
                  <VStack spacing={2} align="flex-start" width="full" pl={4}>
                    <Checkbox
                      isChecked={form.sawMarks}
                      onChange={(e) => handleCheckbox('sawMarks', e.target.checked)}
                    >
                      Saw Marks
                    </Checkbox>
                    <Checkbox
                      isChecked={form.handScrapped}
                      onChange={(e) => handleCheckbox('handScrapped', e.target.checked)}
                    >
                      Hand-scrapped
                    </Checkbox>
                  </VStack>
                )}

                <Divider />

                {/* Additional Options */}
                <Heading size="md" alignSelf="flex-start">Additional Options</Heading>
                <VStack spacing={2} align="flex-start" width="full">
                  <FormControl>
                    <HStack>
                      <Checkbox
                        isChecked={form.breadboardEnds}
                        onChange={(e) => handleCheckbox('breadboardEnds', e.target.checked)}
                      >
                        Breadboard Ends
                      </Checkbox>
                    </HStack>
                  </FormControl>
                  <FormControl>
                    <HStack>
                      <Checkbox
                        isChecked={form.extensions}
                        onChange={(e) => handleCheckbox('extensions', e.target.checked)}
                      >
                        Extensions
                      </Checkbox>
                    </HStack>
                  </FormControl>
                </VStack>

                <Divider />

                <FormControl>
                  <FormLabel>Other Notes</FormLabel>
                  <Textarea
                    name="otherNotes"
                    value={form.otherNotes}
                    onChange={handleChange}
                    placeholder="Enter any additional notes (optional)"
                  />
                </FormControl>

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
            <TableOrderLabel data={{
              name: form.name,
              phone: form.phone,
              invoice: form.invoice,
              balDue: form.balDue,
              size: form.size,
              tableTopThickness: form.tableTopThickness,
              legStyle: form.legStyle,
              wood: form.wood,
              stainColor: form.stainColor,
              distressing: form.distressing,
              sawMarks: form.sawMarks,
              handScrapped: form.handScrapped,
              breadboardEnds: form.breadboardEnds,
              extensions: form.extensions,
              otherNotes: form.otherNotes,
              createdAt: { toDate: () => new Date() },
              userEmail: user?.email || undefined,
            }} />
          </div>
        </div>
      </VStack>
    </Container>
  );
};

export default TableOrderForm;
