"use client"

import { useState } from "react"
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
} from "react-native"
import Icon from "react-native-vector-icons/MaterialIcons"
import { useCart } from "../components/CartContext"
import { useNavigation } from "@react-navigation/native"

const { width, height } = Dimensions.get("window")
const BOTTOM_PADDING = Platform.OS === "ios" ? 34 : 20

// Payment method type
type PaymentMethod = "card" | "cash" | "wallet"

// Address type
type Address = {
  id: string
  name: string
  address: string
  isDefault: boolean
}

const CheckoutScreen = () => {
  const { cart, clearCart } = useCart()
  const navigation = useNavigation<any>()

  // State for selected payment method
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card")

  // State for delivery addresses
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: "1",
      name: "Home",
      address: "Sundarharaincha-12, Morang Nepal",
      isDefault: true,
    },
    {
      id: "2",
      name: "Work",
      address: "Itahari 4, Sunsari Nepal",
      isDefault: false,
    },
  ])

  // State for selected address
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    addresses.find((addr) => addr.isDefault)?.id || "1",
  )

  // State for promo code
  const [promoCode, setPromoCode] = useState<string>("")
  const [promoApplied, setPromoApplied] = useState<boolean>(false)

  // Calculate subtotal
  const calculateSubtotal = () => {
    return cart.reduce((total, item) => {
      const price = Number.parseFloat(item.price.replace("Rs.", ""))
      return total + price * item.quantity
    }, 0)
  }

  // Calculate delivery fee
  const deliveryFee = 40

  
  // Calculate discount if promo applied (10% off)
  const calculateDiscount = () => {
    return promoApplied ? calculateSubtotal() * 0.1 : 0
  }

  // Calculate total
  const calculateTotal = () => {
    return calculateSubtotal() + deliveryFee  - calculateDiscount()
  }

  // Handle applying promo code
  const handleApplyPromo = () => {
    if (promoCode.toLowerCase() === "welcome10") {
      setPromoApplied(true)
      Alert.alert("Success", "Promo code applied successfully!")
    } else {
      Alert.alert("Invalid Code", "Please enter a valid promo code.")
    }
  }

  // Handle place order
  const handlePlaceOrder = () => {
    Alert.alert("Confirm Order", "Are you sure you want to place this order?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Place Order",
        onPress: () => {
          // Simulate order placement
          setTimeout(() => {
            Alert.alert("Order Placed!", "Your order has been placed successfully.", [
              {
                text: "OK",
                onPress: () => {
                  clearCart()
                  navigation.navigate("Home", { screen: "Homescreen" })
                },
              },
            ])
          }, 1000)
        },
      },
    ])
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Checkout</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Main Content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Delivery Address Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icon name="location-on" size={22} color="#FF3F00" />
              <Text style={styles.sectionTitle}>Delivery Address</Text>
            </View>

            {addresses.map((address) => (
              <TouchableOpacity
                key={address.id}
                style={[styles.addressCard, selectedAddressId === address.id && styles.selectedAddressCard]}
                onPress={() => setSelectedAddressId(address.id)}
              >
                <View style={styles.addressHeader}>
                  <Text style={styles.addressName}>{address.name}</Text>
                  {address.isDefault && (
                    <View style={styles.defaultBadge}>
                      <Text style={styles.defaultText}>Default</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.addressText}>{address.address}</Text>
                <View style={styles.radioButton}>
                  {selectedAddressId === address.id && <View style={styles.radioButtonInner} />}
                </View>
              </TouchableOpacity>
            ))}

            <TouchableOpacity style={styles.addButton}>
              <Icon name="add" size={20} color="#FF3F00" />
              <Text style={styles.addButtonText}>Add New Address</Text>
            </TouchableOpacity>
          </View>

          {/* Payment Method Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icon name="payment" size={22} color="#FF3F00" />
              <Text style={styles.sectionTitle}>Payment Method</Text>
            </View>

            <TouchableOpacity
              style={[styles.paymentOption, paymentMethod === "card" && styles.selectedPaymentOption]}
              onPress={() => setPaymentMethod("card")}
            >
              <View style={styles.paymentOptionContent}>
                <Icon name="credit-card" size={24} color="#333" />
                <Text style={styles.paymentOptionText}>Credit/Debit Card</Text>
              </View>
              <View style={styles.radioButton}>
                {paymentMethod === "card" && <View style={styles.radioButtonInner} />}
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.paymentOption, paymentMethod === "cash" && styles.selectedPaymentOption]}
              onPress={() => setPaymentMethod("cash")}
            >
              <View style={styles.paymentOptionContent}>
                <Icon name="attach-money" size={24} color="#333" />
                <Text style={styles.paymentOptionText}>Cash on Delivery</Text>
              </View>
              <View style={styles.radioButton}>
                {paymentMethod === "cash" && <View style={styles.radioButtonInner} />}
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.paymentOption, paymentMethod === "wallet" && styles.selectedPaymentOption]}
              onPress={() => setPaymentMethod("wallet")}
            >
              <View style={styles.paymentOptionContent}>
                <Icon name="account-balance-wallet" size={24} color="#333" />
                <Text style={styles.paymentOptionText}>Digital Wallet</Text>
              </View>
              <View style={styles.radioButton}>
                {paymentMethod === "wallet" && <View style={styles.radioButtonInner} />}
              </View>
            </TouchableOpacity>
          </View>

          {/* Promo Code Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icon name="local-offer" size={22} color="#FF3F00" />
              <Text style={styles.sectionTitle}>Promo Code</Text>
            </View>

            <View style={styles.promoContainer}>
              <TextInput
                style={styles.promoInput}
                placeholder="Enter promo code"
                value={promoCode}
                onChangeText={setPromoCode}
                editable={!promoApplied}
              />
              <TouchableOpacity
                style={[styles.promoButton, promoApplied && styles.promoAppliedButton]}
                onPress={handleApplyPromo}
                disabled={promoApplied}
              >
                <Text style={styles.promoButtonText}>{promoApplied ? "Applied" : "Apply"}</Text>
              </TouchableOpacity>
            </View>
            {promoApplied && <Text style={styles.promoAppliedText}>10% discount applied!</Text>}
          </View>

          {/* Order Summary Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icon name="receipt" size={22} color="#FF3F00" />
              <Text style={styles.sectionTitle}>Order Summary</Text>
            </View>

            {/* Order Items */}
            {cart.map((item) => (
              <View key={item.cartId} style={styles.orderItem}>
                <View style={styles.orderItemLeft}>
                  <Image source={item.image} style={styles.orderItemImage} />
                  <View style={styles.orderItemDetails}>
                    <Text style={styles.orderItemName}>{item.name}</Text>
                    <Text style={styles.orderItemPrice}>
                      {item.price} × {item.quantity}
                    </Text>
                  </View>
                </View>
                <Text style={styles.orderItemTotal}>
                  Rs.{(Number.parseFloat(item.price.replace("Rs.", "")) * item.quantity).toFixed(2)}
                </Text>
              </View>
            ))}

            {/* Price Breakdown */}
            <View style={styles.priceBreakdown}>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Subtotal</Text>
                <Text style={styles.priceValue}>Rs.{calculateSubtotal().toFixed(2)}</Text>
              </View>

              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Delivery Fee</Text>
                <Text style={styles.priceValue}>Rs.{deliveryFee.toFixed(2)}</Text>
              </View>


              {promoApplied && (
                <View style={styles.priceRow}>
                  <Text style={[styles.priceLabel, styles.discountLabel]}>Discount (10%)</Text>
                  <Text style={[styles.priceValue, styles.discountValue]}>-Rs.{calculateDiscount().toFixed(2)}</Text>
                </View>
              )}

              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>Rs.{calculateTotal().toFixed(2)}</Text>
              </View>
            </View>
          </View>

          {/* Extra space at bottom */}
          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Place Order Button */}
        <View style={styles.footer}>
  <View style={styles.totalContainer}>
    <Text style={styles.totalLabelFooter}>Total</Text>
    <Text style={styles.totalValueFooter}>Rs.{calculateTotal().toFixed(2)}</Text>
  </View>

  <TouchableOpacity style={styles.placeOrderButton} onPress={handlePlaceOrder}>
    <Text style={styles.placeOrderText} >Place Order</Text>
  </TouchableOpacity>
