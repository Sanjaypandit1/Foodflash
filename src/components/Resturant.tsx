import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'

// Define types for data
type Restaurant = {
  id: string;
  name: string;
  rating: string;
  cuisine: string;
  deliveryTime: string;
  image: string;
}

// Sample restaurant data - in a real app, this would come from an API
const restaurantData: Restaurant[] = [
  {
    id: '1',
    name: 'Delicious Bites',
    rating: '4.5',
    cuisine: 'Kathmandu',
    deliveryTime: '25-35 min',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
  },
  {
    id: '2',
    name: 'Spice Garden',
    rating: '4.2',
    cuisine: 'Itahari',
    deliveryTime: '30-40 min',
    image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80'
  },
  {
    id: '3',
    name: 'Sushi Palace',
    rating: '4.7',
    cuisine: 'Biratchowk',
    deliveryTime: '20-30 min',
    image: 'https://images.unsplash.com/photo-1579027989536-b7b1f875659b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
  },
  {
    id: '4',
    name: 'Burger Joint',
    rating: '4.3',
    cuisine: 'Biratnagar',
    deliveryTime: '15-25 min',
    image: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80'
  }
]

export default function Resturant() {
  // Use the useNavigation hook
  const navigation = useNavigation();
  
  const handleRestaurantPress = (restaurant: Restaurant) => {
    try {
      // Navigate to different screens based on restaurant ID
      switch(restaurant.id) {
        case '1': // Delicious Bites
          (navigation as any).navigate('DeliciousBite', { restaurant });
          console.log('Navigating to Delicious Bites details');
          break;
        case '2': // Spice Garden
          // You can create specific screens for each restaurant
          // For now, we'll just navigate to a generic screen with the restaurant data
          (navigation as any).navigate('SpiceGarden', { restaurant });
          console.log('Navigating to Spice Garden details');
          break;
        case '3': // Sushi Palace
          (navigation as any).navigate('SushilPalace', { restaurant });
          console.log('Navigating to Sushi Palace details');
          break;
        case '4': // Burger Joint
          (navigation as any).navigate('BurgerJoint', { restaurant });
          console.log('Navigating to Burger Joint details');
          break;
        default:
          // Fallback for any other restaurants
          (navigation as any).navigate('DelicioudBite', { restaurant });
          console.log('Navigating to restaurant details:', restaurant.name);
      }
    } catch (error) {
      console.error('Navigation error:', error);
    }
  }

  const renderRestaurantItem = ({ item }: { item: Restaurant }) => (
    <TouchableOpacity 
      style={styles.restaurantCard}
      onPress={() => handleRestaurantPress(item)}
      activeOpacity={0.8}
    >
      <Image 
        source={{ uri: item.image }} 
        style={styles.restaurantImage}
        resizeMode="cover"
      />
      <View style={styles.restaurantInfo}>
        <Text style={styles.restaurantName}>{item.name}</Text>
        <View style={styles.restaurantDetails}>
          <Text style={styles.restaurantRating}>★ {item.rating}</Text>
          <Text style={styles.restaurantCuisine}>{item.cuisine}</Text>
          <Text style={styles.restaurantDelivery}>{item.deliveryTime}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Popular Restaurants</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={restaurantData}
        renderItem={renderRestaurantItem}
        keyExtractor={item => item.id}
        horizontal={false}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false} // Disable scrolling as parent ScrollView handles it
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingHorizontal: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAllText: {
    fontSize: 14,
    color: '#FF3F00',
  },
  restaurantCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  restaurantImage: {
    width: '100%',
    height: 180,
  },
  restaurantInfo: {
    padding: 12,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#333',
  },
  restaurantDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  restaurantRating: {
    fontSize: 14,
    color: '#FF3F00',
    marginRight: 10,
  },
  restaurantCuisine: {
    fontSize: 14,
    color: '#666',
    marginRight: 10,
  },
  restaurantDelivery: {
    fontSize: 14,
    color: '#666',
  }
})