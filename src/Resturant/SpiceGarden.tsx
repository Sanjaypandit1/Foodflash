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


// Sample food items data
// For SpiceGarden.tsx - Indian cuisine food items
const foodItems: FoodItem[] = [
  {
    id: "51",
    name: "Chicken Pizza",
    price: "380",
    description: "Wood-fired pizza with grilled chicken, bell peppers, and extra cheese.",
    image: { uri: "https://images.unsplash.com/photo-1552539618-7eec9b4d1796?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGNoaWNrZW4lMjBwaXp6YXxlbnwwfHwwfHx8MA%3D%3D" },
    isVeg: false,
    rating: "4.7",
    preparationTime: "28 min",
  },
  {
    id: "52",
    name: "Veg Pizza",
    price: "320",
    description: "Garden fresh veggies on whole wheat crust with garlic sauce.",
    image: { uri: "https://images.unsplash.com/photo-1681567604770-0dc826c870ae?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHZlZyUyMHBpenphfGVufDB8fDB8fHww" },
    isVeg: true,
    rating: "4.6",
    preparationTime: "22 min",
  },
  {
    id: "53",
    name: "Cheese Pizza",
    price: "340",
    description: "Four cheese blend on thick crust with oregano seasoning.",
    image: { uri: "https://images.unsplash.com/photo-1601924582970-9238bcb495d9" },
    isVeg: true,
    rating: "4.8",
    preparationTime: "20 min",
  },
  {
    id: "54",
    name: "Egg Pizza",
    price: "350",
    description: "Farm fresh eggs baked on pizza with cherry tomatoes and herbs.",
    image: { uri: "https://images.unsplash.com/photo-1541745537411-b8046dc6d66c" },
    isVeg: false,
    rating: "4.5",
    preparationTime: "25 min",
  },
  {
    id: "55",
    name: "Mushroom Pizza",
    price: "330",
    description: "Exotic mushrooms with truffle oil on thin crust pizza.",
    image: { uri: "https://images.unsplash.com/photo-1513104890138-7c749659a591" },
    isVeg: true,
    rating: "4.7",
    preparationTime: "23 min",
  },
  {
    id: "56",
    name: "Veg Steam Momo",
    price: "160",
    description: "Delicate steamed dumplings with organic vegetables and sesame dip.",
    image: { uri: "https://images.unsplash.com/photo-1635844035031-72e3a3ff1e42?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHZlZyUyMGR1bXBsaW5nfGVufDB8fDB8fHww" },
    isVeg: true,
    rating: "4.4",
    preparationTime: "18 min",
  },
  {
    id: "57",
    name: "Chicken Steam Momo",
    price: "190",
    description: "Juicy chicken-filled momos with ginger-garlic sauce.",
    image: { uri: "https://plus.unsplash.com/premium_photo-1661600643912-dc6dbb1db475?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y2hpY2tlbiUyMGR1bXBsaW5nfGVufDB8fDB8fHww" },
    isVeg: false,
    rating: "4.6",
    preparationTime: "18 min",
  },
  {
    id: "58",
    name: "Buff Momo",
    price: "200",
    description: "Authentic buffalo meat momos with spicy tomato chutney.",
    image: { uri: "https://images.unsplash.com/photo-1705186383409-e6e6da37fc53?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8amhvbCUyMGR1bXBsaW5nfGVufDB8fDB8fHww" },
    isVeg: false,
    rating: "4.7",
    preparationTime: "18 min",
  },
  {
    id: "59",
    name: "Veg Jhol Momo",
    price: "180",
    description: "Steamed veg momos immersed in aromatic herb-infused broth.",
    image: { uri: "https://images.unsplash.com/photo-1707895601304-62327fd562ef?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDd8fGpob2wlMjBkdW1wbGluZ3xlbnwwfHwwfHx8MA%3D%3D" },
    isVeg: true,
    rating: "4.5",
    preparationTime: "22 min",
  },
  {
    id: "60",
    name: "Chicken Jhol Momo",
    price: "210",
    description: "Chicken momos served in rich bone broth with spices.",
    image: { uri: "https://images.unsplash.com/photo-1656759637476-1ea88a76d104?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjIwfHxqaG9sJTIwZHVtcGxpbmd8ZW58MHx8MHx8fDA%3D" },
    isVeg: false,
    rating: "4.7",
    preparationTime: "22 min",
  },
  {
    id: "61",
    name: "Chicken Chowmein",
    price: "210",
    description: "Hakka-style noodles with shredded chicken and bean sprouts.",
    image: { uri: "https://images.unsplash.com/photo-1617622141675-d3005b9067c5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y2hvd21laW58ZW58MHx8MHx8fDA%3D" },
    isVeg: false,
    rating: "4.6",
    preparationTime: "18 min",
  },
  {
    id: "62",
    name: "Veg Chowmein",
    price: "190",
    description: "Stir-fried noodles with seasonal organic vegetables.",
    image: { uri: "https://images.unsplash.com/photo-1585032226651-759b368d7246" },
    isVeg: true,
    rating: "4.4",
    preparationTime: "18 min",
  },
  {
    id: "63",
    name: "Paneer Chowmein",
    price: "230",
    description: "Tandoori paneer cubes with schezwan flavored noodles.",
    image: { uri: "https://images.unsplash.com/photo-1585503913867-f3382c5d1122?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y2hvd21laW58ZW58MHx8MHx8fDA%3D" },
    isVeg: true,
    rating: "4.5",
    preparationTime: "18 min",
  },
  {
    id: "64",
    name: "Veg Burger",
    price: "160",
    description: "Crunchy veg patty with special sauce in multigrain bun.",
    image: { uri: "https://images.unsplash.com/photo-1571091718767-18b5b1457add" },
    isVeg: true,
    rating: "4.3",
    preparationTime: "12 min",
  },
  {
    id: "65",
    name: "Chicken Burger",
    price: "190",
    description: "Spicy chicken patty with coleslaw and chipotle mayo.",
    image: { uri: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd" },
    isVeg: false,
    rating: "4.6",
    preparationTime: "12 min",
  },
  {
    id: "66",
    name: "Egg Burger",
    price: "180",
    description: "Double egg patty with cheese and caramelized onions.",
    image: { uri: "https://images.unsplash.com/photo-1609796632543-65cdda96651c" },
    isVeg: false,
    rating: "4.4",
    preparationTime: "12 min",
  },
  {
    id: "67",
    name: "Veg Biryani",
    price: "260",
    description: "Fragrant basmati rice with assorted vegetables and saffron.",
    image: { uri: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8YmlyeWFuaXxlbnwwfHwwfHx8MA%3D%3D" },
    isVeg: true,
    rating: "4.6",
    preparationTime: "28 min",
  },
  {
    id: "68",
    name: "Chicken Biryani",
    price: "340",
    description: "Dum-cooked biryani with succulent chicken pieces.",
    image: { uri: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a" },
    isVeg: false,
    rating: "4.8",
    preparationTime: "28 min",
  },
  {
    id: "69",
    name: "Mutton Biryani",
    price: "420",
    description: "Premium mutton pieces slow-cooked with aged basmati rice.",
    image: { uri: "https://images.unsplash.com/photo-1701579231305-d84d8af9a3fd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmlyeWFuaXxlbnwwfHwwfHx8MA%3D%3D" },
    isVeg: false,
    rating: "4.9",
    preparationTime: "35 min",
  },
  {
    id: "70",
    name: "Veg Khana Set",
    price: "320",
    description: "Traditional thali with 8 different seasonal vegetable dishes.",
    image: { uri: "https://images.unsplash.com/photo-1666251214795-a1296307d29c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDh8fHJpY2UlMjBzZXR8ZW58MHx8MHx8fDA%3D" },
    isVeg: true,
    rating: "4.7",
    preparationTime: "35 min",
  },
  {
    id: "71",
    name: "Chicken Khana Set",
    price: "420",
    description: "Complete meal with chicken curry, rice, dal, and sides.",
    image: { uri: "https://images.unsplash.com/photo-1544378730-8b5104b18790?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTh8fG5vbiUyMHZlZyUyMHJpY2V8ZW58MHx8MHx8fDA%3D" },
    isVeg: false,
    rating: "4.8",
    preparationTime: "35 min",
  },
  {
    id: "72",
    name: "Mutton Khana Set",
    price: "470",
    description: "Royal platter with mutton curry, 3 side dishes, and desserts.",
    image: { uri: "https://images.unsplash.com/photo-1691170979035-27e5ec943205?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bXV0dG9uJTIwYW5kJTIwcmljZXxlbnwwfHwwfHx8MA%3D%3D" },
    isVeg: false,
    rating: "4.9",
    preparationTime: "40 min",
  },
  {
    id: "73",
    name: "Coca Cola",
    price: "65",
    description: "Ice cold Coca Cola in chilled glass bottle.",
    image: { uri: "https://images.unsplash.com/photo-1554866585-cd94860890b7" },
    isVeg: true,
    rating: "4.5",
    preparationTime: "2 min",
  },
  {
    id: "74",
    name: "Fanta",
    price: "65",
    description: "Refreshing orange soda with real fruit flavor.",
    image: { uri: "https://images.unsplash.com/photo-1632818924360-68d4994cfdb2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZmFudGF8ZW58MHx8MHx8fDA%3D" },
    isVeg: true,
    rating: "4.4",
    preparationTime: "2 min",
  },
  {
    id: "75",
    name: "Maaza",
    price: "65",
    description: "Pure Alphonso mango pulp drink, no artificial flavors.",
    image: { uri: "https://images.unsplash.com/photo-1657600704994-ea5020a66231?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFhemF8ZW58MHx8MHx8fDA%3D" },
    isVeg: true,
    rating: "4.6",
    preparationTime: "2 min",
  }
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
