"use client"

import type React from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  StatusBar,
  Platform,
  Alert,
} from "react-native"
import Icon from "react-native-vector-icons/Feather"
import { type NavigationProp, useNavigation } from "@react-navigation/native"
import { useState } from "react"
import type { User } from "./User"

type RootStackParamList = {
  Settings: undefined
  SignIn: undefined
}

type NavigationProps = NavigationProp<RootStackParamList, "Settings">

interface WalletScreenProps {
  user?: User
}

const WalletScreen: React.FC<WalletScreenProps> = ({ user }) => {
  const navigation = useNavigation<NavigationProps>()
  const [balance] = useState(125.5)
  const [addAmount, setAddAmount] = useState("")

  const transactions = [
    {
      id: 1,
      type: "credit",
      description: "Refund for Order #1234",
      amount: 25.0,
      date: "Dec 15, 2024",
      time: "2:30 PM",
    },
    {
      id: 2,
      type: "debit",
      description: "Payment for Order #1235",
      amount: -45.5,
      date: "Dec 14, 2024",
      time: "11:15 AM",
    },
    {
      id: 3,
      type: "credit",
      description: "Cashback Reward",
      amount: 10.0,
      date: "Dec 12, 2024",
      time: "4:45 PM",
    },
    {
      id: 4,
      type: "credit",
      description: "Wallet Top-up",
      amount: 100.0,
      date: "Dec 10, 2024",
      time: "9:20 AM",
    },
  ]

  const quickAmounts = [10, 25, 50, 100]

  const handleAddMoney = () => {
    if (addAmount && Number.parseFloat(addAmount) > 0) {
      Alert.alert("Success", `$${addAmount} added to wallet successfully!`)
      setAddAmount("")
    } else {
      Alert.alert("Error", "Please enter a valid amount")
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
          <Text style={styles.headerTitle}>My Wallet</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.card}>
            <Text style={styles.cardText}>Sign in to access your wallet and manage your funds.</Text>

            <TouchableOpacity style={styles.signInButton} onPress={() => navigation.navigate("SignIn")}>
              <Text style={styles.signInText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    )
  }

  // If user is signed in, show wallet
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Wallet</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        {/* Wallet Balance */}
        <View style={styles.balanceCard}>
          <Icon name="credit-card" size={48} color="#fff" />
          <Text style={styles.balanceAmount}>${balance.toFixed(2)}</Text>
          <Text style={styles.balanceLabel}>Available Balance</Text>
        </View>

        {/* Add Money */}
        <View style={styles.addMoneyCard}>
          <View style={styles.addMoneyHeader}>
            <Icon name="plus" size={20} color="#333" />
            <Text style={styles.addMoneyTitle}>Add Money</Text>
          </View>

          <View style={styles.quickAmountsContainer}>
            {quickAmounts.map((amount) => (
              <TouchableOpacity
                key={amount}
                style={styles.quickAmountButton}
                onPress={() => setAddAmount(amount.toString())}
              >
                <Text style={styles.quickAmountText}>${amount}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.addMoneyInputContainer}>
            <TextInput
              style={styles.addMoneyInput}
              placeholder="Enter amount"
              value={addAmount}
              onChangeText={setAddAmount}
              keyboardType="numeric"
            />
            <TouchableOpacity style={styles.addMoneyButton} onPress={handleAddMoney}>
              <Text style={styles.addMoneyButtonText}>Add Money</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.securePaymentInfo}>
            <Icon name="shield" size={16} color="#666" />
            <Text style={styles.securePaymentText}>Secure payment via card or UPI</Text>
          </View>
        </View>

        {/* Transaction History */}
        <View style={styles.transactionCard}>
          <Text style={styles.transactionTitle}>Transaction History</Text>
          {transactions.map((transaction) => (
            <View key={transaction.id} style={styles.transactionItem}>
              <View style={styles.transactionLeft}>
                <View
                  style={[styles.transactionIcon, transaction.type === "credit" ? styles.creditIcon : styles.debitIcon]}
                >
                  <Icon
                    name={transaction.type === "credit" ? "arrow-down-left" : "arrow-up-right"}
                    size={16}
                    color="#fff"
                  />
                </View>
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionDescription}>{transaction.description}</Text>
                  <Text style={styles.transactionDateTime}>
                    {transaction.date} • {transaction.time}
                  </Text>
                </View>
              </View>
              <Text
                style={[
                  styles.transactionAmount,
                  transaction.type === "credit" ? styles.creditAmount : styles.debitAmount,
                ]}
              >
                {transaction.type === "credit" ? "+" : ""}${Math.abs(transaction.amount).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        {/* Wallet Features */}
        <View style={styles.featuresCard}>
          <Text style={styles.featuresTitle}>Wallet Features</Text>
          <View style={styles.featureItem}>
            <View style={styles.featureDot} />
            <Text style={styles.featureText}>Instant refunds to wallet</Text>
          </View>
          <View style={styles.featureItem}>
            <View style={styles.featureDot} />
            <Text style={styles.featureText}>Cashback rewards</Text>
          </View>
          <View style={styles.featureItem}>
            <View style={styles.featureDot} />
            <Text style={styles.featureText}>Secure transactions</Text>
          </View>
          <View style={styles.featureItem}>
            <View style={styles.featureDot} />
            <Text style={styles.featureText}>No transaction fees</Text>
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
  balanceCard: {
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
  balanceAmount: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
    marginVertical: 10,
  },
  balanceLabel: {
    fontSize: 16,
    color: "#fff",
    opacity: 0.9,
  },
  addMoneyCard: {
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
  addMoneyHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  addMoneyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginLeft: 8,
  },
  quickAmountsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  quickAmountButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
    marginHorizontal: 2,
  },
  quickAmountText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  addMoneyInputContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 15,
  },
  addMoneyInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
  },
  addMoneyButton: {
    backgroundColor: "red",
    borderRadius: 8,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  addMoneyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  securePaymentInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  securePaymentText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 5,
  },
  transactionCard: {
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
  transactionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 15,
  },
  transactionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  transactionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  transactionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  creditIcon: {
    backgroundColor: "#4CAF50",
  },
  debitIcon: {
    backgroundColor: "#F44336",
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  transactionDateTime: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "bold",
  },
  creditAmount: {
    color: "#4CAF50",
  },
  debitAmount: {
    color: "#F44336",
  },
  featuresCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 15,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  featureDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#4CAF50",
    marginRight: 12,
  },
  featureText: {
    fontSize: 14,
    color: "#333",
  },
})

export default WalletScreen
