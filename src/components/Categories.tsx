// Modified Categories.tsx with TypeScript fixes
import { StyleSheet, Text, TouchableOpacity, View, Image, Dimensions } from 'react-native';
import React from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { NavigationProp } from '@react-navigation/native';
import { ImageSourcePropType } from 'react-native';

// Define prop types
type Props = {
  navigation: NavigationProp<any>;
};

// Define FoodItem type
type FoodItem = {
  id: string;
  name: string;
  price: string;
  description: string;
  image: ImageSourcePropType;
  isVeg: boolean;
  rating: string;
  preparationTime: string;
};

// Define CategoryName type to ensure type safety
type CategoryName = 'Pizza' | 'Momo' | 'Chowmin' | 'Burger' | 'Biryani';

// Define Category type
type Category = {
  id: number;
  name: CategoryName;
  image: ImageSourcePropType;
  color: string;
};

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.28;

const Categories: React.FC<Props> = ({ navigation }) => {
  // Sample food items for each category
  const foodItems: Record<CategoryName, FoodItem> = {
    Pizza: {
      id: '1',
      name: 'Veg Pizza',
      price: '300',
      description: 'Classic pizza with tomato sauce, mozzarella, and basil',
      image: require('../Assets/pizza/vegpizza.jpg'),
      isVeg: true,
      rating: '4.5',
      preparationTime: '20 min',
    },
    Momo: {
      id: '2',
      name: 'Chicken Momo',
      price: '150',
      description: 'Steamed dumplings filled with spiced chicken',
      image: require('../Assets/momo/chickenmomo.jpeg'),
      isVeg: false,
      rating: '4.7',
      preparationTime: '15 min',
    },
    Chowmin: {
      id: '3',
      name: 'Veg Chowmin',
      price: '120',
      description: 'Stir-fried noodles with mixed vegetables',
      image: require('../Assets/Chowmin/vegchowmin.webp'),
      isVeg: true,
      rating: '4.3',
      preparationTime: '12 min',
    },
    Burger: {
      id: '4',
      name: 'Veg Burger',
      price: '120',
      description: 'Delicious burger with vegetable patty',
      image: require('../Assets/Burger/vegburger.jpg'),
      isVeg: true,
      rating: '4.2',
      preparationTime: '10 min',
    },
    Biryani: {
      id: '5',
      name: 'Chicken Biryani',
      price: '250',
      description: 'Aromatic rice dish with chicken and spices',
      image: require('../Assets/biryani/chickenbiryani.jpeg'),
      isVeg: false,
      rating: '4.8',
      preparationTime: '25 min',
    }
  };

  const categories: Category[] = [
    {
      id: 1,
      name: 'Pizza',
      image: require('../Assets/pizza/vegpizza.jpg'),
      color: '#E96A1C'
    },
    {
      id: 2,
      name: 'Momo',
      image: require('../Assets/momo/chickenmomo.jpeg'),
      color: '#E96A1C',
    },
    {
      id: 3,
      name: 'Chowmin',
      image: require('../Assets/Chowmin/vegchowmin.webp'),
      color: '#E96A1C'
    },
    {
      id: 4,
      name: 'Burger',
      image: require('../Assets/Burger/vegburger.jpg'),
      color: '#E96A1C'
    },
    {
      id: 5,
      name: 'Biryani',
      image: require('../Assets/biryani/chickenbiryani.jpeg'),
      color: '#E96A1C'
    }
  ];

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.head}>What's on Your Mind</Text>
        <TouchableOpacity>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.scrollView}
        decelerationRate="fast"
      >
        {categories.map((category) => (
          <TouchableOpacity 
            key={category.id}
            style={[styles.boxContainer, { backgroundColor: category.color }]} 
            onPress={() => navigation.navigate('FoodItemDetail', { item: foodItems[category.name] })}
            activeOpacity={0.8}
          >
            <View style={styles.imageContainer}>
              <Image source={category.image} style={styles.image} />
            </View>
            <Text style={styles.label}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default Categories;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 15,
  },
  head: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  viewAll: {
    fontSize: 14,
    color: '#FF3F00',
    fontWeight: '600',
  },
  scrollView: {
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  boxContainer: {
    width: ITEM_WIDTH,
    aspectRatio: 0.9,
    marginRight: 16,
    borderRadius: 16,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    marginBottom: 5,
  },
});