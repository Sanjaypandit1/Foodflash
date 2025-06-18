import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native'
import React, { useState, useEffect } from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Geolocation from 'react-native-geolocation-service'
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions'
import AsyncStorage from '@react-native-async-storage/async-storage'
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window')

type LocationData = {
  address: string
  coordinates: {
    latitude: number
    longitude: number
  }
  city: string
  country: string
}

// Add props interface
interface LocationSelectionScreenProps {
  onFinish: () => void
}

const LocationSelectionScreen: React.FC<LocationSelectionScreenProps> = ({ onFinish }) => {
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null)
  const [loading, setLoading] = useState(false)
  const [locationPermissionGranted, setLocationPermissionGranted] = useState(false)

  // Request location permission
  const requestLocationPermission = async () => {
    try {
      const result = await request(
        Platform.OS === 'ios' 
          ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE 
          : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
      )
      
      if (result === RESULTS.GRANTED) {
        setLocationPermissionGranted(true)
        getCurrentLocation()
      } else {
        Alert.alert(
          'Permission Required',
          'Location permission is needed to find nearby restaurants and deliver food to you.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Try Again', onPress: requestLocationPermission }
          ]
        )
      }
    } catch (error) {
      console.log('Error requesting location permission:', error)
    }
  }

  // Get current location using device GPS
  const getCurrentLocation = () => {
    setLoading(true)
    
    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords
        fetchAddressFromNominatim(latitude, longitude)
      },
      error => {
        setLoading(false)
        Alert.alert(
          'Location Error', 
          'Unable to get your location. Please check your GPS settings and try again.',
          [{ text: 'OK' }]
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
        
        setCurrentLocation(locationData)
        
        // Save location to AsyncStorage
        await AsyncStorage.setItem('userLocation', JSON.stringify(locationData))
      } else {
        throw new Error('Unable to fetch address')
      }
    } catch (error) {
      console.log('Error fetching address:', error)
      
      // Fallback location data with coordinates
      const fallbackLocation: LocationData = {
        address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
        coordinates: { latitude, longitude },
        city: 'Current Location',
        country: 'Unknown'
      }
      
      setCurrentLocation(fallbackLocation)
      await AsyncStorage.setItem('userLocation', JSON.stringify(fallbackLocation))
    } finally {
      setLoading(false)
    }
  }

  // Handle location confirmation - Use onFinish prop
  const handleConfirmLocation = async () => {
    if (currentLocation) {
      try {
        await AsyncStorage.setItem('locationConfirmed', 'true')
        onFinish() // Use the onFinish prop
      } catch (error) {
        console.log('Error saving location confirmation:', error)
        onFinish() // Still call onFinish even if saving fails
      }
    }
  }

  // Handle manual location entry
  const handleManualLocation = () => {
    Alert.alert(
      'Manual Location',
      'This feature will allow you to enter your address manually.',
      [{ text: 'OK' }]
    )
  }

  // Handle Next button - Use onFinish prop
  const handleNext = async () => {
    try {
      // Mark location selection as completed (even if not set)
      await AsyncStorage.setItem('locationSelectionCompleted', 'true')
      
      // If location is available, save it as confirmed
      if (currentLocation) {
        await AsyncStorage.setItem('locationConfirmed', 'true')
      }
      
      onFinish() // Use the onFinish prop
    } catch (error) {
      console.log('Error saving location selection status:', error)
      onFinish() // Still call onFinish even if saving fails
    }
  }

  // Skip location selection - Use onFinish prop
  const handleSkip = () => {
    Alert.alert(
      'Skip Location',
      'You can set your location later in settings. Some features may be limited.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Skip', 
          onPress: handleNext // Use handleNext which calls onFinish
        }
      ]
    )
  }

  useEffect(() => {
    // Check if location is already saved
    const checkSavedLocation = async () => {
      try {
        const savedLocation = await AsyncStorage.getItem('userLocation')
        const locationConfirmed = await AsyncStorage.getItem('locationConfirmed')
        
        if (savedLocation && locationConfirmed) {
          onFinish() // Use the onFinish prop
        }
      } catch (error) {
        console.log('Error checking saved location:', error)
      }
    }
    
    checkSavedLocation()
  }, [onFinish])

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      {/* Skip Button */}
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Illustration */}
        <View style={styles.illustrationContainer}>
          <View style={styles.phoneContainer}>
            <View style={styles.phone}>
              <View style={styles.phoneScreen}>
                <View style={styles.mapContainer}>
                  <Icon name="map" size={40} color="#FF3F00" />
                  <View style={styles.locationPin}>
                    <Icon name="location-on" size={20} color="#FF3F00" />
                  </View>
                </View>
              </View>
            </View>
          </View>
          
          {/* Person illustration (simplified) */}
          <View style={styles.personContainer}>
            <View style={styles.person}>
              <View style={styles.personHead} />
              <View style={styles.personBody} />
            </View>
            <View style={styles.deliveryBag}>
              <Text style={styles.deliveryText}>FOOD</Text>
            </View>
          </View>
        </View>

        {/* Title and Description */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>Select Your Location</Text>
          <Text style={styles.description}>
            Discover nearby restaurants, cuisines, and favorite foods that you crave.
          </Text>
        </View>

        {/* Current Location Display */}
        {currentLocation && (
          <View style={styles.currentLocationContainer}>
            <Icon name="location-on" size={24} color="#FF3F00" />
            <View style={styles.locationInfo}>
              <Text style={styles.locationTitle}>Current Location</Text>
              <Text style={styles.locationAddress} numberOfLines={2}>
                {currentLocation.address}
              </Text>
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.primaryButton]} 
            onPress={requestLocationPermission}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Icon name="my-location" size={20} color="white" />
            )}
            <Text style={styles.primaryButtonText}>
              {loading ? 'Getting Location...' : 'Use Current Location'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
     <TouchableOpacity style={styles.nextButton} onPress={onFinish}>
             <LinearGradient colors={['red', 'red']} style={styles.gradient}>
               <Icon name="arrow-forward" size={24} color="#fff" />
             </LinearGradient>
           </TouchableOpacity>

    </SafeAreaView>
  )
}

