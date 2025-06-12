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
    userEmail?: string;
  };
}

export const Label = ({ data }: LabelProps) => {
  return (
    <Box
      p={4}
      borderWidth={2}
      borderRadius={8}
      width="4in"
      height="6in"
      position="relative"
      bg="white"
      color="black"
      fontSize="12px"
      lineHeight="1.2"
      fontFamily="Arial, sans-serif"
      style={{
        pageBreakAfter: 'always',
        pageBreakInside: 'avoid',
        breakAfter: 'page',
        breakInside: 'avoid',
      }}
    >
      <VStack spacing={2} align="stretch" height="100%">
        {/* Header */}
        <Text fontSize="16px" fontWeight="bold" textAlign="center" mb={1}>
          ORDER LABEL
        </Text>
        <Divider borderWidth={1} mb={2} />

        {/* Customer Information */}
        <VStack spacing={1} align="stretch">
          <Text fontWeight="bold">
            Customer: {data.firstName} {data.lastName}
          </Text>
          <HStack justify="space-between">
            <Text>Invoice #: {data.invoiceNumber}</Text>
            <Text>Date: {data.dateOfPurchase}</Text>
          </HStack>
          {data.userEmail && (
            <Text fontSize="10px" color="gray.600">
              Created by: {data.userEmail}
            </Text>
          )}
        </VStack>

        <Divider my={2} />

        {/* Fulfillment Details */}
        <VStack spacing={1} align="stretch">
          <Text fontWeight="bold">
            {data.isPickup ? 'PICKUP' : 'DELIVERY'}
          </Text>
          {data.isPickup && data.estimatedPickupDate && (
            <Text>Estimated Pickup: {data.estimatedPickupDate}</Text>
          )}
          {data.isDelivery && (
            <>
              {data.deliveryDate && (
                <Text>Delivery Date: {data.deliveryDate}</Text>
              )}
              {data.deliveryAddress && (
                <Text fontSize="10px">Address: {data.deliveryAddress}</Text>
              )}
            </>
          )}
        </VStack>

        <Divider my={2} />

        {/* Items Purchased */}
        <VStack spacing={1} align="stretch" flex={1}>
          <Text fontWeight="bold">Items Purchased:</Text>
          <Table size="sm" variant="simple">
            <Thead>
              <Tr>
                <Th p={1} fontSize="10px">Item #</Th>
                <Th p={1} fontSize="10px">Description</Th>
                <Th p={1} fontSize="10px" textAlign="right">Qty</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.itemsPurchased?.map((item, index) => (
                <Tr key={index}>
                  <Td p={1} fontSize="10px">{item.itemNumber}</Td>
                  <Td p={1} fontSize="10px">{item.description}</Td>
                  <Td p={1} fontSize="10px" textAlign="right">{item.qty}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </VStack>

        <Box position="absolute" bottom={2} left={2} right={2}>
          <Text fontSize="10px" textAlign="center" color="gray.600">
            Generated: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
          </Text>
        </Box>
      </VStack>
    </Box>
  );
};
