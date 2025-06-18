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
    notes?: string;
  };
}

export const Label = ({ data }: LabelProps) => {
  return (
    <Box
      p={4}
      borderWidth={2}
      borderRadius={8}
      position="relative"
      bg="white"
      color="black"
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
        <Text fontWeight="bold" textAlign="center" mb={1} className='label-header'>
          ORDER LABEL
        </Text>
        <Divider borderWidth={1} mb={2} />

        {/* Customer Information */}
        <VStack spacing={1} align="stretch">
          <Text fontWeight="bold">
            Customer: {data.firstName} {data.lastName}
          </Text>
          <HStack justify="space-between">
            <Text>Date: {data.dateOfPurchase}</Text>
            <Text>Invoice #: {data.invoiceNumber}</Text>
          </HStack>
          {data.userEmail && (
            <>
              <Text color="gray.600" className='label-small'>
                Created by
              </Text>
              <Text color="gray.600" className='label-small'>{data.userEmail}</Text>
            </>
          )}
        </VStack>

        <Divider my={2} />

        {/* Fulfillment Details */}
        <VStack spacing={1} align="stretch">
          <Text fontWeight="bold" className='label-header'>
            {data.isPickup ? 'Pickup' : 'Delivery'}
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
                <>
                  <Text className='label-header'>Address</Text>
                  <Text>{data.deliveryAddress}</Text>
                </>
              )}
            </>
          )}
        </VStack>

        <Divider my={2} />

        {/* Items Purchased */}
        <VStack spacing={1} align="stretch" flex={1}>
          <Table size="sm" variant="simple">
            <Thead>
              <Tr>
                <Th p={1}>Item #</Th>
                <Th p={1}>Description</Th>
                <Th p={1} textAlign="right">Qty</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.itemsPurchased?.map((item, index) => (
                <Tr key={index}>
                  <Td p={1}>{item.itemNumber}</Td>
                  <Td p={1}>{item.description}</Td>
                  <Td p={1} textAlign="right">{item.qty}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </VStack>
        {data.notes && (
          <Box mt={2} p={2} borderWidth={1} borderRadius={4} bg="gray.50">
            <Text fontWeight="bold" fontSize="sm" className='label-header'>Notes:</Text>
            <Text fontSize="sm">{data.notes}</Text>
          </Box>
        )}

        <Box position="absolute" bottom={2} left={2} right={2}>
          <Text textAlign="left" color="gray.600" className='label-small'>
            Generated: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
          </Text>
        </Box>
      </VStack>
    </Box>
  );
};
