"use client"

import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity, SafeAreaView, ScrollView, Dimensions, Animated, StatusBar, Platform } from "react-native"
import { useEffect, useState, useRef } from "react"
import { type RouteProp, useNavigation, useRoute, type NavigationProp } from "@react-navigation/native"
import type { ImageSourcePropType } from "react-native"
import Icon from 'react-native-vector-icons/MaterialIcons'
// Define types
type RootStackParamList = {
  CategoryItems: {
    categoryName: string
  }
  FoodItemDetail: {
    item: FoodItem
    restaurantName: string
  }
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
  restaurant: string
}

// Sample food items data from all restaurants
const allFoodItems = [
  // Burger Joint
  {
    id: "3",
    name: "Veg Momo",
    price: "100",
    description:
      "Soft dumplings filled with finely chopped cabbage, carrots, onions, and aromatic spices. Steamed to perfection and served with spicy tomato dipping sauce.",
    image: require("../Assets/BurgerJoint/Veg-momo.jpg"),
    isVeg: true,
    rating: "4.2",
    preparationTime: "10 min",
    restaurant: "Burger Joint",
  },
  {
    id: "6",
    name: "Chicken Momo",
    price: "150",
    description:
      "Juicy dumplings filled with minced chicken, ginger, garlic, and spring onions. Steamed to perfection and served with a spicy sesame-soy dipping sauce.",
    image: require("../Assets/BurgerJoint/chicken-momo.jpg"),
    isVeg: false,
    rating: "4.8",
    preparationTime: "25 min",
    restaurant: "Burger Joint",
  },

  // Delicious Bites
  {
    id: "9",
    name: "Veg Momo",
    price: "120",
    description:
      "Steamed dumplings filled with finely chopped vegetables, herbs, and aromatic spices. Served with spicy tomato chutney.",
    image: require("../Assets/DeliciousBite/veg-momo.jpg"),
    isVeg: true,
    rating: "4.5",
    preparationTime: "20 min",
    restaurant: "Delicious Bites",
  },
  {
    id: "15",
    name: "Chicken Momo",
    price: "200",
    description:
      "Juicy dumplings filled with minced chicken, onions, garlic, and ginger. Steamed to perfection and served with spicy red chili dipping sauce.",
    image: require("../Assets/DeliciousBite/chicken-momo.jpg"),
    isVeg: false,
    rating: "4.4",
    preparationTime: "30 min",
    restaurant: "Delicious Bites",
  },

  // Sushil Palace
  {
    id: "29",
    name: "Mutton Momo",
    price: "220",
    description:
      "Juicy dumplings filled with minced mutton, ginger, garlic, onions, and Himalayan herbs. Steamed to perfection and served with spicy tomato achar and sesame chutney.",
    image: require("../Assets/SusiPalace/mutton-momo.jpg"),
    isVeg: false,
    rating: "4.4",
    preparationTime: "30 min",
    restaurant: "Sushil Palace",
  },
  {
    id: "31",
    name: "Veg Momo",
    price: "100",
    description:
      "Soft dumplings filled with a mixture of finely chopped cabbage, carrots, onions, and Himalayan spices. Steamed and served with homemade tomato-sesame chutney.",
    image: require("../Assets/SusiPalace/veg-momo.jpeg"),
    isVeg: true,
    rating: "4.4",
    preparationTime: "30 min",
    restaurant: "Sushil Palace",
  },

  // Pizza items
  {
    id: "1",
    name: "Veg Pizza",
    price: "300",
    description:
      "Hand-tossed pizza topped with fresh vegetables, rich tomato sauce, and melted mozzarella cheese. Garnished with fresh basil leaves and a drizzle of olive oil.",
    image: require("../Assets/BurgerJoint/veg-pizza.jpeg"),
    isVeg: true,
    rating: "4.5",
    preparationTime: "20 min",
    restaurant: "Burger Joint",
  },
  {
    id: "2",
    name: "Chicken Pizza",
    price: "400",
    description:
      "Delicious pizza topped with grilled chicken pieces, bell peppers, onions, and a blend of mozzarella and cheddar cheese. Finished with our signature herb seasoning.",
    image: require("../Assets/BurgerJoint/chicken-pizza.jpg"),
    isVeg: false,
    rating: "4.7",
    preparationTime: "25 min",
    restaurant: "Burger Joint",
  },

  // Biryani items
  {
    id: "5",
    name: "Veg Biryani",
    price: "250",
    description:
      "Fragrant basmati rice cooked with mixed vegetables, saffron, and aromatic spices. Served with raita and papadum. A perfect blend of flavors and textures.",
    image: require("../Assets/BurgerJoint/veg-biryani.jpg"),
    isVeg: true,
    rating: "4.4",
    preparationTime: "30 min",
    restaurant: "Burger Joint",
  },
  {
    id: "8",
    name: "Chicken Biryani",
    price: "450",
    description:
      "Aromatic basmati rice layered with tender chicken pieces, caramelized onions, and authentic spices. Slow-cooked to perfection and garnished with fresh mint and coriander.",
    image: require("../Assets/BurgerJoint/chicken-biryani.jpg"),
    isVeg: false,
    rating: "4.7",
    preparationTime: "20 min",
    restaurant: "Burger Joint",
  },

  // Burger items
  {
    id: "4",
    name: "Veg Burger",
    price: "120",
    description:
      "Crispy vegetable patty with lettuce, tomato, onion, and cheese in a toasted sesame bun. Served with our special house sauce and a side of fries.",
    image: require("../Assets/BurgerJoint/veg-burger.webp"),
    isVeg: true,
    rating: "4.6",
    preparationTime: "15 min",
    restaurant: "Burger Joint",
  },
  {
    id: "7",
    name: "Chicken Burger",
    price: "180",
    description:
      "Grilled chicken breast with crisp lettuce, tomato, cheese, and our signature mayo in a toasted brioche bun. Served with seasoned fries and coleslaw.",
    image: require("../Assets/BurgerJoint/chicken-burger.jpg"),
    isVeg: false,
    rating: "4.8",
    preparationTime: "25 min",
    restaurant: "Burger Joint",
  },

  // Chowmin items
  {
    id: "11",
    name: "Paneer Chowmin",
    price: "120",
    description:
      "Stir-fried noodles with soft paneer cubes, bell peppers, carrots, and cabbage. Tossed in our special soy-based sauce with garlic and ginger.",
    image: require("../Assets/DeliciousBite/paneer-chowmin.jpg"),
    isVeg: true,
    rating: "4.2",
    preparationTime: "10 min",
    restaurant: "Delicious Bites",
  },
  {
    id: "16",
    name: "Chicken Chowmin",
    price: "180",
    description:
      "Wok-tossed noodles with tender chicken strips, crunchy vegetables, and our house special sauce. Garnished with spring onions and sesame seeds.",
    image: require("../Assets/DeliciousBite/chicken-chowmin.jpg"),
    isVeg: false,
    rating: "4.8",
    preparationTime: "25 min",
    restaurant: "Delicious Bites",
  },

  // Butter Chicken
  {
    id: "24",
    name: "Butter Chicken",
    price: "330",
    description:
      "Tender chicken pieces cooked in a rich, creamy tomato sauce with butter, cream, and aromatic spices. Served with naan bread or steamed rice.",
    image: require("../Assets/SpiceGarden/Butter-Chicken.jpeg"),
    isVeg: false,
    rating: "4.8",
    preparationTime: "25 min",
    restaurant: "Spice Garden",
  }
]

