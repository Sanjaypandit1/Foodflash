import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity } from 'react-native';
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
const foodItems: FoodItem[] = [
  {
    id: "26",
    name: "Pepperoni Pizza",
    price: "370",
    description: "Classic pizza topped with spicy pepperoni, melted cheese, and tangy tomato sauce.",
    image: { uri: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3" },
    isVeg: false,
    rating: "4.7",
    preparationTime: "25 min",
  },
  {
    id: "27",
    name: "Margherita Pizza",
    price: "290",
    description: "Simple yet delicious with fresh tomatoes, mozzarella, and basil on thin crust.",
    image: { uri: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e" },
    isVeg: true,
    rating: "4.6",
    preparationTime: "18 min",
  },
  {
    id: "28",
    name: "BBQ Chicken Pizza",
    price: "380",
    description: "Smoky BBQ sauce, grilled chicken, red onions, and cilantro on pizza.",
    image: { uri: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee" },
    isVeg: false,
    rating: "4.8",
    preparationTime: "28 min",
  },
  {
    id: "29",
    name: "Paneer Pizza",
    price: "340",
    description: "Indian style pizza with spiced paneer cubes and bell peppers.",
    image: { uri: "https://images.unsplash.com/photo-1573821663912-569905455b1c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGFuZWVyJTIwcGl6emF8ZW58MHx8MHx8fDA%3D" },
    isVeg: true,
    rating: "4.5",
    preparationTime: "22 min",
  },
  {
    id: "30",
    name: "Cheese Garlic Bread",
    price: "120",
    description: "Toasted bread topped with garlic butter and melted cheese.",
    image: { uri: "https://images.unsplash.com/photo-1573140401552-3fab0b24306f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Y2hlZXNlJTIwR2FybGljJTIwYnJlYWR8ZW58MHx8MHx8fDA%3D" },
    isVeg: true,
    rating: "4.4",
    preparationTime: "10 min",
  },
  {
    id: "31",
    name: "Fried Momo",
    price: "200",
    description: "Crispy fried dumplings filled with vegetables and spices.",
    image: { uri: "https://images.unsplash.com/photo-1703080173985-936514c7c8bd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZnJ5JTIwZHVtcGxpbmd8ZW58MHx8MHx8fDA%3D" },
    isVeg: true,
    rating: "4.6",
    preparationTime: "18 min",
  },
  {
    id: "32",
    name: "Chicken Fried Momo",
    price: "220",
    description: "Deep-fried momos with juicy chicken filling, served with dipping sauce.",
    image: { uri: "https://images.unsplash.com/photo-1703080173985-936514c7c8bd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZnJ5JTIwZHVtcGxpbmd8ZW58MHx8MHx8fDA%3D" },
    isVeg: false,
    rating: "4.7",
    preparationTime: "18 min",
  },
  {
    id: "33",
    name: "Veg C Momo",
    price: "190",
    description: "Pan-fried momos with vegetable filling, crispy on one side.",
    image: { uri: "https://plus.unsplash.com/premium_photo-1661600604025-26f3d0fee123?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGZyeSUyMGR1bXBsaW5nfGVufDB8fDB8fHww" },
    isVeg: true,
    rating: "4.5",
    preparationTime: "20 min",
  },
  {
    id: "34",
    name: "Chicken C Momo",
    price: "210",
    description: "Half-fried, half-steamed chicken momos with perfect texture.",
    image: { uri: "https://images.unsplash.com/photo-1700809979031-582d10f3a4d5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGZyeSUyMGR1bXBsaW5nfGVufDB8fDB8fHww" },
    isVeg: false,
    rating: "4.7",
    preparationTime: "20 min",
  },
  {
    id: "35",
    name: "Egg Chowmein",
    price: "190",
    description: "Stir-fried noodles with scrambled eggs and fresh vegetables.",
    image: { uri: "https://images.unsplash.com/photo-1617622141573-2e00d8818f3f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2hvd21laW58ZW58MHx8MHx8fDA%3D" },
    isVeg: false,
    rating: "4.4",
    preparationTime: "15 min",
  },
  {
    id: "36",
    name: "Mushroom Chowmein",
    price: "210",
    description: "Sautéed mushrooms with noodles in light soy sauce.",
    image: { uri: "https://media.istockphoto.com/id/2191428492/photo/chow-mein-or-vegetable-hakka-noodles-is-a-popular-indo-chinese-dish-served-in-plate-noodles.webp?a=1&b=1&s=612x612&w=0&k=20&c=jkEt--cGrcgOZGx_l7yzaGI5FvCSM70pNbMu18rbwvc=" },
    isVeg: true,
    rating: "4.5",
    preparationTime: "15 min",
  },
  {
    id: "37",
    name: "Cheese Burger",
    price: "200",
    description: "Double cheese patty with lettuce and special sauce in soft bun.",
    image: { uri: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd" },
    isVeg: true,
    rating: "4.6",
    preparationTime: "12 min",
  },
  {
    id: "38",
    name: "Aloo Burger",
    price: "160",
    description: "Crispy potato patty with Indian spices and veggies in burger.",
    image: { uri: "https://media.istockphoto.com/id/617759204/photo/steakhouse-double-bacon-cheeseburger.webp?a=1&b=1&s=612x612&w=0&k=20&c=ClO9FRiWvSfMothhoVfcdcB7CUsUPWSa-0wf38U7h3E=" },
    isVeg: true,
    rating: "4.3",
    preparationTime: "10 min",
  },
  {
    id: "39",
    name: "Paneer Biryani",
    price: "280",
    description: "Fragrant biryani rice with cubes of spiced paneer and vegetables.",
    image: { uri: "https://media.istockphoto.com/id/1393066617/photo/veg-biryani.webp?a=1&b=1&s=612x612&w=0&k=20&c=jKDUJm3f6WUNcvzygzkDGfWkCk0ecPQ_Cl0rbEQSDFg=" },
    isVeg: true,
    rating: "4.6",
    preparationTime: "25 min",
  },
  {
    id: "40",
    name: "Egg Biryani",
    price: "270",
    description: "Boiled eggs with aromatic basmati rice and biryani spices.",
    image: { uri: "https://media.istockphoto.com/id/1277579909/photo/egg-biryani.webp?a=1&b=1&s=612x612&w=0&k=20&c=08UMGiKH38MN3db5gWG7CLsrEr6nD0ENiLZuM0BhiJE=" },
    isVeg: false,
    rating: "4.5",
    preparationTime: "25 min",
  },
  {
    id: "41",
    name: "Fish Biryani",
    price: "350",
    description: "Marinated fish pieces layered with fragrant basmati rice.",
    image: { uri: "https://media.istockphoto.com/id/1334383300/photo/fish-biryani-spicy-and-delicious-malabar-biryani-or-hydrabadi-biryani-dum-biriyani.webp?a=1&b=1&s=612x612&w=0&k=20&c=ZqTAGd2qFYQHDxhmvWC5XSwKLIQSPEGFDOEz9wK9SEE=" },
    isVeg: false,
    rating: "4.7",
    preparationTime: "30 min",
  },
  {
    id: "42",
    name: "Dal Bhat Set",
    price: "280",
    description: "Traditional Nepali meal with rice, lentil soup, and vegetable curry.",
    image: { uri: "https://media.istockphoto.com/id/473582814/photo/dal-bhat-traditional-nepali-meal-platter.webp?a=1&b=1&s=612x612&w=0&k=20&c=mFnSwdSZCRxRmuSpvljHxBE8vzMH0Vi4B2FRfaHfumc=" },
    isVeg: true,
    rating: "4.5",
    preparationTime: "25 min",
  },
  {
    id: "43",
    name: "Pepsi",
    price: "55",
    description: "Cold and refreshing Pepsi cola drink.",
    image: { uri: "https://images.unsplash.com/photo-1531384370597-8590413be50a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHBlcHNpfGVufDB8fDB8fHww" },
    isVeg: true,
    rating: "4.4",
    preparationTime: "2 min",
  },
  {
    id: "44",
    name: "Sprite",
    price: "55",
    description: "Crisp lemon-lime soda to quench your thirst.",
    image: { uri: "https://images.unsplash.com/photo-1680404005217-a441afdefe83?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3ByaXRlfGVufDB8fDB8fHww" },
    isVeg: true,
    rating: "4.3",
    preparationTime: "2 min",
  },
  {
    id: "45",
    name: "Lassi",
    price: "80",
    description: "Creamy yogurt drink, available in sweet or salty flavors.",
    image: { uri: "https://media.istockphoto.com/id/1496158255/photo/glass-of-ayran-or-kefir-or-lassi-on-wooden-table-top.webp?a=1&b=1&s=612x612&w=0&k=20&c=I_UJQAayscskcnIxua8GpZ0ZIRCEDlXtyEI3L8AGoR8=" },
    isVeg: true,
    rating: "4.6",
    preparationTime: "5 min",
  },
  {
    id: "46",
    name: "Mango Juice",
    price: "90",
    description: "Fresh mango pulp blended into sweet, thick juice.",
    image: { uri: "https://media.istockphoto.com/id/157567573/photo/clear-full-glass-of-mango-juice-with-mangos-laying-beside.webp?a=1&b=1&s=612x612&w=0&k=20&c=w3lTM0MEpDSbv5EfK5dQxQptlnJ02TCZCKsREJ3flNw=" },
    isVeg: true,
    rating: "4.5",
    preparationTime: "5 min",
  },
  {
    id: "47",
    name: "Chicken Wings",
    price: "280",
    description: "Crispy fried chicken wings with spicy or BBQ sauce.",
    image: { uri: "https://plus.unsplash.com/premium_photo-1672498193267-4f0e8c819bc8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y2hpY2tlbiUyMHdpbmdzfGVufDB8fDB8fHww" },
    isVeg: false,
    rating: "4.7",
    preparationTime: "20 min",
  },
  {
    id: "48",
    name: "French Fries",
    price: "120",
    description: "Golden crispy potato fries served with ketchup.",
    image: { uri: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5" },
    isVeg: true,
    rating: "4.4",
    preparationTime: "10 min",
  },
  {
    id: "49",
    name: "Onion Rings",
    price: "130",
    description: "Crispy battered onion rings, perfect as a side dish.",
    image: { uri: "https://media.istockphoto.com/id/621849666/photo/baskets-of-onion-rings-curly-fries-and-cheese-sticks.webp?a=1&b=1&s=612x612&w=0&k=20&c=Mr9Dh-ogwRIfA9S04DCGUdf1H2OxI2GupLkHXdR_iow=" },
    isVeg: true,
    rating: "4.3",
    preparationTime: "12 min",
  },
  {
    id: "50",
    name: "Chocolate Brownie",
    price: "150",
    description: "Warm chocolate brownie with fudge center, served with ice cream.",
    image: { uri: "https://images.unsplash.com/photo-1672867458764-2a04080005fe?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Y2hvY29sYXRlJTIwQnJvd25pZXxlbnwwfHwwfHx8MA%3D%3D" },
    isVeg: true,
    rating: "4.8",
    preparationTime: "15 min",
  }
];

export default function DeliciousBite() {
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
