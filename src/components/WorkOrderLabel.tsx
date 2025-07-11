import React from 'react';
import { Box, Text, VStack, HStack, Divider, Badge } from '@chakra-ui/react';

interface WorkOrderLabelProps {
  data: {
    id: string;
    isPurchased: boolean;
    name?: string;
    phone?: string;
    invoice?: string;
    dateOfPurchase?: string;
    location?: string;
    whoShouldRepair?: string;
    scopeOfWork: string;
    estimatedCompletion?: string;
    completed: boolean;
    completedAt?: any;
    createdAt: any;
    userEmail?: string;
  };
}

export const WorkOrderLabel = ({ data }: WorkOrderLabelProps) => {
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
          WORK ORDER
        </Text>
        <Divider borderWidth={1} mb={2} />

        {/* Work Order Type and Status */}
        <HStack justify="space-between">
          <Badge colorScheme={data.isPurchased ? 'blue' : 'orange'} size="lg">
            {data.isPurchased ? 'Purchased Item' : 'Floor Item'}
          </Badge>
          <Badge colorScheme={data.completed ? 'green' : 'yellow'} size="lg">
            {data.completed ? 'Completed' : 'Pending'}
          </Badge>
        </HStack>

        <Divider my={2} />

        {/* Customer/Location Information */}
        <VStack spacing={1} align="stretch">
          {data.isPurchased ? (
            <>
              <Text fontWeight="bold">
                Customer: {data.name}
              </Text>
              {data.phone && (
                <Text>Phone: {data.phone}</Text>
              )}
              <HStack justify="space-between">
                <Text>Invoice #: {data.invoice}</Text>
                <Text>Date: {data.dateOfPurchase}</Text>
              </HStack>
            </>
          ) : (
            <>
              <Text fontWeight="bold">
                Location: {data.location}
              </Text>
              {data.whoShouldRepair && (
                <Text>Repair By: {data.whoShouldRepair}</Text>
              )}
            </>
          )}
        </VStack>

        <Divider my={2} />

        {/* Scope of Work */}
        <VStack spacing={1} align="stretch" flex={1}>
          <Text fontWeight="bold" className='label-header'>
            Scope of Work
          </Text>
          <Box p={2} borderWidth={1} borderRadius={4} bg="gray.50" minH="60px">
            <Text fontSize="sm">{data.scopeOfWork}</Text>
          </Box>
        </VStack>

        {/* Dates */}
        <VStack spacing={1} align="stretch">
          {data.estimatedCompletion && (
            <Text>Estimated Completion: {data.estimatedCompletion}</Text>
          )}
          {data.completed && data.completedAt && (
            <Text>Completed: {data.completedAt?.toDate?.()?.toLocaleDateString() || 'N/A'}</Text>
          )}
          <Text>Created: {data.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A'}</Text>
        </VStack>

        {data.userEmail && (
          <>
            <Divider my={2} />
            <VStack spacing={1} align="stretch">
              <Text color="gray.600" className='label-small'>
                Created by
              </Text>
              <Text color="gray.600" className='label-small'>{data.userEmail}</Text>
            </VStack>
          </>
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
