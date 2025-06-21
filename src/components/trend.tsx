import { StyleSheet, Text, TouchableOpacity, View, Image, ScrollView } from 'react-native';
import React from 'react';
import { NavigationProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

// Define prop types
type Props = {
  navigation: NavigationProp<any>;
};

const TodayTrends: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();

  // Updated trending items with restaurant-specific images and restaurant names
  const trendingItems = [
    {
      id: "93",
      name: "Chicken Biryani",
      originalPrice: '400',
      discountedPrice: '345',
      description: "Dum-style biryani with free-range chicken and kewra water.",
      image: { uri: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a" },
      isVeg: false,
      discount: '13.7',
      rating: "4.9",
      preparationTime: "29 min",
      restaurant: "Sushil Palace",
    },
    {
      id: "82",
      name: "Chicken Steam Momo",
      originalPrice: '200',
      discountedPrice: '195',
      discount: '2.5',
      description: "Juicy free-range chicken momos with house-made ginger sauce.",
      image: {
        uri: "https://images.unsplash.com/photo-1647999019630-dabe1a837693?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGR1bXBsaW5nJTIwd2l0aCUyMGp1aWNlfGVufDB8fDB8fHww",
      },
      isVeg: false,
      rating: "4.7",
      preparationTime: "19 min",
      restaurant: "Sushil Palace",
    },
    {
      id: "1",
      name: "Chicken Pizza",
      originalPrice: '400',
      discountedPrice: '350',
      discount: '12.5',
      description: "Hand-tossed pizza topped with juicy chicken pieces, rich tomato sauce, and lots of cheese.",
      image: { uri: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38" },
      isVeg: false,
      rating: "4.6",
      preparationTime: "25 min",
      restaurant: "Burger Joint",
    },
    {
      id: "11",
      name: "Chicken Chowmin",
      originalPrice: '300',
      discountedPrice: '200',
      discount: '33.3',
      description: "Stir-fried noodles with tender chicken and mixed veggies.",
      image: {
        uri: "https://media.istockphoto.com/id/1023472716/photo/chicken-chow-mein.webp?a=1&b=1&s=612x612&w=0&k=20&c=imRM1hOMVFkjAnlpR8RpIGgya0X2iERxfsKT1UdCWIY=",
      },
      isVeg: false,
      rating: "4.5",
      preparationTime: "15 min",
      restaurant: "Burger Joint",
    },
    {
      id: "89",
      name: "Veg Burger",
      originalPrice: '170',
      discountedPrice: '165',
      discount: '3.0',
      description: "Quinoa-black bean patty with avocado spread in brioche bun.",
      image: { uri: "https://images.unsplash.com/photo-1571091718767-18b5b1457add" },
      isVeg: true,
      rating: "4.4",
      preparationTime: "13 min",
      restaurant: "Sushil Palace",
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.head}>{t('todayTrends.title')}</Text>
      <Text style={styles.subhead}>{t('todayTrends.subtitle')}</Text>
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
            <View style={styles.discountTag}>
              <Text style={styles.discountText}>{item.discount}% {t('common.off')}</Text>
            </View>

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
    backgroundColor: '#fff',
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