"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

interface UserContextType {
  profileImage: string | null
  setProfileImage: (imageUri: string | null) => Promise<void>
  clearProfileImage: () => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

interface UserProviderProps {
  children: ReactNode
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [profileImage, setProfileImageState] = useState<string | null>(null)

  // Load profile image from storage on app start
  useEffect(() => {
    loadProfileImage()
  }, [])

  const loadProfileImage = async () => {
    try {
      const savedImage = await AsyncStorage.getItem("userProfileImage")
      if (savedImage) {
        setProfileImageState(savedImage)
      }
    } catch (error) {
      console.log("Error loading profile image:", error)
    }
  }

  const setProfileImage = async (imageUri: string | null) => {
    try {
      if (imageUri) {
        await AsyncStorage.setItem("userProfileImage", imageUri)
      } else {
        await AsyncStorage.removeItem("userProfileImage")
      }
      setProfileImageState(imageUri)
    } catch (error) {
      console.log("Error saving profile image:", error)
    }
  }

  const clearProfileImage = async () => {
    try {
      await AsyncStorage.removeItem("userProfileImage")
      setProfileImageState(null)
    } catch (error) {
      console.log("Error clearing profile image:", error)
    }
  }

  return (
    <UserContext.Provider value={{ profileImage, setProfileImage, clearProfileImage }}>{children}</UserContext.Provider>
  )
}

export const useUserContext = () => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUserContext must be used within a UserProvider")
  }
  return context
}
