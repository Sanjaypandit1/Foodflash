import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, type ImageSourcePropType } from "react-native"
import Ionicons from "react-native-vector-icons/Ionicons"
import { useNavigation, type NavigationProp } from "@react-navigation/native"

// Define types for navigation and data
type RootStackParamList = {
  FoodItemDetail: {
    item: FoodItem
    restaurantName: string
  }
  // Add other routes as needed
}

// Define the FoodItem type
type FoodItem = {
  id: string
  name: string
  price: string
  description: string
  image: ImageSourcePropType
  isVeg: boolean
  rating: string
  preparationTime: string
}

// Define the HighlightItem type that includes additional properties
type HighlightItem = FoodItem & {
  restaurant: string
  originalPrice: string
  discount: string
}

const HighlightsForYou = () => {
  // Properly type the navigation object
  const navigation = useNavigation<NavigationProp<RootStackParamList>>()

  // Highlight items with restaurant-specific details
  const highlightItems: HighlightItem[] = [
    {
      id: "93",
      name: "Chicken Biryani",
      price: "299",
      originalPrice: "345",
      discount: "15%",
      description:
        "Dum-style biryani with free-range chicken and kewra water. Our signature dish prepared with aromatic basmati rice and tender chicken pieces.",
      image: { uri: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a" },
      isVeg: false,
      rating: "4.9",
      preparationTime: "29 min",
      restaurant: "Sushil Palace",
    },
    {
      id: "69",
      name: "Mutton Biryani",
      price: "380",
      originalPrice: "420",
      discount: "10%",
      description:
        "Premium mutton pieces slow-cooked with aged basmati rice. A royal delicacy with authentic spices and tender meat.",
      image: { uri: "https://images.unsplash.com/photo-1701579231305-d84d8af9a3fd" },
      isVeg: false,
      rating: "4.9",
      preparationTime: "35 min",
      restaurant: "Spice Garden",
    },
    {
      id: "28",
      name: "BBQ Chicken Pizza",
      price: "320",
      originalPrice: "380",
      discount: "15%",
      description:
        "Smoky BBQ sauce, grilled chicken, red onions, and cilantro on pizza. A perfect blend of tangy and savory flavors.",
      image: { uri: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee" },
      isVeg: false,
      rating: "4.8",
      preparationTime: "28 min",
      restaurant: "Delicious Bite",
    },
    {
      id: "3",
      name: "Cheese Pizza",
      price: "280",
      originalPrice: "320",
      discount: "12%",
      description: "Cheesy delight with mozzarella and cheddar layers on thin crust. Perfect for cheese lovers!",
      image: { uri: "https://images.unsplash.com/photo-1541745537411-b8046dc6d66c" },
      isVeg: true,
      rating: "4.7",
      preparationTime: "20 min",
      restaurant: "Burger Joint",
    },
    {
      id: "83",
      name: "Buff Momo",
      price: "180",
      originalPrice: "205",
      discount: "12%",
      description:
        "Grass-fed buffalo momos with Himalayan spice blend and tomato chutney. Handcrafted dumplings with authentic flavors.",
      image: { uri: "https://plus.unsplash.com/premium_photo-1674601033631-79eeffaac6f9" },
      isVeg: false,
      rating: "4.8",
      preparationTime: "19 min",
      restaurant: "Sushil Palace",
    },
    {
      id: "45",
      name: "Lassi",
      price: "70",
      originalPrice: "80",
      discount: "12%",
      description:
        "Creamy yogurt drink, available in sweet or salty flavors. A refreshing traditional beverage made with fresh yogurt.",
      image: {
        uri: "https://media.istockphoto.com/id/1496158255/photo/glass-of-ayran-or-kefir-or-lassi-on-wooden-table-top.webp",
      },
      isVeg: true,
      rating: "4.6",
      preparationTime: "5 min",
      restaurant: "Delicious Bite",
    },
  ]

  // Properly type the handleHighlightPress function
  const handleHighlightPress = (item: HighlightItem) => {
    // Use type assertion to handle the navigation
    ;(navigation.navigate as any)("FoodItemDetail", {
      item: {
        id: item.id,
        name: item.name,
        price: item.price,
        description: item.description,
        image: item.image,
        isVeg: item.isVeg,
        rating: item.rating,
        preparationTime: item.preparationTime,
      },
      restaurantName: item.restaurant,
    })
  }

  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Highlights for you</Text>
          <Ionicons name="sparkles" size={20} color="#FF3F00" />
        </View>
        <Text style={styles.subtitle}>Special dishes from our top restaurants</Text>
      </View>

      {/* Highlights Carousel */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carouselContainer}>
        {highlightItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.highlightCard}
            onPress={() => handleHighlightPress(item)}
            activeOpacity={0.9}
          >
            <View style={styles.imageContainer}>
              <Image source={item.image} style={styles.highlightImage} />

              {/* Discount Badge */}
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>{item.discount} OFF</Text>
              </View>

              {/* Veg/Non-Veg Indicator */}
              <View style={[styles.vegBadge, { backgroundColor: item.isVeg ? "#0f8a0f" : "#b30000" }]}>
                <Text style={styles.vegBadgeText}>{item.isVeg ? "VEG" : "NON-VEG"}</Text>
              </View>
            </View>

            {/* Restaurant Name */}
            <View style={styles.restaurantContainer}>
              <Ionicons name="restaurant-outline" size={14} color="#FF3F00" />
              <Text style={styles.restaurantName}>{item.restaurant}</Text>
            </View>

            {/* Food Name */}
            <Text style={styles.foodName}>{item.name}</Text>

            {/* Price and Rating */}
            <View style={styles.detailsRow}>
              <View style={styles.priceContainer}>
                <Text style={styles.originalPrice}>₹{item.originalPrice}</Text>
                <Text style={styles.price}>Rs. {item.price}</Text>
              </View>

              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={14} color="#FF3F00" />
                <Text style={styles.ratingText}>{item.rating}</Text>
              </View>
            </View>

            {/* Order Button */}
            <TouchableOpacity style={styles.orderButton} onPress={() => handleHighlightPress(item)}>
              <Text style={styles.orderButtonText}>Order Now</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Discount Info Card */}
      <View style={styles.discountCard}>
        <Ionicons name="gift-outline" size={24} color="#FF3F00" />
        <View style={styles.discountTextContainer}>
          <Text style={styles.discountTitle}>Special Offer: 50% Off First Order</Text>
          <Text style={styles.discountDescription}>
            Use code WELCOME50 at checkout to get 50% off on your first order (up to ₹100)
          </Text>
        </View>
        <TouchableOpacity style={styles.promoButton}>
          <Text style={styles.promoButtonText}>CLAIM</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 18,
    backgroundColor: "#f9f9f9",
    borderRadius: 16,
    marginBottom: 10,
  },
  header: {
    marginBottom: 18,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#222",
    marginRight: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  carouselContainer: {
    paddingBottom: 10,
  },
  highlightCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    width: 260,
    marginRight: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  imageContainer: {
    position: "relative",
    height: 160,
  },
  highlightImage: {
    width: "100%",
    height: "100%",
  },
  discountBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "#FF3F00",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  discountText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
    letterSpacing: 0.5,
  },
  vegBadge: {
    position: "absolute",
    top: 10,
    right: 10,
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
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF8EE",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
    alignSelf: "flex-start",
    margin: 10,
  },
  restaurantName: {
    fontSize: 12,
    color: "#FF3F00",
    fontWeight: "600",
    marginLeft: 4,
  },
  foodName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    paddingHorizontal: 12,
    marginBottom: 6,
    marginTop: 2,
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  originalPrice: {
    fontSize: 14,
    color: "#999",
    textDecorationLine: "line-through",
    marginRight: 5,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF3F00",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF8EE",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  ratingText: {
    fontSize: 12,
    color: "#FF3F00",
    fontWeight: "bold",
    marginLeft: 4,
  },
  orderButton: {
    backgroundColor: "#FF3F00",
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#FF3F00",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  orderButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  discountCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginTop: 24,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  discountTextContainer: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
  },
  discountTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 5,
  },
  discountDescription: {
    fontSize: 12,
    color: "#666",
    lineHeight: 18,
  },
  promoButton: {
    backgroundColor: "#FF3F00",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    shadowColor: "#FF3F00",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 2,
  },
  promoButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
})

export default HighlightsForYou
