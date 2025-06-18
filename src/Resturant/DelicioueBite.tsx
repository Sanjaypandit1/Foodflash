import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity, StatusBar, Platform } from 'react-native';
import React, { useState } from 'react';
import { RouteProp, useNavigation, useRoute, NavigationProp } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import LinearGradient from "react-native-linear-gradient"
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
  category: string; // Added category field
}

// Changed from FilterOption type to string for more flexibility
type FilterOption = string;

// Sample food items data with added category field
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
    category: "pizza"
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
    category: "pizza"
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
    category: "pizza"
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
    category: "pizza"
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
    category: "others"
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
    category: "momo"
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
    category: "momo"
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
    category: "momo"
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
    category: "momo"
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
    category: "chowmin"
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
    category: "chowmin"
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
    category: "burger"
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
    category: "burger"
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
    category: "biryani"
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
    category: "biryani"
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
    category: "biryani"
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
    category: "khana"
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
    category: "drinks"
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
    category: "drinks"
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
    category: "drinks"
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
    category: "drinks"
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
    category: "others"
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
    category: "others"
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
    category: "others"
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
    category: "others"
  }
];
export default function DeliciousBite() {
  const route = useRoute<RouteProp<RootStackParamList, 'RestaurantDetails'>>();
  const { restaurant } = route.params;
  const [filter, setFilter] = useState<FilterOption>('all');

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const filterCategories = ['all', 'momo', 'chowmin', 'drinks', 'pizza', 'khana', 'burger', 'biryani', 'others'];

  const filteredFoodItems = foodItems.filter(item => {
    if (filter === 'all') return true;
    return item.category === filter;
  });

  const renderFoodItem = ({ item }: { item: FoodItem }) => (
    <TouchableOpacity
      style={styles.foodCard}
      activeOpacity={0.9}
      onPress={() => navigation.navigate('FoodItemDetail', {
        item,
        restaurantName: restaurant.name,
      })}
    >
      <View style={styles.foodInfo}>
        <View style={styles.foodHeader}>
          <Text style={styles.foodName}>{item.name}</Text>
          <View style={[styles.vegBadge, { backgroundColor: item.isVeg ? '#0f8a0f' : '#b30000' }]}>
            <Text style={styles.vegBadgeText}>{item.isVeg ? 'VEG' : 'NON-VEG'}</Text>
          </View>
        </View>

        <Text style={styles.foodPrice}>Rs. {item.price}</Text>
        <Text style={styles.foodDescription} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.foodMeta}>
          <View style={styles.ratingContainer}>
            <MaterialIcons name="star" size={16} color="#FFD700" />
            <Text style={styles.foodRating}>{item.rating}</Text>
          </View>
          <View style={styles.timeContainer}>
            <MaterialIcons name="access-time" size={14} color="#666" />
            <Text style={styles.foodTime}>{item.preparationTime}</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.addButton} 
          onPress={() => navigation.navigate('FoodItemDetail', { item })}
        >
          <Text style={styles.addButtonText}>ADD +</Text>
        </TouchableOpacity>
      </View>

      <Image source={item.image} style={styles.foodImage} resizeMode="cover" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Restaurant Header with Image */}
       <View style={styles.restaurantHeader}>
    <Image 
             source={{ uri: restaurant.image }} 
             style={styles.restaurantImage}
             resizeMode="cover"
           />
      <LinearGradient
        colors={['rgba(0,0,0,0.7)', 'transparent']}
        style={styles.imageOverlay}
      />
        
        <View style={styles.headerContent}>
          <Text style={styles.restaurantName}>{restaurant.name}</Text>
          <View style={styles.restaurantInfoContainer}>
            <Text style={styles.restaurantInfo}>{restaurant.cuisine}</Text>
            <View style={styles.infoSeparator} />
            <View style={styles.ratingContainer}>
              <MaterialIcons name="star" size={16} color="#FFD700" />
              <Text style={styles.restaurantInfo}>{restaurant.rating}</Text>
            </View>
            <View style={styles.infoSeparator} />
            <Text style={styles.restaurantInfo}>{restaurant.deliveryTime}</Text>
          </View>
        </View>
      </View>

      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Filter by Category</Text>
        <FlatList
          data={filterCategories}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item}
          renderItem={({ item: category }) => (
            <TouchableOpacity
              style={[styles.filterOption, filter === category && styles.filterOptionActive]}
              onPress={() => setFilter(category)}
            >
              <Text style={[styles.filterText, filter === category && styles.filterTextActive]}>
                {category === 'all' ? 'All' : category.charAt(0).toUpperCase() + category.slice(1)}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.filterOptions}
        />
      </View>

      <FlatList
        data={filteredFoodItems}
        renderItem={renderFoodItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.foodList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  
  },
  restaurantHeader: {
    height: 220,
    marginBottom: 16,
    position: 'relative',
  },
  restaurantImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  imageOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '40%',
  },
  headerContent: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  restaurantName: {
    fontSize: 28,
    fontWeight: "800",
    color: "white",
    marginBottom: 8,
    fontFamily: 'sans-serif-condensed',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  restaurantInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  restaurantInfo: {
    fontSize: 15,
    color: "rgba(255,255,255,0.9)",
    marginRight: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  infoSeparator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.7)',
    marginHorizontal: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterContainer: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    color: '#333',
    letterSpacing: 0.5,
  },
  filterOptions: {
    paddingRight: 16,
    gap: 12,
  },
  filterOption: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  filterOptionActive: {
    backgroundColor: '#FF3F00',
    borderColor: '#FF3F00',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  filterTextActive: {
    color: 'white',
    fontWeight: '600',
  },
  foodList: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  foodCard: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  foodInfo: {
    flex: 1,
    marginRight: 16,
  },
  foodHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  foodName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    flex: 1,
    marginRight: 12,
  },
  vegBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  vegBadgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  foodPrice: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FF3F00",
    marginBottom: 8,
  },
  foodDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
    lineHeight: 20,
  },
  foodMeta: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: 'center',
    gap: 16,
  },
  foodRating: {
    fontSize: 14,
    color: "#333",
    marginLeft: 4,
    fontWeight: '600',
  },
  foodTime: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
  foodImage: {
    width: 110,
    height: 110,
    borderRadius: 12,
  },
  addButton: {
    backgroundColor: "#FF3F00",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: "flex-start",
    shadowColor: "#FF3F00",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 14,
    letterSpacing: 0.5,
  },
});
