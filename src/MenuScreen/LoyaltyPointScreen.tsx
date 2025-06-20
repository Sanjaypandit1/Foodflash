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
} from "react-native"
import Icon from "react-native-vector-icons/Feather"
import { type NavigationProp, useNavigation } from "@react-navigation/native"

type RootStackParamList = {
  Settings: undefined
  SignIn: undefined
}

type NavigationProps = NavigationProp<RootStackParamList, "Settings">

interface User {
  uid: string
   email: string | null 
  displayName?: string | null
  name?: string
  photoURL?: string | null
  emailVerified: boolean
}

interface LoyaltyPointsScreenProps {
  user?: User | null
}

const LoyaltyPointsScreen: React.FC<LoyaltyPointsScreenProps> = ({ user }) => {
  const navigation = useNavigation<NavigationProps>()

  const currentPoints = 1250
  const nextTierPoints = 2000
  const progress = (currentPoints / nextTierPoints) * 100

  const recentActivity = [
    {
      id: 1,
      action: "Order Purchase",
      points: "+50",
      date: "Dec 15, 2024",
    },
    {
      id: 2,
      action: "Review Written",
      points: "+25",
      date: "Dec 12, 2024",
    },
    {
      id: 3,
      action: "Referral Bonus",
      points: "+100",
      date: "Dec 10, 2024",
    },
  ]

  const rewards = [
    {
      id: 1,
      title: "$5 Off Coupon",
      points: 500,
      description: "Valid on orders above $25",
    },
    {
      id: 2,
      title: "$10 Off Coupon",
      points: 1000,
      description: "Valid on orders above $50",
    },
    {
      id: 3,
      title: "Free Shipping",
      points: 750,
      description: "Free delivery on any order",
    },
  ]

  const redeemReward = (reward: any) => {
    if (currentPoints >= reward.points) {
      Alert.alert("Success", `${reward.title} redeemed successfully!`)
    } else {
      Alert.alert("Insufficient Points", "You don't have enough points to redeem this reward.")
    }
  }

  // If user is not signed in, show sign-in prompt
  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Loyalty Points</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.card}>
            <Text style={styles.cardText}>Sign in to view and redeem your loyalty points.</Text>

            <TouchableOpacity style={styles.signInButton} onPress={() => navigation.navigate("SignIn")}>
              <Text style={styles.signInText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    )
  }

  // If user is signed in, show loyalty points
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Loyalty Points</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        {/* Points Balance */}
        <View style={styles.pointsCard}>
          <Icon name="star" size={48} color="#fff" />
          <Text style={styles.pointsAmount}>{currentPoints.toLocaleString()}</Text>
          <Text style={styles.pointsLabel}>Loyalty Points</Text>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
            <Text style={styles.progressText}>{nextTierPoints - currentPoints} points to next tier</Text>
          </View>
        </View>

        {/* Available Rewards */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Icon name="gift" size={20} color="#333" />
            <Text style={styles.sectionTitle}>Available Rewards</Text>
          </View>
          {rewards.map((reward) => (
            <View key={reward.id} style={styles.rewardItem}>
              <View style={styles.rewardInfo}>
                <Text style={styles.rewardTitle}>{reward.title}</Text>
                <Text style={styles.rewardDescription}>{reward.description}</Text>
              </View>
              <View style={styles.rewardAction}>
                <Text style={styles.rewardPoints}>{reward.points} pts</Text>
                <TouchableOpacity
                  style={[styles.redeemButton, currentPoints < reward.points && styles.redeemButtonDisabled]}
                  onPress={() => redeemReward(reward)}
                  disabled={currentPoints < reward.points}
                >
                  <Text
                    style={[styles.redeemButtonText, currentPoints < reward.points && styles.redeemButtonTextDisabled]}
                  >
                    {currentPoints >= reward.points ? "Redeem" : "Not enough"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Recent Activity */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Icon name="calendar" size={20} color="#333" />
            <Text style={styles.sectionTitle}>Recent Activity</Text>
          </View>
          {recentActivity.map((activity) => (
            <View key={activity.id} style={styles.activityItem}>
              <View style={styles.activityInfo}>
                <Text style={styles.activityAction}>{activity.action}</Text>
                <Text style={styles.activityDate}>{activity.date}</Text>
              </View>
              <Text style={styles.activityPoints}>{activity.points}</Text>
            </View>
          ))}
        </View>

        {/* How to Earn */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>How to Earn Points</Text>
          <View style={styles.earnItem}>
            <Text style={styles.earnAction}>Make a purchase</Text>
            <Text style={styles.earnPoints}>1 point per $1</Text>
          </View>
          <View style={styles.earnItem}>
            <Text style={styles.earnAction}>Write a review</Text>
            <Text style={styles.earnPoints}>25 points</Text>
          </View>
          <View style={styles.earnItem}>
            <Text style={styles.earnAction}>Refer a friend</Text>
            <Text style={styles.earnPoints}>100 points</Text>
          </View>
          <View style={styles.earnItem}>
            <Text style={styles.earnAction}>Birthday bonus</Text>
            <Text style={styles.earnPoints}>50 points</Text>
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
  // Authenticated user styles
  pointsCard: {
    backgroundColor: "red",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  pointsAmount: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
    marginVertical: 10,
  },
  pointsLabel: {
    fontSize: 16,
    color: "#fff",
    opacity: 0.9,
  },
  progressContainer: {
    width: "100%",
    marginTop: 15,
  },
  progressBar: {
    height: 8,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#fff",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: "#fff",
    textAlign: "center",
    marginTop: 8,
    opacity: 0.9,
  },
  sectionCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginLeft: 8,
  },
  rewardItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  rewardInfo: {
    flex: 1,
  },
  rewardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  rewardDescription: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  rewardAction: {
    alignItems: "center",
  },
  rewardPoints: {
    fontSize: 14,
    fontWeight: "bold",
    color: "red",
    marginBottom: 8,
  },
  redeemButton: {
    backgroundColor: "red",
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 5,
  },
  redeemButtonDisabled: {
    backgroundColor: "#ccc",
  },
  redeemButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  redeemButtonTextDisabled: {
    color: "#999",
  },
  activityItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  activityInfo: {
    flex: 1,
  },
  activityAction: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  activityDate: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  activityPoints: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  earnItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  earnAction: {
    fontSize: 14,
    color: "#333",
  },
  earnPoints: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
})

export default LoyaltyPointsScreen
