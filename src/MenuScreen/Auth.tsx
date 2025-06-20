"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
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
import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin"
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

interface SocialButtonProps {
  icon: string
  backgroundColor: string
  onPress: () => void
  disabled?: boolean
}

const SocialButton: React.FC<SocialButtonProps> = ({ icon, backgroundColor, onPress, disabled = false }) => {
  return (
    <TouchableOpacity
      style={[styles.socialButton, { backgroundColor }, disabled && styles.socialButtonDisabled]}
      onPress={onPress}
      disabled={disabled}
    >
      <Icon name={icon} size={20} color="#fff" />
    </TouchableOpacity>
  )
}

interface FirebaseAuthScreenProps {
  onAuthSuccess?: (user: any) => void
}

const FirebaseAuthScreen: React.FC<FirebaseAuthScreenProps> = ({ onAuthSuccess }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  const navigation = useNavigation<NavigationProps>()

  // Configure Google Sign-In
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: "YOUR_WEB_CLIENT_ID", // Replace with your actual web client ID
      offlineAccess: true,
    })
  }, [])

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSignIn = async () => {
    if (!email.trim() || !password.trim()) {
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

    setLoading(true)
    Keyboard.dismiss()

    try {
      const userCredential = await auth().signInWithEmailAndPassword(email, password)
      console.log("User signed in successfully:", userCredential.user.email)

      if (rememberMe) {
        console.log("Remember me enabled")
      }

      if (onAuthSuccess) {
        onAuthSuccess(userCredential.user)
      }

      // Navigate back to MainTabs - the auth state change will handle the rest
      navigation.navigate("MainTabs")

      // Show success message
      Alert.alert("Success", "Welcome back! You have been signed in successfully.", [
        {
          text: "OK",
          onPress: () => {
            // Navigate to Menu tab to show FrontScreen
            navigation.navigate("MainTabs")
          }
        }
      ])

    } catch (error: any) {
      console.error("Sign in error:", error)
      let errorMessage = "An error occurred during sign in"

      switch (error.code) {
        case "auth/user-not-found":
          errorMessage = "No account found with this email address"
          break
        case "auth/wrong-password":
          errorMessage = "Incorrect password"
          break
        case "auth/invalid-email":
          errorMessage = "Invalid email address"
          break
        case "auth/user-disabled":
          errorMessage = "This account has been disabled"
          break
        case "auth/too-many-requests":
          errorMessage = "Too many failed attempts. Please try again later"
          break
        default:
          errorMessage = error.message || errorMessage
      }

      Alert.alert("Sign In Failed", errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true)

    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true })
      const userInfo = await GoogleSignin.signIn()
      const tokens = await GoogleSignin.getTokens()
      const idToken = tokens.idToken
      const googleCredential = auth.GoogleAuthProvider.credential(idToken)
      const userCredential = await auth().signInWithCredential(googleCredential)

      console.log("Google sign in successful:", userCredential.user.email)

      if (onAuthSuccess) {
        onAuthSuccess(userCredential.user)
      }

      // Navigate back to MainTabs - the auth state change will handle the rest
      navigation.navigate("MainTabs")

      // Show success message
      Alert.alert("Success", "Welcome! You have been signed in with Google successfully.", [
        {
          text: "OK",
          onPress: () => {
            // Navigate to Menu tab to show FrontScreen
            navigation.navigate("MainTabs")
          }
        }
      ])

    } catch (error: any) {
      console.error("Google sign in error:", error)
      let errorMessage = "Google sign in failed"

      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        errorMessage = "Sign in was cancelled"
      } else if (error.code === statusCodes.IN_PROGRESS) {
        errorMessage = "Sign in is already in progress"
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        errorMessage = "Google Play Services not available"
      } else {
        errorMessage = error.message || errorMessage
      }

      Alert.alert("Google Sign In Failed", errorMessage)
    } finally {
      setGoogleLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      Alert.alert("Reset Password", "Please enter your email address first")
      return
    }

    if (!validateEmail(email)) {
      Alert.alert("Error", "Please enter a valid email address")
      return
    }

    try {
      await auth().sendPasswordResetEmail(email)
      Alert.alert(
        "Password Reset",
        `A password reset email has been sent to ${email}. Please check your inbox and follow the instructions.`,
      )
    } catch (error: any) {
      console.error("Password reset error:", error)
      let errorMessage = "Failed to send password reset email"

      switch (error.code) {
        case "auth/user-not-found":
          errorMessage = "No account found with this email address"
          break
        case "auth/invalid-email":
          errorMessage = "Invalid email address"
          break
        default:
          errorMessage = error.message || errorMessage
      }

      Alert.alert("Password Reset Failed", errorMessage)
    }
  }

  const handleSignUp = () => {
    navigation.navigate("SignUp")
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
            <Text style={styles.title}>Sign In</Text>
            <Text style={styles.subtitle}>Please sign in to continue using our app</Text>

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

            <View style={styles.optionsRow}>
              <TouchableOpacity style={styles.rememberMeContainer} onPress={() => setRememberMe(!rememberMe)}>
                <View style={styles.checkbox}>{rememberMe && <Icon name="check" size={14} color="#FF8C00" />}</View>
                <Text style={styles.rememberMeText}>Remember me</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleForgotPassword}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.signInButton, loading && styles.signInButtonDisabled]}
              onPress={handleSignIn}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.signInButtonText}>Sign In</Text>
              )}
            </TouchableOpacity>

            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.divider} />
            </View>

            <View style={styles.socialButtonsContainer}>
              <SocialButton
                icon="facebook"
                backgroundColor="#3b5998"
                onPress={() => Alert.alert("Facebook", "Facebook sign in not implemented yet")}
                disabled={googleLoading}
              />
              <SocialButton
                icon="twitter"
                backgroundColor="#1DA1F2"
                onPress={() => Alert.alert("Twitter", "Twitter sign in not implemented yet")}
                disabled={googleLoading}
              />
              <TouchableOpacity
                style={[styles.googleButton, googleLoading && styles.socialButtonDisabled]}
                onPress={handleGoogleSignIn}
                disabled={googleLoading}
              >
                {googleLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.googleButtonText}>G</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={handleSignUp}>
              <Text style={styles.signUpText}>Sign Up</Text>
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
    height: 300,
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
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },
  rememberMeContainer: {
    flexDirection: "row",
    alignItems: "center",
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
  rememberMeText: {
    fontSize: 14,
    color: "#666",
  },
  forgotPasswordText: {
    fontSize: 14,
    color: "#FF8C00",
    fontWeight: "500",
  },
  signInButton: {
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
  signInButtonDisabled: {
    opacity: 0.7,
  },
  signInButtonText: {
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
  socialButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 30,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },
  socialButtonDisabled: {
    opacity: 0.5,
  },
  googleButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    backgroundColor: "#DB4437",
  },
  googleButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
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
  signUpText: {
    fontSize: 14,
    color: "#FF8C00",
    fontWeight: "bold",
  },
})

export default FirebaseAuthScreen