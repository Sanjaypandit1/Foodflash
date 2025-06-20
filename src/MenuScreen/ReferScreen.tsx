import type React from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  Alert,
  Clipboard,
   StatusBar, Platform 
} from "react-native"
import Icon from "react-native-vector-icons/Feather"
import { type NavigationProp, useNavigation } from "@react-navigation/native"

type RootStackParamList = {
  Settings: undefined
}

type NavigationProps = NavigationProp<RootStackParamList, "Settings">

const ReferScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProps>()

  const copyToClipboard = () => {
    Clipboard.setString("FRIEND50")
    Alert.alert("Copied", "Referral code copied to clipboard!")
  }

  const shareViaWhatsApp = () => {
    // Share functionality would go here
    Alert.alert("Share", "WhatsApp sharing would open here")
  }

  const shareViaEmail = () => {
    // Share functionality would go here
    Alert.alert("Share", "Email sharing would open here")
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Refer & Earn</Text>
         <View style={{width: 24}}/>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.card}>
          <View style={styles.titleContainer}>
            <Text style={styles.cardTitle}>Invite Friends & Earn Rewards</Text>
            <Text style={styles.cardSubtitle}>
              Share your referral code with friends and earn rewards when they sign up!
            </Text>
          </View>

          <View style={styles.referralCodeContainer}>
            <Text style={styles.referralCodeLabel}>Your Referral Code</Text>
            <View style={styles.referralCodeInputContainer}>
              <TextInput style={styles.referralCodeInput} value="FRIEND50" editable={false} />
              <TouchableOpacity style={styles.copyButton} onPress={copyToClipboard}>
                <Text style={styles.copyButtonText}>Copy</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.shareButtonsContainer}>
            <TouchableOpacity style={styles.whatsappButton} onPress={shareViaWhatsApp}>
              <Text style={styles.whatsappButtonText}>Share via WhatsApp</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.emailButton} onPress={shareViaEmail}>
              <Text style={styles.emailButtonText}>Share via Email</Text>
            </TouchableOpacity>
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
  titleContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 5,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  referralCodeContainer: {
    backgroundColor: "#FFF5EB",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  referralCodeLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  referralCodeInputContainer: {
    flexDirection: "row",
  },
  referralCodeInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#fff",
    marginRight: 10,
  },
  copyButton: {
    borderWidth: 1,
    borderColor: "red",
    borderRadius: 8,
    paddingHorizontal: 15,
    justifyContent: "center",
  },
  copyButtonText: {
    color: "red",
    fontWeight: "bold",
  },
  shareButtonsContainer: {
    marginTop: 10,
  },
  whatsappButton: {
    backgroundColor: "red",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 10,
  },
  whatsappButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  emailButton: {
    borderWidth: 1,
    borderColor: "red",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  emailButtonText: {
    color: "red",
    fontSize: 16,
    fontWeight: "bold",
  },
})

export default ReferScreen