const { width } = Dimensions.get('window')
const itemWidth = (width - 48) / 2

const CategoryItems = () => {
  const route = useRoute<RouteProp<RootStackParamList, "CategoryItems">>()
  const { categoryName } = route.params
  const navigation = useNavigation<NavigationProp<RootStackParamList>>()
  const [filteredItems, setFilteredItems] = useState<FoodItem[]>([])
  const [initialItems, setInitialItems] = useState<FoodItem[]>([])
  
  // Filter states
  const [vegFilter, setVegFilter] = useState<string>("all")
  const [priceSort, setPriceSort] = useState<string>("none")
  
  // Filter visibility states
  const [showVegOptions, setShowVegOptions] = useState(false)
  const [showPriceOptions, setShowPriceOptions] = useState(false)

  useEffect(() => {
    const filtered = allFoodItems.filter(
      (item) => item.name.toLowerCase().includes(categoryName.toLowerCase())
    )
    setInitialItems(filtered)
    setFilteredItems(filtered)
  }, [categoryName])

  useEffect(() => {
    let result = [...initialItems]
    if (vegFilter !== "all") {
      result = result.filter((item) => (vegFilter === "veg" ? item.isVeg : !item.isVeg))
    }
    if (priceSort !== "none") {
      result = [...result].sort((a, b) => {
        const priceA = Number.parseFloat(a.price)
        const priceB = Number.parseFloat(b.price)
        return priceSort === "lowToHigh" ? priceA - priceB : priceB - priceA
      })
    }
    setFilteredItems(result)
  }, [vegFilter, priceSort, initialItems])

  const clearFilters = () => {
    setVegFilter("all")
    setPriceSort("none")
  }

  const renderFoodItem = ({ item }: { item: FoodItem }) => (
    <TouchableOpacity
      style={[styles.foodCard, { width: itemWidth }]}
      onPress={() => navigation.navigate("FoodItemDetail", {
        item,
        restaurantName: item.restaurant
      })}
    >
      <Image source={item.image} style={styles.foodImage} />
      <View style={styles.foodInfo}>
        <View style={styles.foodHeader}>
          <Text style={styles.foodName} numberOfLines={1}>{item.name}</Text>
          <View style={[styles.vegBadge, { backgroundColor: item.isVeg ? "#0f8a0f" : "#b30000" }]}>
            <Text style={styles.vegBadgeText}>{item.isVeg ? "VEG" : "NON-VEG"}</Text>
          </View>
        </View>
        <View style={styles.restaurantContainer}>
          <Text style={styles.restaurantName} numberOfLines={1}>{item.restaurant}</Text>
        </View>
        <View style={styles.priceRatingContainer}>
          <Text style={styles.price}>Rs. {item.price}</Text>
          <View style={styles.ratingContainer}>
            <Icon name="star" size={14} color="#FFD700" />
            <Text style={styles.rating}>{item.rating}</Text>
          </View>
        </View>
        <Text style={styles.prepTime}>{item.preparationTime}</Text>
      </View>
    </TouchableOpacity>
  )

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Icon name="search-off" size={50} color="#E96A1C" />
      <Text style={styles.emptyText}>No {categoryName} items found</Text>
      <Text style={styles.emptySubtext}>Try another category or adjust filters</Text>
      <TouchableOpacity style={styles.clearFiltersButton} onPress={clearFilters}>
        <Text style={styles.clearFiltersText}>Clear Filters</Text>
      </TouchableOpacity>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with category name and filters */}
      <View style={styles.header}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>All {categoryName}</Text>
        </View>
        
        {/* Compact Filter Row */}
        <View style={styles.filterRow}>
          {/* Veg Filter */}
          <View style={styles.filterWrapper}>
            <Text style={styles.filterLabel}>Type:</Text>
            <TouchableOpacity 
              style={styles.filterButton}
              onPress={() => {
                setShowVegOptions(!showVegOptions)
                setShowPriceOptions(false)
              }}
            >
              <Text style={styles.filterButtonText}>
                {vegFilter === "all" ? "All" : vegFilter === "veg" ? "Veg" : "Non-Veg"}
              </Text>
              <Icon 
                name={showVegOptions ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
                size={16} 
                color="#E96A1C" 
              />
            </TouchableOpacity>
            
            {showVegOptions && (
              <View style={styles.filterOptions}>
                <TouchableOpacity
                  style={[styles.filterOption, vegFilter === "all" && styles.activeFilterOption]}
                  onPress={() => {
                    setVegFilter("all")
                    setShowVegOptions(false)
                  }}
                >
                  <Text style={[styles.filterOptionText, vegFilter === "all" && styles.activeFilterOptionText]}>All</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.filterOption, vegFilter === "veg" && styles.activeFilterOption]}
                  onPress={() => {
                    setVegFilter("veg")
                    setShowVegOptions(false)
                  }}
                >
                  <Text style={[styles.filterOptionText, vegFilter === "veg" && styles.activeFilterOptionText]}>Veg</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.filterOption, vegFilter === "nonveg" && styles.activeFilterOption]}
                  onPress={() => {
                    setVegFilter("nonveg")
                    setShowVegOptions(false)
                  }}
                >
                  <Text style={[styles.filterOptionText, vegFilter === "nonveg" && styles.activeFilterOptionText]}>Non-Veg</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Price Filter */}
          <View style={styles.filterWrapper}>
            <Text style={styles.filterLabel}>Sort:</Text>
            <TouchableOpacity 
              style={styles.filterButton}
              onPress={() => {
                setShowPriceOptions(!showPriceOptions)
                setShowVegOptions(false)
              }}
            >
              <Text style={styles.filterButtonText}>
                {priceSort === "none" ? "Default" : priceSort === "lowToHigh" ? "Price ↑" : "Price ↓"}
              </Text>
              <Icon 
                name={showPriceOptions ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
                size={16} 
                color="#E96A1C" 
              />
            </TouchableOpacity>
            
            {showPriceOptions && (
              <View style={styles.filterOptions}>
                <TouchableOpacity
                  style={[styles.filterOption, priceSort === "none" && styles.activeFilterOption]}
                  onPress={() => {
                    setPriceSort("none")
                    setShowPriceOptions(false)
                  }}
                >
                  <Text style={[styles.filterOptionText, priceSort === "none" && styles.activeFilterOptionText]}>Default</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.filterOption, priceSort === "lowToHigh" && styles.activeFilterOption]}
                  onPress={() => {
                    setPriceSort("lowToHigh")
                    setShowPriceOptions(false)
                  }}
                >
                  <Text style={[styles.filterOptionText, priceSort === "lowToHigh" && styles.activeFilterOptionText]}>Low to High</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.filterOption, priceSort === "highToLow" && styles.activeFilterOption]}
                  onPress={() => {
                    setPriceSort("highToLow")
                    setShowPriceOptions(false)
                  }}
                >
                  <Text style={[styles.filterOptionText, priceSort === "highToLow" && styles.activeFilterOptionText]}>High to Low</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>

      <FlatList
        data={filteredItems}
        renderItem={renderFoodItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={[styles.listContainer, filteredItems.length === 0 && styles.emptyListContainer]}
        ListEmptyComponent={renderEmptyList}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    
 paddingTop: Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0,
   },
   safeArea: {
     flex: 1,
   },
  header: {
    marginBottom: 16,
    backgroundColor:'#fff',
    width:'auto'
  },
  headerTextContainer: {
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "red",
  },
  subheader: {
    fontSize: 14,
    color: "red",
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  filterWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
    position: 'relative',
  },
  filterLabel: {
    fontSize: 14,
    color: 'red',
    marginRight: 8,
    fontWeight: '500',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'red',
    flex: 1,
  },
  filterButtonText: {
    fontSize: 14,
    color: 'red',
    fontWeight: '500',
    flex: 1,
  },
  filterOptions: {
    position: 'absolute',
    top: 40,
    left: 60,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 8,
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  filterOption: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  activeFilterOption: {
    backgroundColor: '#FFF8EE',
  },
  filterOptionText: {
    fontSize: 14,
    color: '#333',
  },
  activeFilterOptionText: {
    color: 'red',
    fontWeight: '500',
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  listContainer: {
    paddingBottom: 20,
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  clearFiltersButton: {
    backgroundColor: '#E96A1C',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  clearFiltersText: {
    color: 'white',
    fontWeight: 'bold',
  },
  foodCard: {
    margin:12,
    backgroundColor: "white",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  foodImage: {
    width: '80%',
    height: itemWidth - 30,
    aspectRatio: 1,
  },
  foodInfo: {
    padding: 12,
  },
  foodHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 1,
  },
  foodName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
    marginRight: 8,
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
  restaurantContainer: {
    backgroundColor: "#FFF8EE",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 8,
    maxWidth: '100%',
  },
  restaurantName: {
    fontSize: 12,
    color: "#E96A1C",
    fontWeight: "600",
  },
  priceRatingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#E96A1C",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    fontSize: 14,
    color: "#E96A1C",
    fontWeight: "500",
    marginLeft: 4,
  },
  prepTime: {
    fontSize: 12,
    color: "#666",
  },
})

export default CategoryItems