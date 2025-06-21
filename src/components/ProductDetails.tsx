"use client"

import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Dimensions,
  StatusBar,
  Platform,
  Alert,
  RefreshControl,
  Animated,
  FlatList,
} from "react-native"
import { useState } from "react"
import { type RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import type { NavigationProp } from "@react-navigation/native"
import { useCart } from "./CartContext"
import Icon from "react-native-vector-icons/MaterialIcons"
import type { ImageSourcePropType } from "react-native"
import FavoriteButton from "../screens/favorite-button"
import { getImageUri } from "../screens/favorite-helper"
import { useTranslation } from 'react-i18next'

// Get screen dimensions
const { width, height } = Dimensions.get("window")
// Calculate bottom padding to avoid navigation bar
const BOTTOM_TAB_HEIGHT = 60
const BOTTOM_PADDING = Platform.OS === "ios" ? 34 : 60

// Define types
type RootStackParamList = {
  FoodItemDetail: {
    item: FoodItem
    restaurantName?: string
  }
  Home: undefined
  Cart: undefined
  CheckoutScreen: undefined
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
}

const FoodItemDetail = () => {
  const route = useRoute<RouteProp<RootStackParamList, "FoodItemDetail">>()
  const navigation = useNavigation<NavigationProp<RootStackParamList>>()
  const { item, restaurantName } = route.params
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()
  const { t } = useTranslation()

  // Convert price string to number for calculations
  const priceValue = parseFloat(item.price.replace(/[^\d.]/g, '')) || 0

  // Calculate total price based on quantity
  const totalPrice = (priceValue * quantity).toFixed(2)

  const handleAddToCart = () => {
    try {
      // Convert the food item to cart item format
      const cartItem = {
        id: item.id,
        name: item.name,
        price: `Rs.${priceValue}`,
        image: item.image,
        description: item.description,
        tag: item.isVeg ? t('foodDetail.vegetarian') : t('foodDetail.nonVegetarian'),
        rating: parseFloat(item.rating) || 0,
        restaurantName: restaurantName || t('foodDetail.unknownRestaurant'),
      }

      // Add to cart multiple times based on quantity
      for (let i = 0; i < quantity; i++) {
        addToCart(cartItem)
      }

      Alert.alert(
        t('foodDetail.addedToCart'),
        t('foodDetail.addedToCartMessage', { quantity, itemName: item.name }),
        [{ text: t('common.ok') }]
      )
    } catch (error) {
      console.error("Error adding to cart:", error)
      Alert.alert(t('common.error'), t('foodDetail.addToCartError'))
    }
  }

  const handleBuyNow = () => {
    try {
      // First add to cart
      handleAddToCart()
      // Then navigate to cart or checkout
      navigation.navigate("Cart")
    } catch (error) {
      console.error("Error in buy now:", error)
      Alert.alert(t('common.error'), t('foodDetail.buyNowError'))
    }
  }

  const handleBackPress = () => {
    try {
      if (navigation.canGoBack()) {
        navigation.goBack()
      } else {
        navigation.navigate("Home")
      }
    } catch (error) {
      console.error("Navigation error:", error)
      navigation.navigate("Home")
    }
  }

  // Prepare favorite item data with proper type handling
  const favoriteItem = {
    id: item.id,
    name: item.name,
    price: item.price.replace(/[^\d.]/g, ''), // Clean price for favorites
    description: item.description,
    image: { uri: getImageUri(item.image) }, // Use helper function to ensure string type
    isVeg: item.isVeg,
    rating: item.rating,
    preparationTime: item.preparationTime,
    restaurant: restaurantName || t('foodDetail.unknownRestaurant'),
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* Main Scrollable Content */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Hero Image */}
        <View style={styles.imageContainer}>
          <Image source={item.image} style={styles.heroImage} resizeMode="cover" />

          {/* Back Button */}
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={handleBackPress}
            accessibilityLabel={t('common.goBack')}
            accessibilityRole="button"
          >
            <Icon name="arrow-back" size={24} color="white" />
          </TouchableOpacity>

          <View style={[styles.badgeContainer, { backgroundColor: item.isVeg ? "#0f8a0f" : "#b30000" }]}>
            <Text style={styles.badgeText}>
              {item.isVeg ? t('foodDetail.veg') : t('foodDetail.nonVeg')}
            </Text>
          </View>
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          {/* Restaurant Name with Favorite Button */}
          {restaurantName && (
            <View style={styles.restaurantSection}>
              <View style={styles.restaurantNameContainer}>
                <Icon name="restaurant" size={18} color="#FF3F00" />
                <Text style={styles.restaurantName}>{restaurantName}</Text>
              </View>
              {/* Additional Favorite Button next to restaurant name */}
              <View style={styles.restaurantFavoriteButton}>
                <FavoriteButton 
                  item={favoriteItem} 
                  size={20} 
                  style={styles.smallFavoriteButton}
                />
              </View>
            </View>
          )}

          {/* Header Section */}
          <View style={styles.headerSection}>
            <Text style={styles.title}>{item.name}</Text>
            <View style={styles.ratingContainer}>
              <Icon name="star" size={18} color="#FF3F00" />
              <Text style={styles.rating}>{item.rating}</Text>
            </View>
          </View>

          {/* Price and Preparation Time */}
          <View style={styles.metaSection}>
            <Text style={styles.price}>Rs. {priceValue}</Text>
            <View style={styles.prepTimeContainer}>
              <Icon name="access-time" size={16} color="#666" />
              <Text style={styles.prepTime}>{item.preparationTime}</Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>{t('foodDetail.description')}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>

          {/* Quantity Selector */}
          <View style={styles.quantitySection}>
            <Text style={styles.sectionTitle}>{t('foodDetail.quantity')}</Text>
            <View style={styles.quantitySelector}>
              <TouchableOpacity
                style={[styles.quantityButton, quantity <= 1 && styles.quantityButtonDisabled]}
                onPress={() => quantity > 1 && setQuantity(quantity - 1)}
                disabled={quantity <= 1}
                accessibilityLabel={t('foodDetail.decreaseQuantity')}
              >
                <Icon name="remove" size={20} color={quantity <= 1 ? "#ccc" : "#333"} />
              </TouchableOpacity>

              <Text style={styles.quantityText}>{quantity}</Text>

              <TouchableOpacity 
                style={styles.quantityButton} 
                onPress={() => setQuantity(quantity + 1)}
                accessibilityLabel={t('foodDetail.increaseQuantity')}
              >
                <Icon name="add" size={20} color="#333" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Total */}
          <View style={styles.totalSection}>
            <Text style={styles.totalLabel}>{t('foodDetail.total')}:</Text>
            <Text style={styles.totalPrice}>Rs. {totalPrice}</Text>
          </View>

          {/* Extra space at bottom to ensure content isn't hidden behind action buttons */}
          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* Action Buttons - Fixed at bottom */}
      <View style={styles.actionContainer}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.addToCartButton]} 
          onPress={handleAddToCart}
          accessibilityLabel={t('foodDetail.addToCartAccessibility', { quantity, itemName: item.name })}
        >
          <Icon name="shopping-cart" size={20} color="white" />
          <Text style={styles.actionButtonText}>{t('foodDetail.addToCart')}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, styles.buyNowButton]} 
          onPress={handleBuyNow}
          accessibilityLabel={t('foodDetail.buyNowAccessibility', { quantity, itemName: item.name })}
        >
          <Icon name="flash-on" size={20} color="white" />
          <Text style={styles.actionButtonText}>{t('foodDetail.buyNow')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingBottom: 20, // Add padding to the bottom of the screen
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0,
  },
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  scrollContent: {
    paddingBottom: BOTTOM_TAB_HEIGHT + BOTTOM_PADDING,
  },
  imageContainer: {
    position: "relative",
    width: width,
    height: height * 0.4,
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  backButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 16,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
 
  badgeContainer: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 16,
    right: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    zIndex: 10,
  },
  badgeText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
  contentContainer: {
    padding: 20,
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20,
    minHeight: height * 0.7,
  },
  restaurantSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  restaurantNameContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF8EE",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
  },
  restaurantName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FF3F00",
    marginLeft: 6,
  },
  restaurantFavoriteButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  smallFavoriteButton: {
    padding: 12,
    borderRadius: 15,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  headerSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
    marginRight: 10,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF8EE",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
  },
  rating: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FF3F00",
    marginLeft: 4,
  },
  metaSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  price: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FF3F00",
  },
  prepTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  prepTime: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
  descriptionSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
  },
  quantitySection: {
    marginBottom: 20,
  },
  quantitySelector: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  quantityButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityButtonDisabled: {
    opacity: 0.5,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "bold",
    paddingHorizontal: 15,
    minWidth: 40,
    textAlign: "center",
  },
  totalSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FF3F00",
  },
  actionContainer: {
    position: "absolute",
    bottom: BOTTOM_PADDING,
    left: 0,
    right: 0,
    flexDirection: "row",
    padding: 16,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 8,
    marginHorizontal: 6,
  },
  addToCartButton: {
    backgroundColor: "#FF3F00",
  },
  buyNowButton: {
    backgroundColor: "#0f8a0f",
  },
  actionButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 8,
  },
})

export default FoodItemDetail