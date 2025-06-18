import React, { useState, useEffect, useRef } from 'react';
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
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { Label } from '../components/Label';
import printLabelStyles from '../printLabelStyles';

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
  notes?: string;
}

export const AdminPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState<DocumentData | null>(null);
  const [editData, setEditData] = useState<Partial<DocumentData>>({});
  const labelRef = useRef<HTMLDivElement>(null);
  const [pickupDateFilter, setPickupDateFilter] = useState('');
  const [deliveryDateFilter, setDeliveryDateFilter] = useState('');
  const [sortField, setSortField] = useState<'name' | 'fulfillment'>('fulfillment');
  const [sortAsc, setSortAsc] = useState(true);

  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);

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

  const handleView = (document: DocumentData) => {
    setSelectedDoc(document);
    onViewOpen();
  };

  // Filtering logic
  const filteredDocuments = documents.filter(doc => {
    let pickupMatch = true;
    let deliveryMatch = true;
    if (pickupDateFilter) {
      pickupMatch = doc.isPickup && doc.estimatedPickupDate === pickupDateFilter;
    }
    if (deliveryDateFilter) {
      deliveryMatch = doc.isDelivery && doc.deliveryDate === deliveryDateFilter;
    }
    if (pickupDateFilter && deliveryDateFilter) {
      return (
        (doc.isPickup && doc.estimatedPickupDate === pickupDateFilter) ||
        (doc.isDelivery && doc.deliveryDate === deliveryDateFilter)
      );
    }
    return pickupMatch && deliveryMatch;
  });

  // Sorting logic
  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    if (sortField === 'name') {
      const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
      const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
      if (nameA < nameB) return sortAsc ? -1 : 1;
      if (nameA > nameB) return sortAsc ? 1 : -1;
      return 0;
    } else {
      // Fulfillment date: prefer deliveryDate if delivery, else pickup
      const dateA = a.isDelivery && a.deliveryDate ? a.deliveryDate : a.estimatedPickupDate || '';
      const dateB = b.isDelivery && b.deliveryDate ? b.deliveryDate : b.estimatedPickupDate || '';
      if (dateA < dateB) return sortAsc ? -1 : 1;
      if (dateA > dateB) return sortAsc ? 1 : -1;
      return 0;
    }
  });

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

        {/* Filter Controls */}
        <HStack spacing={6} width="full" align="center">
          <FormControl maxW="200px">
            <FormLabel fontSize="sm">Pickup Date</FormLabel>
            <Input
              type="date"
              value={pickupDateFilter}
              onChange={e => setPickupDateFilter(e.target.value)}
              size="sm"
            />
          </FormControl>
          <FormControl maxW="200px">
            <FormLabel fontSize="sm">Delivery Date</FormLabel>
            <Input
              type="date"
              value={deliveryDateFilter}
              onChange={e => setDeliveryDateFilter(e.target.value)}
              size="sm"
            />
          </FormControl>
          {(pickupDateFilter || deliveryDateFilter) && (
            <Button size="md" onClick={() => { setPickupDateFilter(''); setDeliveryDateFilter(''); }} style={{ marginTop: '25px' }}>Clear Filters</Button>
          )}
          <FormControl maxW="200px">
            <FormLabel fontSize="sm">Sort By</FormLabel>
            <select
              value={sortField}
              onChange={e => setSortField(e.target.value as 'name' | 'fulfillment')}
              style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px' }}
            >
              <option value="fulfillment">Fulfillment Date</option>
              <option value="name">Name</option>
            </select>
          </FormControl>
          <Button size="md" onClick={() => setSortAsc(a => !a)} style={{ marginTop: '25px' }}>
            {sortAsc ? 'Asc' : 'Desc'}
          </Button>
        </HStack>

        <Box width="full" p={6} borderWidth={1} borderRadius={8} boxShadow="lg">
          <VStack spacing={4}>
            <HStack width="full" justify="space-between">
              <Heading size="md">Orders ({sortedDocuments.length})</Heading>
              <Button onClick={fetchDocuments} size="sm">
                Refresh
              </Button>
            </HStack>

            {sortedDocuments.length === 0 ? (
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
                      <Th>Fulfillment Date</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {sortedDocuments.map((doc) => (
                      <Tr key={doc.id}>
                        <Td>{`${doc.firstName} ${doc.lastName}`}</Td>
                        <Td>{doc.invoiceNumber}</Td>
                        <Td>{doc.dateOfPurchase}</Td>
                        <Td>
                          <Badge colorScheme={doc.isPickup ? 'blue' : 'green'}>
                            {doc.isPickup ? 'Pickup' : 'Delivery'}
                          </Badge>
                        </Td>
                        <Td>{doc.itemsPurchased?.length || 0}</Td>
                        <Td>
                          {doc.isPickup && doc.estimatedPickupDate ? doc.estimatedPickupDate : ''}
                          {doc.isDelivery && doc.deliveryDate ? doc.deliveryDate : ''}
                        </Td>
                        <Td>
                          <HStack spacing={2}>
                            <IconButton
                              aria-label="View"
                              icon={<Box as="span" className="material-icons">visibility</Box>}
                              size="sm"
                              colorScheme="blue"
                              onClick={() => handleView(doc)}
                            />
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
                    onChange={(e) => setEditData({ ...editData, firstName: e.target.value })}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Last Name</FormLabel>
                  <Input
                    value={editData.lastName || ''}
                    onChange={(e) => setEditData({ ...editData, lastName: e.target.value })}
                  />
                </FormControl>
              </HStack>

              <HStack spacing={4} width="full">
                <FormControl>
                  <FormLabel>Invoice #</FormLabel>
                  <Input
                    value={editData.invoiceNumber || ''}
                    onChange={(e) => setEditData({ ...editData, invoiceNumber: e.target.value })}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Purchase Date</FormLabel>
                  <Input
                    type="date"
                    value={editData.dateOfPurchase || ''}
                    onChange={(e) => setEditData({ ...editData, dateOfPurchase: e.target.value })}
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
                    onChange={(e) => setEditData({ ...editData, estimatedPickupDate: e.target.value })}
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
                      onChange={(e) => setEditData({ ...editData, deliveryDate: e.target.value })}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Delivery Address</FormLabel>
                    <Textarea
                      value={editData.deliveryAddress || ''}
                      onChange={(e) => setEditData({ ...editData, deliveryAddress: e.target.value })}
                    />
                  </FormControl>
                </VStack>
              )}

              <FormControl>
                <FormLabel>Notes</FormLabel>
                <Textarea
                  value={editData.notes || ''}
                  onChange={e => setEditData({ ...editData, notes: e.target.value })}
                  placeholder="Enter any notes for this order (optional)"
                />
              </FormControl>
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

      {/* View Modal */}
      <Modal isOpen={isViewOpen} onClose={onViewClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>View Order</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <HStack spacing={4} width="full">
                <FormControl>
                  <FormLabel>First Name</FormLabel>
                  <Input value={selectedDoc?.firstName || ''} isReadOnly />
                </FormControl>
                <FormControl>
                  <FormLabel>Last Name</FormLabel>
                  <Input value={selectedDoc?.lastName || ''} isReadOnly />
                </FormControl>
              </HStack>

              <HStack spacing={4} width="full">
                <FormControl>
                  <FormLabel>Invoice #</FormLabel>
                  <Input value={selectedDoc?.invoiceNumber || ''} isReadOnly />
                </FormControl>
                <FormControl>
                  <FormLabel>Purchase Date</FormLabel>
                  <Input value={selectedDoc?.dateOfPurchase || ''} isReadOnly />
                </FormControl>
              </HStack>

              <HStack spacing={8}>
                <Checkbox isChecked={selectedDoc?.isPickup} isReadOnly>
                  Pickup
                </Checkbox>
                <Checkbox isChecked={selectedDoc?.isDelivery} isReadOnly>
                  Delivery
                </Checkbox>
              </HStack>

              {selectedDoc?.isPickup && (
                <FormControl>
                  <FormLabel>Estimated Pickup Date</FormLabel>
                  <Input value={selectedDoc?.estimatedPickupDate || ''} isReadOnly />
                </FormControl>
              )}

              {selectedDoc?.isDelivery && (
                <VStack spacing={4} width="full">
                  <FormControl>
                    <FormLabel>Delivery Date</FormLabel>
                    <Input value={selectedDoc?.deliveryDate || ''} isReadOnly />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Delivery Address</FormLabel>
                    <Textarea value={selectedDoc?.deliveryAddress || ''} isReadOnly />
                  </FormControl>
                </VStack>
              )}

              <FormControl>
                <FormLabel>Notes</FormLabel>
                <Textarea value={selectedDoc?.notes || ''} isReadOnly />
              </FormControl>

              <Box width="full">
                <Heading size="sm" mb={2}>Items Purchased</Heading>
                <Table size="sm">
                  <Thead>
                    <Tr>
                      <Th>Item #</Th>
                      <Th>Description</Th>
                      <Th>Qty</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {selectedDoc?.itemsPurchased?.map((item, index) => (
                      <Tr key={index}>
                        <Td>{item.itemNumber}</Td>
                        <Td>{item.description}</Td>
                        <Td>{item.qty}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            </VStack>
          </ModalBody>
          <ModalFooter>
            {selectedDoc && (
              <Button colorScheme="blue" onClick={handlePrint} mr={3}>
                Print Label
              </Button>
            )}
            <Button onClick={onViewClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Label for printing */}
      <div style={{
        position: 'fixed',
        top: '-9999px',
        left: '-9999px',
        width: '4in',
        height: '6in',
        backgroundColor: 'white',
        zIndex: -1
      }}>
        <div ref={labelRef} style={{ display: 'none' }}>
          {selectedDoc && <Label data={selectedDoc} />}
        </div>
      </div>
    </Container>
  );
};
