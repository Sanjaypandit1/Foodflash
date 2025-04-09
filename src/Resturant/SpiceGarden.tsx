import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { RouteProp, useNavigation, useRoute, NavigationProp } from '@react-navigation/native';
import {ImageSourcePropType} from 'react-native';


// Define types
type RootStackParamList = {
  Home: undefined;
  RestaurantDetails: { restaurant: Restaurant };
  FoodItemDetail: {
    item: FoodItem;
    restaurantName?: string; // Add this line to include restaurantName
  };
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
  image: ImageSourcePropType;
  isVeg: boolean;
  rating: string;
  preparationTime: string;
}

type FilterOption = 'all' | 'veg' | 'nonVeg';


// Sample food items data
// For SpiceGarden.tsx - Indian cuisine food items
const foodItems: FoodItem[] = [
  {
    id: '17',
    name: 'Veg Biryani',
    price: '225',
    description: 'Aromatic basmati rice cooked with garden-fresh vegetables, saffron, and authentic Indian spices. Served with cooling raita and crispy papadum.',
    image: require('../Assets/SpiceGarden/Veg-biryani.jpeg'),
    isVeg: true,
    rating: '4.5',
    preparationTime: '20 min',
  },
  {
    id: '18',
    name: 'Paneer Pakoda',
    price: '280',
    description: 'Soft cottage cheese cubes dipped in spiced gram flour batter and deep-fried to golden perfection. Served with mint chutney and tamarind sauce.',
    image: require('../Assets/SpiceGarden/Paneer-Pakoda.jpg'),
    isVeg: true,
    rating: '4.7',
    preparationTime: '25 min',
  },
  {
    id: '19',
    name: 'Mushroom Chilly',
    price: '225',
    description: 'Button mushrooms tossed in a spicy Indo-Chinese sauce with bell peppers, onions, and green chilies. Garnished with spring onions and sesame seeds.',
    image: require('../Assets/SpiceGarden/mushroom-chilly.webp'),
    isVeg: true,
    rating: '4.2',
    preparationTime: '10 min',
  },
  {
    id: '20',
    name: 'Grilled Chicken',
    price: '600',
    description: 'Tender chicken pieces marinated in yogurt and aromatic spices, then grilled to perfection. Served with mint chutney and a side of fresh salad.',
    image: require('../Assets/SpiceGarden/Grilled-chicken.jpg'),
    isVeg: false,
    rating: '4.6',
    preparationTime: '15 min',
  },
  {
    id: '21',
    name: 'French Fry',
    price: '100',
    description: 'Crispy golden potato fries seasoned with our special spice blend. Served with tomato ketchup and garlic mayonnaise for dipping.',
    image: require('../Assets/SpiceGarden/French-fry.webp'),
    isVeg: true,
    rating: '4.4',
    preparationTime: '30 min',
  },
  {
    id: '22',
    name: 'Chicken Biryani',
    price: '490',
    description: 'Fragrant long-grain basmati rice layered with tender chicken pieces, caramelized onions, and traditional spices. Slow-cooked in a sealed pot and garnished with fresh herbs.',
    image: require('../Assets/SpiceGarden/chicken-biryani.jpg'),
    isVeg: false,
    rating: '4.4',
    preparationTime: '30 min',
  },
  {
    id: '23',
    name: 'Chicken Pakoda',
    price: '300',
    description: 'Juicy chicken pieces coated in a spiced chickpea flour batter and deep-fried until crispy and golden. Served with mint-coriander chutney and lemon wedges.',
    image: require('../Assets/SpiceGarden/chicken-pakoda.jpg'),
    isVeg: false,
    rating: '4.4',
    preparationTime: '30 min',
  },
  {
    id: '24',
    name: 'Butter Chicken',
    price: '330',
    description: 'Tender chicken pieces cooked in a rich, creamy tomato sauce with butter, cream, and aromatic spices. Served with naan bread or steamed rice.',
    image: require('../Assets/SpiceGarden/Butter-Chicken.jpeg'),
    isVeg: false,
    rating: '4.8',
    preparationTime: '25 min',
  },
];
export default function SpiceGarden() {
  const route = useRoute<RouteProp<RootStackParamList, 'RestaurantDetails'>>();
   const { restaurant } = route.params;
   const [filter, setFilter] = useState<FilterOption>('all');

     // Properly type the navigation object
     const navigation = useNavigation<NavigationProp<RootStackParamList>>();

   // Filter food items based on selected filter
   const filteredFoodItems = foodItems.filter(item => {
     if (filter === 'all') {return true;}
     if (filter === 'veg') {return item.isVeg;}
     if (filter === 'nonVeg') {return !item.isVeg;}
     return true;
   });

  const renderFoodItem = ({ item }: { item: FoodItem }) => (
      <TouchableOpacity
           style={styles.foodCard}
           activeOpacity={0.9}
           onPress={() => navigation.navigate('FoodItemDetail', {
             item,
             restaurantName: restaurant.name, // Pass the restaurant name
           })}>
        <View style={styles.foodInfo}>
          <View style={styles.foodHeader}>
            <Text style={styles.foodName}>{item.name}</Text>
            <View style={[styles.vegBadge, { backgroundColor: item.isVeg ? '#0f8a0f' : '#b30000' }]}>
              <Text style={styles.vegBadgeText}>{item.isVeg ? 'VEG' : 'NON-VEG'}</Text>
            </View>
          </View>

          <Text style={styles.foodPrice}>Rs. {item.price}</Text>
          <Text style={styles.foodDescription} numberOfLines={2}>{item.description}</Text>

          <View style={styles.foodMeta}>
            <Text style={styles.foodRating}>★ {item.rating}</Text>
            <Text style={styles.foodTime}>{item.preparationTime}</Text>
          </View>

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('FoodItemDetail', { item })}
          >
            <Text style={styles.addButtonText}>ADD</Text>
          </TouchableOpacity>
        </View>

          <Image
         source={item.image}
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
      padding: 1,
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
