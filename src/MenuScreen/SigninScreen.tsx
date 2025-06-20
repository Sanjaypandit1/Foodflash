"use client"

import type React from "react"
import { useState, useRef } from "react"
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
  StatusBar,
  Alert,
  ActivityIndicator,
} from "react-native"
import Icon from "react-native-vector-icons/Feather"
import auth from "@react-native-firebase/auth"
import { GoogleSignin } from "@react-native-google-signin/google-signin"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"

type RootStackParamList = {
  SignIn: undefined
  SignUp: undefined
  MainTabs: undefined
  FrontScreen: { user?: any }
}

type NavigationProps = NativeStackNavigationProp<RootStackParamList>

interface InputFieldProps {
  placeholder: string
  icon: string
  secureTextEntry?: boolean
  value: string
  onChangeText: (text: string) => void
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad"
  autoCapitalize?: "none" | "sentences" | "words" | "characters"
}

const InputField: React.FC<InputFieldProps> = ({
  placeholder,
  icon,
  secureTextEntry = false,
  value,
  onChangeText,
  keyboardType = "default",
  autoCapitalize = "none",
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<TextInput>(null)

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={[styles.inputContainer, isFocused && styles.inputContainerFocused]}
      onPress={() => inputRef.current?.focus()}
    >
      <Icon name={icon} size={20} color="#888" style={styles.inputIcon} />
      <TextInput
        ref={inputRef}
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#888"
        secureTextEntry={secureTextEntry && !isPasswordVisible}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        editable={true}
        autoCorrect={false}
      />
      {secureTextEntry && (
        <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
          <Icon name={isPasswordVisible ? "eye-off" : "eye"} size={20} color="#888" />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  )
}

interface FirebaseSignUpScreenProps {
  onAuthSuccess?: (user: any) => void
}

const FirebaseSignUpScreen: React.FC<FirebaseSignUpScreenProps> = ({ onAuthSuccess }) => {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  const navigation = useNavigation<NavigationProps>()

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSignUp = async () => {
    if (!fullName.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert("Error", "Please fill in all fields")
      return
    }

    if (!validateEmail(email)) {
      Alert.alert("Error", "Please enter a valid email address")
      return
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long")
      return
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match")
      return
    }

    if (!agreeToTerms) {
      Alert.alert("Error", "Please agree to the Terms and Conditions")
      return
    }

    setLoading(true)
    Keyboard.dismiss()

    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password)

      // Update user profile with display name
      await userCredential.user.updateProfile({
        displayName: fullName,
      })

      console.log("User account created successfully:", userCredential.user.email)

      if (onAuthSuccess) {
        onAuthSuccess(userCredential.user)
      }

      // Navigate back to MainTabs - the auth state change will handle the rest
      navigation.navigate("MainTabs")

      // Show success message
      Alert.alert("Success", `Welcome ${fullName}! Your account has been created successfully.`, [
        {
          text: "OK",
          onPress: () => {
            // Navigate to Menu tab to show FrontScreen
            navigation.navigate("MainTabs")
          }
        }
      ])

    } catch (error: any) {
      console.error("Sign up error:", error)
      let errorMessage = "An error occurred during sign up"

      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = "This email address is already registered"
          break
        case "auth/invalid-email":
          errorMessage = "Invalid email address"
          break
        case "auth/weak-password":
          errorMessage = "Password is too weak"
          break
        case "auth/operation-not-allowed":
          errorMessage = "Email/password accounts are not enabled"
          break
        default:
          errorMessage = error.message || errorMessage
      }

      Alert.alert("Sign Up Failed", errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    setGoogleLoading(true)

    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true })
      const userInfo = await GoogleSignin.signIn()
      const tokens = await GoogleSignin.getTokens()
      const idToken = tokens.idToken
      const googleCredential = auth.GoogleAuthProvider.credential(idToken)
      const userCredential = await auth().signInWithCredential(googleCredential)

      console.log("Google sign up successful:", userCredential.user.email)

      if (onAuthSuccess) {
        onAuthSuccess(userCredential.user)
      }

      // Navigate back to MainTabs - the auth state change will handle the rest
      navigation.navigate("MainTabs")

      // Show success message
      Alert.alert("Success", "Welcome! Your account has been created with Google successfully.", [
        {
          text: "OK",
          onPress: () => {
            // Navigate to Menu tab to show FrontScreen
            navigation.navigate("MainTabs")
          }
        }
      ])

    } catch (error: any) {
      console.error("Google sign up error:", error)
      Alert.alert("Google Sign Up Failed", error.message || "Google sign up failed")
    } finally {
      setGoogleLoading(false)
    }
  }

  const handleSignIn = () => {
    navigation.navigate("SignIn")
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View>
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
              }}
              style={styles.logo}
            />
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Please fill in the form to continue</Text>

            <InputField
              placeholder="Full Name"
              icon="user"
              value={fullName}
              onChangeText={(text) => setFullName(text)}
              autoCapitalize="words"
            />

            <InputField
              placeholder="Email Address"
              icon="mail"
              value={email}
              onChangeText={(text) => setEmail(text.trim())}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <InputField
              placeholder="Password"
              icon="lock"
              secureTextEntry
              value={password}
              onChangeText={(text) => setPassword(text)}
              autoCapitalize="none"
            />

            <InputField
              placeholder="Confirm Password"
              icon="lock"
              secureTextEntry
              value={confirmPassword}
              onChangeText={(text) => setConfirmPassword(text)}
              autoCapitalize="none"
            />

            <TouchableOpacity style={styles.termsContainer} onPress={() => setAgreeToTerms(!agreeToTerms)}>
              <View style={styles.checkbox}>{agreeToTerms && <Icon name="check" size={14} color="#FF8C00" />}</View>
              <Text style={styles.termsText}>
                I agree to the <Text style={styles.linkText}>Terms and Conditions</Text>
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.signUpButton, loading && styles.signUpButtonDisabled]}
              onPress={handleSignUp}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.signUpButtonText}>Create Account</Text>
              )}
            </TouchableOpacity>

            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.divider} />
            </View>

            <TouchableOpacity
              style={[styles.googleButton, googleLoading && styles.googleButtonDisabled]}
              onPress={handleGoogleSignUp}
              disabled={googleLoading}
            >
              {googleLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Text style={styles.googleButtonText}>G</Text>
                  <Text style={styles.googleButtonLabel}>Continue with Google</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={handleSignIn}>
              <Text style={styles.signInText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  logo: {
    width: "100%",
    height: 250,
    borderRadius: 20,
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  formContainer: {
    paddingHorizontal: 25,
    paddingTop: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    height: 55,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  inputContainerFocused: {
    borderColor: "#FF8C00",
    shadowColor: "#FF8C00",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: 16,
    color: "#333",
    paddingVertical: 0,
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: "#FF8C00",
    borderRadius: 4,
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  termsText: {
    fontSize: 14,
    color: "#666",
    flex: 1,
  },
  linkText: {
    color: "#FF8C00",
    fontWeight: "500",
  },
  signUpButton: {
    backgroundColor: "red",
    borderRadius: 10,
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
    shadowColor: "#FF8C00",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  signUpButtonDisabled: {
    opacity: 0.7,
  },
  signUpButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#e0e0e0",
  },
  dividerText: {
    paddingHorizontal: 15,
    color: "#666",
    fontSize: 14,
  },
  googleButton: {
    backgroundColor: "#DB4437",
    borderRadius: 10,
    height: 55,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  googleButtonDisabled: {
    opacity: 0.7,
  },
  googleButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginRight: 10,
  },
  googleButtonLabel: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 14,
    color: "#666",
  },
  signInText: {
    fontSize: 14,
    color: "#FF8C00",
    fontWeight: "bold",
  },
})

export default FirebaseSignUpScreen