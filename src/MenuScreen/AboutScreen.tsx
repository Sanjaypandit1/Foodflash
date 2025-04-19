import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Image, StatusBar, Platform  } from "react-native"
import Icon from "react-native-vector-icons/Feather"
import { type NavigationProp, useNavigation } from "@react-navigation/native"

type RootStackParamList = {
  Settings: undefined
}

type NavigationProps = NavigationProp<RootStackParamList, "Settings">

const AboutScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProps>()

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About Us</Text>
         <View style={{width: 24}}/>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.card}>
          <View style={styles.logoContainer}>
            <Image source={require("../Assets/logo.jpg")} style={styles.logo} resizeMode="contain" />
          </View>

          <Text style={styles.cardTitle}>Our Story</Text>

          <Text style={styles.paragraph}>
            Founded in 2023, our company was born from a simple idea: to create a platform that connects people with the
            products they love while providing an exceptional user experience.
          </Text>

          <Text style={styles.paragraph}>
            We believe in quality, convenience, and customer satisfaction. Our team works tirelessly to ensure that
            every interaction you have with our platform exceeds your expectations.
          </Text>

          <Text style={styles.paragraph}>
            As we continue to grow, we remain committed to our core values of integrity, innovation, and inclusivity.
            We're not just building a business; we're building a community.
          </Text>

          <Text style={styles.paragraph}>
            Thank you for being a part of our journey. We look forward to serving you and growing together.
          </Text>

          <View style={styles.socialContainer}>
            <Text style={styles.socialTitle}>Connect With Us</Text>

            <View style={styles.socialLinks}>
              <TouchableOpacity style={styles.socialLink}>
                <Text style={styles.socialLinkText}>Facebook</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialLink}>
                <Text style={styles.socialLinkText}>Twitter</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialLink}>
                <Text style={styles.socialLinkText}>Instagram</Text>
              </TouchableOpacity>
            </View>
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
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
    textAlign: "center",
  },
  paragraph: {
    fontSize: 14,
    color: "#666",
    marginBottom: 15,
    lineHeight: 20,
  },
  socialContainer: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  socialTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 15,
    textAlign: "center",
  },
  socialLinks: {
    flexDirection: "row",
    justifyContent: "center",
  },
  socialLink: {
    marginHorizontal: 10,
  },
  socialLinkText: {
    color: "red",
    fontSize: 14,
    fontWeight: "500",
  },
})

export default AboutScreen
