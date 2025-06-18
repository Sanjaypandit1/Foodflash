"use client"

import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity,   StatusBar, Platform } from "react-native"
import { useState } from "react"
import { type RouteProp, useNavigation, useRoute, type NavigationProp } from "@react-navigation/native"
import type { ImageSourcePropType } from "react-native"
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import LinearGradient from "react-native-linear-gradient"

// Define types
type RootStackParamList = {
  Home: undefined
  RestaurantDetails: { restaurant: Restaurant }
  FoodItemDetail: {
    item: FoodItem
    restaurantName?: string // Add this line to include restaurantName
  }
}

type Restaurant = {
  id: string
  name: string
  rating: string
  cuisine: string
  deliveryTime: string
  image: string
}

type FoodItem = {
  id: string
  name: string
  price: string
  description: string
  image: { uri: string } | ImageSourcePropType
  isVeg: boolean
  rating: string
  preparationTime: string
  category: string // Added category field
}

// Changed from FilterOption type to string for more flexibility
type FilterOption = string

// Sample food items data with fixed image format and added category
const foodItems: FoodItem[] = [
  {
    id: "1",
    name: "Chicken Pizza",
    price: "350",
    description: "Hand-tossed pizza topped with juicy chicken pieces, rich tomato sauce, and lots of cheese.",
    image: { uri: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38" },
    isVeg: false,
    rating: "4.6",
    preparationTime: "25 min",
    category: "pizza"
  },
  {
    id: "2",
    name: "Veg Pizza",
    price: "300",
    description: "Fresh vegetables, mozzarella cheese and basil on a crispy pizza base.",
    image: { uri: "https://images.unsplash.com/photo-1506354666786-959d6d497f1a" },
    isVeg: true,
    rating: "4.5",
    preparationTime: "20 min",
    category: "pizza"
  },
  {
    id: "3",
    name: "Cheese Pizza",
    price: "320",
    description: "Cheesy delight with mozzarella and cheddar layers on thin crust.",
    image: { uri: "https://images.unsplash.com/photo-1541745537411-b8046dc6d66c" },
    isVeg: true,
    rating: "4.7",
    preparationTime: "20 min",
    category: "pizza"
  },
  {
    id: "4",
    name: "Egg Pizza",
    price: "330",
    description: "Soft baked eggs with a cheesy pizza base and tomato sauce.",
    image: { uri: "https://images.unsplash.com/photo-1595854341625-f33ee10dbf94" },
    isVeg: false,
    rating: "4.4",
    preparationTime: "22 min",
    category: "pizza"
  },
  {
    id: "5",
    name: "Mushroom Pizza",
    price: "310",
    description: "Fresh mushrooms sautéed with herbs, loaded on top of cheesy pizza.",
    image: { uri: "https://images.unsplash.com/photo-1513104890138-7c749659a591" },
    isVeg: true,
    rating: "4.5",
    preparationTime: "20 min",
    category: "pizza"
  },
  {
    id: "6",
    name: "Veg Steam Momo",
    price: "150",
    description: "Steamed dumplings filled with seasonal veggies and light spices.",
    image: { uri: "https://media.istockphoto.com/id/1292635321/photo/veg-steam-momo-nepalese-traditional-dish-momo-stuffed-with-vegetables-and-then-cooked-and.webp?a=1&b=1&s=612x612&w=0&k=20&c=UnTAWRhFjF0ERXdBmZXCYQU5nsLGAHfKwbGBqQ6QzT0=" },
    isVeg: true,
    rating: "4.3",
    preparationTime: "15 min",
    category: "momo"
  },
  {
    id: "7",
    name: "Chicken Steam Momo",
    price: "180",
    description: "Tender chicken filled in steamed momos, served with spicy chutney.",
    image: { uri: "https://media.istockphoto.com/id/1475787002/photo/chicken-dumplings-in-a-plate-with-chopsticks-directly-above-photo.webp?a=1&b=1&s=612x612&w=0&k=20&c=Ub3lgPcUD11P-nEGBztAcWBGZojeEqJ6gPWUpQ9D3uE=" },
    isVeg: false,
    rating: "4.5",
    preparationTime: "15 min",
    category: "momo"
  },
  {
    id: "8",
    name: "Buff Momo",
    price: "190",
    description: "Traditional Nepali buff momos packed with spices.",
    image: { uri: "https://media.istockphoto.com/id/636287858/photo/nepali-cuisine-steam-mo-mo-or-dumpling.webp?a=1&b=1&s=612x612&w=0&k=20&c=qRhH-hnUPZppMP3rUfmBcPEiS0bUXH9mf8Svs06dwsQ=" },
    isVeg: false,
    rating: "4.5",
    preparationTime: "15 min",
    category: "momo"
  },
  {
    id: "9",
    name: "Veg Jhol Momo",
    price: "170",
    description: "Vegetable momos dipped in spicy jhol (soup) sauce.",
    image: { uri: "https://media.istockphoto.com/id/496359484/photo/dumpling-soup.jpg?s=1024x1024&w=is&k=20&c=--1Hxz1rrBxxHQyYbondSv_B_kTv3kdvRUMh1bLteC0=" },
    isVeg: true,
    rating: "4.4",
    preparationTime: "20 min",
    category: "momo"
  },
  {
    id: "10",
    name: "Chicken Jhol Momo",
    price: "200",
    description: "Chicken stuffed momos with jhol (gravy) special sauce.",
    image: { uri: "https://media.istockphoto.com/id/1458219795/photo/jhol-momo-jhol-momo-are-steamed-dumplings-made-with-spiced-meat-fillings-momo-jhol-achar-or.webp?a=1&b=1&s=612x612&w=0&k=20&c=3CdF0QeKfJB_52TQRyX3flkbkCgSyJvDfxG2I7OosfU=" },
    isVeg: false,
    rating: "4.6",
    preparationTime: "20 min",
    category: "momo"
  },
  {
    id: "11",
    name: "Chicken Chowmein",
    price: "200",
    description: "Stir-fried noodles with tender chicken and mixed veggies.",
    image: { uri: "https://media.istockphoto.com/id/1023472716/photo/chicken-chow-mein.webp?a=1&b=1&s=612x612&w=0&k=20&c=imRM1hOMVFkjAnlpR8RpIGgya0X2iERxfsKT1UdCWIY=" },
    isVeg: false,
    rating: "4.5",
    preparationTime: "15 min",
    category: "chowmin"
  },
  {
    id: "12",
    name: "Veg Chowmein",
    price: "180",
    description: "Flavorful fried noodles with colorful vegetables.",
    image: { uri: "https://images.unsplash.com/photo-1585032226651-759b368d7246" },
    isVeg: true,
    rating: "4.3",
    preparationTime: "15 min",
    category: "chowmin"
  },
  {
    id: "13",
    name: "Paneer Chowmein",
    price: "220",
    description: "Crispy paneer tossed with spicy stir-fried noodles.",
    image: { uri: "https://media.istockphoto.com/id/1294041937/photo/vegetable-chowmein-texture-background.webp?a=1&b=1&s=612x612&w=0&k=20&c=goW6UuVNaPV61wCyeCvwpkD5Mb87QRKwrRx7M9Ohxto=" },
    isVeg: true,
    rating: "4.4",
    preparationTime: "15 min",
    category: "chowmin"
  },
  {
    id: "14",
    name: "Veg Burger",
    price: "150",
    description: "Crispy veg patty, lettuce, cheese and mayo inside a soft bun.",
    image: { uri: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dmVnJTIwYnVyZ2VyfGVufDB8fDB8fHww" },
    isVeg: true,
    rating: "4.2",
    preparationTime: "10 min",
    category: "burger"
  },
  {
    id: "15",
    name: "Chicken Burger",
    price: "180",
    description: "Juicy fried chicken patty topped with cheese and sauces.",
    image: { uri: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd" },
    isVeg: false,
    rating: "4.5",
    preparationTime: "10 min",
    category: "burger"
  },
  {
    id: "16",
    name: "Egg Burger",
    price: "170",
    description: "Fried egg, crispy patty, cheese, and veggies inside a burger bun.",
    image: { uri: "https://images.unsplash.com/photo-1609796632543-65cdda96651c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8ZWdnJTIwYnVyZ2VyfGVufDB8fDB8fHww" },
    isVeg: false,
    rating: "4.3",
    preparationTime: "10 min",
    category: "burger"
  },
  {
    id: "17",
    name: "Veg Biryani",
    price: "250",
    description: "Flavorful biryani made with basmati rice and fresh vegetables.",
    image: { uri: "https://media.istockphoto.com/id/495188382/photo/indian-pulav-vegetable-rice-veg-biryani-basmati-rice.webp?a=1&b=1&s=612x612&w=0&k=20&c=7ovRTJwxa_x4Q_BHoiLhiTKdTneDQ5W_m4_jJyOHbBM=" },
    isVeg: true,
    rating: "4.5",
    preparationTime: "25 min",
    category: "biryani"
  },
  {
    id: "18",
    name: "Chicken Biryani",
    price: "320",
    description: "Traditional chicken biryani with rich spices and saffron rice.",
    image: { uri: "https://images.unsplash.com/photo-1701579231305-d84d8af9a3fd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2hpY2tlbiUyMGJpcnlhbml8ZW58MHx8MHx8fDA%3D" },
    isVeg: false,
    rating: "4.7",
    preparationTime: "25 min",
    category: "biryani"
  },
  {
    id: "19",
    name: "Mutton Biryani",
    price: "400",
    description: "Spicy and tender mutton pieces layered with basmati rice.",
    image: { uri: "https://media.istockphoto.com/id/469866881/photo/mutton-gosht-biryani.webp?a=1&b=1&s=612x612&w=0&k=20&c=ceb_mB8xxyD7sipoGoO3A77TgD3_a8RTrhF3LM24ixk=" },
    isVeg: false,
    rating: "4.8",
    preparationTime: "30 min",
    category: "biryani"
  },
  {
    id: "20",
    name: "Veg Khana Set",
    price: "300",
    description: "Traditional Nepali thali with rice, lentils, vegetables, and pickles.",
    image: { uri: "https://media.istockphoto.com/id/673844932/photo/nepali-food.webp?a=1&b=1&s=612x612&w=0&k=20&c=m87zDAwkaNQwn-XA3NOp9zlkXZ1LIaUYtOpuJU_fU1I=" },
    isVeg: true,
    rating: "4.6",
    preparationTime: "30 min",
    category: "khana"
  },
  {
    id: "21",
    name: "Chicken Khana Set",
    price: "400",
    description: "Nepali thali with rice, dal, chicken curry, and vegetables.",
    image: { uri: "https://images.unsplash.com/photo-1569058242252-623df46b5025?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2hpY2tlbiUyMHJpY2V8ZW58MHx8MHx8fDA%3D" },
    isVeg: false,
    rating: "4.7",
    preparationTime: "30 min",
    category: "khana"
  },
  {
    id: "22",
    name: "Mutton Khana Set",
    price: "450",
    description: "Rice and lentils served with mutton curry and sides.",
    image: { uri: "https://media.istockphoto.com/id/623426322/photo/madras-beef-with-basmati-rice-horizontal-top-view.webp?a=1&b=1&s=612x612&w=0&k=20&c=XYa6IC83vAfZzWwfEQhNmHjBdGGfr5SVGhtsB4SyC74=" },
    isVeg: false,
    rating: "4.8",
    preparationTime: "35 min",
    category: "khana"
  },
  {
    id: "23",
    name: "Coca Cola",
    price: "60",
    description: "Chilled Coca Cola to refresh your day.",
    image: { uri: "https://images.unsplash.com/photo-1624552184280-9e9631bbeee9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y29rZXxlbnwwfHwwfHx8MA%3D%3D" },
    isVeg: true,
    rating: "4.5",
    preparationTime: "2 min",
    category: "drinks"
  },
  {
    id: "24",
    name: "Fanta",
    price: "60",
    description: "Sweet and fizzy orange flavored drink.",
    image: { uri: "https://images.unsplash.com/photo-1632818924360-68d4994cfdb2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZmFudGF8ZW58MHx8MHx8fDA%3D" },
    isVeg: true,
    rating: "4.4",
    preparationTime: "2 min",
    category: "drinks"
  },
  {
    id: "25",
    name: "Maaza",
    price: "60",
    description: "Delicious mango drink for a fruity refreshment.",
    image: { uri: "https://images.unsplash.com/photo-1657600704994-ea5020a66231?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFhemF8ZW58MHx8MHx8fDA%3D" },
    isVeg: true,
    rating: "4.3",
    preparationTime: "2 min",
    category: "drinks"
  },
]

export default function BurgerJoint() {
  const route = useRoute<RouteProp<RootStackParamList, "RestaurantDetails">>()
  const { restaurant } = route.params
  const [filter, setFilter] = useState<FilterOption>("all")

  const navigation = useNavigation<NavigationProp<RootStackParamList>>()
  const filterCategories = ['all', 'momo', 'chowmin', 'drinks', 'pizza', 'khana', 'burger', 'biryani', 'others']

  const filteredFoodItems = foodItems.filter((item) => {
    if (filter === "all") return true
    return item.category === filter
  })

  const renderFoodItem = ({ item }: { item: FoodItem }) => (
    <TouchableOpacity
      style={styles.foodCard}
      activeOpacity={0.9}
      onPress={() =>
        navigation.navigate("FoodItemDetail", {
          item,
          restaurantName: restaurant.name,
        })
      }
    >
      <View style={styles.foodInfo}>
        <View style={styles.foodHeader}>
          <Text style={styles.foodName}>{item.name}</Text>
          <View style={[styles.vegBadge, { backgroundColor: item.isVeg ? "#0f8a0f" : "#b30000" }]}>
            <Text style={styles.vegBadgeText}>{item.isVeg ? "VEG" : "NON-VEG"}</Text>
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
          onPress={() => navigation.navigate("FoodItemDetail", { item })}
        >
          <Text style={styles.addButtonText}>ADD +</Text>
        </TouchableOpacity>
      </View>

      <Image source={item.image} style={styles.foodImage} resizeMode="cover" />
    </TouchableOpacity>
  )

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
  )
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
})