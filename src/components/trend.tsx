import { StyleSheet, Text, TouchableOpacity, View, Image, ScrollView } from 'react-native';
import React from 'react';
import { NavigationProp } from '@react-navigation/native';

// Define prop types
type Props = {
  navigation: NavigationProp<any>;
};

const TodayTrends: React.FC<Props> = ({ navigation }) => {
  // Updated trending items with restaurant-specific images and restaurant names
  const trendingItems = [
    {
      id: '1',
      name: 'Chicken Biryani',
      restaurant: 'Spice Garden',
      originalPrice: '500',
      discountedPrice: '450',
      discount: '10.0',
      image: require('../Assets/SpiceGarden/chicken-biryani.jpg'),
      description: 'Fragrant long-grain basmati rice layered with tender chicken pieces, caramelized onions, and traditional spices.',
      isVeg: false,
      rating: '4.5',
      preparationTime: '30 min',
    },
    {
      id: '2',
      name: 'Chicken Momo',
      restaurant: 'Delicious Bites',
      originalPrice: '200',
      discountedPrice: '140',
      discount: '30.0',
      image: require('../Assets/DeliciousBite/chicken-momo.jpg'),
      description: 'Juicy dumplings filled with minced chicken, onions, garlic, and ginger. Steamed to perfection.',
      isVeg: false,
      rating: '4.7',
      preparationTime: '15 min',
    },
    {
      id: '3',
      name: 'Chicken Pizza',
      restaurant: 'Burger Joint',
      originalPrice: '400',
      discountedPrice: '360',
      discount: '10.0',
      image: require('../Assets/BurgerJoint/chicken-pizza.jpg'),
      description: 'Delicious pizza topped with grilled chicken pieces, bell peppers, onions, and a blend of mozzarella and cheddar cheese.',
      isVeg: false,
      rating: '4.3',
      preparationTime: '25 min',
    },
    {
      id: '4',
      name: 'Veg Momo',
      restaurant: 'Delicious Bites',
      originalPrice: '120',
      discountedPrice: '100',
      discount: '16.7',
      image: require('../Assets/DeliciousBite/veg-momo.jpg'),
      description: 'Steamed dumplings filled with finely chopped vegetables, herbs, and aromatic spices.',
      isVeg: true,
      rating: '4.2',
      preparationTime: '20 min',
    },
    {
      id: '5',
      name: 'Butter Chicken',
      restaurant: 'Spice Garden',
      originalPrice: '330',
      discountedPrice: '280',
      discount: '15.2',
      image: require('../Assets/SpiceGarden/Butter-Chicken.jpeg'),
      description: 'Tender chicken pieces cooked in a rich, creamy tomato sauce with butter, cream, and aromatic spices.',
      isVeg: false,
      rating: '4.8',
      preparationTime: '25 min',
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.head}>Today's Trends</Text>
      <Text style={styles.subhead}>Here's what you might like to taste</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollView}>
        {trendingItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            onPress={() => navigation.navigate('FoodItemDetail', {
              item: {
                id: item.id,
                name: item.name,
                price: item.discountedPrice,
                description: item.description,
                image: item.image,
                isVeg: item.isVeg,
                rating: item.rating,
                preparationTime: item.preparationTime,
              },
              restaurantName: item.restaurant, // Pass restaurant name to FoodItemDetail
            })}
          >
            <Image source={item.image} style={styles.image} />
            <View style={styles.discountTag}><Text style={styles.discountText}>{item.discount}% OFF</Text></View>

            {/* Restaurant name with icon */}
            <View style={styles.restaurantContainer}>
              <Text style={styles.restaurant}>{item.restaurant}</Text>
            </View>

            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.price}>
              <Text style={styles.strikeThrough}>Rs.{item.originalPrice}</Text> Rs.{item.discountedPrice}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default TodayTrends;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F9F1E7',
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  head: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E96A1C',
    marginBottom: 5,
  },
  subhead: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  scrollView: {
    flexDirection: 'row',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginRight: 15,
    width: 170,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 2, height: 2 },
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 120,
    borderRadius: 10,
  },
  discountTag: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#E96A1C',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 5,
  },
  discountText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  restaurantContainer: {
    backgroundColor: '#FFF8EE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 8,
    marginBottom: 2,
  },
  restaurant: {
    fontSize: 12,
    color: '#E96A1C',
    fontWeight: '600',
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#E96A1C',
    marginTop: 4,
  },
  strikeThrough: {
    textDecorationLine: 'line-through',
    color: '#888',
    marginRight: 5,
  },
});
