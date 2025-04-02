import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Import Ionicons from vector-icons

const HighlightsForYou = () => {
  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Highlights for you</Text>
        <Ionicons name="sparkles" size={20} color="#FFA500" />
      </View>
      <Text style={styles.subtitle}>See our most popular restaurant and foods</Text>

      {/* Highlighted Poster */}
      <View style={styles.poster}>
        <Image source={require('../Assets/biryani/vegbiryani.jpg')} style={styles.posterImage} />

        {/* Title at the Top */}
        <Text style={styles.posterTitle}>Veg Hydrabadi Biryani</Text>

        {/* Bottom Section (Order & Rating) */}
        <View style={styles.bottomContainer}>
          <TouchableOpacity style={styles.orderButton}>
            <Text style={styles.orderButtonText}>Order Now!</Text>
          </TouchableOpacity>

          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#FFA500" />
            <Text style={styles.ratingText}>4.7 (3)</Text>
          </View>
        </View>
      </View>

      {/* Discount Info Card */}
      <View style={styles.discountCard}>
        <Ionicons name="fast-food-outline" size={24} color="#FFA500" />
        <View style={styles.discountTextContainer}>
          <Text style={styles.discountTitle}>Incredible Savings! Get 45% Off</Text>
          <Text style={styles.discountDescription}>
            Discover unbeatable deals with our 45% off sale! Explore a wide range of products and more.
          </Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="heart-outline" size={24} color="#FF3F00"  />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  subtitle: {
    fontSize: 13,
    color: '#666',
    marginBottom: 10,
  },
  poster: {
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
    position: 'relative',
  },
  posterImage: {
    width: '100%',
    height: 180,
  },
  posterTitle: {
    position: 'absolute',
    top: 1,
    left: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Add background for readability
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 10,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  orderButton: {
    backgroundColor: '#FF3F00',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 5,
  },
  orderButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 5,
  },
  ratingText: {
    color: '#F7931A',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  discountCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginTop: 0,
    elevation: 3,
  },
  discountTextContainer: {
    flex: 1,
    marginLeft: 10,
  },
  discountTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  discountDescription: {
    fontSize: 14,
    color: '#666',
  },
 
});

export default HighlightsForYou;
