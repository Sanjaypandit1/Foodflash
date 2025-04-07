import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { RouteProp, useNavigation, useRoute, NavigationProp } from '@react-navigation/native'
import {ImageSourcePropType} from 'react-native';


// Define types
type RootStackParamList = {
  Home: undefined;
  RestaurantDetails: { restaurant: Restaurant };
  FoodItemDetail: { item: FoodItem };
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


// For SushilPalace.tsx - Japanese cuisine food items
const foodItems: FoodItem[] = [
  {
    id: '1',
    name: 'Aalu Nimki',
    price: '80',
    description: 'Classic pizza with tomato sauce, mozzarella, and basil',
    image: require('../Assets/SusiPalace/aalu-nimki.jpeg'),
    isVeg: true,
    rating: '4.5',
    preparationTime: '20 min'
  },
  {
    id: '2',
    name: 'Chicken Khana',
    price: '250',
    description: 'Creamy pasta with grilled chicken and parmesan',
    image: require('../Assets/SusiPalace/chicken-khana.jpeg'),
    isVeg: false,
    rating: '4.7',
    preparationTime: '25 min'
  },
  {
    id: '3',
    name: 'Sekewa chicken',
    price: '180',
    description: 'Fresh mixed greens with seasonal vegetables and vinaigrette',
    image: require('../Assets/SusiPalace/chicken-sekewa.jpeg'),
    isVeg: false,
    rating: '4.2',
    preparationTime: '10 min'
  },
  {
    id: '4',
    name: 'Mutton Khana',
    price: '300',
    description: 'Juicy beef patty with lettuce, tomato, and special sauce',
    image: require('../Assets/SusiPalace/mutton-khana.jpeg'),
    isVeg: false,
    rating: '4.6',
    preparationTime: '15 min'
  },
  {
    id: '5',
    name: 'Mutton Momo',
    price: '220',
    description: 'Creamy arborio rice with wild mushrooms and parmesan',
    image: require('../Assets/SusiPalace/mutton-momo.jpg'),
    isVeg: false,
    rating: '4.4',
    preparationTime: '30 min'
  },
  {
    id: '6',
    name: 'Veg Khana',
    price: '280',
    description: 'Creamy arborio rice with wild mushrooms and parmesan',
    image: require('../Assets/SusiPalace/veg-khana.jpg'),
    isVeg: true,
    rating: '4.4',
    preparationTime: '30 min'
  },
  {
    id: '7',
    name: 'Veg Momo',
    price: '100',
    description: 'Creamy arborio rice with wild mushrooms and parmesan',
    image: require('../Assets/SusiPalace/veg-momo.jpeg'),
    isVeg: true,
    rating: '4.4',
    preparationTime: '30 min'
  },
  {
    id: '8',
    name: 'Veg Pakoda',
    price: '115',
    description: 'Fresh salmon fil',
    image: require('../Assets/SusiPalace/veg-pakoda.jpg'),
    isVeg: true,
    rating: '4.8',
    preparationTime: '25 min'
  }
  ];
export default function SushilPalace() {
   const route = useRoute<RouteProp<RootStackParamList, 'RestaurantDetails'>>();
    const { restaurant } = route.params;
    const [filter, setFilter] = useState<FilterOption>('all');
  
      // Properly type the navigation object
      const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    
    // Filter food items based on selected filter
    const filteredFoodItems = foodItems.filter(item => {
      if (filter === 'all') return true;
      if (filter === 'veg') return item.isVeg;
      if (filter === 'nonVeg') return !item.isVeg;
      return true;
    });
  
   const renderFoodItem = ({ item }: { item: FoodItem }) => (
       <TouchableOpacity 
         style={styles.foodCard} 
         activeOpacity={0.9}
         onPress={() => navigation.navigate('FoodItemDetail', { item })}
       >
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