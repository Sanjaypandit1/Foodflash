'use client';

import React, {useState, useEffect} from 'react';
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
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import AddressManager, { Address } from '../MenuScreen/Address1';
import auth from '@react-native-firebase/auth';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  
  // Authentication state
  const [user, setUser] = useState<any>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  
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

  // Check authentication status when screen focuses
  useFocusEffect(
    React.useCallback(() => {
      const checkAuthStatus = () => {
        const currentUser = auth().currentUser;
        console.log('Current user in checkout:', currentUser?.email);
        
        if (!currentUser) {
          // User is not authenticated, redirect to sign in
          Alert.alert(
            t('checkout.signInRequired'),
            t('checkout.signInMessage'),
            [
              {
                text: t('common.cancel'),
                style: 'cancel',
                onPress: () => navigation.goBack(),
              },
              {
                text: t('checkout.signIn'),
                onPress: () => {
                  // Navigate to sign in and pass a flag to return to checkout
                  navigation.navigate('SignIn', { 
                    returnToCheckout: true,
                    cartItems: cart 
                  });
                },
              },
            ]
          );
          return;
        }
        
        setUser(currentUser);
        setIsCheckingAuth(false);
      };

      checkAuthStatus();
    }, [navigation, cart, t])
  );

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((authUser) => {
      console.log('Auth state changed in checkout:', authUser?.email);
      setUser(authUser);
      setIsCheckingAuth(false);
      
      if (!authUser && !isCheckingAuth) {
        // User signed out while on checkout screen
        Alert.alert(
          t('checkout.sessionExpired'),
          t('checkout.sessionExpiredMessage'),
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('SignIn'),
            },
          ]
        );
      }
    });

    return unsubscribe;
  }, [navigation, isCheckingAuth, t]);

  // Show loading while checking authentication
  if (isCheckingAuth) {
    return (
      <SafeAreaView style={[styles.safeArea, isDarkMode && styles.darkSafeArea]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, isDarkMode && styles.darkText]}>
            {t('checkout.verifyingAuth')}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // If no user after auth check, don't render the checkout content
  if (!user) {
    return (
      <SafeAreaView style={[styles.safeArea, isDarkMode && styles.darkSafeArea]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, isDarkMode && styles.darkText]}>
            {t('checkout.redirectingSignIn')}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Available promo codes
  const promoCodes: PromoCode[] = [
    {
      id: 1,
      code: "SAVE20",
      title: t('checkout.promos.save20.title'),
      description: t('checkout.promos.save20.description'),
      expiry: t('checkout.promos.save20.expiry'),
      discount: "20%",
      discountType: "percentage",
      discountValue: 20,
      minOrderValue: 500,
    },
    {
      id: 2,
      code: "WELCOME10",
      title: t('checkout.promos.welcome10.title'),
      description: t('checkout.promos.welcome10.description'),
      expiry: t('checkout.promos.welcome10.expiry'),
      discount: "10%",
      discountType: "percentage",
      discountValue: 10,
    },
    {
      id: 3,
      code: "FREESHIP",
      title: t('checkout.promos.freeship.title'),
      description: t('checkout.promos.freeship.description'),
      expiry: t('checkout.promos.freeship.expiry'),
      discount: "FREE",
      discountType: "free_shipping",
      discountValue: 40,
    },
    {
      id: 4,
      code: "SAVE100",
      title: t('checkout.promos.save100.title'),
      description: t('checkout.promos.save100.description'),
      expiry: t('checkout.promos.save100.expiry'),
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
        return t('checkout.creditCard');
      case 'cash':
        return t('checkout.cashOnDelivery');
      case 'wallet':
        return t('checkout.digitalWallet');
      default:
        return t('checkout.creditCard');
    }
  };

  // Handle applying promo code
  const handleApplyPromo = () => {
    const foundPromo = promoCodes.find(
      promo => promo.code.toLowerCase() === promoCode.toLowerCase()
    );

    if (!foundPromo) {
      Alert.alert(t('checkout.invalidCode'), t('checkout.invalidCodeMessage'));
      return;
    }

    // Check minimum order value if applicable
    if (foundPromo.minOrderValue && calculateSubtotal() < foundPromo.minOrderValue) {
      Alert.alert(
        t('checkout.minimumOrderNotMet'), 
        t('checkout.minimumOrderMessage', { amount: foundPromo.minOrderValue })
      );
      return;
    }

    setAppliedPromo(foundPromo);
    Alert.alert(t('common.success'), `${foundPromo.title} ${t('checkout.promoApplied')}`);
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
        return `${appliedPromo.discount} ${t('checkout.discount')}`;
      case 'fixed':
        return `Rs.${appliedPromo.discountValue} off`;
      case 'free_shipping':
        return t('checkout.freeShipping');
      default:
        return '';
    }
  };

  // Handle place order
  const handlePlaceOrder = () => {
    // Double-check authentication before placing order
    if (!user) {
      Alert.alert(t('checkout.authRequired'), t('checkout.authRequiredMessage'));
      navigation.navigate('SignIn');
      return;
    }

    // Check if an address is selected
    if (!selectedAddress) {
      Alert.alert(t('checkout.noAddressSelected'), t('checkout.selectAddressMessage'));
      return;
    }

    Alert.alert(
      t('checkout.confirmOrder'), 
      t('checkout.confirmOrderMessage'), 
      [
        {
          text: t('common.cancel'),
          style: 'cancel',
        },
        {
          text: t('checkout.placeOrder'),
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

            // Create order object
            const orderData = {
              items: orderItems,
              total: calculateTotal(),
              deliveryAddress: selectedAddress.address,
              contactPhone: selectedAddress.phone,
              paymentMethod: getPaymentMethodText(),
            };

            // Add order to context
            addOrder(orderData);

            // Simulate order placement
            setTimeout(() => {
              Alert.alert(
                t('checkout.orderPlaced'),
                t('checkout.orderPlacedMessage', { 
                  name: user.displayName || user.email 
                }),
                [
                  {
                    text: t('checkout.viewOrders'),
                    onPress: () => {
                      clearCart();
                      navigation.navigate('Orders');
                    },
                  },
                  {
                    text: t('checkout.continueShopping'),
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
      ]
    );
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
          <Text style={styles.headerTitle}>{t('checkout.title')}</Text>
          <View style={styles.userInfo}>
            <Text style={styles.userText}>
              {user?.displayName || user?.email?.split('@')[0] || 'User'}
            </Text>
          </View>
        </View>

        {/* Main Content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          
          {/* User Welcome Section */}
          <View style={[styles.section, isDarkMode && styles.darkSection]}>
            <View style={styles.welcomeContainer}>
              <Icon name="person" size={22} color="#FF3F00" />
              <Text style={[styles.welcomeText, isDarkMode && styles.darkText]}>
                {t('checkout.welcomeBack')}, {user?.displayName || user?.email?.split('@')[0] || 'User'}!
              </Text>
            </View>
          </View>

          {/* Delivery Address Section */}
          <View style={[styles.section, isDarkMode && styles.darkSection]}>
            <View style={styles.sectionHeader}>
              <Icon name="location-on" size={22} color="#FF3F00" />
              <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>
                {t('checkout.deliveryAddress')}
              </Text>
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
              <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>
                {t('checkout.paymentMethod')}
              </Text>
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
                <Text style={[styles.paymentOptionText, isDarkMode && styles.darkText]}>
                  {t('checkout.creditCard')}
                </Text>
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
                <Text style={[styles.paymentOptionText, isDarkMode && styles.darkText]}>
                  {t('checkout.cashOnDelivery')}
                </Text>
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
                <Text style={[styles.paymentOptionText, isDarkMode && styles.darkText]}>
                  {t('checkout.digitalWallet')}
                </Text>
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
              <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>
                {t('checkout.promoCode')}
              </Text>
            </View>

            <View style={styles.promoContainer}>
              <TextInput
                style={[styles.promoInput, isDarkMode && styles.darkPromoInput]}
                placeholder={t('checkout.enterPromoCode')}
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
                  {appliedPromo ? t('common.remove') : t('common.apply')}
                </Text>
              </TouchableOpacity>
            </View>
            
            {appliedPromo && (
              <View style={styles.promoAppliedContainer}>
                <Text style={styles.promoAppliedText}>
                  {appliedPromo.title} - {getDiscountText()} {t('checkout.promoApplied')}
                </Text>
                <Text style={styles.promoDescription}>
                  {appliedPromo.description}
                </Text>
              </View>
            )}

            {/* Available Promo Codes */}
            <View style={styles.availablePromosContainer}>
              <Text style={[styles.availablePromosTitle, isDarkMode && styles.darkText]}>
                {t('checkout.availableOffers')}
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
                    <Text style={styles.promoCardCode}>{t('checkout.code')}: {promo.code}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Order Summary Section */}
          <View style={[styles.section, isDarkMode && styles.darkSection]}>
            <View style={styles.sectionHeader}>
              <Icon name="receipt" size={22} color="#FF3F00" />
              <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>
                {t('checkout.orderSummary')}
              </Text>
            </View>

            {/* Order Items */}
            {cart.map(item => (
              <View key={item.cartId} style={styles.orderItem}>
                <View style={styles.orderItemLeft}>
                  <Image source={item.image} style={styles.orderItemImage} />
                  <View style={styles.orderItemDetails}>
                    <Text style={[styles.orderItemName, isDarkMode && styles.darkText]}>
                      {item.name}
                    </Text>
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
                <Text style={[styles.priceLabel, isDarkMode && styles.darkSubText]}>
                  {t('checkout.subtotal')}
                </Text>
                <Text style={[styles.priceValue, isDarkMode && styles.darkText]}>
                  Rs.{calculateSubtotal().toFixed(2)}
                </Text>
              </View>

              <View style={styles.priceRow}>
                <Text style={[styles.priceLabel, isDarkMode && styles.darkSubText]}>
                  {t('checkout.deliveryFee')}
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
                    {t('checkout.discount')} ({getDiscountText()})
                  </Text>
                  <Text style={[styles.priceValue, styles.discountValue]}>
                    -Rs.{calculateDiscount().toFixed(2)}
                  </Text>
                </View>
              )}

              <View style={styles.totalRow}>
                <Text style={[styles.totalLabel, isDarkMode && styles.darkText]}>
                  {t('common.total')}
                </Text>
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
            <Text style={[styles.totalLabelFooter, isDarkMode && styles.darkSubText]}>
              {t('common.total')}
            </Text>
            <Text style={[styles.totalValueFooter, isDarkMode && styles.darkText]}>
              Rs.{calculateTotal().toFixed(2)}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.placeOrderButton}
            onPress={handlePlaceOrder}>
            <Text style={styles.placeOrderText}>{t('checkout.placeOrder')}</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
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
  userInfo: {
    alignItems: 'flex-end',
  },
  userText: {
    fontSize: 12,
    color: 'white',
    opacity: 0.9,
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
  welcomeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  welcomeText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
    color: '#333',
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