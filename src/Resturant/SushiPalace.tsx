import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { RouteProp, useRoute } from '@react-navigation/native'

// Define types
type RootStackParamList = {
  Home: undefined;
  RestaurantDetails: { restaurant: Restaurant };
};

type Restaurant = {
  id: string;
  name: string;
  rating: string;
  cuisine: string;
  deliveryTime: string;
  image: string;
}

type FoodItem = {
  id: string;
  name: string;
  price: string;
  description: string;
  image: string;
  isVeg: boolean;
  rating: string;
  preparationTime: string;
}

type FilterOption = 'all' | 'veg' | 'nonVeg';

// Sample food items data
// For SushilPalace.tsx - Japanese cuisine food items
const foodItems: FoodItem[] = [
    {
      id: '1',
      name: 'Salmon Nigiri (2 pcs)',
      price: '$6.99',
      description: 'Fresh salmon slices over pressed vinegared rice',
      image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      isVeg: false,
      rating: '4.8',
      preparationTime: '10 min'
    },
    {
      id: '2',
      name: 'California Roll (8 pcs)',
      price: '$9.99',
      description: 'Crab, avocado and cucumber rolled in seaweed and rice',
      image: 'https://images.unsplash.com/photo-1617196034183-421b4917c92d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      isVeg: false,
      rating: '4.5',
      preparationTime: '15 min'
    },
    {
      id: '3',
      name: 'Vegetable Tempura',
      price: '$8.99',
      description: 'Assorted vegetables lightly battered and deep-fried',
      image: 'https://images.unsplash.com/photo-1615361200141-f45961bc0d4c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1364&q=80',
      isVeg: true,
      rating: '4.4',
      preparationTime: '12 min'
    },
    {
      id: '4',
      name: 'Chicken Teriyaki',
      price: '$14.99',
      description: 'Grilled chicken glazed with sweet teriyaki sauce, served with rice',
      image: 'https://images.unsplash.com/photo-1598514983318-2f64f55b2b36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      isVeg: false,
      rating: '4.6',
      preparationTime: '20 min'
    },
    {
      id: '5',
      name: 'Miso Soup',
      price: '$3.99',
      description: 'Traditional Japanese soup with tofu, seaweed, and green onions',
      image: 'https://images.unsplash.com/photo-1607301406259-dfb186e15de8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      isVeg: true,
      rating: '4.3',
      preparationTime: '8 min'
    },
    {
      id: '6',
      name: 'Dragon Roll (8 pcs)',
      price: '$16.99',
      description: 'Eel and cucumber inside, avocado and tobiko on top',
      image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1325&q=80',
      isVeg: false,
      rating: '4.9',
      preparationTime: '18 min'
    }
  ];
export default function SushilPalace() {
  const route = useRoute<RouteProp<RootStackParamList, 'RestaurantDetails'>>();
  const { restaurant } = route.params;
  const [filter, setFilter] = useState<FilterOption>('all');
  
  // Filter food items based on selected filter
  const filteredFoodItems = foodItems.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'veg') return item.isVeg;
    if (filter === 'nonVeg') return !item.isVeg;
    return true;
  });

  const renderFoodItem = ({ item }: { item: FoodItem }) => (
    <TouchableOpacity style={styles.foodCard} activeOpacity={0.9}>
      <View style={styles.foodInfo}>
        <View style={styles.foodHeader}>
          <Text style={styles.foodName}>{item.name}</Text>
          <View style={[styles.vegBadge, { backgroundColor: item.isVeg ? '#0f8a0f' : '#b30000' }]}>
            <Text style={styles.vegBadgeText}>{item.isVeg ? 'VEG' : 'NON-VEG'}</Text>
          </View>
        </View>
        
        <Text style={styles.foodPrice}>{item.price}</Text>
        <Text style={styles.foodDescription} numberOfLines={2}>{item.description}</Text>
        
        <View style={styles.foodMeta}>
          <Text style={styles.foodRating}>★ {item.rating}</Text>
          <Text style={styles.foodTime}>{item.preparationTime}</Text>
        </View>
        
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>ADD</Text>
        </TouchableOpacity>
      </View>
      
      <Image 
        source={{ uri: item.image }} 
        style={styles.foodImage}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.restaurantName}>{restaurant.name}</Text>
        <Text style={styles.restaurantInfo}>{restaurant.cuisine} • {restaurant.rating} ★ • {restaurant.deliveryTime}</Text>
      </View>
      
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Filter:</Text>
        <View style={styles.filterOptions}>
          <TouchableOpacity 
            style={[styles.filterOption, filter === 'all' && styles.filterOptionActive]}
            onPress={() => setFilter('all')}
          >
            <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>All</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.filterOption, filter === 'veg' && styles.filterOptionActive]}
            onPress={() => setFilter('veg')}
          >
            <Text style={[styles.filterText, filter === 'veg' && styles.filterTextActive]}>Vegetarian</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.filterOption, filter === 'nonVeg' && styles.filterOptionActive]}
            onPress={() => setFilter('nonVeg')}
          >
            <Text style={[styles.filterText, filter === 'nonVeg' && styles.filterTextActive]}>Non-Vegetarian</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <FlatList
        data={filteredFoodItems}
        renderItem={renderFoodItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.foodList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 15,
  },
  header: {
    marginBottom: 20,
  },
  restaurantName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  restaurantInfo: {
    fontSize: 14,
    color: '#666',
  },
  filterContainer: {
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  filterOptions: {
    flexDirection: 'row',
    gap: 10,
  },
  filterOption: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#EEEEEE',
  },
  filterOptionActive: {
    backgroundColor: '#FF3F00',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
  },
  filterTextActive: {
    color: 'white',
    fontWeight: '500',
  },
  foodList: {
    paddingBottom: 20,
  },
  foodCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  foodInfo: {
    flex: 1,
    marginRight: 15,
  },
  foodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 5,
  },
  foodName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  vegBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  vegBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  foodPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF3F00',
    marginBottom: 5,
  },
  foodDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  foodMeta: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  foodRating: {
    fontSize: 14,
    color: '#FF3F00',
    marginRight: 10,
  },
  foodTime: {
    fontSize: 14,
    color: '#666',
  },
  foodImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  addButton: {
    backgroundColor: '#FF3F00',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
});