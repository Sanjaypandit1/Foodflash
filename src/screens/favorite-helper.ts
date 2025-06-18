import AsyncStorage from "@react-native-async-storage/async-storage"

export interface FavoriteItem {
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

// Enhanced helper function to safely extract URI from any image format
export const getImageUri = (image: any): string => {
  console.log("getImageUri input:", image, typeof image)

  // Handle object with uri property
  if (typeof image === "object" && image !== null) {
    if ("uri" in image && typeof image.uri === "string") {
      console.log("Found URI in object:", image.uri)
      return image.uri
    }
    // Handle require() images (numbers)
    if (typeof image === "number") {
      console.log("Found require() image:", image)
      return `asset://image_${image}`
    }
  }

  // Handle direct string URIs
  if (typeof image === "string") {
    console.log("Found string URI:", image)
    return image
  }

  // Fallback to a working placeholder
  const fallbackUri = "https://via.placeholder.com/300x200/cccccc/666666?text=Food+Image"
  console.log("Using fallback URI:", fallbackUri)
  return fallbackUri
}

// Enhanced function to convert any image format to favorites format
export const convertToFavoriteImage = (image: any): { uri: string } => {
  const uri = getImageUri(image)
  console.log("convertToFavoriteImage result:", { uri })
  return { uri }
}

// Add item to favorites with enhanced image handling and validation
export const addToFavorites = async (item: Omit<FavoriteItem, "dateAdded">) => {
  try {
    console.log("Adding to favorites:", item.name, "Image:", item.image)

    const existingFavorites = await AsyncStorage.getItem("favorites")
    const favorites: FavoriteItem[] = existingFavorites ? JSON.parse(existingFavorites) : []

    // Check if item already exists
    const itemExists = favorites.some((fav) => fav.id === item.id)
    if (itemExists) {
      console.log("Item already in favorites:", item.name)
      return false
    }

    // Ensure image has proper format and validate URI
    const processedImage = convertToFavoriteImage(item.image)

    // Validate that we have a proper URI
    if (!processedImage.uri || processedImage.uri.trim() === "") {
      console.warn("Invalid image URI, using fallback")
      processedImage.uri = "https://via.placeholder.com/300x200/cccccc/666666?text=Food+Image"
    }

    const newFavorite: FavoriteItem = {
      ...item,
      image: processedImage,
      dateAdded: new Date().toISOString(),
    }

    favorites.unshift(newFavorite) // Add to beginning
    await AsyncStorage.setItem("favorites", JSON.stringify(favorites))

    console.log("Successfully added to favorites:", {
      name: newFavorite.name,
      imageUri: newFavorite.image.uri,
      totalFavorites: favorites.length,
    })

    return true
  } catch (error) {
    console.error("Failed to add to favorites:", error)
    return false
  }
}

// Remove item from favorites
export const removeFromFavorites = async (itemId: string) => {
  try {
    const existingFavorites = await AsyncStorage.getItem("favorites")
    if (!existingFavorites) return false

    const favorites: FavoriteItem[] = JSON.parse(existingFavorites)
    const updatedFavorites = favorites.filter((item) => item.id !== itemId)

    await AsyncStorage.setItem("favorites", JSON.stringify(updatedFavorites))
    console.log("Removed from favorites:", itemId)
    return true
  } catch (error) {
    console.error("Failed to remove from favorites:", error)
    return false
  }
}

// Check if item is in favorites
export const isInFavorites = async (itemId: string) => {
  try {
    const existingFavorites = await AsyncStorage.getItem("favorites")
    if (!existingFavorites) return false

    const favorites: FavoriteItem[] = JSON.parse(existingFavorites)
    return favorites.some((item) => item.id === itemId)
  } catch (error) {
    console.error("Failed to check favorites:", error)
    return false
  }
}

// Get all favorites with image validation
export const getFavorites = async (): Promise<FavoriteItem[]> => {
  try {
    const existingFavorites = await AsyncStorage.getItem("favorites")
    const favorites = existingFavorites ? JSON.parse(existingFavorites) : []

    // Validate and fix any image issues
    const validatedFavorites = favorites.map((item: FavoriteItem) => {
      if (!item.image || !item.image.uri || item.image.uri.trim() === "") {
        console.warn(`Invalid image for item ${item.name}, fixing...`)
        item.image = { uri: "https://via.placeholder.com/300x200/cccccc/666666?text=Food+Image" }
      }
      return item
    })

    console.log("Retrieved favorites:", validatedFavorites.length, "items")
    return validatedFavorites
  } catch (error) {
    console.error("Failed to get favorites:", error)
    return []
  }
}

// Toggle favorite status
export const toggleFavorite = async (item: Omit<FavoriteItem, "dateAdded">) => {
  const isFavorite = await isInFavorites(item.id)

  if (isFavorite) {
    return await removeFromFavorites(item.id)
  } else {
    return await addToFavorites(item)
  }
}

// Get favorites count
export const getFavoritesCount = async (): Promise<number> => {
  try {
    const favorites = await getFavorites()
    return favorites.length
  } catch (error) {
    console.error("Failed to get favorites count:", error)
    return 0
  }
}

// Clear all favorites
export const clearAllFavorites = async () => {
  try {
    await AsyncStorage.removeItem("favorites")
    console.log("Cleared all favorites")
    return true
  } catch (error) {
    console.error("Failed to clear favorites:", error)
    return false
  }
}

// Utility function to validate image URI
export const isValidImageUri = (uri: string): boolean => {
  if (!uri || typeof uri !== "string") return false

  // Check for common image URL patterns
  const imageUrlPattern = /\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i
  const httpPattern = /^https?:\/\/.+/
  const dataPattern = /^data:image\/.+/

  return httpPattern.test(uri) || dataPattern.test(uri) || imageUrlPattern.test(uri)
}
