import { StyleSheet, Text, TouchableOpacity, View, Image, ScrollView } from "react-native"
import type React from "react"
import type { NavigationProp } from "@react-navigation/native"

// Define prop types
type Props = {
  navigation: NavigationProp<any>
}

const Categories: React.FC<Props> = ({ navigation }) => {
  // Category data with restaurant-specific food items
  const categoryItems = [
    {
      id: "1",
      name: "Pizza",
      restaurant: "Burger Joint",
      image: require("../Assets/BurgerJoint/chicken-pizza.jpg"),
      price: "400",
      description:
        "Delicious pizza topped with grilled chicken pieces, bell peppers, onions, and a blend of mozzarella and cheddar cheese. Finished with our signature herb seasoning.",
      isVeg: false,
      rating: "4.7",
      preparationTime: "25 min",
    },
    {
      id: "2",
      name: "Momo",
      restaurant: "Delicious Bites",
      image: require("../Assets/DeliciousBite/chicken-momo.jpg"),
      price: "200",
      description:
        "Juicy dumplings filled with minced chicken, onions, garlic, and ginger. Steamed to perfection and served with spicy red chili dipping sauce.",
      isVeg: false,
      rating: "4.4",
      preparationTime: "30 min",
    },
    {
      id: "3",
      name: "Biryani",
      restaurant: "Spice Garden",
      image: require("../Assets/SpiceGarden/chicken-biryani.jpg"),
      price: "490",
      description:
        "Fragrant long-grain basmati rice layered with tender chicken pieces, caramelized onions, and traditional spices. Slow-cooked in a sealed pot and garnished with fresh herbs.",
      isVeg: false,
      rating: "4.4",
      preparationTime: "30 min",
    },
    {
      id: "4",
      name: "Burger",
      restaurant: "Burger Joint",
      image: require("../Assets/BurgerJoint/chicken-burger.jpg"),
      price: "180",
      description:
        "Grilled chicken breast with crisp lettuce, tomato, cheese, and our signature mayo in a toasted brioche bun. Served with seasoned fries and coleslaw.",
      isVeg: false,
      rating: "4.8",
      preparationTime: "25 min",
    },
    {
      id: "6",
      name: "Chowmin",
      restaurant: "Delicious Bites",
      image: require("../Assets/DeliciousBite/chicken-chowmin.jpg"),
      price: "180",
      description:
        "Wok-tossed noodles with tender chicken strips, crunchy vegetables, and our house special sauce. Garnished with spring onions and sesame seeds.",
      isVeg: false,
      rating: "4.8",
      preparationTime: "25 min",
    },
  ]

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View>
          <Text style={styles.head}>Categories</Text>
          <Text style={styles.subhead}>Explore food by category</Text>
        </View>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("AllCategories", {
              categories: categoryItems.map((item) => ({
                id: item.id,
                name: item.name,
                restaurant: item.restaurant,
                price: item.price,
                description: item.description,
                isVeg: item.isVeg,
                rating: item.rating,
                preparationTime: item.preparationTime,
              })),
            })
          }
        >
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollView}>
        {categoryItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            onPress={() =>
              navigation.navigate("CategoryItems", {
                categoryName: item.name,
                restaurant: item.restaurant,
                image: item.image,
                price: item.price,
                description: item.description,
                isVeg: item.isVeg,
                rating: item.rating,
                preparationTime: item.preparationTime,
              })
            }
          >
            <Image source={item.image} style={styles.image} />

            {/* Category name overlay */}
            <View style={styles.categoryOverlay}>
              <Text style={styles.categoryName}>{item.name}</Text>
            </View>

            {/* Restaurant name */}
            <View style={styles.restaurantContainer}>
              <Text style={styles.restaurant}>{item.restaurant}</Text>
            </View>

            <View style={styles.priceRatingContainer}>
              <Text style={styles.price}>Rs. {item.price}</Text>
              <View style={styles.ratingContainer}>
                <Text style={styles.rating}>★ {item.rating}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  )
}

export default Categories

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginTop: 10,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  head: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  subhead: {
    fontSize: 14,
    color: "#666",
  },
  seeAll: {
    color: "#E96A1C",
    fontWeight: "600",
    fontSize: 14,
  },
  scrollView: {
    flexDirection: "row",
    paddingVertical: 5,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginRight: 15,
    width: 150,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 2, height: 2 },
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 100,
    borderRadius: 10,
  },
  categoryOverlay: {
    position: "absolute",
    top: 10,
    left: 10,
    right: 10,
    backgroundColor: "red",
    paddingVertical: 0,
    paddingHorizontal: 3,
    borderRadius: 5,
  },
  categoryName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  restaurantContainer: {
    backgroundColor: "#FFF8EE",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: "flex-start",
    marginTop: 8,
    marginBottom: 5,
  },
  restaurant: {
    fontSize: 12,
    color: "#E96A1C",
    fontWeight: "600",
  },
  priceRatingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5,
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
    fontSize: 12,
    color: "#E96A1C",
    fontWeight: "500",
  },
})
