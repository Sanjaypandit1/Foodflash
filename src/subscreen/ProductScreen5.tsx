

import { useState } from "react"
import { View, Text, TouchableOpacity, StatusBar, StyleSheet, Image, Alert } from "react-native"
import { useNavigation } from "@react-navigation/native"
import Icon from "react-native-vector-icons/MaterialIcons"
import { useCart } from "../components/CartContext"

const biryaniOptions = [
  {
    id: "vegburger",
    name: "Veg Burger",
    price: "Rs.100",
    image: require("../Assets/Burger/vegburger.jpg"),
    description: "A crispy veggie patty with fresh lettuce and creamy mayo in a soft bun",
    tag: "Vegetarian",
    rating: 4.7,
  },
  {
    id: "chickenburger",
    name: "Chicken Burger",
    price: "Rs.150",
    image: require("../Assets/Burger/chickenburger.jpeg"),
    description: "A juicy chicken patty layered with cheese, lettuce, and tangy sauces.",
    tag: "Chicken",
    rating: 4.5,
  },
  {
    id: "mixedburger",
    name: "Egg Burger",
    price: "Rs.180",
    image: require("../Assets/Burger/specialburger.jpeg"),
    description: "Spiced paneer patty with crunchy veggies and flavorful sauces in a bun.",
    tag: "Mixed",
    rating: 4.1,
  },
]

const ProductScreen5 = () => {
  const navigation = useNavigation()
  const { addToCart } = useCart()
  const [selectedBiryani, setSelectedBiryani] = useState(biryaniOptions[1]) // Default to Chicken Biryani

  const handleAddToCart = () => {
    addToCart(selectedBiryani)
    Alert.alert("Added to Cart", `${selectedBiryani.name} has been added to your cart.`, [{ text: "OK" }])
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={"#FF3f00"} />

      {/* Product Image */}
      <Image source={selectedBiryani.image} style={styles.productImage} />

      {/* Product Details Section */}
      <View style={styles.detailsContainer}>
        <View style={styles.row}>
          <Text style={styles.productName}>{selectedBiryani.name}</Text>
          <Text style={styles.price}>{selectedBiryani.price}</Text>
        </View>

        {/* Description */}
        <Text style={styles.description}>{selectedBiryani.description}</Text>

        {/* Free Delivery */}
        <View style={styles.deliveryContainer}>
          <Icon name="local-shipping" size={20} color="#4CAF50" />
          <Text style={styles.deliveryText}>Free Delivery</Text>
          {/* Ratings */}
          <View style={styles.ratingContainer}>
            <View style={styles.ratingContent}>
              {[...Array(Math.floor(selectedBiryani.rating))].map((_, index) => (
                <Icon key={index} name="star" size={24} color="#FFD700" style={styles.starIcon} />
              ))}
              {selectedBiryani.rating % 1 !== 0 && (
                <Icon name="star-half" size={24} color="#FFD700" style={styles.starIcon} />
              )}
              <Text style={styles.ratingText}>({selectedBiryani.rating})</Text>
            </View>
          </View>
        </View>

        {/* Product Selection Buttons */}
        <View style={styles.selectionContainer}>
          {biryaniOptions.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.selectionButton, selectedBiryani.id === item.id && styles.activeSelection]}
              onPress={() => setSelectedBiryani(item)}
            >
              <Text style={[styles.selectionText, selectedBiryani.id === item.id && styles.activeText]}>
                {item.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Restaurant Name */}
        <View style={styles.restaurantContainer}>
          <Text style={styles.restaurantTitle}>Restaurant Name</Text>
          <Text style={styles.restaurantName}>Swad Restaurant</Text>
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
            <Icon name="shopping-cart" size={20} color="white" />
            <Text style={styles.buttonText}>Add to Cart</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.buyButton}>
            <Icon name="shopping-bag" size={20} color="white" />
            <Text style={styles.buttonText}>Buy Now</Text>
          </TouchableOpacity>
        </View>

        {/* Close Button */}
        <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
          <Icon name="close" size={20} color="white" />
          <Text style={styles.closeText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default ProductScreen5

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7931A",
  },
  productImage: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
  },
  detailsContainer: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  productName: {
    fontSize: 22,
    fontWeight: "bold",
  },
  description: {
    fontSize: 16,
    color: "#555",
    marginBottom: 10,
  },
  price: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  selectionContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 20,
  },
  selectionButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#e0e0e0",
    borderRadius: 20,
    marginHorizontal: 5,
  },
  activeSelection: {
    backgroundColor: "#FF3f00",
  },
  selectionText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
  },
  activeText: {
    color: "white",
  },
  ratingContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginVertical: 10,
    left: 75,
  },
  ratingContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  starIcon: {
    marginHorizontal: 0,
  },
  ratingText: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 5,
    color: "#333",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 5,
  },
  deliveryContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  deliveryText: {
    fontSize: 16,
    marginLeft: 5,
    color: "#4CAF50",
    fontWeight: "bold",
  },
  restaurantContainer: {
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  restaurantTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#666",
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 5,
  },
  addToCartButton: {
    flex: 1,
    backgroundColor: "#0288D1",
    paddingVertical: 15,
    borderRadius: 10,
    marginRight: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  buyButton: {
    flex: 1,
    backgroundColor: "#FF3f00",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  closeButton: {
    backgroundColor: "#d32f2f",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  closeText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 5,
  },
})

