import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Image,
  StatusBar,
  Platform
} from 'react-native';
import { useOrders } from '../components/OrderContext';
import { useColorScheme } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Define types for the order items and orders
interface OrderItem {
  id: string;
  name: string;
  price: string;
  quantity: number;
  image: any; // Use more specific type if available
}

interface Order {
  id: string;
  date: string;
  status: string;
  items: OrderItem[];
  total: number;
}

const OrdersScreen = () => {
  const { orders, cancelOrder } = useOrders();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  // Function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Function to get status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return '#FF9800';
      case 'delivered':
        return '#4CAF50';
      case 'cancelled':
        return '#F44336';
      default:
        return '#757575';
    }
  };

  // Function to handle order cancellation
  const handleCancelOrder = (orderId: string) => {
    cancelOrder(orderId);
  };

  // Render empty state
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Icon name="receipt-long" size={80} color={isDarkMode ? "#555" : "#ddd"} />
      <Text style={[styles.emptyTitle, isDarkMode && styles.darkText]}>No Orders Yet</Text>
      <Text style={[styles.emptySubtitle, isDarkMode && styles.darkSubText]}>
        Your order history will appear here
      </Text>
    </View>
  );

  // Render individual order item
  const renderOrderItem = ({ item, index }: { item: Order; index: number }) => (
    <View 
      style={[
        styles.orderCard, 
        isDarkMode && styles.darkOrderCard,
        index === orders.length - 1 && styles.lastOrderCard // Special styling for last item
      ]}
    >
      <View style={styles.orderHeader}>
        <View>
          <Text style={[styles.orderDate, isDarkMode && styles.darkText]}>
            {formatDate(item.date)}
          </Text>
          <Text style={[styles.orderId, isDarkMode && styles.darkSubText]}>
            Order #{item.id.slice(-6)}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
      </View>

      <View style={styles.orderItems}>
        {item.items.slice(0, 2).map((orderItem: OrderItem, index: number) => (
          <View key={orderItem.id} style={styles.orderItem}>
            <Image source={orderItem.image} style={styles.itemImage} />
            <View style={styles.itemDetails}>
              <Text style={[styles.itemName, isDarkMode && styles.darkText]}>
                {orderItem.name}
              </Text>
              <Text style={[styles.itemPrice, isDarkMode && styles.darkSubText]}>
                {orderItem.price} × {orderItem.quantity}
              </Text>
            </View>
          </View>
        ))}
        {item.items.length > 2 && (
          <Text style={[styles.moreItems, isDarkMode && styles.darkSubText]}>
            +{item.items.length - 2} more items
          </Text>
        )}
      </View>

      <View style={styles.orderFooter}>
        <View>
          <Text style={[styles.totalLabel, isDarkMode && styles.darkSubText]}>Total</Text>
          <Text style={[styles.totalAmount, isDarkMode && styles.darkText]}>
            Rs.{item.total.toFixed(2)}
          </Text>
        </View>
        
        {item.status.toLowerCase() === 'pending' && (
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={() => handleCancelOrder(item.id)}>
            <Text style={styles.cancelButtonText}>Cancel Order</Text>
          </TouchableOpacity>
        )}
        
        {item.status.toLowerCase() === 'delivered' && (
          <TouchableOpacity style={styles.reorderButton}>
            <Text style={styles.reorderButtonText}>Reorder</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.darkContainer]}>
      <View style={[styles.header, isDarkMode && styles.darkHeader]}>
        <Text style={styles.headerTitle}>My Orders</Text>
      </View>

      {/* Wrap FlatList in a View with flex: 1 to ensure it takes up all available space */}
      <View style={styles.listContainer}>
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={renderOrderItem}
          contentContainerStyle={orders.length === 0 ? styles.emptyList : styles.list}
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={true}
          initialNumToRender={5}
          maxToRenderPerBatch={10}
          windowSize={10}
          removeClippedSubviews={Platform.OS === 'android'}
          // Add footer component to ensure space at the bottom
          ListFooterComponent={<View style={styles.listFooter} />}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0,
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  listContainer: {
    flex: 1, // Ensure the list container takes up all available space
  },
  header: {
    backgroundColor: '#FF3F00',
    paddingVertical: 15,
    paddingHorizontal: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  darkHeader: {
    backgroundColor: '#8B0000',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
  },
  list: {
    padding: 15,
    paddingBottom: 80, // Significantly increased bottom padding
  },
  emptyList: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  orderCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  lastOrderCard: {
    marginBottom: 50, // Add extra margin to the last card
  },
  darkOrderCard: {
    backgroundColor: '#222',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  darkText: {
    color: '#f0f0f0',
  },
  darkSubText: {
    color: '#aaa',
  },
  orderId: {
    fontSize: 13,
    color: '#777',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  orderItems: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
    paddingVertical: 12,
    marginBottom: 12,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  itemPrice: {
    fontSize: 13,
    color: '#777',
  },
  moreItems: {
    fontSize: 13,
    color: '#777',
    marginTop: 5,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 13,
    color: '#777',
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  cancelButton: {
    backgroundColor: '#ffeeee',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: '#F44336',
    fontSize: 13,
    fontWeight: '600',
  },
  reorderButton: {
    backgroundColor: '#FF3F00',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  reorderButtonText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 15,
    marginBottom: 5,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
  },
  listFooter: {
    height: 30, // Extra space at the bottom of the list
  },
});

export default OrdersScreen;