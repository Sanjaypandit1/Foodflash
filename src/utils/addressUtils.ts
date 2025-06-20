import Geolocation from "react-native-geolocation-service"
import { request, PERMISSIONS, RESULTS } from "react-native-permissions"
import { Platform, Alert } from "react-native"

/**
 * Utility functions for address validation and location services
 */

export type LocationData = {
  address: string
  coordinates: {
    latitude: number
    longitude: number
  }
  city: string
  country: string
  postalCode?: string
  state?: string
  street?: string
  houseNumber?: string
}

/**
 * Validates a phone number to ensure it starts with +977 and has 10 digits after
 * @param phone The phone number to validate
 * @returns Boolean indicating if the phone number is valid
 */
export const validatePhoneNumber = (phone: string): boolean => {
  // Check if phone starts with +977 and has exactly 10 more digits
  const phoneRegex = /^\+977\d{10}$/
  return phoneRegex.test(phone)
}

/**
 * Formats a phone number to ensure it has the +977 prefix
 * @param phone The phone number to format
 * @returns Formatted phone number with +977 prefix
 */
export const formatPhoneNumber = (phone: string): string => {
  // Remove any existing +977 prefix to avoid duplication
  const cleanPhone = phone.replace(/^\+977/, "")

  // Add the +977 prefix
  return "+977" + cleanPhone
}

/**
 * Validates an email to ensure it's a Gmail address
 * @param email The email to validate
 * @returns Boolean indicating if the email is valid
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i
  return emailRegex.test(email)
}

/**
 * Validates that all required address fields are filled
 * @param fields Object containing the address fields
 * @returns Boolean indicating if all required fields are filled
 */
export const validateRequiredFields = (fields: {
  name: string
  fullName: string
  address: string
  phone: string
  email: string
}): boolean => {
  return (
    !!fields.name.trim() &&
    !!fields.fullName.trim() &&
    !!fields.address.trim() &&
    !!fields.phone.trim() &&
    !!fields.email.trim()
  )
}

/**
 * Request location permission from the user
 * @returns Promise<boolean> indicating if permission was granted
 */
export const requestLocationPermission = async (): Promise<boolean> => {
  try {
    const result = await request(
      Platform.OS === "ios" ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    )

    return result === RESULTS.GRANTED
  } catch (error) {
    console.log("Error requesting location permission:", error)
    return false
  }
}

/**
 * Get current location using device GPS
 * @returns Promise<LocationData | null>
 */
export const getCurrentLocation = (): Promise<LocationData | null> => {
  return new Promise((resolve) => {
    Geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        const locationData = await fetchAddressFromCoordinates(latitude, longitude)
        resolve(locationData)
      },
      (error) => {
        console.log("Error getting location:", error)
        Alert.alert("Location Error", "Unable to get your location. Please check your GPS settings and try again.")
        resolve(null)
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      },
    )
  })
}

/**
 * Fetch address details from coordinates using OpenStreetMap's Nominatim
 * @param latitude The latitude coordinate
 * @param longitude The longitude coordinate
 * @returns Promise<LocationData | null>
 */
export const fetchAddressFromCoordinates = async (
  latitude: number,
  longitude: number,
): Promise<LocationData | null> => {
  try {
    // Add a small delay to respect API rate limits
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
      {
        headers: {
          "User-Agent": "FoodDeliveryApp/1.0",
        },
      },
    )

    const data = await response.json()

    if (data && data.display_name) {
      const locationData: LocationData = {
        address: data.display_name,
        coordinates: { latitude, longitude },
        city: data.address?.city || data.address?.town || data.address?.village || "Unknown City",
        country: data.address?.country || "Nepal",
        postalCode: data.address?.postcode || "",
        state: data.address?.state || data.address?.province || "",
        street: data.address?.road || "",
        houseNumber: data.address?.house_number || "",
      }

      return locationData
    } else {
      throw new Error("Unable to fetch address")
    }
  } catch (error) {
    console.log("Error fetching address:", error)

    // Fallback location data with coordinates
    const fallbackLocation: LocationData = {
      address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
      coordinates: { latitude, longitude },
      city: "Current Location",
      country: "Nepal",
    }

    return fallbackLocation
  }
}

/**
 * Format location data into a readable address string
 * @param locationData The location data to format
 * @returns Formatted address string
 */
export const formatLocationAddress = (locationData: LocationData): string => {
  const parts = []

  if (locationData.houseNumber) parts.push(locationData.houseNumber)
  if (locationData.street) parts.push(locationData.street)
  if (locationData.city) parts.push(locationData.city)
  if (locationData.state) parts.push(locationData.state)
  if (locationData.postalCode) parts.push(locationData.postalCode)

  return parts.length > 0 ? parts.join(", ") : locationData.address
}
