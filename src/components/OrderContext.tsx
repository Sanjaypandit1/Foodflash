import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Order item type
export type OrderItem = {
  id: string;
  name: string;
  price: string;
  image: any;
  quantity: number;
  tag?: string;
};

// Order type
export type Order = {
  id: string;
  items: OrderItem[];
  total: number;
  deliveryAddress: string;
  contactPhone: string;
  paymentMethod: string;
  status: string;
  date: string;
};

// Context type
export type OrderContextType = {
  orders: Order[];
  addOrder: (orderData: Omit<Order, 'id' | 'status' | 'date'>) => void;
  cancelOrder: (orderId: string) => void;
  clearOrders: () => void;
};

// Create context
const OrderContext = createContext<OrderContextType>({
  orders: [],
  addOrder: () => {},
  cancelOrder: () => {},
  clearOrders: () => {},
});

// Custom hook to use the order context
export const useOrders = () => useContext(OrderContext);

// Provider component
export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  // Load orders from AsyncStorage on mount
  useEffect(() => {
    const loadOrders = async () => {
      try {
        const savedOrders = await AsyncStorage.getItem('orders');
        if (savedOrders) {
          setOrders(JSON.parse(savedOrders));
        }
      } catch (error) {
        console.error('Failed to load orders:', error);
      }
    };

    loadOrders();
  }, []);

  // Save orders to AsyncStorage whenever they change
  useEffect(() => {
    const saveOrders = async () => {
      try {
        await AsyncStorage.setItem('orders', JSON.stringify(orders));
      } catch (error) {
        console.error('Failed to save orders:', error);
      }
    };

    saveOrders();
  }, [orders]);

  // Add a new order
  const addOrder = (orderData: Omit<Order, 'id' | 'status' | 'date'>) => {
    const newOrder: Order = {
      ...orderData,
      id: Date.now().toString(),
      status: 'pending', // Make sure status is lowercase to match your UI logic
      date: new Date().toISOString(),
    };

    setOrders(prevOrders => [newOrder, ...prevOrders]);
  };

  // Cancel an order
  const cancelOrder = (orderId: string) => {
    console.log('Cancelling order with ID:', orderId); // Add this for debugging
    
    setOrders(prevOrders => {
      const updatedOrders = prevOrders.map(order => 
        order.id === orderId 
          ? { ...order, status: 'cancelled' } 
          : order
      );
      
      console.log('Updated orders:', updatedOrders); // Add this for debugging
      return updatedOrders;
    });
  };

  // Clear all orders
  const clearOrders = () => {
    setOrders([]);
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder, cancelOrder, clearOrders }}>
      {children}
    </OrderContext.Provider>
  );
};

export default OrderContext;