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
          <Text>
            <Text as="span" fontWeight="bold" style={{ fontWeight: 'bold' }} className="label-bold">Customer:</Text> {data.name}
          </Text>
          <Text>
            <Text as="span" fontWeight="bold" style={{ fontWeight: 'bold' }} className="label-bold">Phone:</Text> {data.phone}
          </Text>
          <HStack justify="space-between">
            <Text>
              <Text as="span" fontWeight="bold" style={{ fontWeight: 'bold' }} className="label-bold">Invoice #:</Text> {data.invoice}
            </Text>
            <Text>
              <Text as="span" fontWeight="bold" style={{ fontWeight: 'bold' }} className="label-bold">Bal Due:</Text> {data.balDue}
            </Text>
          </HStack>
        </VStack>

        <Divider my={2} />

        {/* Specifications */}
        <VStack spacing={1} align="stretch">
          <Text fontWeight="bold" className='label-header'>
            Specifications
          </Text>
          <Text>
            <Text as="span" fontWeight="bold" style={{ fontWeight: 'bold' }} className="label-bold">Size:</Text> {data.size}
          </Text>
          <Text>
            <Text as="span" fontWeight="bold" style={{ fontWeight: 'bold' }} className="label-bold">Table Top Thickness:</Text> {data.tableTopThickness}
          </Text>
          <Text>
            <Text as="span" fontWeight="bold" style={{ fontWeight: 'bold' }} className="label-bold">Leg Style:</Text> {data.legStyle}
          </Text>
          <Text>
            <Text as="span" fontWeight="bold" style={{ fontWeight: 'bold' }} className="label-bold">Wood:</Text> {data.wood}
          </Text>
        </VStack>

        <Divider my={2} />

        {/* Finish */}
        <VStack spacing={1} align="stretch">
          <Text fontWeight="bold" className='label-header'>
            Finish
          </Text>
          <Text>
            <Text as="span" fontWeight="bold" style={{ fontWeight: 'bold' }} className="label-bold">Stain Color:</Text> {data.stainColor}
          </Text>
          {getDistressingDetails() && (
            <Text>
              <Text as="span" fontWeight="bold" style={{ fontWeight: 'bold' }} className="label-bold">Distressing:</Text> {getDistressingDetails()}
            </Text>
          )}
        </VStack>

        <Divider my={2} />

        {/* Additional Options */}
        <VStack spacing={1} align="stretch">
          <Text fontWeight="bold" className='label-header'>
            Additional Options
          </Text>
          <Text>
            <Text as="span" fontWeight="bold" style={{ fontWeight: 'bold' }} className="label-bold">Breadboard Ends:</Text> {data.breadboardEnds ? 'Yes' : 'No'}
          </Text>
          <Text>
            <Text as="span" fontWeight="bold" style={{ fontWeight: 'bold' }} className="label-bold">Extensions:</Text> {data.extensions ? 'Yes' : 'No'}
          </Text>
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

        {/* Signature Areas */}
        <VStack spacing={3} align="stretch" mt={data.otherNotes ? 2 : 0}>
          {/* QC Sign Off */}
          <Box>
            <Text fontWeight="bold" fontSize="sm" mb={1} style={{ fontWeight: 'bold' }} className="label-bold">QC Sign Off:</Text>
            <Box 
              borderBottomWidth={1} 
              borderColor="black" 
              pb={0.5} 
              mb={1} 
              minH="20px"
              style={{ borderBottom: '1px solid black' }}
            >
              {/* Signature line */}
            </Box>
          </Box>

          {/* Ready for Customer */}
          <Box>
            <Text fontWeight="bold" fontSize="sm" mb={1} style={{ fontWeight: 'bold' }} className="label-bold">Ready for Customer:</Text>
            <Box 
              borderBottomWidth={1} 
              borderColor="black" 
              pb={0.5} 
              mb={1} 
              minH="20px"
              style={{ borderBottom: '1px solid black' }}
            >
              {/* Signature line */}
            </Box>
          </Box>
        </VStack>

        <Divider my={2} />

        <VStack spacing={1} align="stretch">
          <Text>
            <Text as="span" fontWeight="bold" style={{ fontWeight: 'bold' }} className="label-bold">Created:</Text> {data.createdAt?.toDate?.()?.toLocaleDateString() || new Date().toLocaleDateString()}
          </Text>
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
            <Text as="span" fontWeight="bold" style={{ fontWeight: 'bold' }} className="label-bold">Generated:</Text> {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
          </Text>
        </Box>
      </VStack>
    </Box>
  );
};
