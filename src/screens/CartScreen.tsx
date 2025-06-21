import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Alert,
  StatusBar, Platform
} from 'react-native';
import { useCart } from '../components/CartContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { type RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

const { width, height } = Dimensions.get('window');

// Define proper types for navigation
type RootStackParamList = {
  Homescreen: undefined
  FoodItemDetail: {
    item: {
      id: string
      name: string
      price: string
      description: string
      image: any
      isVeg: boolean
      rating: string
      preparationTime: string
    }
    restaurantName?: string
  }
}

const CartScreen = () => {
  const { cart, removeFromCart, clearCart } = useCart();
  const navigation = useNavigation<any>();
  const { t } = useTranslation();

  // Calculate total price
  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const price = Number.parseFloat(item.price.replace('Rs.', ''));
      return total + price * item.quantity;
    }, 0);
  };

  // Handle navigation to food item details
  const handleItemPress = (item: any) => {
    try {
      console.log('Navigating to FoodItemDetail with item:', item.name);

      // Navigate to the HomeStack navigator first, then to FoodItemDetail
      navigation.navigate('Home', {
        screen: 'FoodItemDetail',
        params: {
          item: {
            id: item.id,
            name: item.name,
            price: item.price.replace('Rs.', ''),
            description: item.description,
            image: item.image,
            isVeg: item.tag === 'Vegetarian',
            rating: item.rating.toString(),
            preparationTime: '20 min', // Default value since it might not be in cart item
          },
          restaurantName: item.restaurantName || 'Restaurant', // Use restaurant name if available
        },
      });
    } catch (error) {
      console.error('Navigation error:', error);
      Alert.alert(t('common.error'), t('cart.navigationError'));
    }
  };

  const handleBuyNow = () => {
    navigation.navigate('Home', {
      screen: 'CheckoutScreen',
    });
  };

  if (cart.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t('cart.title')}</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Icon name="shopping-cart" size={80} color="#ccc" />
          <Text style={styles.emptyText}>{t('cart.empty')}</Text>
          <TouchableOpacity
            style={styles.shopNowButton}
            onPress={() => {
              try {
                navigation.navigate('Home', { screen: 'Homescreen' });
              } catch (error) {
                console.error('Navigation error:', error);
              }
            }}
          >
            <Text style={styles.shopNowText}>{t('cart.shopNow')}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Fixed Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('cart.title')}</Text>
        {cart.length > 0 && (
          <TouchableOpacity onPress={clearCart} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>{t('cart.clearAll')}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Main Container with Flex Layout */}
      <View style={styles.mainContainer}>
        {/* Scrollable Product List */}
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContentContainer}
          showsVerticalScrollIndicator={false}
        >
          {cart.map((item) => (
            <View key={item.cartId} style={styles.cartItem}>
              <TouchableOpacity
                style={styles.itemContentContainer}
                onPress={() => handleItemPress(item)}
                activeOpacity={0.7}
              >
                <Image source={item.image} style={styles.itemImage} />
                <View style={styles.itemDetails}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemTag}>{item.tag}</Text>
                  <View style={styles.priceRow}>
                    <Text style={styles.itemPrice}>{item.price}</Text>
                    <Text style={styles.itemQuantity}>
                      {t('cart.quantity', { count: item.quantity })}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>

              {/* Separate TouchableOpacity for the remove button */}
              <TouchableOpacity 
                style={styles.removeButton} 
                onPress={() => removeFromCart(item.cartId)}
              >
                <Icon name="delete" size={18} color="white" />
                <Text style={styles.removeText}>{t('common.remove')}</Text>
              </TouchableOpacity>
            </View>
          ))}
          {/* Add padding at the bottom to ensure last item is fully visible above footer */}
          <View style={{ height: 20 }} />
        </ScrollView>

        {/* Fixed Footer - Positioned higher on the screen */}
        <View style={styles.footerWrapper}>
          <View style={styles.footer}>
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>{t('common.total')}:</Text>
              <Text style={styles.totalAmount}>Rs.{calculateTotal().toFixed(2)}</Text>
            </View>

            <TouchableOpacity style={styles.checkoutButton} onPress={handleBuyNow}>
              <Text style={styles.checkoutText}>{t('cart.proceedToCheckout')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.addToCartButton}
              onPress={() => {
                try {
                  navigation.navigate('Home', { screen: 'Homescreen' });
                } catch (error) {
                  console.error('Navigation error:', error);
                }
              }}
            >
              <Text style={styles.addToCartText}>{t('cart.addMoreItems')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

// Keep all your existing styles
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: 'red',
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  clearButton: {
    padding: 5,
  },
  clearButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  mainContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#555',
    marginTop: 15,
    marginBottom: 20,
  },
  shopNowButton: {
    backgroundColor: '#F7931A',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  shopNowText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scrollContainer: {
    flex: 1,
    marginBottom: 200,
  },
  scrollContentContainer: {
    padding: 15,
  },
  cartItem: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemContentContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 15,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  itemTag: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F7931A',
  },
  itemQuantity: {
    fontSize: 14,
    color: '#666',
  },
  removeButton: {
    backgroundColor: '#ff3b30',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  removeText: {
    color: 'white',
    marginLeft: 5,
    fontWeight: '500',
  },
  footerWrapper: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    paddingHorizontal: 15,
  },
  footer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 10,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F7931A',
  },
  checkoutButton: {
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  checkoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addToCartButton: {
    backgroundColor: '#F7931A',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  addToCartText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CartScreen;