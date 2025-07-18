import { StyleSheet, Text, TouchableOpacity, View, Alert, ActivityIndicator, Platform } from 'react-native'
import React, { useState, useEffect } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import Geolocation from 'react-native-geolocation-service'
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions'

type LocationData = {
  address: string
  coordinates: {
    latitude: number
    longitude: number
  }
  city: string
  country: string
}

const HeaderBar = () => {
  const navigation = useNavigation()
  const { t } = useTranslation()
  const [location, setLocation] = useState(t('header.selectLocation'))
  const [locationData, setLocationData] = useState<LocationData | null>(null)
  const [isDetectingLocation, setIsDetectingLocation] = useState(false)

  // Load saved location
  const loadSavedLocation = async () => {
    try {
      const savedLocation = await AsyncStorage.getItem('userLocation')
      if (savedLocation) {
        const locationData: LocationData = JSON.parse(savedLocation)
        setLocationData(locationData)
        setLocation(locationData.city || locationData.country || t('header.currentLocation'))
      }
    } catch (error) {
      console.log('Error loading saved location:', error)
    }
  }

  // Request location permission
  const requestLocationPermission = async () => {
    try {
      const result = await request(
        Platform.OS === 'ios' 
          ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE 
          : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
      )
      
      if (result === RESULTS.GRANTED) {
        getCurrentLocation()
      } else {
        Alert.alert(
          t('header.permissionRequired'),
          t('header.locationPermissionMessage'),
          [
            { text: t('common.cancel'), style: 'cancel' },
            { text: t('header.tryAgain'), onPress: requestLocationPermission },
            { 
              text: t('header.manualEntry'), 
              onPress: () => navigation.navigate('LocationSelection' as never)
            }
          ]
        )
      }
    } catch (error) {
      console.log('Error requesting location permission:', error)
    }
  }

  // Get current location using device GPS
  const getCurrentLocation = () => {
    setIsDetectingLocation(true)
    
    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords
        fetchAddressFromNominatim(latitude, longitude)
      },
      error => {
        setIsDetectingLocation(false)
        Alert.alert(
          t('header.locationError'), 
          t('header.locationErrorMessage'),
          [
            { text: t('common.cancel'), style: 'cancel' },
            { text: t('header.tryAgain'), onPress: getCurrentLocation },
            { 
              text: t('header.manualEntry'), 
              onPress: () => navigation.navigate('LocationSelection' as never)
            }
          ]
        )
        console.log('Error getting location:', error)
      },
      { 
        enableHighAccuracy: true, 
        timeout: 15000, 
        maximumAge: 10000 
      }
    )
  }

  // Fetch address from coordinates using OpenStreetMap's Nominatim
  const fetchAddressFromNominatim = async (latitude: number, longitude: number) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'FoodDeliveryApp/1.0'
          }
        }
      )
      
      const data = await response.json()
      
      if (data && data.display_name) {
        const locationData: LocationData = {
          address: data.display_name,
          coordinates: { latitude, longitude },
          city: data.address?.city || data.address?.town || data.address?.village || 'Unknown City',
          country: data.address?.country || 'Unknown Country'
        }
        
        setLocationData(locationData)
        setLocation(locationData.city || locationData.country || t('header.currentLocation'))
        
        // Save location to AsyncStorage
        await AsyncStorage.setItem('userLocation', JSON.stringify(locationData))
        await AsyncStorage.setItem('locationConfirmed', 'true')
        
        // Show success message
        Alert.alert(
          t('header.locationUpdated'),
          t('header.locationSetMessage', { location: locationData.city || locationData.country }),
          [{ text: 'OK' }]
        )
      } else {
        throw new Error('Unable to fetch address')
      }
    } catch (error) {
      console.log('Error fetching address:', error)
      
      // Fallback location data with coordinates
      const fallbackLocation: LocationData = {
        address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
        coordinates: { latitude, longitude },
        city: t('header.currentLocation'),
        country: 'Unknown'
      }
      
      setLocationData(fallbackLocation)
      setLocation(t('header.currentLocation'))
      await AsyncStorage.setItem('userLocation', JSON.stringify(fallbackLocation))
      await AsyncStorage.setItem('locationConfirmed', 'true')
      
      Alert.alert(
        t('header.locationUpdated'),
        t('header.locationDetectedGPS'),
        [{ text: 'OK' }]
      )
    } finally {
      setIsDetectingLocation(false)
    }
  }

  // Handle location press - Auto-detect or show options
  const handleLocationPress = () => {
    if (isDetectingLocation) {
      return // Prevent multiple requests
    }

    Alert.alert(
      t('header.updateLocation'),
      t('header.locationPermissionMessage'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        { 
          text: t('header.autoDetect'), 
          onPress: requestLocationPermission
        },
      ]
    )
  }

  // Handle notification press
  const handleNotificationPress = () => {
    Alert.alert(t('header.notifications'), t('header.noNotifications'))
  }

  // Handle search press
  const handleSearchPress = () => {
    navigation.navigate('Search' as never)
  }

  useEffect(() => {
    loadSavedLocation()
    
    // Listen for location updates
    const unsubscribe = navigation.addListener('focus', () => {
      loadSavedLocation()
    })

    return unsubscribe
  }, [navigation])

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        {/* Location Section */}
        <TouchableOpacity 
          style={styles.location} 
          onPress={handleLocationPress}
          disabled={isDetectingLocation}
        >
          {isDetectingLocation ? (
            <ActivityIndicator size={20} color="white" style={{ marginRight: 6 }} />
          ) : (
            <Ionicons name="location-outline" size={24} color="white" style={{ marginRight: 6 }} />
          )}
          <View style={styles.locationTextContainer}>
            <Text style={styles.locationTitle}>{t('header.deliverTo')}</Text>
            <Text style={styles.locationText} numberOfLines={1}>
              {isDetectingLocation ? t('header.detectingLocation') : location}
            </Text>
          </View>
          {!isDetectingLocation && (
            <Ionicons name="chevron-down" size={16} color="white" style={{ marginLeft: 4 }} />
          )}
        </TouchableOpacity>

        {/* Notification Bell Icon */}
        <TouchableOpacity style={styles.bellIcon} onPress={handleNotificationPress}>
          <Ionicons name="notifications-outline" size={24} color="#FF3F00" />
          {/* Notification badge */}
          <View style={styles.notificationBadge}>
            <Text style={styles.badgeText}>0</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Search Box */}
      <TouchableOpacity style={styles.searchbox} onPress={handleSearchPress}>
        <AntDesign name="search1" size={24} color="#FF3F00" style={styles.searchicon} />
        <Text style={styles.input}>{t('header.searchPlaceholder')}</Text>
      </TouchableOpacity>
    </View>
  )
}

export default HeaderBar

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: '#FF3F00',
    paddingHorizontal: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 15,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 15,
  },
  locationTextContainer: {
    flex: 1,
  },
  locationTitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 2,
  },
  locationText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  bellIcon: {
    padding: 8,
    backgroundColor: 'white',
    borderRadius: 12,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#e74c3c',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  searchbox: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: 'white',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 25,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchicon: {
    marginRight: 12,
  },
  input: {
    fontSize: 16,
    color: '#666',
    flex: 1,
  },
})