import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, ImageSourcePropType } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, NavigationProp } from '@react-navigation/native';

// Define types for navigation and data
type RootStackParamList = {
  FoodItemDetail: {
    item: FoodItem;
    restaurantName: string;
  };
  // Add other routes as needed
};

// Define the FoodItem type
type FoodItem = {
  id: string;
  name: string;
  price: string;
  description: string;
  image: ImageSourcePropType;
  isVeg: boolean;
  rating: string;
  preparationTime: string;
};

// Define the HighlightItem type that includes additional properties
type HighlightItem = FoodItem & {
  restaurant: string;
  originalPrice: string;
  discount: string;
};

const HighlightsForYou = () => {
  // Properly type the navigation object
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  // Highlight items with restaurant-specific details
  const highlightItems: HighlightItem[] = [
    {
      id: '1',
      name: 'Chicken Burger',
      restaurant: 'Burger Joint',
      price: '180',
      originalPrice: '220',
      discount: '18%',
      description: 'Grilled chicken breast with crisp lettuce, tomato, cheese, and our signature mayo in a toasted brioche bun. Served with seasoned fries and coleslaw.',
      image: require('../Assets/BurgerJoint/chicken-burger.jpg'),
      isVeg: false,
      rating: '4.8',
      preparationTime: '25 min',
    },
    {
      id: '2',
      name: 'Butter Chicken',
      restaurant: 'Spice Garden',
      price: '330',
      originalPrice: '390',
      discount: '15%',
      description: 'Tender chicken pieces cooked in a rich, creamy tomato sauce with butter, cream, and aromatic spices. Served with naan bread or steamed rice.',
      image: require('../Assets/SpiceGarden/Butter-Chicken.jpeg'),
      isVeg: false,
      rating: '4.9',
      preparationTime: '30 min',
    },
    {
      id: '3',
      name: 'Mushroom Pizza',
      restaurant: 'Delicious Bites',
      price: '350',
      originalPrice: '420',
      discount: '17%',
      description: 'Hand-tossed thin crust topped with rich tomato sauce, mozzarella cheese, and assorted mushrooms. Finished with fresh herbs and truffle oil.',
      image: require('../Assets/DeliciousBite/mushroom-pizza.jpg'),
      isVeg: true,
      rating: '4.6',
      preparationTime: '20 min',
    },
  ];

  // Properly type the handleHighlightPress function
  const handleHighlightPress = (item: HighlightItem) => {
    // Use type assertion to handle the navigation
    (navigation.navigate as any)('FoodItemDetail', {
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
    });
  };

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
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.carouselContainer}
      >
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
              <View style={[styles.vegBadge, { backgroundColor: item.isVeg ? '#0f8a0f' : '#b30000' }]}>
                <Text style={styles.vegBadgeText}>{item.isVeg ? 'VEG' : 'NON-VEG'}</Text>
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
                <Text style={styles.price}>₹{item.price}</Text>
              </View>

              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={14} color="#FF3F00" />
                <Text style={styles.ratingText}>{item.rating}</Text>
              </View>
            </View>

            {/* Order Button */}
            <TouchableOpacity
              style={styles.orderButton}
              onPress={() => handleHighlightPress(item)}
            >
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
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: '#f8f8f8',
  },
  header: {
    marginBottom: 15,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  carouselContainer: {
    paddingBottom: 10,
  },
  highlightCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: 250,
    marginRight: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    position: 'relative',
    height: 150,
  },
  highlightImage: {
    width: '100%',
    height: '100%',
  },
  discountBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#FF3F00',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  discountText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  vegBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  vegBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  restaurantContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8EE',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
    alignSelf: 'flex-start',
    margin: 10,
  },
  restaurantName: {
    fontSize: 12,
    color: '#FF3F00',
    fontWeight: '600',
    marginLeft: 4,
  },
  foodName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 10,
    marginBottom: 5,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  originalPrice: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
    marginRight: 5,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF3F00',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8EE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  ratingText: {
    fontSize: 12,
    color: '#FF3F00',
    fontWeight: 'bold',
    marginLeft: 4,
  },
  orderButton: {
    backgroundColor: '#FF3F00',
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 5,
  },
  orderButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  discountCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  discountTextContainer: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
  },
  discountTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  discountDescription: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
  },
  promoButton: {
    backgroundColor: '#FF3F00',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  promoButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
});

export default HighlightsForYou;
