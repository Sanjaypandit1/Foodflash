"use client"

import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity } from "react-native"
import { useState } from "react"
import { type RouteProp, useNavigation, useRoute, type NavigationProp } from "@react-navigation/native"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import LinearGradient from "react-native-linear-gradient"
import type { ImageSourcePropType } from "react-native"
import { useTranslation } from "react-i18next"

// Define types
type RootStackParamList = {
  Home: undefined
  RestaurantDetails: { restaurant: Restaurant }
  FoodItemDetail: {
    item: FoodItem
    restaurantName?: string
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
  image: ImageSourcePropType
  isVeg: boolean
  rating: string
  preparationTime: string
  category: string
}

type FilterOption = string

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
    category: "pizza",
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
    category: "pizza",
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
    category: "pizza",
  },
  {
    id: "29",
    name: "Paneer Pizza",
    price: "340",
    description: "Indian style pizza with spiced paneer cubes and bell peppers.",
    image: {
      uri: "https://images.unsplash.com/photo-1573821663912-569905455b1c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGFuZWVyJTIwcGl6emF8ZW58MHx8MHx8fDA%3D",
    },
    isVeg: true,
    rating: "4.5",
    preparationTime: "22 min",
    category: "pizza",
  },
  {
    id: "30",
    name: "Cheese Garlic Bread",
    price: "120",
    description: "Toasted bread topped with garlic butter and melted cheese.",
    image: {
      uri: "https://images.unsplash.com/photo-1573140401552-3fab0b24306f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Y2hlZXNlJTIwR2FybGljJTIwYnJlYWR8ZW58MHx8MHx8fDA%3D",
    },
    isVeg: true,
    rating: "4.4",
    preparationTime: "10 min",
    category: "others",
  },
  // ... rest of the food items remain the same
]

export default function DeliciousBite() {
  const { t } = useTranslation()
  const route = useRoute<RouteProp<RootStackParamList, "RestaurantDetails">>()
  const { restaurant } = route.params
  const [filter, setFilter] = useState<FilterOption>("all")

  const navigation = useNavigation<NavigationProp<RootStackParamList>>()
  const filterCategories = ["all", "momo", "chowmin", "drinks", "pizza", "khana", "burger", "biryani", "others"]

  const filteredFoodItems = foodItems.filter((item) => {
    if (filter === "all") return true
    return item.category === filter
  })

  const getCategoryDisplayName = (category: string) => {
    if (category === "all") return t("categories.subtypes.all")
    return t(`categories.subtypes.${category}`, category.charAt(0).toUpperCase() + category.slice(1))
  }

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
            <Text style={styles.vegBadgeText}>{item.isVeg ? t("foodDetail.veg") : t("foodDetail.nonVeg")}</Text>
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

        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("FoodItemDetail", { item })}>
          <Text style={styles.addButtonText}>{t("common.addToCart").toUpperCase()}</Text>
        </TouchableOpacity>
      </View>

      <Image source={item.image} style={styles.foodImage} resizeMode="cover" />
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      {/* Restaurant Header with Image */}
      <View style={styles.restaurantHeader}>
        <Image source={{ uri: restaurant.image }} style={styles.restaurantImage} resizeMode="cover" />
        <LinearGradient colors={["rgba(0,0,0,0.7)", "transparent"]} style={styles.imageOverlay} />

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
        <Text style={styles.filterLabel}>{t("categories.title")}</Text>
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
                {getCategoryDisplayName(category)}
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
    position: "relative",
  },
  restaurantImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  imageOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: "40%",
  },
  headerContent: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
  restaurantName: {
    fontSize: 28,
    fontWeight: "800",
    color: "white",
    marginBottom: 8,
    fontFamily: "sans-serif-condensed",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  restaurantInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  restaurantInfo: {
    fontSize: 15,
    color: "rgba(255,255,255,0.9)",
    marginRight: 8,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  infoSeparator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.7)",
    marginHorizontal: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  filterContainer: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
    color: "#333",
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
    backgroundColor: "#F5F5F5",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  filterOptionActive: {
    backgroundColor: "#FF3F00",
    borderColor: "#FF3F00",
  },
  filterText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  filterTextActive: {
    color: "white",
    fontWeight: "600",
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
    borderColor: "#F0F0F0",
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
    alignSelf: "flex-start",
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
    alignItems: "center",
    gap: 16,
  },
  foodRating: {
    fontSize: 14,
    color: "#333",
    marginLeft: 4,
    fontWeight: "600",
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
