import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView , StatusBar, Platform } from "react-native"
import Icon from "react-native-vector-icons/Feather"
import { type NavigationProp, useNavigation } from "@react-navigation/native"

type RootStackParamList = {
  Settings: undefined
}

type NavigationProps = NavigationProp<RootStackParamList, "Settings">

const PrivacyScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProps>()

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
         <View style={{width: 24}}/>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.lastUpdated}>Last Updated: April 19, 2025</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. Information We Collect</Text>
            <Text style={styles.sectionText}>
              We collect information you provide directly to us, such as when you create an account, make a purchase, or
              contact customer support. This may include your name, email address, phone number, and payment
              information.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
            <Text style={styles.sectionText}>
              We use your information to provide, maintain, and improve our services, process transactions, send
              communications, and for security purposes. We may also use your information to personalize your experience
              and to deliver relevant content and advertisements.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>3. Information Sharing</Text>
            <Text style={styles.sectionText}>
              We may share your information with service providers who perform services on our behalf, such as payment
              processing and data analysis. We may also share information when required by law or to protect our rights.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>4. Your Choices</Text>
            <Text style={styles.sectionText}>
              You can access and update certain information through your account settings. You can also opt out of
              receiving promotional emails by following the instructions in those emails.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>5. Data Security</Text>
            <Text style={styles.sectionText}>
              We take reasonable measures to help protect your personal information from loss, theft, misuse, and
              unauthorized access.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>6. Changes to This Policy</Text>
            <Text style={styles.sectionText}>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new
              policy on our platform.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>7. Contact Us</Text>
            <Text style={styles.sectionText}>
              If you have any questions about this Privacy Policy, please contact us at privacy@example.com.
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

export default PrivacyScreen
