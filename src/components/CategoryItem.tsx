"use client"

import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  StatusBar,
  Platform,
  ScrollView,
} from "react-native"
import { useEffect, useState, useCallback } from "react"
import { type RouteProp, useNavigation, useRoute, type NavigationProp } from "@react-navigation/native"
import type { ImageSourcePropType } from "react-native"
import Icon from "react-native-vector-icons/MaterialIcons"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import FavoriteButton from "../screens/favorite-button"
import { getImageUri } from "../screens/favorite-helper"

// Define types
type RootStackParamList = {
  CategoryItems: {
    categoryName: string
  }
  FoodItemDetail: {
    item: FoodItem
    restaurantName: string
  }
}

type FoodItem = {
  id: string
  name: string
  price: string
  description: string
  image: ImageSourcePropType
  isVeg: boolean
  rating: string
  preparationTime: string
  restaurant: string
}

const { width } = Dimensions.get("window")
const itemWidth = (width - 20) / 2



// Sample food items data from all restaurants
const allFoodItems: FoodItem[] = [
  {
    id: "6",
    name: "Veg Steam Momo",
    price: "150",
    description: "Steamed dumplings filled with seasonal veggies and light spices.",
    image: {
      uri: "https://media.istockphoto.com/id/1292635321/photo/veg-steam-momo-nepalese-traditional-dish-momo-stuffed-with-vegetables-and-then-cooked-and.webp?a=1&b=1&s=612x612&w=0&k=20&c=UnTAWRhFjF0ERXdBmZXCYQU5nsLGAHfKwbGBqQ6QzT0=",
    }, // Proper veg momo image
    isVeg: true,
    rating: "4.3",
    preparationTime: "15 min",
    restaurant: "Burger Joint",
  },
  {
    id: "7",
    name: "Chicken Steam Momo",
    price: "180",
    description: "Tender chicken filled in steamed momos, served with spicy chutney.",
    image: {
      uri: "https://media.istockphoto.com/id/1475787002/photo/chicken-dumplings-in-a-plate-with-chopsticks-directly-above-photo.webp?a=1&b=1&s=612x612&w=0&k=20&c=Ub3lgPcUD11P-nEGBztAcWBGZojeEqJ6gPWUpQ9D3uE=",
    }, // Proper chicken momo image
    isVeg: false,
    rating: "4.5",
    preparationTime: "15 min",
    restaurant: "Burger Joint",
  },
  {
    id: "8",
    name: "Buff Momo",
    price: "190",
    description: "Traditional Nepali buff momos packed with spices.",
    image: {
      uri: "https://media.istockphoto.com/id/636287858/photo/nepali-cuisine-steam-mo-mo-or-dumpling.webp?a=1&b=1&s=612x612&w=0&k=20&c=qRhH-hnUPZppMP3rUfmBcPEiS0bUXH9mf8Svs06dwsQ=",
    }, // Proper buff momo image
    isVeg: false,
    rating: "4.5",
    preparationTime: "15 min",
    restaurant: "Burger Joint",
  },
  {
    id: "9",
    name: "Veg Jhol Momo",
    price: "170",
    description: "Vegetable momos dipped in spicy jhol (soup) sauce.",
    image: {
      uri: "https://media.istockphoto.com/id/496359484/photo/dumpling-soup.jpg?s=1024x1024&w=is&k=20&c=--1Hxz1rrBxxHQyYbondSv_B_kTv3kdvRUMh1bLteC0=",
    }, // Proper jhol momo image
    isVeg: true,
    rating: "4.4",
    preparationTime: "20 min",
    restaurant: "Burger Joint",
  },
  {
    id: "10",
    name: "Chicken Jhol Momo",
    price: "200",
    description: "Chicken stuffed momos with jhol (gravy) special sauce.",
    image: {
      uri: "https://media.istockphoto.com/id/1458219795/photo/jhol-momo-jhol-momo-are-steamed-dumplings-made-with-spiced-meat-fillings-momo-jhol-achar-or.webp?a=1&b=1&s=612x612&w=0&k=20&c=3CdF0QeKfJB_52TQRyX3flkbkCgSyJvDfxG2I7OosfU=",
    }, // Proper chicken jhol momo image
    isVeg: false,
    rating: "4.6",
    preparationTime: "20 min",
    restaurant: "Burger Joint",
  },
  {
    id: "31",
    name: "Fried Momo",
    price: "200",
    description: "Crispy fried dumplings filled with vegetables and spices.",
    image: {
      uri: "https://images.unsplash.com/photo-1703080173985-936514c7c8bd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZnJ5JTIwZHVtcGxpbmd8ZW58MHx8MHx8fDA%3D",
    },
    isVeg: true,
    rating: "4.6",
    preparationTime: "18 min",
    restaurant: "Delicious Bites",
  },
  {
    id: "32",
    name: "Chicken Fried Momo",
    price: "220",
    description: "Deep-fried momos with juicy chicken filling, served with dipping sauce.",
    image: {
      uri: "https://images.unsplash.com/photo-1703080173985-936514c7c8bd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZnJ5JTIwZHVtcGxpbmd8ZW58MHx8MHx8fDA%3D",
    },
    isVeg: false,
    rating: "4.7",
    preparationTime: "18 min",
    restaurant: "Delicious Bites",
  },
  {
    id: "33",
    name: "Veg C Momo",
    price: "190",
    description: "Pan-fried momos with vegetable filling, crispy on one side.",
    image: {
      uri: "https://plus.unsplash.com/premium_photo-1661600604025-26f3d0fee123?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGZyeSUyMGR1bXBsaW5nfGVufDB8fDB8fHww",
    },
    isVeg: true,
    rating: "4.5",
    preparationTime: "20 min",
    restaurant: "Delicious Bites",
  },
  {
    id: "34",
    name: "Chicken C Momo",
    price: "210",
    description: "Half-fried, half-steamed chicken momos with perfect texture.",
    image: {
      uri: "https://images.unsplash.com/photo-1700809979031-582d10f3a4d5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGZyeSUyMGR1bXBsaW5nfGVufDB8fDB8fHww",
    },
    isVeg: false,
    rating: "4.7",
    preparationTime: "20 min",
    restaurant: "Delicious Bites",
  },
  {
    id: "56",
    name: "Veg Steam Momo",
    price: "160",
    description: "Delicate steamed dumplings with organic vegetables and sesame dip.",
    image: {
      uri: "https://images.unsplash.com/photo-1635844035031-72e3a3ff1e42?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHZlZyUyMGR1bXBsaW5nfGVufDB8fDB8fHww",
    },
    isVeg: true,
    rating: "4.4",
    preparationTime: "18 min",
    restaurant: "Spice Garden",
  },
  {
    id: "57",
    name: "Chicken Steam Momo",
    price: "190",
    description: "Juicy chicken-filled momos with ginger-garlic sauce.",
    image: {
      uri: "https://plus.unsplash.com/premium_photo-1661600643912-dc6dbb1db475?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y2hpY2tlbiUyMGR1bXBsaW5nfGVufDB8fDB8fHww",
    },
    isVeg: false,
    rating: "4.6",
    preparationTime: "18 min",
    restaurant: "Spice Garden",
  },
  {
    id: "58",
    name: "Buff Momo",
    price: "200",
    description: "Authentic buffalo meat momos with spicy tomato chutney.",
    image: {
      uri: "https://images.unsplash.com/photo-1705186383409-e6e6da37fc53?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8amhvbCUyMGR1bXBsaW5nfGVufDB8fDB8fHww",
    },
    isVeg: false,
    rating: "4.7",
    preparationTime: "18 min",
    restaurant: "Spice Garden",
  },
  {
    id: "59",
    name: "Veg Jhol Momo",
    price: "180",
    description: "Steamed veg momos immersed in aromatic herb-infused broth.",
    image: {
      uri: "https://images.unsplash.com/photo-1707895601304-62327fd562ef?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDd8fGpob2wlMjBkdW1wbGluZ3xlbnwwfHwwfHx8MA%3D%3D",
    },
    isVeg: true,
    rating: "4.5",
    preparationTime: "22 min",
    restaurant: "Spice Garden",
  },
  {
    id: "60",
    name: "Chicken Jhol Momo",
    price: "210",
    description: "Chicken momos served in rich bone broth with spices.",
    image: {
      uri: "https://images.unsplash.com/photo-1656759637476-1ea88a76d104?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjIwfHxqaG9sJTIwZHVtcGxpbmd8ZW58MHx8MHx8fDA%3D",
    },
    isVeg: false,
    rating: "4.7",
    preparationTime: "22 min",
    restaurant: "Spice Garden",
  },
  {
    id: "81",
    name: "Veg Steam Momo",
    price: "165",
    description: "Hand-pinched momos with seasonal organic vegetables and sesame-chili oil.",
    image: {
      uri: "https://plus.unsplash.com/premium_photo-1673769108258-4e0053145334?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGR1bXBsaW5nfGVufDB8fDB8fHww",
    },
    isVeg: true,
    rating: "4.5",
    preparationTime: "19 min",
    restaurant: "Sushil Palace",
  },
  {
    id: "82",
    name: "Chicken Steam Momo",
    price: "195",
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
    id: "83",
    name: "Buff Momo",
    price: "205",
    description: "Grass-fed buffalo momos with Himalayan spice blend and tomato chutney.",
    image: {
      uri: "https://plus.unsplash.com/premium_photo-1674601033631-79eeffaac6f9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8ZHVtcGxpbmd8ZW58MHx8MHx8fDA%3D",
    },
    isVeg: false,
    rating: "4.8",
    preparationTime: "19 min",
    restaurant: "Sushil Palace",
  },
  {
    id: "84",
    name: "Veg Jhol Momo",
    price: "185",
    description: "Steamed vegetable momos in aromatic lemongrass-infused broth.",
    image: {
      uri: "https://images.unsplash.com/photo-1707528904025-5315e787958a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGR1bXBsaW5nJTIwd2l0aCUyMGp1aWNlfGVufDB8fDB8fHww",
    },
    isVeg: true,
    rating: "4.6",
    preparationTime: "23 min",
    restaurant: "Sushil Palace",
  },
  {
    id: "85",
    name: "Chicken Jhol Momo",
    price: "215",
    description: "Chicken momos in rich bone broth with Himalayan herbs.",
    image: {
      uri: "https://images.unsplash.com/photo-1707528904025-5315e787958a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGR1bXBsaW5nJTIwd2l0aCUyMGp1aWNlfGVufDB8fDB8fHww",
    },
    isVeg: false,
    rating: "4.8",
    preparationTime: "23 min",
    restaurant: "Sushil Palace",
  },

  // Pizza items
  {
    id: "1",
    name: "Chicken Pizza",
    price: "350",
    description: "Hand-tossed pizza topped with juicy chicken pieces, rich tomato sauce, and lots of cheese.",
    image: { uri: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38" },
    isVeg: false,
    rating: "4.6",
    preparationTime: "25 min",
    restaurant: "Burger Joint",
  },
  {
    id: "2",
    name: "Veg Pizza",
    price: "300",
    description: "Fresh vegetables, mozzarella cheese and basil on a crispy pizza base.",
    image: { uri: "https://images.unsplash.com/photo-1506354666786-959d6d497f1a" },
    isVeg: true,
    rating: "4.5",
    preparationTime: "20 min",
    restaurant: "Burger Joint",
  },
  {
    id: "3",
    name: "Cheese Pizza",
    price: "320",
    description: "Cheesy delight with mozzarella and cheddar layers on thin crust.",
    image: { uri: "https://images.unsplash.com/photo-1541745537411-b8046dc6d66c" },
    isVeg: true,
    rating: "4.7",
    preparationTime: "20 min",
    restaurant: "Burger Joint",
  },
  {
    id: "4",
    name: "Egg Pizza",
    price: "330",
    description: "Soft baked eggs with a cheesy pizza base and tomato sauce.",
    image: { uri: "https://images.unsplash.com/photo-1595854341625-f33ee10dbf94" },
    isVeg: false,
    rating: "4.4",
    preparationTime: "22 min",
    restaurant: "Burger Joint",
  },
  {
    id: "5",
    name: "Mushroom Pizza",
    price: "310",
    description: "Fresh mushrooms sautéed with herbs, loaded on top of cheesy pizza.",
    image: { uri: "https://images.unsplash.com/photo-1513104890138-7c749659a591" },
    isVeg: true,
    rating: "4.5",
    preparationTime: "20 min",
    restaurant: "Burger Joint",
  },
  {
    id: "26",
    name: "Pepperoni Pizza",
    price: "370",
    description: "Classic pizza topped with spicy pepperoni, melted cheese, and tangy tomato sauce.",
    image: { uri: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3" },
    isVeg: false,
    rating: "4.7",
    preparationTime: "25 min",
    restaurant: "Delicious Bites",
  },
  {
    id: "27",
    name: "Margherita Pizza",
    price: "290",
    description: "Simple yet delicious with fresh tomatoes, mozzarella, and basil on thin crust.",
    image: { uri: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e" },
    isVeg: true,
    rating: "4.6",
    preparationTime: "18 min",
    restaurant: "Delicious Bites",
  },
  {
    id: "28",
    name: "BBQ Chicken Pizza",
    price: "380",
    description: "Smoky BBQ sauce, grilled chicken, red onions, and cilantro on pizza.",
    image: { uri: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee" },
    isVeg: false,
    rating: "4.8",
    preparationTime: "28 min",
    restaurant: "Delicious Bites",
  },
  {
    id: "29",
    name: "Paneer Pizza",
    price: "340",
    description: "Indian style pizza with spiced paneer cubes and bell peppers.",
    image: {
      uri: "https://images.unsplash.com/photo-1573821663912-569905455b1c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGFuZWVyJTIwcGl6emF8ZW58MHx8MHx8fDA%3D",
    },
    isVeg: true,
    rating: "4.5",
    preparationTime: "22 min",
    restaurant: "Delicious Bites",
  },
  {
    id: "51",
    name: "Chicken Pizza",
    price: "380",
    description: "Wood-fired pizza with grilled chicken, bell peppers, and extra cheese.",
    image: {
      uri: "https://images.unsplash.com/photo-1552539618-7eec9b4d1796?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGNoaWNrZW4lMjBwaXp6YXxlbnwwfHwwfHx8MA%3D%3D",
    },
    isVeg: false,
    rating: "4.7",
    preparationTime: "28 min",
    restaurant: "Spice Garden",
  },
  {
    id: "52",
    name: "Veg Pizza",
    price: "320",
    description: "Garden fresh veggies on whole wheat crust with garlic sauce.",
    image: {
      uri: "https://images.unsplash.com/photo-1681567604770-0dc826c870ae?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHZlZyUyMHBpenphfGVufDB8fDB8fHww",
    },
    isVeg: true,
    rating: "4.6",
    preparationTime: "22 min",
    restaurant: "Spice Garden",
  },
  {
    id: "53",
    name: "Cheese Pizza",
    price: "340",
    description: "Four cheese blend on thick crust with oregano seasoning.",
    image: { uri: "https://images.unsplash.com/photo-1601924582970-9238bcb495d9" },
    isVeg: true,
    rating: "4.8",
    preparationTime: "20 min",
    restaurant: "Spice Garden",
  },
  {
    id: "54",
    name: "Egg Pizza",
    price: "350",
    description: "Farm fresh eggs baked on pizza with cherry tomatoes and herbs.",
    image: { uri: "https://images.unsplash.com/photo-1541745537411-b8046dc6d66c" },
    isVeg: false,
    rating: "4.5",
    preparationTime: "25 min",
    restaurant: "Spice Garden",
  },
  {
    id: "55",
    name: "Mushroom Pizza",
    price: "330",
    description: "Exotic mushrooms with truffle oil on thin crust pizza.",
    image: { uri: "https://images.unsplash.com/photo-1513104890138-7c749659a591" },
    isVeg: true,
    rating: "4.7",
    preparationTime: "23 min",
    restaurant: "Spice Garden",
  },
  {
    id: "76",
    name: "Chicken Pizza",
    price: "395",
    description: "Signature pizza with free-range chicken, roasted garlic, and three-cheese blend.",
    image: { uri: "https://images.unsplash.com/photo-1593504049359-74330189a345" },
    isVeg: false,
    rating: "4.8",
    preparationTime: "27 min",
    restaurant: "Sushil Palace",
  },
  {
    id: "77",
    name: "Veg Pizza",
    price: "315",
    description: "Farm-to-table vegetables on sourdough crust with pesto drizzle.",
    image: { uri: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e" },
    isVeg: true,
    rating: "4.7",
    preparationTime: "23 min",
    restaurant: "Sushil Palace",
  },
  {
    id: "78",
    name: "Cheese Pizza",
    price: "335",
    description: "Five premium cheeses including gouda and parmesan on crispy thin crust.",
    image: { uri: "https://images.unsplash.com/photo-1601924582970-9238bcb495d9" },
    isVeg: true,
    rating: "4.9",
    preparationTime: "21 min",
    restaurant: "Sushil Palace",
  },
  {
    id: "79",
    name: "Egg Pizza",
    price: "355",
    description: "Organic eggs with caramelized onions and smoked mozzarella.",
    image: { uri: "https://images.unsplash.com/photo-1541745537411-b8046dc6d66c" },
    isVeg: false,
    rating: "4.6",
    preparationTime: "26 min",
    restaurant: "Sushil Palace",
  },
  {
    id: "80",
    name: "Mushroom Pizza",
    price: "325",
    description: "Wild forest mushrooms with truffle paste and aged cheddar.",
    image: { uri: "https://images.unsplash.com/photo-1513104890138-7c749659a591" },
    isVeg: true,
    rating: "4.8",
    preparationTime: "24 min",
    restaurant: "Sushil Palace",
  },

  // Biryani items
  {
    id: "17",
    name: "Veg Biryani",
    price: "250",
    description: "Flavorful biryani made with basmati rice and fresh vegetables.",
    image: {
      uri: "https://media.istockphoto.com/id/495188382/photo/indian-pulav-vegetable-rice-veg-biryani-basmati-rice.webp?a=1&b=1&s=612x612&w=0&k=20&c=7ovRTJwxa_x4Q_BHoiLhiTKdTneDQ5W_m4_jJyOHbBM=",
    },
    isVeg: true,
    rating: "4.5",
    preparationTime: "25 min",
    restaurant: "Burger Joint",
  },
  {
    id: "18",
    name: "Chicken Biryani",
    price: "320",
    description: "Traditional chicken biryani with rich spices and saffron rice.",
    image: {
      uri: "https://images.unsplash.com/photo-1701579231305-d84d8af9a3fd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2hpY2tlbiUyMGJpcnlhbml8ZW58MHx8MHx8fDA%3D",
    },
    isVeg: false,
    rating: "4.7",
    preparationTime: "25 min",
    restaurant: "Burger Joint",
  },
  {
    id: "19",
    name: "Mutton Biryani",
    price: "400",
    description: "Spicy and tender mutton pieces layered with basmati rice.",
    image: {
      uri: "https://media.istockphoto.com/id/469866881/photo/mutton-gosht-biryani.webp?a=1&b=1&s=612x612&w=0&k=20&c=ceb_mB8xxyD7sipoGoO3A77TgD3_a8RTrhF3LM24ixk=",
    },
    isVeg: false,
    rating: "4.8",
    preparationTime: "30 min",
    restaurant: "Burger Joint",
  },
  {
    id: "39",
    name: "Paneer Biryani",
    price: "280",
    description: "Fragrant biryani rice with cubes of spiced paneer and vegetables.",
    image: {
      uri: "https://media.istockphoto.com/id/1393066617/photo/veg-biryani.webp?a=1&b=1&s=612x612&w=0&k=20&c=jKDUJm3f6WUNcvzygzkDGfWkCk0ecPQ_Cl0rbEQSDFg=",
    },
    isVeg: true,
    rating: "4.6",
    preparationTime: "25 min",
    restaurant: "Delicious Bites",
  },
  {
    id: "40",
    name: "Egg Biryani",
    price: "270",
    description: "Boiled eggs with aromatic basmati rice and biryani spices.",
    image: {
      uri: "https://media.istockphoto.com/id/1277579909/photo/egg-biryani.webp?a=1&b=1&s=612x612&w=0&k=20&c=08UMGiKH38MN3db5gWG7CLsrEr6nD0ENiLZuM0BhiJE=",
    },
    isVeg: false,
    rating: "4.5",
    preparationTime: "25 min",
    restaurant: "Delicious Bites",
  },
  {
    id: "41",
    name: "Fish Biryani",
    price: "350",
    description: "Marinated fish pieces layered with fragrant basmati rice.",
    image: {
      uri: "https://media.istockphoto.com/id/1334383300/photo/fish-biryani-spicy-and-delicious-malabar-biryani-or-hydrabadi-biryani-dum-biriyani.webp?a=1&b=1&s=612x612&w=0&k=20&c=ZqTAGd2qFYQHDxhmmalabar-biryani-or-hydrabadi-biryani-dum-biriyani.webp?a=1&b=1&s=612x612&w=0&k=20&c=ZqTAGd2qFYQHDxhmvWC5XSwKLIQSPEGFDOEz9wK9SEE=",
    },
    isVeg: false,
    rating: "4.7",
    preparationTime: "30 min",
    restaurant: "Delicious Bites",
  },
  {
    id: "67",
    name: "Veg Biryani",
    price: "260",
    description: "Fragrant basmati rice with assorted vegetables and saffron.",
    image: {
      uri: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8YmlyeWFuaXxlbnwwfHwwfHx8MA%3D%3D",
    },
    isVeg: true,
    rating: "4.6",
    preparationTime: "28 min",
    restaurant: "Spice Garden",
  },
  {
    id: "68",
    name: "Chicken Biryani",
    price: "340",
    description: "Dum-cooked biryani with succulent chicken pieces.",
    image: { uri: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a" },
    isVeg: false,
    rating: "4.8",
    preparationTime: "28 min",
    restaurant: "Spice Garden",
  },
  {
    id: "69",
    name: "Mutton Biryani",
    price: "420",
    description: "Premium mutton pieces slow-cooked with aged basmati rice.",
    image: {
      uri: "https://images.unsplash.com/photo-1701579231305-d84d8af9a3fd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmlyeWFuaXxlbnwwfHwwfHx8MA%3D%3D",
    },
    isVeg: false,
    rating: "4.9",
    preparationTime: "35 min",
    restaurant: "Spice Garden",
  },
  {
    id: "92",
    name: "Veg Biryani",
    price: "275",
    description: "Royal biryani with seasonal vegetables and edible silver leaf.",
    image: {
      uri: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8YmlyeWFuaXxlbnwwfHwwfHx8MA%3D%3D",
    },
    isVeg: true,
    rating: "4.7",
    preparationTime: "29 min",
    restaurant: "Sushil Palace",
  },
  {
    id: "93",
    name: "Chicken Biryani",
    price: "345",
    description: "Dum-style biryani with free-range chicken and kewra water.",
    image: { uri: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a" },
    isVeg: false,
    rating: "4.9",
    preparationTime: "29 min",
    restaurant: "Sushil Palace",
  },
  {
    id: "94",
    name: "Mutton Biryani",
    price: "425",
    description: "Premium mutton shanks slow-cooked with aged basmati rice.",
    image: {
      uri: "https://plus.unsplash.com/premium_photo-1694141252026-3df1de888a21?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8YmlyeWFuaXxlbnwwfHwwfHx8MA%3D%3D",
    },
    isVeg: false,
    rating: "5.0",
    preparationTime: "36 min",
    restaurant: "Sushil Palace",
  },

  // Burger items
  {
    id: "14",
    name: "Veg Burger",
    price: "150",
    description: "Crispy veg patty, lettuce, cheese and mayo inside a soft bun.",
    image: {
      uri: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dmVnJTIwYnVyZ2VyfGVufDB8fDB8fHww",
    },
    isVeg: true,
    rating: "4.2",
    preparationTime: "10 min",
    restaurant: "Burger Joint",
  },
  {
    id: "15",
    name: "Chicken Burger",
    price: "180",
    description: "Juicy fried chicken patty topped with cheese and sauces.",
    image: { uri: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd" },
    isVeg: false,
    rating: "4.5",
    preparationTime: "10 min",
    restaurant: "Burger Joint",
  },
  {
    id: "16",
    name: "Egg Burger",
    price: "170",
    description: "Fried egg, crispy patty, cheese, and veggies inside a burger bun.",
    image: {
      uri: "https://images.unsplash.com/photo-1609796632543-65cdda96651c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8ZWdnJTIwYnVyZ2VyfGVufDB8fDB8fHww",
    },
    isVeg: false,
    rating: "4.3",
    preparationTime: "10 min",
    restaurant: "Burger Joint",
  },
  {
    id: "37",
    name: "Cheese Burger",
    price: "200",
    description: "Double cheese patty with lettuce and special sauce in soft bun.",
    image: { uri: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd" },
    isVeg: true,
    rating: "4.6",
    preparationTime: "12 min",
    restaurant: "Delicious Bites",
  },
  {
    id: "38",
    name: "Aloo Burger",
    price: "160",
    description: "Crispy potato patty with Indian spices and veggies in burger.",
    image: {
      uri: "https://media.istockphoto.com/id/617759204/photo/steakhouse-double-bacon-cheeseburger.webp?a=1&b=1&s=612x612&w=0&k=20&c=ClO9FRiWvSfMothhoVfcdcB7CUsUPWSa-0wf38U7h3E=",
    },
    isVeg: true,
    rating: "4.3",
    preparationTime: "10 min",
    restaurant: "Delicious Bites",
  },
  {
    id: "64",
    name: "Veg Burger",
    price: "160",
    description: "Crunchy veg patty with special sauce in multigrain bun.",
    image: { uri: "https://images.unsplash.com/photo-1571091718767-18b5b1457add" },
    isVeg: true,
    rating: "4.3",
    preparationTime: "12 min",
    restaurant: "Spice Garden",
  },
  {
    id: "65",
    name: "Chicken Burger",
    price: "190",
    description: "Spicy chicken patty with coleslaw and chipotle mayo.",
    image: { uri: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd" },
    isVeg: false,
    rating: "4.6",
    preparationTime: "12 min",
    restaurant: "Spice Garden",
  },
  {
    id: "66",
    name: "Egg Burger",
    price: "180",
    description: "Double egg patty with cheese and caramelized onions.",
    image: { uri: "https://images.unsplash.com/photo-1609796632543-65cdda96651c" },
    isVeg: false,
    rating: "4.4",
    preparationTime: "12 min",
    restaurant: "Spice Garden",
  },
  {
    id: "89",
    name: "Veg Burger",
    price: "165",
    description: "Quinoa-black bean patty with avocado spread in brioche bun.",
    image: { uri: "https://images.unsplash.com/photo-1571091718767-18b5b1457add" },
    isVeg: true,
    rating: "4.4",
    preparationTime: "13 min",
    restaurant: "Sushil Palace",
  },
  {
    id: "90",
    name: "Chicken Burger",
    price: "195",
    description: "Buttermilk-fried chicken with sriracha mayo in potato bun.",
    image: { uri: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd" },
    isVeg: false,
    rating: "4.7",
    preparationTime: "13 min",
    restaurant: "Sushil Palace",
  },
  {
    id: "91",
    name: "Egg Burger",
    price: "185",
    description: "Free-range egg patty with smoked gouda and arugula.",
    image: { uri: "https://images.unsplash.com/photo-1609796632543-65cdda96651c" },
    isVeg: false,
    rating: "4.5",
    preparationTime: "13 min",
    restaurant: "Sushil Palace",
  },

  // Chowmin items
  {
    id: "11",
    name: "Chicken Chowmin",
    price: "200",
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
    id: "12",
    name: "Veg Chowmin",
    price: "180",
    description: "Flavorful fried noodles with colorful vegetables.",
    image: { uri: "https://images.unsplash.com/photo-1585032226651-759b368d7246" },
    isVeg: true,
    rating: "4.3",
    preparationTime: "15 min",
    restaurant: "Burger Joint",
  },
  {
    id: "13",
    name: "Paneer Chowmin",
    price: "220",
    description: "Crispy paneer tossed with spicy stir-fried noodles.",
    image: {
      uri: "https://media.istockphoto.com/id/1294041937/photo/vegetable-chowmein-texture-background.webp?a=1&b=1&s=612x612&w=0&k=20&c=goW6UuVNaPV61wCyeCvwpkD5Mb87QRKwrRx7M9Ohxto=",
    },
    isVeg: true,
    rating: "4.4",
    preparationTime: "15 min",
    restaurant: "Burger Joint",
  },
  {
    id: "35",
    name: "Egg Chowmin",
    price: "190",
    description: "Stir-fried noodles with scrambled eggs and fresh vegetables.",
    image: {
      uri: "https://images.unsplash.com/photo-1617622141573-2e00d8818f3f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2hvd21laW58ZW58MHx8MHx8fDA%3D",
    },
    isVeg: false,
    rating: "4.4",
    preparationTime: "15 min",
    restaurant: "Delicious Bites",
  },
  {
    id: "36",
    name: "Mushroom Chowmin",
    price: "210",
    description: "Sautéed mushrooms with noodles in light soy sauce.",
    image: {
      uri: "https://media.istockphoto.com/id/2191428492/photo/chow-mein-or-vegetable-hakka-noodles-is-a-popular-indo-chinese-dish-served-in-plate-noodles.webp?a=1&b=1&s=612x612&w=0&k=20&c=jkEt--cGrcgOZGx_l7yzaGI5FvCSM70pNbMu18rbwvc=",
    },
    isVeg: true,
    rating: "4.5",
    preparationTime: "15 min",
    restaurant: "Delicious Bites",
  },
  {
    id: "61",
    name: "Chicken Chowmin",
    price: "210",
    description: "Hakka-style noodles with shredded chicken and bean sprouts.",
    image: {
      uri: "https://images.unsplash.com/photo-1617622141675-d3005b9067c5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y2hvd21laW58ZW58MHx8MHx8fDA%3D",
    },
    isVeg: false,
    rating: "4.6",
    preparationTime: "18 min",
    restaurant: "Spice Garden",
  },
  {
    id: "62",
    name: "Veg Chowmin",
    price: "190",
    description: "Stir-fried noodles with seasonal organic vegetables.",
    image: { uri: "https://images.unsplash.com/photo-1585032226651-759b368d7246" },
    isVeg: true,
    rating: "4.4",
    preparationTime: "18 min",
    restaurant: "Spice Garden",
  },
  {
    id: "63",
    name: "Paneer Chowmin",
    price: "230",
    description: "Tandoori paneer cubes with schezwan flavored noodles.",
    image: {
      uri: "https://images.unsplash.com/photo-1585503913867-f3382c5d1122?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y2hvd21laW58ZW58MHx8MHx8fDA%3D",
    },
    isVeg: true,
    rating: "4.5",
    preparationTime: "18 min",
    restaurant: "Spice Garden",
  },
  {
    id: "86",
    name: "Chicken Chowmin",
    price: "215",
    description: "Wok-tossed noodles with free-range chicken and seasonal vegetables.",
    image: {
      uri: "https://images.unsplash.com/photo-1617622141675-d3005b9067c5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y2hvd21laW58ZW58MHx8MHx8fDA%3D",
    },
    isVeg: false,
    rating: "4.7",
    preparationTime: "19 min",
    restaurant: "Sushil Palace",
  },
  {
    id: "87",
    name: "Veg Chowmin",
    price: "195",
    description: "Organic vegetable chowmein with house-made sauce.",
    image: { uri: "https://images.unsplash.com/photo-1585032226651-759b368d7246" },
    isVeg: true,
    rating: "4.5",
    preparationTime: "19 min",
    restaurant: "Sushil Palace",
  },
  {
    id: "88",
    name: "Paneer Chowmin",
    price: "235",
    description: "Homemade paneer with spicy schezwan noodles and bell peppers.",
    image: {
      uri: "https://images.unsplash.com/photo-1585503913867-f3382c5d1122?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y2hvd21laW58ZW58MHx8MHx8fDA%3D",
    },
    isVeg: true,
    rating: "4.6",
    preparationTime: "19 min",
    restaurant: "Sushil Palace",
  },

  // Butter Chicken
]


const CategoryItems = () => {
  const route = useRoute<RouteProp<RootStackParamList, "CategoryItems">>()
  const { categoryName } = route.params
  const navigation = useNavigation<NavigationProp<RootStackParamList>>()
  const [filteredItems, setFilteredItems] = useState<FoodItem[]>([])
  const [initialItems, setInitialItems] = useState<FoodItem[]>([])
  const [selectedSubtype, setSelectedSubtype] = useState<string>("All")
  const [activeTab, setActiveTab] = useState<string>("Item")

  // Get category-specific subtypes
  const getSubtypes = useCallback((category: string): string[] => {
    switch (category.toLowerCase()) {
      case "momo":
        return ["All", "Buff", "Mutton", "Steam", "Fry", "Jhol", "Chilly", "Pork"]
      case "pizza":
        return ["All", "Veg", "Chicken", "Paneer", "Mushroom", "Cheese", "Pepperoni"]
      case "burger":
        return ["All", "Veg", "Chicken", "Cheese", "Egg", "Aloo"]
      case "chowmin":
        return ["All", "Veg", "Chicken", "Egg", "Paneer", "Mushroom"]
      case "biryani":
        return ["All", "Veg", "Chicken", "Mutton", "Egg", "Fish", "Paneer"]
      default:
        return ["All"]
    }
  }, [])

  const subtypes = getSubtypes(categoryName)

  useEffect(() => {
    // Filter items based on category name
    let filtered: FoodItem[] = []

    if (categoryName.toLowerCase() === "momo") {
      filtered = allFoodItems.filter((item) => item.name.toLowerCase().includes("momo"))
    } else if (categoryName.toLowerCase() === "pizza") {
      filtered = allFoodItems.filter((item) => item.name.toLowerCase().includes("pizza"))
    } else if (categoryName.toLowerCase() === "chowmin") {
      filtered = allFoodItems.filter((item) => item.name.toLowerCase().includes("chowmin"))
    } else if (categoryName.toLowerCase() === "burger") {
      filtered = allFoodItems.filter((item) => item.name.toLowerCase().includes("burger"))
    } else if (categoryName.toLowerCase() === "biryani") {
      filtered = allFoodItems.filter((item) => item.name.toLowerCase().includes("biryani"))
    } else {
      // Default fallback for other categories
      filtered = allFoodItems.filter((item) => item.name.toLowerCase().includes(categoryName.toLowerCase()))
    }

    setInitialItems(filtered)
    setFilteredItems(filtered)
  }, [categoryName])

  useEffect(() => {
    let result = [...initialItems]

    // Apply subtype filter
    if (selectedSubtype !== "All") {
      result = result.filter((item: FoodItem) => item.name.toLowerCase().includes(selectedSubtype.toLowerCase()))
    }

    setFilteredItems(result)
  }, [initialItems, selectedSubtype])

  const renderFoodItem = ({ item }: { item: FoodItem }) => {
    // Prepare favorite item data with proper type handling
    const favoriteItem = {
      id: item.id,
      name: item.name,
      price: item.price,
      description: item.description,
      image: { uri: getImageUri(item.image) }, // Use helper function to ensure string type
      isVeg: item.isVeg,
      rating: item.rating,
      preparationTime: item.preparationTime,
      restaurant: item.restaurant,
    }

    return (
      <TouchableOpacity
        style={styles.foodCard}
        onPress={() =>
          navigation.navigate("FoodItemDetail", {
            item,
            restaurantName: item.restaurant,
          })
        }
      >
        <Image source={item.image} style={styles.foodImage} />

        {/* Favorite Button */}
        <View style={styles.favoriteButtonContainer}>
          <FavoriteButton item={favoriteItem} size={20} />
        </View>

        <View style={styles.foodInfo}>
          <View style={styles.foodHeader}>
            <Text style={styles.foodName} numberOfLines={1}>
              {item.name}
            </Text>
            <View style={[styles.vegBadge, { backgroundColor: item.isVeg ? "#0f8a0f" : "#b30000" }]}>
              <Text style={styles.vegBadgeText}>{item.isVeg ? "VEG" : "NON-VEG"}</Text>
            </View>
          </View>
          <Text style={styles.restaurantName} numberOfLines={1}>
            {item.restaurant}
          </Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>
              {"★".repeat(Math.floor(Number.parseFloat(item.rating)))}
              {"☆".repeat(5 - Math.floor(Number.parseFloat(item.rating)))}
            </Text>
            <Text style={styles.ratingCount}>{item.rating}</Text>
          </View>
          <Text style={styles.price}>Rs. {item.price}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Icon name="search-off" size={50} color="red" />
      <Text style={styles.emptyText}>No {categoryName} items found</Text>
      <Text style={styles.emptySubtext}>Try another category or adjust filters</Text>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{categoryName.toUpperCase()}</Text>
      </View>

      {/* Subtype filter chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.subtypeScrollView}>
        {subtypes.map((type: string) => (
          <TouchableOpacity
            key={type}
            style={[styles.subtypeChip, selectedSubtype === type && styles.selectedSubtypeChip]}
            onPress={() => setSelectedSubtype(type)}
          >
            <Text style={[styles.subtypeText, selectedSubtype === type && styles.selectedSubtypeText]}>{type}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "Item" && styles.activeTab]}
          onPress={() => setActiveTab("Item")}
        >
          <Text style={[styles.tabText, activeTab === "Item" && styles.activeTabText]}>Item</Text>
          {activeTab === "Item" && <View style={styles.activeTabIndicator} />}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "Restaurants" && styles.activeTab]}
          onPress={() => setActiveTab("Restaurants")}
        >
          <Text style={[styles.tabText, activeTab === "Restaurants" && styles.activeTabText]}>Restaurants</Text>
          {activeTab === "Restaurants" && <View style={styles.activeTabIndicator} />}
        </TouchableOpacity>
      </View>

      {/* Food Items List */}
      <FlatList
        data={filteredItems}
        renderItem={renderFoodItem}
        keyExtractor={(item: FoodItem) => item.id}
        numColumns={2}
        contentContainerStyle={[styles.listContainer, filteredItems.length === 0 && styles.emptyListContainer]}
        ListEmptyComponent={renderEmptyList}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  subtypeScrollView: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 10,
    maxHeight: 70,
  },
  subtypeChip: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedSubtypeChip: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "red",
    height: 36,
  },
  subtypeText: {
    fontSize: 14,
    color: "#666",
  },
  selectedSubtypeText: {
    color: "red",
    fontWeight: "600",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  tab: {
    paddingVertical: 20,
    marginRight: 30,
    position: "relative",
  },
  activeTab: {},
  tabText: {
    fontSize: 16,
    color: "#999",
  },
  activeTabText: {
    color: "red",
    fontWeight: "bold",
  },
  activeTabIndicator: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: "red",
  },
  listContainer: {
    padding: 10,
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  foodCard: {
    flex: 1,
    margin: 5,
    backgroundColor: "white",
    borderRadius: 8,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    position: "relative",
  },
  foodImage: {
    width: "100%",
    height: 120,
    resizeMode: "cover",
  },
  favoriteButtonContainer: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 1,
  },
  foodInfo: {
    padding: 10,
  },
  foodHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  foodName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  vegBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  vegBadgeText: {
    color: "white",
    fontSize: 9,
    fontWeight: "bold",
  },
  restaurantName: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  rating: {
    fontSize: 14,
    color: "#FFD700",
  },
  ratingCount: {
    fontSize: 12,
    color: "#999",
    marginLeft: 5,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
})

export default CategoryItems
