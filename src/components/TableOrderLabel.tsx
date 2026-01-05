import React from 'react';
import { Box, Text, VStack, HStack, Divider } from '@chakra-ui/react';

interface TableOrderLabelProps {
  data: {
    name: string;
    phone: string;
    invoice: string;
    balDue: string;
    size: string;
    tableTopThickness: string;
    legStyle: string;
    wood: string;
    stainColor: string;
    distressing: string;
    sawMarks: boolean;
    handScrapped: boolean;
    breadboardEnds: boolean;
    extensions: boolean;
    otherNotes?: string;
    createdAt: any;
    userEmail?: string;
  };
}

export const TableOrderLabel = ({ data }: TableOrderLabelProps) => {
  const getDistressingDetails = () => {
    if (data.distressing === 'None') return null;
    
    const details = [];
    if (data.sawMarks) details.push('Saw Marks');
    if (data.handScrapped) details.push('Hand-scrapped');
    
    return details.length > 0 ? `${data.distressing}: ${details.join(', ')}` : data.distressing;
  };

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
          TABLE ORDER
        </Text>
        <Divider borderWidth={1} mb={2} />

        {/* Customer Information */}
        <VStack spacing={1} align="stretch">
          <Text fontWeight="bold">
            Customer: {data.name}
          </Text>
          <Text>Phone: {data.phone}</Text>
          <HStack justify="space-between">
            <Text>Invoice #: {data.invoice}</Text>
            <Text>Bal Due: {data.balDue}</Text>
          </HStack>
        </VStack>

        <Divider my={2} />

        {/* Specifications */}
        <VStack spacing={1} align="stretch">
          <Text fontWeight="bold" className='label-header'>
            Specifications
          </Text>
          <Text>Size: {data.size}</Text>
          <Text>Table Top Thickness: {data.tableTopThickness}</Text>
          <Text>Leg Style: {data.legStyle}</Text>
          <Text>Wood: {data.wood}</Text>
        </VStack>

        <Divider my={2} />

        {/* Finish */}
        <VStack spacing={1} align="stretch">
          <Text fontWeight="bold" className='label-header'>
            Finish
          </Text>
          <Text>Stain Color: {data.stainColor}</Text>
          {getDistressingDetails() && (
            <Text>Distressing: {getDistressingDetails()}</Text>
          )}
        </VStack>

        <Divider my={2} />

        {/* Additional Options */}
        <VStack spacing={1} align="stretch">
          <Text fontWeight="bold" className='label-header'>
            Additional Options
          </Text>
          <Text>Breadboard Ends: {data.breadboardEnds ? 'Yes' : 'No'}</Text>
          <Text>Extensions: {data.extensions ? 'Yes' : 'No'}</Text>
        </VStack>

        {data.otherNotes && (
          <>
            <Divider my={2} />
            <Box p={2} borderWidth={1} borderRadius={4} bg="gray.50">
              <Text fontWeight="bold" fontSize="sm" className='label-header'>Other Notes:</Text>
              <Text fontSize="sm">{data.otherNotes}</Text>
            </Box>
          </>
        )}

        <Divider my={2} />

        <VStack spacing={1} align="stretch">
          <Text>Created: {data.createdAt?.toDate?.()?.toLocaleDateString() || new Date().toLocaleDateString()}</Text>
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