export default LocationSelectionScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  skipButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    right: 20,
    zIndex: 10,
    padding: 10,
  },
  skipText: {
    fontSize: 16,
    color: '#999',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustrationContainer: {
    width: width * 0.8,
    height: height * 0.35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    position: 'relative',
  },
  phoneContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  phone: {
    width: 200,
    height: 350,
    backgroundColor: '#4A90E2',
    borderRadius: 25,
    padding: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  phoneScreen: {
    flex: 1,
    backgroundColor: '#E8F4FD',
    borderRadius: 18,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapContainer: {
    width: '100%',
    height: '60%',
    backgroundColor: '#B8E0FF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  locationPin: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  personContainer: {
    position: 'absolute',
    left: -50,
    bottom: 20,
    alignItems: 'center',
  },
  person: {
    alignItems: 'center',
  },
  personHead: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFB366',
    marginBottom: 5,
  },
  personBody: {
    width: 60,
    height: 80,
    borderRadius: 30,
    backgroundColor: '#FF3F00',
  },
  deliveryBag: {
    marginTop: 10,
    backgroundColor: '#FFD700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  deliveryText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  currentLocationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    width: '100%',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  locationInfo: {
    flex: 1,
    marginLeft: 12,
  },
  locationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  locationAddress: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
  },
  primaryButton: {
    backgroundColor: '#FF3F00',
  },
  secondaryButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#FF3F00',
  },
  confirmButton: {
    backgroundColor: '#0f8a0f',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#FF3F00',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomSection: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    paddingTop: 20,
  },


  nextButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    elevation: 5,
    backgroundColor:'red',
  },

    gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})