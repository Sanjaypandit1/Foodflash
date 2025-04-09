'use client';

import React, { createContext, useState, useContext, type ReactNode } from 'react';
import type { ImageSourcePropType } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Order item interface
export interface OrderItem {
  id: string
  name: string
  price: string
  image: ImageSourcePropType
  quantity: number
  tag: string
}

// Order interface
export interface Order {
  id: string
  items: OrderItem[]
  total: number
  date: string
  status: 'pending' | 'processing' | 'delivered' | 'cancelled'
  deliveryAddress: string
  paymentMethod: string
}

interface OrderContextType {
  orders: Order[]
  addOrder: (order: Omit<Order, 'id' | 'date' | 'status'>) => void
  getOrderById: (id: string) => Order | undefined
  cancelOrder: (id: string) => void
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

interface OrderProviderProps {
  children: ReactNode
}

export const OrderProvider: React.FC<OrderProviderProps> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  // Load orders from AsyncStorage on component mount
  React.useEffect(() => {
    const loadOrders = async () => {
      try {
        const savedOrders = await AsyncStorage.getItem('orders');
        console.log('Loading orders from storage:', savedOrders);
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
  React.useEffect(() => {
    const saveOrders = async () => {
      try {
        await AsyncStorage.setItem('orders', JSON.stringify(orders));
        console.log('Saved orders to storage:', JSON.stringify(orders));
      } catch (error) {
        console.error('Failed to save orders:', error);
      }
    };

    if (orders.length > 0) {
      saveOrders();
    }
  }, [orders]);

  const addOrder = (order: Omit<Order, 'id' | 'date' | 'status'>) => {
    const newOrder: Order = {
      ...order,
      id: `order-${Date.now()}`,
      date: new Date().toISOString(),
      status: 'pending',
    };

    console.log('Adding new order:', newOrder);
    setOrders((prevOrders) => [newOrder, ...prevOrders]);
  };

  const getOrderById = (id: string) => {
    return orders.find((order) => order.id === id);
  };

  const cancelOrder = (id: string) => {
    setOrders((prevOrders) => prevOrders.map((order) => (order.id === id ? { ...order, status: 'cancelled' } : order)));
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder, getOrderById, cancelOrder }}>{children}</OrderContext.Provider>
  );
};

export const useOrders = (): OrderContextType => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};
