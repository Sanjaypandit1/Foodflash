import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from 'react-native';
import React from 'react';
import Swiper from 'react-native-swiper';


const { width } = Dimensions.get('window');

const OfferSlider = () => {
  // Custom slide data
  const slides = [
    {
      id: 1,
      title: "Burger That Will\nSatisfy Your Cravings",
      image: require('../Assets/poster/poster1.jpg'),
      discount: "20%",
      color: "#4CAF50" // Green
    },
    {
      id: 2,
      title: "Pizza With Extra\nCheese Toppings",
      image: require('../Assets/poster/poster2.jpg'),
      discount: "15%",
      color: "#FF5722" // Orange
    },
    {
      id: 3,
      title: "Fresh Salads For\nHealthy Living",
      image: require('../Assets/poster/poster7.jpg'),
      discount: "10%",
      color: "#9C27B0" // Purple
    },
    {
      id: 4,
      title: "Desserts That\nMelt In Your Mouth",
      image: require('../Assets/poster/poster4.jpg'),
      discount: "25%",
      color: "#E91E63" // Pink
    },
    {
      id: 5,
      title: "Pasta Made With\nAuthentic Recipe",
      image: require('../Assets/poster/poster5.jpg'),
      discount: "18%",
      color: "#FF9800" // Amber
    },
    {
      id: 6,
      title: "Biryani That Will\nChange Your Mind",
      image: require('../Assets/poster/poster6.jpeg'),
      discount: "14%",
      color: "#1E88E5" // Blue
    }
  ];

  return (
    <View style={styles.container}>
      <Swiper
        autoplay={true}
        autoplayTimeout={5}
        showsButtons={false}
        dotStyle={styles.dot}
        activeDotStyle={styles.activeDot}
        paginationStyle={styles.pagination}
        loop={true}
      >
        {slides.map((slide, index) => (
          <View key={slide.id} style={[styles.slide, { backgroundColor: slide.color }]}>
            <View style={styles.contentContainer}>
              <View style={styles.textContainer}>
                <Text style={styles.title}>{slide.title}</Text>
                <TouchableOpacity style={styles.orderButton}>
                  <Text style={[styles.orderText, { color: slide.color }]}>Order Now</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.imageContainer}>
                <Image 
                  source={slide.image} 
                  style={styles.foodImage} 
                  resizeMode="contain"
                />
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>{slide.discount}</Text>
                  <Text style={styles.offText}>OFF</Text>
                </View>
              </View>
            </View>
            
            {/* Custom pagination indicator */}
            <View style={styles.customPagination}>
              {slides.map((_, i) => (
                <View 
                  key={i} 
                  style={[
                    styles.paginationDot, 
                    i === index ? styles.paginationActiveDot : null
                  ]} 
                />
              ))}
              <View style={styles.paginationCounter}>
                <Text style={styles.paginationText}>{index + 1}/{slides.length}</Text>
              </View>
            </View>
          </View>
        ))}
      </Swiper>
    </View>
  );
};

export default OfferSlider;

const styles = StyleSheet.create({
  container: {
    top:15,
    width: '100%',
    height: 220, // Increased height to accommodate pagination
   
  },
  slide: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
    overflow: 'hidden',
    padding: 20,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  orderButton: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    alignSelf: 'flex-start',
  },
  orderText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  foodImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  discountBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  discountText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00B0FF',
  },
  offText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#00B0FF',
  },
  // Hide default pagination
  dot: {
    backgroundColor: 'transparent',
    width: 0,
    height: 0,
  },
  activeDot: {
    backgroundColor: 'transparent',
    width: 0,
    height: 0,
  },
  pagination: {
    bottom: -100, // Move it out of view
  },
  // Custom pagination
  customPagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 5,
  },
  paginationActiveDot: {
    backgroundColor: 'white',
  },
  paginationCounter: {
    backgroundColor: '#FF8C00',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
    marginLeft: 10,
  },
  paginationText: {
    color: 'white',
    fontWeight: 'bold',
  },
});