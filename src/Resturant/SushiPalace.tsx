import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity} from 'react-native';
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


// For SushilPalace.tsx - Japanese cuisine food items
const foodItems: FoodItem[] = [
  {
    id: "76",
    name: "Chicken Pizza",
    price: "395",
    description: "Signature pizza with free-range chicken, roasted garlic, and three-cheese blend.",
    image: { uri: "https://images.unsplash.com/photo-1593504049359-74330189a345" },
    isVeg: false,
    rating: "4.8",
    preparationTime: "27 min",
  },
  {
    id: "77",
    name: "Veg Pizza",
    price: "315",
    description: "Farm-to-table vegetables on sourdough crust with pesto drizzle.",
    image: { uri: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e" },
    isVeg: true,
    rating: "4.7",
    preparationTime: "23 min",
  },
  {
    id: "78",
    name: "Cheese Pizza",
    price: "335",
    description: "Five premium cheeses including gouda and parmesan on crispy thin crust.",
    image: { uri: "https://images.unsplash.com/photo-1601924582970-9238bcb495d9" },
    isVeg: true,
    rating: "4.9",
    preparationTime: "21 min",
  },
  {
    id: "79",
    name: "Egg Pizza",
    price: "355",
    description: "Organic eggs with caramelized onions and smoked mozzarella.",
    image: { uri: "https://images.unsplash.com/photo-1541745537411-b8046dc6d66c" },
    isVeg: false,
    rating: "4.6",
    preparationTime: "26 min",
  },
  {
    id: "80",
    name: "Mushroom Pizza",
    price: "325",
    description: "Wild forest mushrooms with truffle paste and aged cheddar.",
    image: { uri: "https://images.unsplash.com/photo-1513104890138-7c749659a591" },
    isVeg: true,
    rating: "4.8",
    preparationTime: "24 min",
  },
  {
    id: "81",
    name: "Veg Steam Momo",
    price: "165",
    description: "Hand-pinched momos with seasonal organic vegetables and sesame-chili oil.",
    image: { uri: "https://plus.unsplash.com/premium_photo-1673769108258-4e0053145334?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGR1bXBsaW5nfGVufDB8fDB8fHww" },
    isVeg: true,
    rating: "4.5",
    preparationTime: "19 min",
  },
  {
    id: "82",
    name: "Chicken Steam Momo",
    price: "195",
    description: "Juicy free-range chicken momos with house-made ginger sauce.",
    image: { uri: "https://images.unsplash.com/photo-1647999019630-dabe1a837693?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGR1bXBsaW5nJTIwd2l0aCUyMGp1aWNlfGVufDB8fDB8fHww" },
    isVeg: false,
    rating: "4.7",
    preparationTime: "19 min",
  },
  {
    id: "83",
    name: "Buff Momo",
    price: "205",
    description: "Grass-fed buffalo momos with Himalayan spice blend and tomato chutney.",
    image: { uri: "https://plus.unsplash.com/premium_photo-1674601033631-79eeffaac6f9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8ZHVtcGxpbmd8ZW58MHx8MHx8fDA%3D" },
    isVeg: false,
    rating: "4.8",
    preparationTime: "19 min",
  },
  {
    id: "84",
    name: "Veg Jhol Momo",
    price: "185",
    description: "Steamed vegetable momos in aromatic lemongrass-infused broth.",
    image: { uri: "https://images.unsplash.com/photo-1707528904025-5315e787958a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGR1bXBsaW5nJTIwd2l0aCUyMGp1aWNlfGVufDB8fDB8fHww" },
    isVeg: true,
    rating: "4.6",
    preparationTime: "23 min",
  },
  {
    id: "85",
    name: "Chicken Jhol Momo",
    price: "215",
    description: "Chicken momos in rich bone broth with Himalayan herbs.",
    image: { uri: "https://images.unsplash.com/photo-1707528904025-5315e787958a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGR1bXBsaW5nJTIwd2l0aCUyMGp1aWNlfGVufDB8fDB8fHww" },
    isVeg: false,
    rating: "4.8",
    preparationTime: "23 min",
  },
  {
    id: "86",
    name: "Chicken Chowmein",
    price: "215",
    description: "Wok-tossed noodles with free-range chicken and seasonal vegetables.",
    image: { uri: "https://images.unsplash.com/photo-1617622141675-d3005b9067c5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y2hvd21laW58ZW58MHx8MHx8fDA%3D" },
    isVeg: false,
    rating: "4.7",
    preparationTime: "19 min",
  },
  {
    id: "87",
    name: "Veg Chowmein",
    price: "195",
    description: "Organic vegetable chowmein with house-made sauce.",
    image: { uri: "https://images.unsplash.com/photo-1585032226651-759b368d7246" },
    isVeg: true,
    rating: "4.5",
    preparationTime: "19 min",
  },
  {
    id: "88",
    name: "Paneer Chowmein",
    price: "235",
    description: "Homemade paneer with spicy schezwan noodles and bell peppers.",
    image: { uri: "https://images.unsplash.com/photo-1585503913867-f3382c5d1122?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y2hvd21laW58ZW58MHx8MHx8fDA%3D" },
    isVeg: true,
    rating: "4.6",
    preparationTime: "19 min",
  },
  {
    id: "89",
    name: "Veg Burger",
    price: "165",
    description: "Quinoa-black bean patty with avocado spread in brioche bun.",
    image: { uri: "https://images.unsplash.com/photo-1571091718767-18b5b1457add" },
    isVeg: true,
    rating: "4.4",
    preparationTime: "13 min",
  },
  {
    id: "90",
    name: "Chicken Burger",
    price: "195",
    description: "Buttermilk-fried chicken with sriracha mayo in potato bun.",
    image: { uri: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd" },
    isVeg: false,
    rating: "4.7",
    preparationTime: "13 min",
  },
  {
    id: "91",
    name: "Egg Burger",
    price: "185",
    description: "Free-range egg patty with smoked gouda and arugula.",
    image: { uri: "https://images.unsplash.com/photo-1609796632543-65cdda96651c" },
    isVeg: false,
    rating: "4.5",
    preparationTime: "13 min",
  },
  {
    id: "92",
    name: "Veg Biryani",
    price: "275",
    description: "Royal biryani with seasonal vegetables and edible silver leaf.",
    image: { uri: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8YmlyeWFuaXxlbnwwfHwwfHx8MA%3D%3D" },
    isVeg: true,
    rating: "4.7",
    preparationTime: "29 min",
  },
  {
    id: "93",
    name: "Chicken Biryani",
    price: "345",
    description: "Dum-style biryani with free-range chicken and kewra water.",
    image: { uri: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a" },
    isVeg: false,
    rating: "4.9",
    preparationTime: "29 min",
  },
  {
    id: "94",
    name: "Mutton Biryani",
    price: "425",
    description: "Premium mutton shanks slow-cooked with aged basmati rice.",
    image: { uri: "https://plus.unsplash.com/premium_photo-1694141252026-3df1de888a21?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8YmlyeWFuaXxlbnwwfHwwfHx8MA%3D%3D" },
    isVeg: false,
    rating: "5.0",
    preparationTime: "36 min",
  },
  {
    id: "95",
    name: "Veg Khana Set",
    price: "325",
    description: "Royal thali with 10 seasonal vegetable preparations.",
    image: { uri: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHJpY2V8ZW58MHx8MHx8fDA%3D" },
    isVeg: true,
    rating: "4.8",
    preparationTime: "36 min",
  },
  {
    id: "96",
    name: "Chicken Khana Set",
    price: "425",
    description: "Signature chicken thali with 5 accompaniments and dessert.",
    image: { uri: "https://images.unsplash.com/photo-1569058242252-623df46b5025" },
    isVeg: false,
    rating: "4.9",
    preparationTime: "36 min",
  },
  {
    id: "97",
    name: "Mutton Khana Set",
    price: "475",
    description: "Premium mutton thali with 7 accompaniments and sweets.",
    image: { uri: "https://images.unsplash.com/photo-1691171047294-bf039a943700?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cmljZSUyMHdpdGglMjBtdXR0b258ZW58MHx8MHx8fDA%3D" },
    isVeg: false,
    rating: "5.0",
    preparationTime: "41 min",
  },
  {
    id: "98",
    name: "Coca Cola",
    price: "70",
    description: "Classic Coca Cola in chilled glass bottle with lemon wedge.",
    image: { uri: "https://images.unsplash.com/photo-1554866585-cd94860890b7" },
    isVeg: true,
    rating: "4.6",
    preparationTime: "2 min",
  },
  {
    id: "99",
    name: "Fanta",
    price: "70",
    description: "Sparkling orange drink with natural fruit extracts.",
    image: { uri: "https://images.unsplash.com/photo-1632818924360-68d4994cfdb2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZmFudGF8ZW58MHx8MHx8fDA%3D" },
    isVeg: true,
    rating: "4.5",
    preparationTime: "2 min",
  },
  {
    id: "100",
    name: "Maaza",
    price: "70",
    description: "Premium Alphonso mango drink with no added preservatives.",
    image: { uri: "https://images.unsplash.com/photo-1657600704994-ea5020a66231?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFhemF8ZW58MHx8MHx8fDA%3D" },
    isVeg: true,
    rating: "4.7",
    preparationTime: "2 min",
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
               <Text style={[styles.filterText, filter === 'veg' && styles.filterTextActive]}>Veg</Text>
             </TouchableOpacity>

             <TouchableOpacity
               style={[styles.filterOption, filter === 'nonVeg' && styles.filterOptionActive]}
               onPress={() => setFilter('nonVeg')}
             >
               <Text style={[styles.filterText, filter === 'nonVeg' && styles.filterTextActive]}>Non-Veg</Text>
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
