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
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react';
import { collection, getDocs, doc, deleteDoc, updateDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { Label } from '../components/Label';
import { WorkOrderLabel } from '../components/WorkOrderLabel';
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
  const [workOrders, setWorkOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState<DocumentData | null>(null);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<any | null>(null);
  const [editData, setEditData] = useState<Partial<DocumentData>>({});
  const [editWorkOrderData, setEditWorkOrderData] = useState<any>({});
  const labelRef = useRef<HTMLDivElement>(null);
  const workOrderLabelRef = useRef<HTMLDivElement>(null);
  const [pickupDateFilter, setPickupDateFilter] = useState('');
  const [deliveryDateFilter, setDeliveryDateFilter] = useState('');
  const [sortField, setSortField] = useState<'name' | 'fulfillment'>('fulfillment');
  const [sortAsc, setSortAsc] = useState(true);

  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const { isOpen: isWorkOrderDeleteOpen, onOpen: onWorkOrderDeleteOpen, onClose: onWorkOrderDeleteClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure();
  const { isOpen: isWorkOrderEditOpen, onOpen: onWorkOrderEditOpen, onClose: onWorkOrderEditClose } = useDisclosure();
  const { isOpen: isWorkOrderViewOpen, onOpen: onWorkOrderViewOpen, onClose: onWorkOrderViewClose } = useDisclosure();
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

  const handleWorkOrderPrint = () => {
    if (!workOrderLabelRef.current) return;

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

    const labelContent = workOrderLabelRef.current.innerHTML;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print Work Order</title>
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
    fetchWorkOrders();
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

  const fetchWorkOrders = async () => {
    try {
      const querySnapshot = await getDocs(query(collection(db, 'work-orders'), orderBy('createdAt', 'desc')));
      const orders = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setWorkOrders(orders);
    } catch (error) {
      console.error('Error fetching work orders:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch work orders',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
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

  const handleWorkOrderDelete = async () => {
    if (!selectedWorkOrder) return;

    try {
      await deleteDoc(doc(db, 'work-orders', selectedWorkOrder.id));
      setWorkOrders(orders => orders.filter(o => o.id !== selectedWorkOrder.id));
      toast({
        title: 'Success',
        description: 'Work order deleted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onWorkOrderDeleteClose();
    } catch (error) {
      console.error('Error deleting work order:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete work order',
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

  const handleWorkOrderView = (workOrder: any) => {
    setSelectedWorkOrder(workOrder);
    onWorkOrderViewOpen();
  };

  const handleDeleteClick = (document: DocumentData) => {
    setSelectedDoc(document);
    onDeleteOpen();
  };

  const handleWorkOrderDeleteClick = (workOrder: any) => {
    setSelectedWorkOrder(workOrder);
    onWorkOrderDeleteOpen();
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

  const handleWorkOrderEdit = (workOrder: any) => {
    setSelectedWorkOrder(workOrder);
    setEditWorkOrderData({ ...workOrder });
    onWorkOrderEditOpen();
  };

  const handleWorkOrderUpdate = async () => {
    if (!selectedWorkOrder || !editWorkOrderData) return;

    try {
      const docRef = doc(db, 'work-orders', selectedWorkOrder.id);
      await updateDoc(docRef, editWorkOrderData);

      setWorkOrders(orders =>
        orders.map(o => o.id === selectedWorkOrder.id ? { ...o, ...editWorkOrderData } : o)
      );

      toast({
        title: 'Success',
        description: 'Work order updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onWorkOrderEditClose();
    } catch (error) {
      console.error('Error updating work order:', error);
      toast({
        title: 'Error',
        description: 'Failed to update work order',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const markWorkOrderComplete = async (workOrder: any) => {
    try {
      const docRef = doc(db, 'work-orders', workOrder.id);
      await updateDoc(docRef, {
        completed: true,
        completedAt: new Date()
      });

      setWorkOrders(orders =>
        orders.map(o => o.id === workOrder.id ? { ...o, completed: true, completedAt: new Date() } : o)
      );

      toast({
        title: 'Success',
        description: 'Work order marked as complete',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error marking work order complete:', error);
      toast({
        title: 'Error',
        description: 'Failed to mark work order as complete',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
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
        <Tabs isFitted variant="enclosed" width="full">
          <TabList mb="1em">
            <Tab>Orders</Tab>
            <Tab>Work Orders</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              {/* Filter Controls */}
              <VStack spacing={4} width="full" align="stretch">
                {/* Desktop Layout */}
                <HStack spacing={6} width="full" align="center" display={{ base: 'none', md: 'flex' }}>
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

                {/* Mobile Layout */}
                <VStack spacing={3} width="full" display={{ base: 'flex', md: 'none' }}>
                  <HStack spacing={3} width="full">
                    <FormControl>
                      <FormLabel fontSize="sm">Pickup Date</FormLabel>
                      <Input
                        type="date"
                        value={pickupDateFilter}
                        onChange={e => setPickupDateFilter(e.target.value)}
                        size="sm"
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel fontSize="sm">Delivery Date</FormLabel>
                      <Input
                        type="date"
                        value={deliveryDateFilter}
                        onChange={e => setDeliveryDateFilter(e.target.value)}
                        size="sm"
                      />
                    </FormControl>
                  </HStack>
                  <HStack spacing={3} width="full">
                    <FormControl>
                      <FormLabel fontSize="sm">Sort By</FormLabel>
                      <select
                        value={sortField}
                        onChange={e => setSortField(e.target.value as 'name' | 'fulfillment')}
                        style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px', width: '100%' }}
                      >
                        <option value="fulfillment">Fulfillment Date</option>
                        <option value="name">Name</option>
                      </select>
                    </FormControl>
                    <Button size="sm" onClick={() => setSortAsc(a => !a)} minW="60px">
                      {sortAsc ? 'Asc' : 'Desc'}
                    </Button>
                  </HStack>
                  {(pickupDateFilter || deliveryDateFilter) && (
                    <Button size="sm" onClick={() => { setPickupDateFilter(''); setDeliveryDateFilter(''); }} width="full">
                      Clear Filters
                    </Button>
                  )}
                </VStack>
              </VStack>

              {/* Orders Table */}
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
                                    onClick={() => handleDeleteClick(doc)}
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
            </TabPanel>

            <TabPanel>
              {/* Work Orders Table */}
              <Box overflowX="auto">
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Type</Th>
                      <Th>Customer/Location</Th>
                      <Th>Date Created</Th>
                      <Th>Status</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {workOrders.map((workOrder) => (
                      <Tr key={workOrder.id}>
                        <Td>
                          <Badge colorScheme={workOrder.isPurchased ? 'blue' : 'orange'}>
                            {workOrder.isPurchased ? 'Purchased' : 'Floor Item'}
                          </Badge>
                        </Td>
                        <Td>
                          {workOrder.isPurchased ? (
                            <Text>{workOrder.name}</Text>
                          ) : (
                            <Text>{workOrder.location}</Text>
                          )}
                        </Td>
                        <Td>{workOrder.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A'}</Td>
                        <Td>
                          {workOrder.completed ? (
                            <Badge colorScheme="green">Completed</Badge>
                          ) : (
                            <Badge colorScheme="yellow">Pending</Badge>
                          )}
                        </Td>
                        <Td>
                          <HStack spacing={2}>
                            <IconButton
                              aria-label="View work order"
                              icon={<Box as="span" className="material-icons">visibility</Box>}
                              size="sm"
                              colorScheme="blue"
                              onClick={() => handleWorkOrderView(workOrder)}
                            />
                            <IconButton
                              aria-label="Edit work order"
                              icon={<Box as="span" className="material-icons">edit</Box>}
                              size="sm"
                              colorScheme="blue"
                              onClick={() => handleWorkOrderEdit(workOrder)}
                            />
                            {!workOrder.completed && (
                              <Button
                                size="sm"
                                colorScheme="green"
                                onClick={() => markWorkOrderComplete(workOrder)}
                              >
                                Mark Complete
                              </Button>
                            )}
                            {workOrder.completed && (
                              <IconButton
                                aria-label="Delete work order"
                                icon={<Box as="span" className="material-icons">delete</Box>}
                                size="sm"
                                colorScheme="red"
                                onClick={() => handleWorkOrderDeleteClick(workOrder)}
                              />
                            )}
                          </HStack>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>

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

        {/* Work Order Delete Confirmation Dialog */}
        <AlertDialog
          isOpen={isWorkOrderDeleteOpen}
          leastDestructiveRef={cancelRef}
          onClose={onWorkOrderDeleteClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Delete Work Order
              </AlertDialogHeader>
              <AlertDialogBody>
                Are you sure you want to delete this completed work order?
                This action cannot be undone.
              </AlertDialogBody>
              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onWorkOrderDeleteClose}>
                  Cancel
                </Button>
                <Button colorScheme="red" onClick={handleWorkOrderDelete} ml={3}>
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

        {/* Work Order View Modal */}
        <Modal isOpen={isWorkOrderViewOpen} onClose={onWorkOrderViewClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>View Work Order</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <HStack spacing={4} width="full">
                  <FormControl>
                    <FormLabel>Type</FormLabel>
                    <Text>
                      {selectedWorkOrder?.isPurchased ? 'Purchased Item' : 'Item on Floor'}
                    </Text>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Status</FormLabel>
                    <Badge colorScheme={selectedWorkOrder?.completed ? 'green' : 'yellow'}>
                      {selectedWorkOrder?.completed ? 'Completed' : 'Pending'}
                    </Badge>
                  </FormControl>
                </HStack>

                {selectedWorkOrder?.isPurchased ? (
                  <>
                    <HStack spacing={4} width="full">
                      <FormControl>
                        <FormLabel>Name</FormLabel>
                        <Input value={selectedWorkOrder?.name || ''} isReadOnly />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Phone</FormLabel>
                        <Input value={selectedWorkOrder?.phone || ''} isReadOnly />
                      </FormControl>
                    </HStack>
                    <HStack spacing={4} width="full">
                      <FormControl>
                        <FormLabel>Invoice #</FormLabel>
                        <Input value={selectedWorkOrder?.invoice || ''} isReadOnly />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Date of Purchase</FormLabel>
                        <Input value={selectedWorkOrder?.dateOfPurchase || ''} isReadOnly />
                      </FormControl>
                    </HStack>
                    <FormControl>
                      <FormLabel>Estimated Completion</FormLabel>
                      <Input value={selectedWorkOrder?.estimatedCompletion || ''} isReadOnly />
                    </FormControl>
                  </>
                ) : (
                  <>
                    <HStack spacing={4} width="full">
                      <FormControl>
                        <FormLabel>Location</FormLabel>
                        <Input value={selectedWorkOrder?.location || ''} isReadOnly />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Who Should Repair</FormLabel>
                        <Input value={selectedWorkOrder?.whoShouldRepair || ''} isReadOnly />
                      </FormControl>
                    </HStack>
                  </>
                )}

                <FormControl>
                  <FormLabel>Scope of Work</FormLabel>
                  <Textarea value={selectedWorkOrder?.scopeOfWork || ''} isReadOnly />
                </FormControl>

                <HStack spacing={4} width="full">
                  <FormControl>
                    <FormLabel>Created</FormLabel>
                    <Input value={selectedWorkOrder?.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A'} isReadOnly />
                  </FormControl>
                  {selectedWorkOrder?.completed && (
                    <FormControl>
                      <FormLabel>Completed</FormLabel>
                      <Input value={selectedWorkOrder?.completedAt?.toDate?.()?.toLocaleDateString() || 'N/A'} isReadOnly />
                    </FormControl>
                  )}
                </HStack>
              </VStack>
            </ModalBody>
            <ModalFooter>
              {selectedWorkOrder && (
                <Button colorScheme="blue" onClick={handleWorkOrderPrint} mr={3}>
                  Print Work Order
                </Button>
              )}
              <Button onClick={onWorkOrderViewClose}>Close</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Work Order Edit Modal */}
        <Modal isOpen={isWorkOrderEditOpen} onClose={onWorkOrderEditClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Edit Work Order</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>Type</FormLabel>
                  <Text>
                    {editWorkOrderData.isPurchased ? 'Purchased Item' : 'Item on Floor'}
                  </Text>
                </FormControl>

                {editWorkOrderData.isPurchased ? (
                  <>
                    <HStack spacing={4} width="full">
                      <FormControl>
                        <FormLabel>Name</FormLabel>
                        <Input
                          value={editWorkOrderData.name || ''}
                          onChange={(e) => setEditWorkOrderData({ ...editWorkOrderData, name: e.target.value })}
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Phone</FormLabel>
                        <Input
                          value={editWorkOrderData.phone || ''}
                          onChange={(e) => setEditWorkOrderData({ ...editWorkOrderData, phone: e.target.value })}
                        />
                      </FormControl>
                    </HStack>
                    <HStack spacing={4} width="full">
                      <FormControl>
                        <FormLabel>Invoice #</FormLabel>
                        <Input
                          value={editWorkOrderData.invoice || ''}
                          onChange={(e) => setEditWorkOrderData({ ...editWorkOrderData, invoice: e.target.value })}
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Date of Purchase</FormLabel>
                        <Input
                          type="date"
                          value={editWorkOrderData.dateOfPurchase || ''}
                          onChange={(e) => setEditWorkOrderData({ ...editWorkOrderData, dateOfPurchase: e.target.value })}
                        />
                      </FormControl>
                    </HStack>
                    <FormControl>
                      <FormLabel>Estimated Completion</FormLabel>
                      <Input
                        type="date"
                        value={editWorkOrderData.estimatedCompletion || ''}
                        onChange={(e) => setEditWorkOrderData({ ...editWorkOrderData, estimatedCompletion: e.target.value })}
                      />
                    </FormControl>
                  </>
                ) : (
                  <>
                    <HStack spacing={4} width="full">
                      <FormControl>
                        <FormLabel>Location</FormLabel>
                        <Input
                          value={editWorkOrderData.location || ''}
                          onChange={(e) => setEditWorkOrderData({ ...editWorkOrderData, location: e.target.value })}
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Who Should Repair</FormLabel>
                        <Input
                          value={editWorkOrderData.whoShouldRepair || ''}
                          onChange={(e) => setEditWorkOrderData({ ...editWorkOrderData, whoShouldRepair: e.target.value })}
                        />
                      </FormControl>
                    </HStack>
                  </>
                )}

                <FormControl>
                  <FormLabel>Scope of Work</FormLabel>
                  <Textarea
                    value={editWorkOrderData.scopeOfWork || ''}
                    onChange={(e) => setEditWorkOrderData({ ...editWorkOrderData, scopeOfWork: e.target.value })}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Status</FormLabel>
                  <Checkbox
                    isChecked={editWorkOrderData.completed || false}
                    onChange={(e) => setEditWorkOrderData({
                      ...editWorkOrderData,
                      completed: e.target.checked,
                      completedAt: e.target.checked ? new Date() : null
                    })}
                  >
                    Mark as Complete
                  </Checkbox>
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button mr={3} onClick={onWorkOrderEditClose}>
                Cancel
              </Button>
              <Button colorScheme="blue" onClick={handleWorkOrderUpdate}>
                Update
              </Button>
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

        {/* Work Order Label for printing */}
        <div style={{
          position: 'fixed',
          top: '-9999px',
          left: '-9999px',
          width: '4in',
          height: '6in',
          backgroundColor: 'white',
          zIndex: -1
        }}>
          <div ref={workOrderLabelRef} style={{ display: 'none' }}>
            {selectedWorkOrder && <WorkOrderLabel data={selectedWorkOrder} />}
          </div>
        </div>
      </VStack>
    </Container>
  );
};
