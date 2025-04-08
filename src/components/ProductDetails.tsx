import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, SafeAreaView, Dimensions, StatusBar, Platform } from 'react-native'
import React, { useState } from 'react'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { useCart } from './CartContext'
import Icon from 'react-native-vector-icons/MaterialIcons'
import {ImageSourcePropType} from 'react-native';

// Get screen dimensions
const { width, height } = Dimensions.get('window');
// Calculate bottom padding to avoid navigation bar
const BOTTOM_TAB_HEIGHT = 60;
const BOTTOM_PADDING = Platform.OS === 'ios' ? 34 : 60;

// Define types
type RootStackParamList = {
  FoodItemDetail: { 
    item: FoodItem;
    restaurantName?: string; // Add restaurant name to params
  };
};

type FoodItem = {
  id: string;
  name: string;
  price: string;
  description: string;
  image: ImageSourcePropType;
  isVeg: boolean;
  rating: string;
  preparationTime: string;
}

const FoodItemDetail = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'FoodItemDetail'>>();
  const { item, restaurantName } = route.params; // Extract restaurant name from params
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const navigation = useNavigation();

  // Convert price string to number for calculations
  const priceValue = parseFloat(item.price.replace('Rs', ''));
  
  // Calculate total price based on quantity
  const totalPrice = (priceValue * quantity).toFixed(2);

  const handleAddToCart = () => {
    // Convert the food item to cart item format
    const cartItem = {
      id: item.id,
      name: item.name,
      price: `Rs.${priceValue}`,
      image: item.image, 
      description: item.description,
      tag: item.isVeg ? 'Vegetarian' : 'Non-Vegetarian',
      rating: parseFloat(item.rating),
      restaurantName: restaurantName // Add restaurant name to cart item
    };
    
    // Add to cart multiple times based on quantity
    for (let i = 0; i < quantity; i++) {
      addToCart(cartItem);
    }
  };

  const handleBuyNow = () => {
    // First add to cart
    handleAddToCart();
    // Then navigate to cart screen
    navigation.navigate('Cart' as never);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Main Scrollable Content */}
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Image */}
        <View style={styles.imageContainer}>
          <Image 
            source={item.image} 
            style={styles.heroImage}
            resizeMode="cover"
          />
          
          <View style={[styles.badgeContainer, { backgroundColor: item.isVeg ? '#0f8a0f' : '#b30000' }]}>
            <Text style={styles.badgeText}>{item.isVeg ? 'VEG' : 'NON-VEG'}</Text>
          </View>
        </View>
        
        {/* Content */}
        <View style={styles.contentContainer}>
          {/* Restaurant Name - New Addition */}
          {restaurantName && (
            <View style={styles.restaurantNameContainer}>
              <Icon name="restaurant" size={18} color="#FF3F00" />
              <Text style={styles.restaurantName}>{restaurantName}</Text>
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
            <Text style={styles.price}>Rs. {item.price}</Text>
            <View style={styles.prepTimeContainer}>
              <Icon name="access-time" size={16} color="#666" />
              <Text style={styles.prepTime}>{item.preparationTime}</Text>
            </View>
          </View>
          
          {/* Description */}
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
          
          {/* Quantity Selector */}
          <View style={styles.quantitySection}>
            <Text style={styles.sectionTitle}>Quantity</Text>
            <View style={styles.quantitySelector}>
              <TouchableOpacity 
                style={styles.quantityButton}
                onPress={() => quantity > 1 && setQuantity(quantity - 1)}
                disabled={quantity <= 1}
              >
                <Icon name="remove" size={20} color={quantity <= 1 ? "#ccc" : "#333"} />
              </TouchableOpacity>
              
              <Text style={styles.quantityText}>{quantity}</Text>
              
              <TouchableOpacity 
                style={styles.quantityButton}
                onPress={() => setQuantity(quantity + 1)}
              >
                <Icon name="add" size={20} color="#333" />
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Reviews (Placeholder) */}
          <View style={styles.reviewsSection}>
            <Text style={styles.sectionTitle}>Customer Reviews</Text>
            <View style={styles.reviewItem}>
              <View style={styles.reviewHeader}>
                <Text style={styles.reviewerName}>John D.</Text>
                <Text style={styles.reviewRating}>★★★★★</Text>
              </View>
              <Text style={styles.reviewText}>
                Absolutely delicious! The flavors were amazing and the portion size was perfect.
              </Text>
            </View>
            <View style={styles.reviewItem}>
              <View style={styles.reviewHeader}>
                <Text style={styles.reviewerName}>Sarah M.</Text>
                <Text style={styles.reviewRating}>★★★★☆</Text>
              </View>
              <Text style={styles.reviewText}>
                Very good, but could use a bit more seasoning. Would order again though!
              </Text>
            </View>
          </View>
          
          {/* Total */}
          <View style={styles.totalSection}>
            <Text style={styles.totalLabel}>Total:</Text>
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
        >
          <Icon name="shopping-cart" size={20} color="white" />
          <Text style={styles.actionButtonText}>Add to Cart</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.buyNowButton]}
          onPress={handleBuyNow}
        >
          <Icon name="flash-on" size={20} color="white" />
          <Text style={styles.actionButtonText}>Buy Now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Dark background for image area
  },
  scrollContent: {
    paddingBottom: BOTTOM_TAB_HEIGHT + BOTTOM_PADDING, // Add padding to avoid bottom nav
  },
  imageContainer: {
    position: 'relative',
    width: width,
    height: height * 0.4, // 40% of screen height
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  badgeContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  badgeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  contentContainer: {
    padding: 20,
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20,
    minHeight: height * 0.7, // Ensure content area is tall enough
  },
  // New styles for restaurant name
  restaurantNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8EE',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  restaurantName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF3F00',
    marginLeft: 6,
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8EE',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
  },
  rating: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF3F00',
    marginLeft: 4,
  },
  metaSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  price: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FF3F00',
  },
  prepTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  prepTime: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  descriptionSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  quantitySection: {
    marginBottom: 20,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  quantityButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 15,
  },
  reviewsSection: {
    marginBottom: 20,
  },
  reviewItem: {
    backgroundColor: '#F8F8F8',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  reviewRating: {
    fontSize: 14,
    color: '#FF3F00',
  },
  reviewText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF3F00',
  },
  actionContainer: {
    position: 'absolute',
    bottom: BOTTOM_PADDING,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    marginHorizontal: 6,
  },
  addToCartButton: {
    backgroundColor: '#FF3F00',
  },
  buyNowButton: {
    backgroundColor: '#0f8a0f',
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
});

export default FoodItemDetail;