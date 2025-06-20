"use client"

import type React from "react"
import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView , StatusBar, Platform } from "react-native"
import Icon from "react-native-vector-icons/Feather"
import { type NavigationProp, useNavigation } from "@react-navigation/native"

type RootStackParamList = {
  Settings: undefined
}

type NavigationProps = NavigationProp<RootStackParamList, "Settings">

interface FAQItem {
  id: string
  question: string
  answer: string
  isOpen: boolean
}

const SupportScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProps>()
  const [faqs, setFaqs] = useState<FAQItem[]>([
    {
      id: "1",
      question: "How do I create an account?",
      answer:
        'You can create an account by clicking on the "Sign In" button and then selecting the "Sign Up" option. Follow the instructions to complete your registration.',
      isOpen: false,
    },
    {
      id: "2",
      question: "How can I track my order?",
      answer:
        'Once you\'re logged in, you can track your order from the "My Orders" section in your account dashboard. Each order will have a tracking number and status updates.',
      isOpen: false,
    },
    {
      id: "3",
      question: "What payment methods do you accept?",
      answer:
        "We accept credit/debit cards, digital wallets like PayPal and Google Pay, and cash on delivery for eligible locations.",
      isOpen: false,
    },
    {
      id: "4",
      question: "How do I return a product?",
      answer:
        'To return a product, go to "My Orders" in your account, select the order containing the item you wish to return, and follow the return instructions. Please note that returns must be initiated within 7 days of delivery.',
      isOpen: false,
    },
  ])

  const toggleFAQ = (id: string) => {
    setFaqs(
      faqs.map((faq) => {
        if (faq.id === id) {
          return { ...faq, isOpen: !faq.isOpen }
        }
        return faq
      }),
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
         <View style={{width: 24}}/>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Frequently Asked Questions</Text>

          <View style={styles.faqContainer}>
            {faqs.map((faq) => (
              <View key={faq.id} style={styles.faqItem}>
                <TouchableOpacity style={styles.faqQuestion} onPress={() => toggleFAQ(faq.id)}>
                  <Text style={styles.faqQuestionText}>{faq.question}</Text>
                  <Icon name={faq.isOpen ? "chevron-up" : "chevron-down"} size={20} color="#666" />
                </TouchableOpacity>
                {faq.isOpen && (
                  <View style={styles.faqAnswer}>
                    <Text style={styles.faqAnswerText}>{faq.answer}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>

          <View style={styles.supportButtonsContainer}>
            <Text style={styles.supportButtonsTitle}>Need more help?</Text>
            <TouchableOpacity
              style={styles.contactButton}
              onPress={() => {
                // Contact support logic would go here
                console.log("Contact support")
              }}
            >
              <Text style={styles.contactButtonText}>Contact Support</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.emailButton}
              onPress={() => {
                // Email us logic would go here
                console.log("Email us")
              }}
            >
              <Text style={styles.emailButtonText}>Email Us</Text>
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
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
  },
  faqContainer: {
    marginBottom: 20,
  },
  faqItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  faqQuestion: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
  },
  faqQuestionText: {
    fontSize: 16,
    fontWeight: "500",
    flex: 1,
  },
  faqAnswer: {
    paddingBottom: 15,
  },
  faqAnswerText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  supportButtonsContainer: {
    marginTop: 10,
  },
  supportButtonsTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 15,
  },
  contactButton: {
    backgroundColor: "red",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 10,
  },
  contactButtonText: {
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

export default SupportScreen
