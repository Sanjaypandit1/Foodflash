import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView , StatusBar, Platform } from "react-native"
import Icon from "react-native-vector-icons/Feather"
import { type NavigationProp, useNavigation } from "@react-navigation/native"

type RootStackParamList = {
  Settings: undefined
}

type NavigationProps = NavigationProp<RootStackParamList, "Settings">

const CancellationScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProps>()

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#fff"/>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cancellation Policy</Text>
         <View style={{width: 24}}/>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.lastUpdated}>Last Updated: April 19, 2025</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. Order Cancellation</Text>
            <Text style={styles.sectionText}>
              You can cancel your order at any time before it is shipped. Once an order has been shipped, it cannot be
              cancelled, but you may return it according to our Return Policy.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. How to Cancel an Order</Text>
            <Text style={styles.sectionText}>
              To cancel an order, log in to your account, go to "My Orders," find the order you wish to cancel, and
              click on the "Cancel Order" button. Alternatively, you can contact our customer support team.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>3. Refund for Cancelled Orders</Text>
            <Text style={styles.sectionText}>
              If you have already paid for an order that you cancel, we will process a refund within 5-7 business days.
              The time it takes for the refund to appear in your account depends on your payment method and financial
              institution.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>4. Subscription Cancellation</Text>
            <Text style={styles.sectionText}>
              If you have a subscription service with us, you can cancel it at any time through your account settings.
              Cancellation will take effect at the end of your current billing cycle.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>5. Event Cancellation</Text>
            <Text style={styles.sectionText}>
              For event bookings, cancellation policies may vary. Please refer to the specific event details for
              cancellation terms.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>6. Contact Us</Text>
            <Text style={styles.sectionText}>
              If you have any questions about our cancellation policy, please contact us at cancellations@example.com.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF5EB",

  },
  safeArea: {
    flex: 1,
  },
  header: {
    backgroundColor: 'red',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    elevation: 4,
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color:'#fff'
  },
  content: {
    flex: 1,
    padding: 15,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  lastUpdated: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  sectionText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
})

export default CancellationScreen
