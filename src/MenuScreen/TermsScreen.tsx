import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, StatusBar, Platform } from "react-native"
import Icon from "react-native-vector-icons/Feather"
import { type NavigationProp, useNavigation } from "@react-navigation/native"

type RootStackParamList = {
  Settings: undefined
}

type NavigationProps = NavigationProp<RootStackParamList, "Settings">

const TermsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProps>()

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms & Conditions</Text>
         <View style={{width: 24}}/>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.lastUpdated}>Last Updated: April 19, 2025</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. Introduction</Text>
            <Text style={styles.sectionText}>
              Welcome to our platform. These Terms and Conditions govern your use of our website and services. By
              accessing or using our platform, you agree to be bound by these Terms.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. Account Registration</Text>
            <Text style={styles.sectionText}>
              To access certain features of our platform, you may be required to register for an account. You agree to
              provide accurate information and to keep your account credentials secure.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>3. User Conduct</Text>
            <Text style={styles.sectionText}>
              You agree to use our platform in compliance with all applicable laws and regulations. You will not engage
              in any activity that disrupts or interferes with our services.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>4. Privacy</Text>
            <Text style={styles.sectionText}>
              Your privacy is important to us. Please refer to our Privacy Policy for information on how we collect,
              use, and disclose your personal information.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>5. Intellectual Property</Text>
            <Text style={styles.sectionText}>
              All content on our platform, including text, graphics, logos, and software, is our property and is
              protected by intellectual property laws.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>6. Limitation of Liability</Text>
            <Text style={styles.sectionText}>
              To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special,
              consequential, or punitive damages we shall not be liable for any indirect, incidental, special,
              consequential, or punitive damages arising out of or relating to your use of our platform.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>7. Changes to Terms</Text>
            <Text style={styles.sectionText}>
              We reserve the right to modify these Terms at any time. We will provide notice of significant changes.
              Your continued use of our platform constitutes acceptance of the updated Terms.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>8. Contact Us</Text>
            <Text style={styles.sectionText}>
              If you have any questions about these Terms, please contact us at support@example.com.
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

export default TermsScreen