</View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: "#FF3F00",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 20,
    elevation: 4,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "white",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 15,
  },
  section: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "600",
    marginLeft: 10,
    color: "#222",
  },
  addressCard: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  selectedAddressCard: {
    borderColor: "#FF3F00",
    backgroundColor: "#FFF3EB",
  },
  addressHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  addressName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  defaultBadge: {
    backgroundColor: "#FF3F00",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  defaultText: {
    color: "white",
    fontSize: 11,
    fontWeight: "500",
  },
  addressText: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
    paddingRight: 30,
  },
  radioButton: {
    position: "absolute",
    right: 14,
    top: "50%",
    marginTop:6,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#FF3F00",
    justifyContent: "center",
    alignItems: "center",
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#FF3F00",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    marginTop: 6,
  },
  addButtonText: {
    color: "#FF3F00",
    fontWeight: "600",
    marginLeft: 5,
    fontSize: 15,
  },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
  },
  selectedPaymentOption: {
    borderColor: "#FF3F00",
    backgroundColor: "#FFF3EB",
  },
  paymentOptionContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  paymentOptionText: {
    marginLeft: 12,
    fontSize: 15,
    color: "#333",
  },
  promoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  promoInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    padding: 10,
    fontSize: 15,
    marginRight: 10,
    backgroundColor: "#fff",
  },
  promoButton: {
    backgroundColor: "#FF3F00",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  promoAppliedButton: {
    backgroundColor: "#aaa",
  },
  promoButtonText: {
    color: "white",
    fontWeight: "600",
  },
  promoAppliedText: {
    color: "#2E7D32",
    fontSize: 14,
    marginTop: 6,
  },
  orderItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  orderItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  orderItemImage: {
    width: 52,
    height: 52,
    borderRadius: 10,
    marginRight: 12,
  },
  orderItemDetails: {
    justifyContent: "center",
  },
  orderItemName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  orderItemPrice: {
    fontSize: 14,
    color: "#777",
  },
  orderItemTotal: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  priceBreakdown: {
    marginTop: 10,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  priceLabel: {
    fontSize: 15,
    color: "#555",
  },
  priceValue: {
    fontSize: 15,
    fontWeight: "600",
  },
  discountLabel: {
    color: "#2E7D32",
  },
  discountValue: {
    color: "#2E7D32",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    borderTopWidth: 1,
    borderColor: "#ddd",
    paddingTop: 10,
  },
  totalLabel: {
    fontSize: 17,
    fontWeight: "700",
  },
  totalValue: {
    fontSize: 17,
    fontWeight: "700",
  },
 
    footer: {
      paddingHorizontal: 15,
      paddingBottom: BOTTOM_PADDING + 10,
      backgroundColor: "white",
      borderTopWidth: 1,
      borderColor: "#ddd",
    
  },
  placeOrderPrice: {
    fontSize: 18,
    color: "white",
    fontWeight: "700",
  },
  totalContainer: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#eee",
  },
  
  totalLabelFooter: {
    fontSize: 16,
    color: "#555",
    fontWeight: "bold",
  },
  
  totalValueFooter: {
    fontSize: 16,
    color: "#000",
    fontWeight: "bold",
  },
  
  placeOrderButton: {
    marginBottom: 35 ,
    backgroundColor: "#FF3F00",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
    marginTop: 10,
  },
  placeOrderText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  
})


export default CheckoutScreen
