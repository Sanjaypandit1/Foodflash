import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, StatusBar, Platform  } from "react-native"
import Icon from "react-native-vector-icons/Feather"
import { type NavigationProp, useNavigation } from "@react-navigation/native"

type RootStackParamList = {
  Settings: undefined
}

type NavigationProps = NavigationProp<RootStackParamList, "Settings">

const RefundScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProps>()

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Refund Policy</Text>
         <View style={{width: 24}}/>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.lastUpdated}>Last Updated: April 19, 2025</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. Refund Eligibility</Text>
            <Text style={styles.sectionText}>
              We accept refund requests within 7 days of product delivery. To be eligible for a refund, the item must be
              unused, in its original packaging, and in the same condition that you received it.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. Refund Process</Text>
            <Text style={styles.sectionText}>
              To initiate a refund, please contact our customer support team or use the return feature in your account.
              Once your return is received and inspected, we will send you an email to notify you that we have received
              your returned item and whether your refund has been approved.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>3. Refund Timeframe</Text>
            <Text style={styles.sectionText}>
              If your refund is approved, it will be processed within 5-7 business days. The time it takes for the
              refund to appear in your account depends on your payment method and financial institution.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>4. Non-Refundable Items</Text>
            <Text style={styles.sectionText}>
              Certain items are non-refundable, including perishable goods, personalized items, and digital products
              after they have been downloaded or accessed.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>5. Damaged or Defective Items</Text>
            <Text style={styles.sectionText}>
              If you receive a damaged or defective item, please contact us immediately. We will provide instructions
              for returning the item and will cover the return shipping costs.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>6. Contact Us</Text>
            <Text style={styles.sectionText}>
              If you have any questions about our refund policy, please contact us at refunds@example.com.
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
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0,
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

export default RefundScreen
