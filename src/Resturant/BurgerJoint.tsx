"use client"

import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity } from "react-native"
import { useState } from "react"
import { type RouteProp, useNavigation, useRoute, type NavigationProp } from "@react-navigation/native"
import type { ImageSourcePropType } from "react-native"

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
}

type FilterOption = "all" | "veg" | "nonVeg"

// Sample food items data with fixed image format
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
  },
  {
    id: "6",
    name: "Veg Steam Momo",
    price: "150",
    description: "Steamed dumplings filled with seasonal veggies and light spices.",
    image: { uri: "https://media.istockphoto.com/id/1292635321/photo/veg-steam-momo-nepalese-traditional-dish-momo-stuffed-with-vegetables-and-then-cooked-and.webp?a=1&b=1&s=612x612&w=0&k=20&c=UnTAWRhFjF0ERXdBmZXCYQU5nsLGAHfKwbGBqQ6QzT0=" }, // Proper veg momo image
    isVeg: true,
    rating: "4.3",
    preparationTime: "15 min",
  },
  {
    id: "7",
    name: "Chicken Steam Momo",
    price: "180",
    description: "Tender chicken filled in steamed momos, served with spicy chutney.",
    image: { uri: "https://media.istockphoto.com/id/1475787002/photo/chicken-dumplings-in-a-plate-with-chopsticks-directly-above-photo.webp?a=1&b=1&s=612x612&w=0&k=20&c=Ub3lgPcUD11P-nEGBztAcWBGZojeEqJ6gPWUpQ9D3uE=" }, // Proper chicken momo image
    isVeg: false,
    rating: "4.5",
    preparationTime: "15 min",
  },
  {
    id: "8",
    name: "Buff Momo",
    price: "190",
    description: "Traditional Nepali buff momos packed with spices.",
    image: { uri: "https://media.istockphoto.com/id/636287858/photo/nepali-cuisine-steam-mo-mo-or-dumpling.webp?a=1&b=1&s=612x612&w=0&k=20&c=qRhH-hnUPZppMP3rUfmBcPEiS0bUXH9mf8Svs06dwsQ=" }, // Proper buff momo image
    isVeg: false,
    rating: "4.5",
    preparationTime: "15 min",
  },
  {
    id: "9",
    name: "Veg Jhol Momo",
    price: "170",
    description: "Vegetable momos dipped in spicy jhol (soup) sauce.",
    image: { uri: "https://media.istockphoto.com/id/496359484/photo/dumpling-soup.jpg?s=1024x1024&w=is&k=20&c=--1Hxz1rrBxxHQyYbondSv_B_kTv3kdvRUMh1bLteC0=" }, // Proper jhol momo image
    isVeg: true,
    rating: "4.4",
    preparationTime: "20 min",
  },
  {
    id: "10",
    name: "Chicken Jhol Momo",
    price: "200",
    description: "Chicken stuffed momos with jhol (gravy) special sauce.",
    image: { uri: "https://media.istockphoto.com/id/1458219795/photo/jhol-momo-jhol-momo-are-steamed-dumplings-made-with-spiced-meat-fillings-momo-jhol-achar-or.webp?a=1&b=1&s=612x612&w=0&k=20&c=3CdF0QeKfJB_52TQRyX3flkbkCgSyJvDfxG2I7OosfU=" }, // Proper chicken jhol momo image
    isVeg: false,
    rating: "4.6",
    preparationTime: "20 min",
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
  },
]

export default function BurgerJoint() {
  const route = useRoute<RouteProp<RootStackParamList, "RestaurantDetails">>()
  const { restaurant } = route.params
  const [filter, setFilter] = useState<FilterOption>("all")

  // Properly type the navigation object
  const navigation = useNavigation<NavigationProp<RootStackParamList>>()

  // Filter food items based on selected filter
  const filteredFoodItems = foodItems.filter((item) => {
    if (filter === "all") {
      return true
    }
    if (filter === "veg") {
      return item.isVeg
    }
    if (filter === "nonVeg") {
      return !item.isVeg
    }
    return true
  })

  const renderFoodItem = ({ item }: { item: FoodItem }) => (
    <TouchableOpacity
      style={styles.foodCard}
      activeOpacity={0.9}
      onPress={() =>
        navigation.navigate("FoodItemDetail", {
          item,
          restaurantName: restaurant.name, // Pass the restaurant name
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
          <Text style={styles.foodRating}>★ {item.rating}</Text>
          <Text style={styles.foodTime}>{item.preparationTime}</Text>
        </View>

        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("FoodItemDetail", { item })}>
          <Text style={styles.addButtonText}>ADD</Text>
        </TouchableOpacity>
      </View>

      <Image source={item.image} style={styles.foodImage} resizeMode="cover" />
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.restaurantName}>{restaurant.name}</Text>
        <Text style={styles.restaurantInfo}>
          {restaurant.cuisine} • {restaurant.rating} ★ • {restaurant.deliveryTime}
        </Text>
      </View>

      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Filter:</Text>
        <View style={styles.filterOptions}>
          <TouchableOpacity
            style={[styles.filterOption, filter === "all" && styles.filterOptionActive]}
            onPress={() => setFilter("all")}
          >
            <Text style={[styles.filterText, filter === "all" && styles.filterTextActive]}>All</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterOption, filter === "veg" && styles.filterOptionActive]}
            onPress={() => setFilter("veg")}
          >
            <Text style={[styles.filterText, filter === "veg" && styles.filterTextActive]}>Veg</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterOption, filter === "nonVeg" && styles.filterOptionActive]}
            onPress={() => setFilter("nonVeg")}
          >
            <Text style={[styles.filterText, filter === "nonVeg" && styles.filterTextActive]}>Non-Veg</Text>
          </TouchableOpacity>
        </View>
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
    backgroundColor: "#F5F5F5",
    padding: 1,
  },
  header: {
    marginBottom: 20,
  },
  restaurantName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  restaurantInfo: {
    fontSize: 14,
    color: "#666",
  },
  filterContainer: {
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  filterOptions: {
    flexDirection: "row",
    gap: 10,
  },
  filterOption: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#EEEEEE",
  },
  filterOptionActive: {
    backgroundColor: "#FF3F00",
  },
  filterText: {
    fontSize: 14,
    color: "#666",
  },
  filterTextActive: {
    color: "white",
    fontWeight: "500",
  },
  foodList: {
    paddingBottom: 20,
  },
  foodCard: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 15,
    padding: 15,
    shadowColor: "#000",
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 5,
  },
  foodName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
    marginRight: 10,
  },
  vegBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  vegBadgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  foodPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF3F00",
    marginBottom: 5,
  },
  foodDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  foodMeta: {
    flexDirection: "row",
    marginBottom: 10,
  },
  foodRating: {
    fontSize: 14,
    color: "#FF3F00",
    marginRight: 10,
  },
  foodTime: {
    fontSize: 14,
    color: "#666",
  },
  foodImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  addButton: {
    backgroundColor: "#FF3F00",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
})
