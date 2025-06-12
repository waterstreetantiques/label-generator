import React from 'react';
import { Box, Text, VStack, HStack, Divider, Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';

interface ItemPurchased {
  itemNumber: string;
  description: string;
  qty: string;
}

interface LabelProps {
  data: {
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
  };
}

export const Label = ({ data }: LabelProps) => {
  return (
    <Box
      p={3}
      borderWidth={2}
      borderRadius={8}
      width="4in"
      height="6in"
      position="relative"
      bg="white"
    >
      <VStack spacing={2} align="stretch">
        {/* Header */}
        <Text fontSize="xl" fontWeight="bold" textAlign="center">
          ORDER LABEL
        </Text>
        <Divider borderWidth={1} />

        {/* Customer Information */}
        <VStack spacing={1} align="stretch">
          <Text fontSize="md" fontWeight="bold">
            Customer: {data.firstName} {data.lastName}
          </Text>
          <HStack justify="space-between">
            <Text fontSize="sm">Invoice #: {data.invoiceNumber}</Text>
            <Text fontSize="sm">Date: {data.dateOfPurchase}</Text>
          </HStack>
        </VStack>

        <Divider />

        {/* Fulfillment Details */}
        <VStack spacing={1} align="stretch">
          <Text fontSize="md" fontWeight="bold">
            {data.isPickup ? 'PICKUP' : 'DELIVERY'}
          </Text>
          {data.isPickup && data.estimatedPickupDate && (
            <Text fontSize="sm">Estimated Pickup: {data.estimatedPickupDate}</Text>
          )}
          {data.isDelivery && (
            <>
              {data.deliveryDate && (
                <Text fontSize="sm">Delivery Date: {data.deliveryDate}</Text>
              )}
              {data.deliveryAddress && (
                <Text fontSize="xs">Address: {data.deliveryAddress}</Text>
              )}
            </>
          )}
        </VStack>

        <Divider />

        {/* Items Purchased */}
        <VStack spacing={1} align="stretch">
          <Text fontSize="md" fontWeight="bold">Items Purchased:</Text>
          <Table size="sm" variant="simple">
            <Thead>
              <Tr>
                <Th p={1} fontSize="2xs">Item #</Th>
                <Th p={1} fontSize="2xs">Description</Th>
                <Th p={1} fontSize="2xs" textAlign="right">Qty</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.itemsPurchased?.map((item, index) => (
                <Tr key={index}>
                  <Td p={1} fontSize="2xs">{item.itemNumber}</Td>
                  <Td p={1} fontSize="2xs">{item.description}</Td>
                  <Td p={1} fontSize="2xs" textAlign="right">{item.qty}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </VStack>

        <Box position="absolute" bottom={2} left={2} right={2}>
          <Text fontSize="2xs" textAlign="center" color="gray.600">
            Generated: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
          </Text>
        </Box>
      </VStack>
    </Box>
  );
};
