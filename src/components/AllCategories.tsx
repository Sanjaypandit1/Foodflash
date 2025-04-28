import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, StatusBar,
    Platform, } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

// Define types for the category item
type CategoryItem = {
  id: string;
  name: string;
  restaurant: string;
  price: string;
  description: string;
  isVeg: boolean;
  rating: string;
  preparationTime: string;
};

// Define the route params type
type RootStackParamList = {
  AllCategories: {
    categories: CategoryItem[];
  };
  CategoryItems: {
    categoryName: string;
  };
  // Add other screens here as needed
};

// Define the route prop type
type AllCategoriesRouteProp = RouteProp<RootStackParamList, 'AllCategories'>;

// Define the navigation prop type
type AllCategoriesNavigationProp = StackNavigationProp<RootStackParamList, 'AllCategories'>;

const AllCategories = () => {
  const route = useRoute<AllCategoriesRouteProp>();
  const navigation = useNavigation<AllCategoriesNavigationProp>();
  const { categories } = route.params;

  // Image mapping object with type safety
  const imageMap: Record<string, any> = {
    pizza: require("../Assets/BurgerJoint/chicken-pizza.jpg"),
    momo: require("../Assets/DeliciousBite/chicken-momo.jpg"),
    biryani: require("../Assets/SpiceGarden/chicken-biryani.jpg"),
    burger: require("../Assets/BurgerJoint/chicken-burger.jpg"),
    butterchicken: require("../Assets/SpiceGarden/Butter-Chicken.jpeg"),
    chowmin: require("../Assets/DeliciousBite/chicken-chowmin.jpg")
  };

  const renderItem = ({ item }: { item: CategoryItem }) => {
    const imageKey = item.name.toLowerCase().replace(/\s/g, '');
    const imageSource = imageMap[imageKey] || require("../Assets/DeliciousBite/chicken-chowmin.jpg");

    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => navigation.navigate('CategoryItems', { categoryName: item.name })}
      >
        <Image source={imageSource} style={styles.itemImage} />
        <View style={styles.itemDetails}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemRestaurant}>{item.restaurant}</Text>
          <View style={styles.priceRatingContainer}>
            
            <Text style={styles.itemRating}></Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>All Categories</Text>
      </View>
      
      <FlatList
        data={categories}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

// Keep the same styles as before
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0,
},
safeArea: {
  flex: 1,
},
  header: {
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  listContainer: {
    paddingBottom: 20,
  },
  itemContainer: {
    flex: 1,
    margin: 8,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  itemDetails: {
    padding: 10,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  itemRestaurant: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
  },
  priceRatingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#E96A1C',
  },
  itemRating: {
    fontSize: 12,
    color: '#E96A1C',
    fontWeight: '500',
  },
});

export default AllCategories;