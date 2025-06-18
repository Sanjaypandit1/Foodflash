"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { TouchableOpacity, StyleSheet, Alert } from "react-native"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import { addToFavorites, removeFromFavorites, isInFavorites } from "./favorite-helper"

// Types
interface FavoriteItem {
  id: string
  name: string
  price: string
  description: string
  image: { uri: string }
  isVeg: boolean
  rating: string
  preparationTime: string
  restaurant: string
  dateAdded: string
}

interface FavoriteButtonProps {
  item: Omit<FavoriteItem, "dateAdded">
  size?: number
  style?: any
  onToggle?: (isFavorite: boolean) => void
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ item, size = 24, style, onToggle }) => {
  const [isFavorite, setIsFavorite] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    checkFavoriteStatus()
  }, [item.id])

  const checkFavoriteStatus = async () => {
    try {
      const isItemFavorite = await isInFavorites(item.id)
      setIsFavorite(isItemFavorite)
      console.log(`Item ${item.id} favorite status:`, isItemFavorite)
    } catch (error) {
      console.error("Error checking favorite status:", error)
    }
  }

  const handleToggleFavorite = async () => {
    if (loading) return

    setLoading(true)
    try {
      if (isFavorite) {
        // Remove from favorites
        const success = await removeFromFavorites(item.id)
        if (success) {
          setIsFavorite(false)
          onToggle?.(false)
          console.log(`Removed ${item.name} from favorites`)
          Alert.alert("Removed from Favorites", `${item.name} has been removed from your favorites.`)
        }
      } else {
        // Add to favorites
        const success = await addToFavorites(item)
        if (success) {
          setIsFavorite(true)
          onToggle?.(true)
          console.log(`Added ${item.name} to favorites`)
          Alert.alert("Added to Favorites", `${item.name} has been added to your favorites!`)
        }
      }
    } catch (error) {
      console.error("Error toggling favorite:", error)
      Alert.alert("Error", "Failed to update favorites. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <TouchableOpacity
      style={[styles.favoriteButton, style]}
      onPress={handleToggleFavorite}
      disabled={loading}
      activeOpacity={0.7}
    >
      <MaterialIcons
        name={isFavorite ? "favorite" : "favorite-border"}
        size={size}
        color={isFavorite ? "#FF3F00" : "#666"}
      />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  favoriteButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
})

export default FavoriteButton
