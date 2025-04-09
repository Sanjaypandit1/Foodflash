'use client';

import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  TextInput,
  Modal,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useOrders, type Order } from '../components/OrderContext';
import { useNavigation } from '@react-navigation/native';

const { } = Dimensions.get('window');

const OrdersScreen = () => {
  const { orders, cancelOrder } = useOrders();
  const navigation = useNavigation<any>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Filter orders based on search query
  const filteredOrders = orders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#FF9800';
      case 'processing':
        return '#2196F3';
      case 'delivered':
        return '#4CAF50';
      case 'cancelled':
        return '#F44336';
      default:
        return '#FF9800';
    }
  };

  // Handle order press
  const handleOrderPress = (order: Order) => {
    setSelectedOrder(order);
    setModalVisible(true);
  };

  // Handle cancel order
  const handleCancelOrder = (orderId: string) => {
    cancelOrder(orderId);
    setModalVisible(false);
  };

  // Render order item
  const renderOrderItem = ({ item }: { item: Order }) => {
    // Get first item image for thumbnail
    const thumbnailImage = item.items[0]?.image;
    // Count total items
    const totalItems = item.items.reduce((sum, item) => sum + item.quantity, 0);

    return (
      <TouchableOpacity style={styles.orderCard} onPress={() => handleOrderPress(item)}>
        <View style={styles.orderHeader}>
          <View>
            <Text style={styles.orderId}>Order #{item.id.slice(-8)}</Text>
            <Text style={styles.orderDate}>{formatDate(item.date)}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{item.status.charAt(0).toUpperCase() + item.status.slice(1)}</Text>
          </View>
        </View>

        <View style={styles.orderContent}>
          <View style={styles.thumbnailContainer}>
            <Image source={thumbnailImage} style={styles.thumbnail} />
            {item.items.length > 1 && (
              <View style={styles.itemCountBadge}>
                <Text style={styles.itemCountText}>+{item.items.length - 1}</Text>
              </View>
            )}
          </View>

          <View style={styles.orderDetails}>
            <Text style={styles.itemsText}>
              {totalItems} {totalItems === 1 ? 'item' : 'items'}
            </Text>
            <Text style={styles.totalText}>Rs.{item.total.toFixed(2)}</Text>
            <Text style={styles.paymentMethod}>{item.paymentMethod}</Text>
          </View>
        </View>

        <View style={styles.orderFooter}>
          <TouchableOpacity style={styles.trackButton}>
            <Icon name="location-on" size={16} color="#FF3F00" />
            <Text style={styles.trackButtonText}>Track Order</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.reorderButton}>
            <Icon name="replay" size={16} color="white" />
            <Text style={styles.reorderButtonText}>Reorder</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  // Render empty state
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Icon name="receipt" size={80} color="#ccc" />
      <Text style={styles.emptyText}>No orders yet</Text>
      <Text style={styles.emptySubText}>Your order history will appear here</Text>
      <TouchableOpacity
        style={styles.shopNowButton}
        onPress={() => {
          navigation.navigate('Home', { screen: 'Homescreen' });
        }}
      >
        <Text style={styles.shopNowText}>Shop Now</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Orders</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={24} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search orders..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
            <Icon name="close" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      {/* Order List */}
      <FlatList
        data={filteredOrders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />

      {/* Order Detail Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Order Details</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                <Icon name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            {selectedOrder && (
              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Order Info */}
                <View style={styles.orderInfoSection}>
                  <View style={styles.orderInfoRow}>
                    <Text style={styles.orderInfoLabel}>Order ID:</Text>
                    <Text style={styles.orderInfoValue}>#{selectedOrder.id.slice(-8)}</Text>
                  </View>
                  <View style={styles.orderInfoRow}>
                    <Text style={styles.orderInfoLabel}>Date:</Text>
                    <Text style={styles.orderInfoValue}>{formatDate(selectedOrder.date)}</Text>
                  </View>
                  <View style={styles.orderInfoRow}>
                    <Text style={styles.orderInfoLabel}>Status:</Text>
                    <View style={[styles.statusBadgeSmall, { backgroundColor: getStatusColor(selectedOrder.status) }]}>
                      <Text style={styles.statusTextSmall}>
                        {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.orderInfoRow}>
                    <Text style={styles.orderInfoLabel}>Payment:</Text>
                    <Text style={styles.orderInfoValue}>{selectedOrder.paymentMethod}</Text>
                  </View>
                </View>

                {/* Delivery Address */}
                <View style={styles.sectionContainer}>
                  <Text style={styles.sectionTitle}>Delivery Address</Text>
                  <View style={styles.addressContainer}>
                    <Icon name="location-on" size={20} color="#FF3F00" style={styles.addressIcon} />
                    <Text style={styles.addressText}>{selectedOrder.deliveryAddress}</Text>
                  </View>
                </View>

                {/* Order Items */}
                <View style={styles.sectionContainer}>
                  <Text style={styles.sectionTitle}>Order Items</Text>
                  {selectedOrder.items.map((item, index) => (
                    <View key={index} style={styles.orderItemRow}>
                      <Image source={item.image} style={styles.orderItemImage} />
                      <View style={styles.orderItemInfo}>
                        <Text style={styles.orderItemName}>{item.name}</Text>
                        <Text style={styles.orderItemPrice}>{item.price}</Text>
                      </View>
                      <Text style={styles.orderItemQuantity}>x{item.quantity}</Text>
                    </View>
                  ))}
                </View>

                {/* Price Summary */}
                <View style={styles.sectionContainer}>
                  <Text style={styles.sectionTitle}>Price Details</Text>
                  <View style={styles.priceSummary}>
                    <View style={styles.priceRow}>
                      <Text style={styles.priceLabel}>Subtotal</Text>
                      <Text style={styles.priceValue}>
                        Rs.{(selectedOrder.total - 40 - selectedOrder.total * 0.05).toFixed(2)}
                      </Text>
                    </View>
                    <View style={styles.priceRow}>
                      <Text style={styles.priceLabel}>Delivery Fee</Text>
                      <Text style={styles.priceValue}>Rs.40.00</Text>
                    </View>
                    <View style={styles.priceRow}>
                      <Text style={styles.priceLabel}>Tax (5%)</Text>
                      <Text style={styles.priceValue}>Rs.{(selectedOrder.total * 0.05).toFixed(2)}</Text>
                    </View>
                    <View style={styles.totalPriceRow}>
                      <Text style={styles.totalPriceLabel}>Total</Text>
                      <Text style={styles.totalPriceValue}>Rs.{selectedOrder.total.toFixed(2)}</Text>
                    </View>
                  </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionButtonsContainer}>
                  {selectedOrder.status === 'pending' && (
                    <TouchableOpacity style={styles.cancelButton} onPress={() => handleCancelOrder(selectedOrder.id)}>
                      <Text style={styles.cancelButtonText}>Cancel Order</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity style={styles.supportButton}>
                    <Icon name="headset-mic" size={18} color="#FF3F00" />
                    <Text style={styles.supportButtonText}>Contact Support</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: 'red',
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    margin: 15,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  clearButton: {
    padding: 5,
  },
  listContainer: {
    padding: 15,
    paddingBottom: 30,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
  },
  emptySubText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  shopNowButton: {
    backgroundColor: '#FF3F00',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  shopNowText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  orderCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  orderContent: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  thumbnailContainer: {
    position: 'relative',
  },
  thumbnail: {
    width: 70,
    height: 70,
    borderRadius: 8,
  },
  itemCountBadge: {
    position: 'absolute',
    right: -5,
    bottom: -5,
    backgroundColor: '#FF3F00',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemCountText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  orderDetails: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  itemsText: {
    fontSize: 15,
    color: '#333',
    marginBottom: 4,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF3F00',
    marginBottom: 4,
  },
  paymentMethod: {
    fontSize: 14,
    color: '#666',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 15,
  },
  trackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#FF3F00',
    borderRadius: 20,
  },
  trackButtonText: {
    color: '#FF3F00',
    marginLeft: 5,
    fontWeight: '500',
  },
  reorderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: '#FF3F00',
    borderRadius: 20,
  },
  reorderButtonText: {
    color: 'white',
    marginLeft: 5,
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 30,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  orderInfoSection: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    marginBottom: 15,
  },
  orderInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderInfoLabel: {
    fontSize: 14,
    color: '#666',
  },
  orderInfoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  statusBadgeSmall: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  statusTextSmall: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  sectionContainer: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  addressIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  addressText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
  },
  orderItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  orderItemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  orderItemInfo: {
    flex: 1,
    marginLeft: 10,
  },
  orderItemName: {
    fontSize: 14,
    fontWeight: '500',
  },
  orderItemPrice: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  orderItemQuantity: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  priceSummary: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 15,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  priceLabel: {
    fontSize: 14,
    color: '#666',
  },
  priceValue: {
    fontSize: 14,
    color: '#333',
  },
  totalPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 10,
    marginTop: 5,
  },
  totalPriceLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalPriceValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF3F00',
  },
  actionButtonsContainer: {
    padding: 15,
    gap: 10,
  },
  cancelButton: {
    backgroundColor: '#F44336',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  supportButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF3F00',
  },
  supportButtonText: {
    color: '#FF3F00',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
});

export default OrdersScreen;
