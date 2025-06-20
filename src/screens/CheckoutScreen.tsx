'use client';

import {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  Platform,
  KeyboardAvoidingView,
  Dimensions,
  useColorScheme,
  StatusBar
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useCart} from '../components/CartContext';
import {useOrders} from '../components/OrderContext';
import {useNavigation} from '@react-navigation/native';
import AddressManager, { Address } from '../MenuScreen/Address1';

const {} = Dimensions.get('window');
const BOTTOM_PADDING = Platform.OS === 'ios' ? 34 : 20;

// Payment method type
type PaymentMethod = 'card' | 'cash' | 'wallet';

// Promo code interface
interface PromoCode {
  id: number;
  code: string;
  title: string;
  description: string;
  expiry: string;
  discount: string;
  discountType: 'percentage' | 'fixed' | 'free_shipping';
  discountValue: number;
  minOrderValue?: number;
}

const CheckoutScreen = () => {
  const {cart, clearCart} = useCart();
  const {addOrder} = useOrders();
  const navigation = useNavigation<any>();
  
  // Use React Native's built-in useColorScheme
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  // State for selected payment method
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');

  // State for selected address
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  // State for promo code
  const [promoCode, setPromoCode] = useState<string>('');
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);

  // Available promo codes
  const promoCodes: PromoCode[] = [
    {
      id: 1,
      code: "SAVE20",
      title: "20% Off Your Next Order",
      description: "Valid on orders above Rs.500",
      expiry: "Expires: Dec 31, 2024",
      discount: "20%",
      discountType: "percentage",
      discountValue: 20,
      minOrderValue: 500,
    },
    {
      id: 2,
      code: "WELCOME10",
      title: "Welcome Bonus",
      description: "First time user discount",
      expiry: "Expires: Jan 15, 2025",
      discount: "10%",
      discountType: "percentage",
      discountValue: 10,
    },
    {
      id: 3,
      code: "FREESHIP",
      title: "Free Shipping",
      description: "Free delivery on any order",
      expiry: "Expires: Dec 25, 2024",
      discount: "FREE",
      discountType: "free_shipping",
      discountValue: 40,
    },
    {
      id: 4,
      code: "SAVE100",
      title: "Rs.100 Off",
      description: "Fixed discount on orders above Rs.300",
      expiry: "Expires: Jan 31, 2025",
      discount: "Rs.100",
      discountType: "fixed",
      discountValue: 100,
      minOrderValue: 300,
    },
  ];

  // Calculate subtotal
  const calculateSubtotal = () => {
    return cart.reduce((total, item) => {
      const price = Number.parseFloat(item.price.replace('Rs.', ''));
      return total + price * item.quantity;
    }, 0);
  };

  // Calculate delivery fee
  const deliveryFee = 40;

  // Calculate discount based on applied promo
  const calculateDiscount = () => {
    if (!appliedPromo) return 0;

    const subtotal = calculateSubtotal();
    
    switch (appliedPromo.discountType) {
      case 'percentage':
        return subtotal * (appliedPromo.discountValue / 100);
      case 'fixed':
        return appliedPromo.discountValue;
      case 'free_shipping':
        return deliveryFee;
      default:
        return 0;
    }
  };

  // Calculate delivery fee after promo
  const calculateDeliveryFee = () => {
    if (appliedPromo?.discountType === 'free_shipping') {
      return 0;
    }
    return deliveryFee;
  };

  // Calculate total
  const calculateTotal = () => {
    return calculateSubtotal() + calculateDeliveryFee() - calculateDiscount();
  };

  // Handle selecting an address
  const handleSelectAddress = (address: Address) => {
    setSelectedAddress(address);
  };

  // Get payment method text
  const getPaymentMethodText = () => {
    switch (paymentMethod) {
      case 'card':
        return 'Credit/Debit Card';
      case 'cash':
        return 'Cash on Delivery';
      case 'wallet':
        return 'Digital Wallet';
      default:
        return 'Credit/Debit Card';
    }
  };

  // Handle applying promo code
  const handleApplyPromo = () => {
    const foundPromo = promoCodes.find(
      promo => promo.code.toLowerCase() === promoCode.toLowerCase()
    );

    if (!foundPromo) {
      Alert.alert('Invalid Code', 'Please enter a valid promo code.');
      return;
    }

    // Check minimum order value if applicable
    if (foundPromo.minOrderValue && calculateSubtotal() < foundPromo.minOrderValue) {
      Alert.alert(
        'Minimum Order Not Met', 
        `This promo code requires a minimum order of Rs.${foundPromo.minOrderValue}.`
      );
      return;
    }

    setAppliedPromo(foundPromo);
    Alert.alert('Success', `${foundPromo.title} applied successfully!`);
  };

  // Handle removing promo code
  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCode('');
  };

  // Get discount display text
  const getDiscountText = () => {
    if (!appliedPromo) return '';
    
    switch (appliedPromo.discountType) {
      case 'percentage':
        return `${appliedPromo.discount} discount`;
      case 'fixed':
        return `Rs.${appliedPromo.discountValue} off`;
      case 'free_shipping':
        return 'Free shipping';
      default:
        return '';
    }
  };

  // Handle place order
  const handlePlaceOrder = () => {
    // Check if an address is selected
    if (!selectedAddress) {
      Alert.alert('No Address Selected', 'Please select a delivery address.');
      return;
    }

    Alert.alert('Confirm Order', 'Are you sure you want to place this order?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Place Order',
        onPress: () => {
          // Create order items from cart
          const orderItems = cart.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            image: item.image,
            quantity: item.quantity,
            tag: item.tag,
          }));

          // Add order to context
          addOrder({
            items: orderItems,
            total: calculateTotal(),
            deliveryAddress: selectedAddress.address,
            contactPhone: selectedAddress.phone,
            paymentMethod: getPaymentMethodText(),
         
          });

          // Simulate order placement
          setTimeout(() => {
            Alert.alert(
              'Order Placed!',
              'Your order has been placed successfully.',
              [
                {
                  text: 'View Orders',
                  onPress: () => {
                    clearCart();
                    navigation.navigate('Orders');
                  },
                },
                {
                  text: 'Continue Shopping',
                  onPress: () => {
                    clearCart();
                    navigation.navigate('Home', {screen: 'Homescreen'});
                  },
                },
              ],
            );
          }, 1000);
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={[styles.safeArea, isDarkMode && styles.darkSafeArea]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        {/* Header */}
        <View style={[styles.header, isDarkMode && styles.darkHeader]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Checkout</Text>
          <View style={{width: 24}} />
        </View>

        {/* Main Content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {/* Delivery Address Section */}
          <View style={[styles.section, isDarkMode && styles.darkSection]}>
            <View style={styles.sectionHeader}>
              <Icon name="location-on" size={22} color="#FF3F00" />
              <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>Delivery Address</Text>
            </View>

            <AddressManager 
              onSelectAddress={handleSelectAddress}
              mode="select"
            />
          </View>

          {/* Payment Method Section */}
          <View style={[styles.section, isDarkMode && styles.darkSection]}>
            <View style={styles.sectionHeader}>
              <Icon name="payment" size={22} color="#FF3F00" />
              <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>Payment Method</Text>
            </View>

            <TouchableOpacity
              style={[
                styles.paymentOption,
                paymentMethod === 'card' && styles.selectedPaymentOption,
                isDarkMode && styles.darkPaymentOption,
                paymentMethod === 'card' && isDarkMode && styles.darkSelectedPaymentOption,
              ]}
              onPress={() => setPaymentMethod('card')}>
              <View style={styles.paymentOptionContent}>
                <Icon name="credit-card" size={24} color={isDarkMode ? "#f0f0f0" : "#333"} />
                <Text style={[styles.paymentOptionText, isDarkMode && styles.darkText]}>Credit/Debit Card</Text>
              </View>
              <View style={styles.radioButton}>
                {paymentMethod === 'card' && (
                  <View style={styles.radioButtonInner} />
                )}
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.paymentOption,
                paymentMethod === 'cash' && styles.selectedPaymentOption,
                isDarkMode && styles.darkPaymentOption,
                paymentMethod === 'cash' && isDarkMode && styles.darkSelectedPaymentOption,
              ]}
              onPress={() => setPaymentMethod('cash')}>
              <View style={styles.paymentOptionContent}>
                <Icon name="attach-money" size={24} color={isDarkMode ? "#f0f0f0" : "#333"} />
                <Text style={[styles.paymentOptionText, isDarkMode && styles.darkText]}>Cash on Delivery</Text>
              </View>
              <View style={styles.radioButton}>
                {paymentMethod === 'cash' && (
                  <View style={styles.radioButtonInner} />
                )}
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.paymentOption,
                paymentMethod === 'wallet' && styles.selectedPaymentOption,
                isDarkMode && styles.darkPaymentOption,
                paymentMethod === 'wallet' && isDarkMode && styles.darkSelectedPaymentOption,
              ]}
              onPress={() => setPaymentMethod('wallet')}>
              <View style={styles.paymentOptionContent}>
                <Icon name="account-balance-wallet" size={24} color={isDarkMode ? "#f0f0f0" : "#333"} />
                <Text style={[styles.paymentOptionText, isDarkMode && styles.darkText]}>Digital Wallet</Text>
              </View>
              <View style={styles.radioButton}>
                {paymentMethod === 'wallet' && (
                  <View style={styles.radioButtonInner} />
                )}
              </View>
            </TouchableOpacity>
          </View>

          {/* Promo Code Section */}
          <View style={[styles.section, isDarkMode && styles.darkSection]}>
            <View style={styles.sectionHeader}>
              <Icon name="local-offer" size={22} color="#FF3F00" />
              <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>Promo Code</Text>
            </View>

            <View style={styles.promoContainer}>
              <TextInput
                style={[styles.promoInput, isDarkMode && styles.darkPromoInput]}
                placeholder="Enter promo code"
                placeholderTextColor={isDarkMode ? "#888" : "#aaa"}
                value={promoCode}
                onChangeText={setPromoCode}
                editable={!appliedPromo}
              />
              <TouchableOpacity
                style={[
                  styles.promoButton,
                  appliedPromo && styles.promoAppliedButton,
                ]}
                onPress={appliedPromo ? handleRemovePromo : handleApplyPromo}
                disabled={false}>
                <Text style={styles.promoButtonText}>
                  {appliedPromo ? 'Remove' : 'Apply'}
                </Text>
              </TouchableOpacity>
            </View>
            
            {appliedPromo && (
              <View style={styles.promoAppliedContainer}>
                <Text style={styles.promoAppliedText}>
                  {appliedPromo.title} - {getDiscountText()} applied!
                </Text>
                <Text style={styles.promoDescription}>
                  {appliedPromo.description}
                </Text>
              </View>
            )}

            {/* Available Promo Codes */}
            <View style={styles.availablePromosContainer}>
              <Text style={[styles.availablePromosTitle, isDarkMode && styles.darkText]}>
                Available Offers:
              </Text>
              {promoCodes.map((promo) => (
                <TouchableOpacity
                  key={promo.id}
                  style={[styles.promoCard, isDarkMode && styles.darkPromoCard]}
                  onPress={() => {
                    if (!appliedPromo) {
                      setPromoCode(promo.code);
                    }
                  }}>
                  <View style={styles.promoCardContent}>
                    <Text style={[styles.promoCardTitle, isDarkMode && styles.darkText]}>
                      {promo.title}
                    </Text>
                    <Text style={[styles.promoCardDescription, isDarkMode && styles.darkSubText]}>
                      {promo.description}
                    </Text>
                    <Text style={[styles.promoCardExpiry, isDarkMode && styles.darkSubText]}>
                      {promo.expiry}
                    </Text>
                  </View>
                  <View style={styles.promoCardRight}>
                    <Text style={styles.promoCardDiscount}>{promo.discount}</Text>
                    <Text style={styles.promoCardCode}>Code: {promo.code}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Order Summary Section */}
          <View style={[styles.section, isDarkMode && styles.darkSection]}>
            <View style={styles.sectionHeader}>
              <Icon name="receipt" size={22} color="#FF3F00" />
              <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>Order Summary</Text>
            </View>

            {/* Order Items */}
            {cart.map(item => (
              <View key={item.cartId} style={styles.orderItem}>
                <View style={styles.orderItemLeft}>
                  <Image source={item.image} style={styles.orderItemImage} />
                  <View style={styles.orderItemDetails}>
                    <Text style={[styles.orderItemName, isDarkMode && styles.darkText]}>{item.name}</Text>
                    <Text style={[styles.orderItemPrice, isDarkMode && styles.darkSubText]}>
                      {item.price} × {item.quantity}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.orderItemTotal, isDarkMode && styles.darkText]}>
                  Rs.
                  {(
                    Number.parseFloat(item.price.replace('Rs.', '')) *
                    item.quantity
                  ).toFixed(2)}
                </Text>
              </View>
            ))}

            {/* Price Breakdown */}
            <View style={styles.priceBreakdown}>
              <View style={styles.priceRow}>
                <Text style={[styles.priceLabel, isDarkMode && styles.darkSubText]}>Subtotal</Text>
                <Text style={[styles.priceValue, isDarkMode && styles.darkText]}>
                  Rs.{calculateSubtotal().toFixed(2)}
                </Text>
              </View>

              <View style={styles.priceRow}>
                <Text style={[styles.priceLabel, isDarkMode && styles.darkSubText]}>
                  Delivery Fee
                  {appliedPromo?.discountType === 'free_shipping' && (
                    <Text style={styles.strikethrough}> (Rs.{deliveryFee.toFixed(2)})</Text>
                  )}
                </Text>
                <Text style={[styles.priceValue, isDarkMode && styles.darkText]}>
                  Rs.{calculateDeliveryFee().toFixed(2)}
                </Text>
              </View>

              {appliedPromo && appliedPromo.discountType !== 'free_shipping' && (
                <View style={styles.priceRow}>
                  <Text style={[styles.priceLabel, styles.discountLabel]}>
                    Discount ({getDiscountText()})
                  </Text>
                  <Text style={[styles.priceValue, styles.discountValue]}>
                    -Rs.{calculateDiscount().toFixed(2)}
                  </Text>
                </View>
              )}

              <View style={styles.totalRow}>
                <Text style={[styles.totalLabel, isDarkMode && styles.darkText]}>Total</Text>
                <Text style={[styles.totalValue, isDarkMode && styles.darkText]}>
                  Rs.{calculateTotal().toFixed(2)}
                </Text>
              </View>
            </View>
          </View>

          {/* Extra space at bottom */}
          <View style={{height: 100}} />
        </ScrollView>

        {/* Place Order Button */}
        <View style={[styles.footer, isDarkMode && styles.darkFooter]}>
          <View style={[styles.totalContainer, isDarkMode && styles.darkTotalContainer]}>
            <Text style={[styles.totalLabelFooter, isDarkMode && styles.darkSubText]}>Total</Text>
            <Text style={[styles.totalValueFooter, isDarkMode && styles.darkText]}>
              Rs.{calculateTotal().toFixed(2)}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.placeOrderButton}
            onPress={handlePlaceOrder}>
            <Text style={styles.placeOrderText}>Place Order</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  darkSafeArea: {
    backgroundColor: '#121212',
  },
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#FF3F00',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20,
    elevation: 4,
  },
  darkHeader: {
    backgroundColor: '#8B0000',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 15,
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  darkSection: {
    backgroundColor: '#222',
    shadowColor: '#000',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginLeft: 10,
    color: '#222',
  },
  darkText: {
    color: '#f0f0f0',
  },
  darkSubText: {
    color: '#aaa',
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  darkPaymentOption: {
    borderColor: '#444',
    backgroundColor: '#333',
  },
  selectedPaymentOption: {
    borderColor: '#FF3F00',
    backgroundColor: '#FFF3EB',
  },
  darkSelectedPaymentOption: {
    borderColor: '#FF3F00',
    backgroundColor: '#3A2A20',
  },
  paymentOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentOptionText: {
    marginLeft: 12,
    fontSize: 15,
    color: '#333',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FF3F00',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF3F00',
  },
  promoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  promoInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    padding: 10,
    fontSize: 15,
    marginRight: 10,
    backgroundColor: '#fff',
    color: '#333',
  },
  darkPromoInput: {
    borderColor: '#444',
    backgroundColor: '#333',
    color: '#f0f0f0',
  },
  promoButton: {
    backgroundColor: '#FF3F00',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  promoAppliedButton: {
    backgroundColor: '#dc3545',
  },
  promoButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  promoAppliedContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#d4edda',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#28a745',
  },
  promoAppliedText: {
    color: '#155724',
    fontSize: 14,
    fontWeight: '600',
  },
  promoDescription: {
    color: '#155724',
    fontSize: 12,
    marginTop: 2,
  },
  availablePromosContainer: {
    marginTop: 15,
  },
  availablePromosTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  promoCard: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  darkPromoCard: {
    backgroundColor: '#333',
    borderColor: '#444',
  },
  promoCardContent: {
    flex: 1,
  },
  promoCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  promoCardDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  promoCardExpiry: {
    fontSize: 11,
    color: '#888',
  },
  promoCardRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  promoCardDiscount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF3F00',
    marginBottom: 2,
  },
  promoCardCode: {
    fontSize: 11,
    color: '#666',
    fontWeight: '600',
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  orderItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderItemImage: {
    width: 52,
    height: 52,
    borderRadius: 10,
    marginRight: 12,
  },
  orderItemDetails: {
    justifyContent: 'center',
  },
  orderItemName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  orderItemPrice: {
    fontSize: 14,
    color: '#777',
  },
  orderItemTotal: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  priceBreakdown: {
    marginTop: 10,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  priceLabel: {
    fontSize: 15,
    color: '#555',
  },
  priceValue: {
    fontSize: 15,
    fontWeight: '600',
  },
  discountLabel: {
    color: '#2E7D32',
  },
  discountValue: {
    color: '#2E7D32',
  },
  strikethrough: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    borderTopWidth: 1,
    borderColor: '#ddd',
    paddingTop: 10,
  },
  totalLabel: {
    fontSize: 17,
    fontWeight: '700',
  },
  totalValue: {
    fontSize: 17,
    fontWeight: '700',
  },
  footer: {
    paddingHorizontal: 15,
    paddingBottom: BOTTOM_PADDING + 10,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  darkFooter: {
    backgroundColor: '#222',
    borderColor: '#444',
  },
  totalContainer: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  darkTotalContainer: {
    backgroundColor: '#222',
    borderColor: '#444',
  },
  totalLabelFooter: {
    fontSize: 16,
    color: '#555',
    fontWeight: 'bold',
  },
  totalValueFooter: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
  },
  placeOrderButton: {
    marginBottom: 35,
    backgroundColor: '#FF3F00',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginTop: 10,
  },
  placeOrderText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CheckoutScreen;