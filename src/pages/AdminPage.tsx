import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  HStack,
  VStack,
  useToast,
  IconButton,
  Badge,
  Text,
  Spinner,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  FormControl,
  FormLabel,
  Textarea,
  Checkbox,
} from '@chakra-ui/react';
import { collection, getDocs, doc, deleteDoc, updateDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';

interface ItemPurchased {
  itemNumber: string;
  description: string;
  qty: string;
}

interface DocumentData {
  id: string;
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
  createdAt: any;
  userEmail: string;
}

export const AdminPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState<DocumentData | null>(null);
  const [editData, setEditData] = useState<Partial<DocumentData>>({});

  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const q = query(collection(db, 'documents'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const docs = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as DocumentData));
      setDocuments(docs);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast({
        title: 'Error',
        description: 'Failed to load documents',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedDoc) return;

    try {
      await deleteDoc(doc(db, 'documents', selectedDoc.id));
      setDocuments(docs => docs.filter(d => d.id !== selectedDoc.id));
      toast({
        title: 'Success',
        description: 'Document deleted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onDeleteClose();
    } catch (error) {
      console.error('Error deleting document:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete document',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleEdit = (document: DocumentData) => {
    setSelectedDoc(document);
    setEditData({ ...document });
    onEditOpen();
  };

  const handleUpdate = async () => {
    if (!selectedDoc || !editData) return;

    try {
      const docRef = doc(db, 'documents', selectedDoc.id);
      await updateDoc(docRef, editData);

      setDocuments(docs =>
        docs.map(d => d.id === selectedDoc.id ? { ...d, ...editData } : d)
      );

      toast({
        title: 'Success',
        description: 'Document updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onEditClose();
    } catch (error) {
      console.error('Error updating document:', error);
      toast({
        title: 'Error',
        description: 'Failed to update document',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
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

  const formatDate = (date: any) => {
    if (!date) return 'N/A';
    if (date.toDate) return date.toDate().toLocaleDateString();
    return new Date(date).toLocaleDateString();
  };

  if (loading) {
    return (
      <Container maxW="container.xl" py={10}>
        <VStack spacing={4}>
          <Spinner size="xl" />
          <Text>Loading documents...</Text>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={10}>
      <VStack spacing={6}>
        <HStack width="full" justify="end">
          <HStack spacing={4}>
            <Button onClick={() => navigate('/form')} colorScheme="blue">
              New Order
            </Button>
            <Button onClick={handleLogout} leftIcon={<Box as="span" className="material-icons">logout</Box>}>
              Sign Out
            </Button>
          </HStack>
        </HStack>

        <Box width="full" p={6} borderWidth={1} borderRadius={8} boxShadow="lg">
          <VStack spacing={4}>
            <HStack width="full" justify="space-between">
              <Heading size="md">Orders ({documents.length})</Heading>
              <Button onClick={fetchDocuments} size="sm">
                Refresh
              </Button>
            </HStack>

            {documents.length === 0 ? (
              <Text>No documents found</Text>
            ) : (
              <Box width="full" overflowX="auto">
                <Table size="sm">
                  <Thead>
                    <Tr>
                      <Th>Customer</Th>
                      <Th>Invoice #</Th>
                      <Th>Purchase Date</Th>
                      <Th>Type</Th>
                      <Th>Items</Th>
                      <Th>Created</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {documents.map((doc) => (
                      <Tr key={doc.id}>
                        <Td>{doc.firstName} {doc.lastName}</Td>
                        <Td>{doc.invoiceNumber}</Td>
                        <Td>{doc.dateOfPurchase}</Td>
                        <Td>
                          <Badge colorScheme={doc.isPickup ? 'blue' : 'green'}>
                            {doc.isPickup ? 'Pickup' : 'Delivery'}
                          </Badge>
                        </Td>
                        <Td>{doc.itemsPurchased?.length || 0}</Td>
                        <Td>{formatDate(doc.createdAt)}</Td>
                        <Td>
                          <HStack spacing={2}>
                            <IconButton
                              aria-label="Edit"
                              icon={<Box as="span" className="material-icons">edit</Box>}
                              size="sm"
                              colorScheme="blue"
                              onClick={() => handleEdit(doc)}
                            />
                            <IconButton
                              aria-label="Delete"
                              icon={<Box as="span" className="material-icons">delete</Box>}
                              size="sm"
                              colorScheme="red"
                              onClick={() => {
                                setSelectedDoc(doc);
                                onDeleteOpen();
                              }}
                            />
                          </HStack>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            )}
          </VStack>
        </Box>
      </VStack>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Order
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete the order for {selectedDoc?.firstName} {selectedDoc?.lastName}?
              This action cannot be undone.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      {/* Edit Modal */}
      <Modal isOpen={isEditOpen} onClose={onEditClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Order</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <HStack spacing={4} width="full">
                <FormControl>
                  <FormLabel>First Name</FormLabel>
                  <Input
                    value={editData.firstName || ''}
                    onChange={(e) => setEditData({...editData, firstName: e.target.value})}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Last Name</FormLabel>
                  <Input
                    value={editData.lastName || ''}
                    onChange={(e) => setEditData({...editData, lastName: e.target.value})}
                  />
                </FormControl>
              </HStack>

              <HStack spacing={4} width="full">
                <FormControl>
                  <FormLabel>Invoice #</FormLabel>
                  <Input
                    value={editData.invoiceNumber || ''}
                    onChange={(e) => setEditData({...editData, invoiceNumber: e.target.value})}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Purchase Date</FormLabel>
                  <Input
                    type="date"
                    value={editData.dateOfPurchase || ''}
                    onChange={(e) => setEditData({...editData, dateOfPurchase: e.target.value})}
                  />
                </FormControl>
              </HStack>

              <HStack spacing={8}>
                <Checkbox
                  isChecked={editData.isPickup}
                  onChange={(e) => setEditData({
                    ...editData,
                    isPickup: e.target.checked,
                    isDelivery: !e.target.checked
                  })}
                >
                  Pickup
                </Checkbox>
                <Checkbox
                  isChecked={editData.isDelivery}
                  onChange={(e) => setEditData({
                    ...editData,
                    isDelivery: e.target.checked,
                    isPickup: !e.target.checked
                  })}
                >
                  Delivery
                </Checkbox>
              </HStack>

              {editData.isPickup && (
                <FormControl>
                  <FormLabel>Estimated Pickup Date</FormLabel>
                  <Input
                    type="date"
                    value={editData.estimatedPickupDate || ''}
                    onChange={(e) => setEditData({...editData, estimatedPickupDate: e.target.value})}
                  />
                </FormControl>
              )}

              {editData.isDelivery && (
                <VStack spacing={4} width="full">
                  <FormControl>
                    <FormLabel>Delivery Date</FormLabel>
                    <Input
                      type="date"
                      value={editData.deliveryDate || ''}
                      onChange={(e) => setEditData({...editData, deliveryDate: e.target.value})}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Delivery Address</FormLabel>
                    <Textarea
                      value={editData.deliveryAddress || ''}
                      onChange={(e) => setEditData({...editData, deliveryAddress: e.target.value})}
                    />
                  </FormControl>
                </VStack>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={onEditClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleUpdate}>
              Update
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};
