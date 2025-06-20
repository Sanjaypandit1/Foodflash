import type React from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Platform,
  Alert,
  Clipboard,
} from "react-native"
import Icon from "react-native-vector-icons/Feather"
import { type NavigationProp, useNavigation } from "@react-navigation/native"
import type { User } from "./User"

type RootStackParamList = {
  Settings: undefined
  SignIn: undefined
}

type NavigationProps = NavigationProp<RootStackParamList, "Settings">

interface CouponsScreenProps {
  user?: User
  onNavigate?: (screen: string) => void
}

const CouponsScreen: React.FC<CouponsScreenProps> = ({ user, onNavigate }) => {
  const navigation = useNavigation<NavigationProps>()

  // Mock coupons data - replace with real data from your backend
  const coupons = [
    {
      id: 1,
      code: "SAVE20",
      title: "20% Off Your Next Order",
      description: "Valid on orders above $50",
      expiry: "Expires: Dec 31, 2024",
      discount: "20%",
    },
    {
      id: 2,
      code: "WELCOME10",
      title: "Welcome Bonus",
      description: "First time user discount",
      expiry: "Expires: Jan 15, 2025",
      discount: "$10",
    },
    {
      id: 3,
      code: "FREESHIP",
      title: "Free Shipping",
      description: "Free delivery on any order",
      expiry: "Expires: Dec 25, 2024",
      discount: "FREE",
    },
  ]

  const copyCoupon = (code: string) => {
    Clipboard.setString(code)
    Alert.alert("Copied", `Coupon code ${code} copied to clipboard!`)
  }

  // If user is not signed in, show sign-in prompt
  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Coupons</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.card}>
            <Text style={styles.cardText}>Sign in to view your available coupons.</Text>

            <TouchableOpacity style={styles.signInButton} onPress={() => navigation.navigate("SignIn")}>
              <Text style={styles.signInText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    )
  }

  // If user is signed in, show coupons
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Coupons</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.welcomeSection}>
          <Icon name="gift" size={48} color="#FF8C00" />
          <Text style={styles.welcomeTitle}>Welcome, {user.name}!</Text>
          <Text style={styles.welcomeSubtitle}>Here are your exclusive coupons</Text>
        </View>

        {coupons.map((coupon) => (
          <View key={coupon.id} style={styles.couponCard}>
            <View style={styles.couponLeft}>
              <Text style={styles.discountText}>{coupon.discount}</Text>
              <Text style={styles.offText}>OFF</Text>
            </View>
            <View style={styles.couponRight}>
              <Text style={styles.couponTitle}>{coupon.title}</Text>
              <Text style={styles.couponDescription}>{coupon.description}</Text>
              <Text style={styles.couponExpiry}>{coupon.expiry}</Text>
              <View style={styles.couponCodeContainer}>
                <View style={styles.codeBox}>
                  <Text style={styles.couponCode}>{coupon.code}</Text>
                </View>
                <TouchableOpacity style={styles.copyButton} onPress={() => copyCoupon(coupon.code)}>
                  <Icon name="copy" size={16} color="#fff" />
                  <Text style={styles.copyButtonText}>Copy</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}

        <View style={styles.infoCard}>
          <Icon name="info" size={24} color="#FF8C00" />
          <Text style={styles.infoText}>More coupons will be available based on your activity and purchases.</Text>
          <TouchableOpacity style={styles.exploreButton}>
            <Text style={styles.exploreButtonText}>Explore Products</Text>
          </TouchableOpacity>
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
  header: {
    backgroundColor: "red",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    elevation: 4,
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  content: {
    flex: 1,
    padding: 15,
  },
  // Original sign-in prompt styles
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
  cardText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
  signInButton: {
    backgroundColor: "red",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  signInText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  // New authenticated user styles
  welcomeSection: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginTop: 10,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  couponCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 15,
    flexDirection: "row",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  couponLeft: {
    backgroundColor: "red",
    width: 100,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  discountText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  offText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  couponRight: {
    flex: 1,
    padding: 15,
  },
  couponTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  couponDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  couponExpiry: {
    fontSize: 12,
    color: "#999",
    marginBottom: 10,
  },
  couponCodeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  codeBox: {
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    borderStyle: "dashed",
  },
  couponCode: {
    fontFamily: "monospace",
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
  },
  copyButton: {
    backgroundColor: "red",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    gap: 5,
  },
  copyButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginVertical: 15,
  },
  exploreButton: {
    backgroundColor: "red",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  exploreButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
})

export default CouponsScreen
