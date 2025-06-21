"use client"

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
  TouchableOpacity,
  Image,
  Alert,
  RefreshControl,
  Animated,
  Dimensions,
  SafeAreaView,
  ScrollView,
  FlatList,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useCart } from "../components/CartContext";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useTranslation } from 'react-i18next';
import type { NavigationProp } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

// Types
interface FavoriteItem {
  id: string;
  name: string;
  price: string;
  description: string;
  image: { uri: string };
  isVeg: boolean;
  rating: string;
  preparationTime: string;
  restaurant: string;
  dateAdded: string;
}

type RootStackParamList = {
  FoodItemDetail: {
    item: {
      id: string;
      name: string;
      price: string;
      description: string;
      image: { uri: string };
      isVeg: boolean;
      rating: string;
      preparationTime: string;
    };
    restaurantName?: string;
  };
  Home: undefined;
  Cart: undefined;
};

type FilterType = "all" | "veg" | "non-veg";
type SortType = "recent" | "name" | "price";

const FavoritesScreen = () => {
  // State management
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<FilterType>("all");
  const [sortBy, setSortBy] = useState<SortType>("recent");
  
  // Hooks
  const { addToCart } = useCart();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { t } = useTranslation();
  const fadeAnim = new Animated.Value(0);

  // Load favorites from AsyncStorage with enhanced error handling
  const loadFavorites = useCallback(async () => {
    try {
      const savedFavorites = await AsyncStorage.getItem("favorites");
      
      if (savedFavorites) {
        const parsedFavorites = JSON.parse(savedFavorites) as FavoriteItem[];
        
        // Validate and sanitize data
        const validatedFavorites = parsedFavorites.map(item => ({
          ...item,
          image: {
            uri: item.image?.uri && typeof item.image.uri === 'string' && item.image.uri.trim() !== '' 
              ? item.image.uri 
              : "https://via.placeholder.com/300x200/cccccc/666666?text=Food+Image"
          }
        }));
        
        setFavorites(validatedFavorites);
      } else {
        setFavorites([]);
      }
    } catch (error) {
      console.error("Failed to load favorites:", error);
      Alert.alert(t('common.error'), t('favorites.failedToLoad'));
      setFavorites([]);
    } finally {
      setLoading(false);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [t]);

  // Filter and sort favorites
  const filteredAndSortedFavorites = useMemo(() => {
    let filtered = [...favorites];
    
    // Apply filter
    if (filter === "veg") {
      filtered = filtered.filter(item => item.isVeg);
    } else if (filter === "non-veg") {
      filtered = filtered.filter(item => !item.isVeg);
    }
    
    // Apply sorting
    switch (sortBy) {
      case "name":
        return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
      case "price":
        return [...filtered].sort((a, b) => Number.parseFloat(a.price) - Number.parseFloat(b.price));
      case "recent":
      default:
        return [...filtered].sort((a, b) => 
          new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
        );
    }
  }, [favorites, filter, sortBy]);

  // Clear all favorites
  const clearAllFavorites = async () => {
    Alert.alert(
      t('favorites.clearAllFavorites'),
      t('favorites.clearAllConfirm'),
      [
        { text: t('common.cancel'), style: "cancel" },
        {
          text: t('favorites.clearAll'),
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem("favorites");
              setFavorites([]);
            } catch (error) {
              console.error("Error clearing favorites:", error);
            }
          },
        },
      ]
    );
  };

  // Remove single item from favorites
  const removeFromFavorites = async (itemId: string) => {
    Alert.alert(
      t('favorites.removeFromFavorites'),
      t('favorites.removeConfirm'),
      [
        { text: t('common.cancel'), style: "cancel" },
        {
          text: t('common.remove'),
          style: "destructive",
          onPress: async () => {
            try {
              const updatedFavorites = favorites.filter(item => item.id !== itemId);
              setFavorites(updatedFavorites);
              await AsyncStorage.setItem("favorites", JSON.stringify(updatedFavorites));
            } catch (error) {
              console.error("Failed to remove from favorites:", error);
            }
          },
        },
      ]
    );
  };

  // Add item to cart
  const handleAddToCart = (item: FavoriteItem) => {
    const cartItem = {
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      description: item.description,
      tag: item.isVeg ? t('favorites.veg') : t('favorites.nonVeg'),
      rating: Number.parseFloat(item.rating),
      restaurantName: item.restaurant,
    };
    
    addToCart(cartItem);
    Alert.alert(
      t('favorites.addedToCart'), 
      t('favorites.addedToCartMessage', { itemName: item.name })
    );
  };

  // Navigate to food detail screen
  const navigateToDetail = (item: FavoriteItem) => {
    navigation.navigate("FoodItemDetail", {
      item: {
        id: item.id,
        name: item.name,
        price: item.price,
        description: item.description,
        image: item.image,
        isVeg: item.isVeg,
        rating: item.rating,
        preparationTime: item.preparationTime,
      },
      restaurantName: item.restaurant,
    });
  };

  // Refresh handler
  const onRefresh = async () => {
    setRefreshing(true);
    await loadFavorites();
    setRefreshing(false);
  };

  // Load favorites when screen focuses
  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [loadFavorites])
  );

  // Get filter label with count
  const getFilterLabel = (type: FilterType) => {
    const counts = {
      all: favorites.length,
      veg: favorites.filter(i => i.isVeg).length,
      'non-veg': favorites.filter(i => !i.isVeg).length
    };
    
    const labels = {
      all: t('favorites.all'),
      veg: t('favorites.veg'),
      'non-veg': t('favorites.nonVeg')
    };
    
    return `${labels[type]} (${counts[type]})`;
  };

  // Get sort label
  const getSortLabel = (type: SortType) => {
    const labels = {
      recent: t('favorites.recent'),
      name: t('favorites.name'),
      price: t('favorites.price')
    };
    return labels[type];
  };

  // Render filter buttons
  const renderFilterButtons = () => (
    <View style={styles.filterContainer}>
      {(["all", "veg", "non-veg"] as FilterType[]).map((type) => (
        <TouchableOpacity
          key={type}
          style={[
            styles.filterButton,
            filter === type && styles.activeFilter,
            type === "veg" && { borderColor: "#0f8a0f" },
            type === "non-veg" && { borderColor: "#b30000" },
          ]}
          onPress={() => setFilter(type)}
        >
          <MaterialIcons
            name={
              type === "all" ? "restaurant" :
              type === "veg" ? "eco" : "local-dining"
            }
            size={16}
            color={filter === type ? "white" : 
                  type === "veg" ? "#0f8a0f" : 
                  type === "non-veg" ? "#b30000" : "#666"}
          />
          <Text style={[
            styles.filterText,
            filter === type && styles.activeFilterText,
            type === "veg" && filter !== type && { color: "#0f8a0f" },
            type === "non-veg" && filter !== type && { color: "#b30000" },
          ]}>
            {getFilterLabel(type)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  // Render sort options
  const renderSortOptions = () => (
    <View style={styles.sortContainer}>
      <Text style={styles.sortLabel}>{t('favorites.sortBy')}</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.sortButtonsContainer}
      >
        {(["recent", "name", "price"] as SortType[]).map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.sortButton,
              sortBy === type && styles.activeSortButton,
            ]}
            onPress={() => setSortBy(type)}
          >
            <Text style={[
              styles.sortButtonText,
              sortBy === type && styles.activeSortButtonText,
            ]}>
              {getSortLabel(type)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  // Render favorite item
  const renderFavoriteItem = ({ item }: { item: FavoriteItem }) => (
    <View style={styles.favoriteItem}>
      <TouchableOpacity
        style={styles.itemContent}
        onPress={() => navigateToDetail(item)}
        activeOpacity={0.8}
      >
        <Image 
          source={item.image} 
          style={styles.itemImage}
          resizeMode="cover"
          defaultSource={{ uri: "https://via.placeholder.com/300x200/cccccc/666666?text=Loading..." }}
        />
        
        <View style={styles.itemDetails}>
          <View style={styles.itemHeader}>
            <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
            <View style={[
              styles.vegBadge,
              { backgroundColor: item.isVeg ? "#0f8a0f" : "#b30000" }
            ]}>
              <Text style={styles.vegBadgeText}>
                {item.isVeg ? t('favorites.veg').toUpperCase() : t('favorites.nonVeg').toUpperCase()}
              </Text>
            </View>
          </View>
          
          <View style={styles.restaurantRow}>
            <MaterialIcons name="restaurant" size={12} color="#FF3F00" />
            <Text style={styles.restaurantName} numberOfLines={1}>
              {item.restaurant}
            </Text>
          </View>
          
          <Text style={styles.itemDescription} numberOfLines={2}>
            {item.description}
          </Text>
          
          <View style={styles.metaRow}>
            <Text style={styles.itemPrice}>Rs. {item.price}</Text>
            <View style={styles.ratingContainer}>
              <MaterialIcons name="star" size={14} color="#FFD700" />
              <Text style={styles.ratingText}>{item.rating}</Text>
            </View>
            <View style={styles.timeContainer}>
              <MaterialIcons name="access-time" size={12} color="#666" />
              <Text style={styles.timeText}>{item.preparationTime}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
      
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.removeButton}
          onPress={() => removeFromFavorites(item.id)}
        >
          <MaterialIcons name="delete" size={16} color="white" />
          <Text style={styles.buttonText}>{t('common.remove')}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.addToCartButton}
          onPress={() => handleAddToCart(item)}
        >
          <MaterialIcons name="shopping-cart" size={16} color="white" />
          <Text style={styles.buttonText}>{t('common.addToCart')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Render empty state
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcons name="favorite-border" size={80} color="#ccc" />
      <Text style={styles.emptyTitle}>{t('favorites.empty')}</Text>
      <Text style={styles.emptySubtitle}>
        {t('favorites.emptySubtitle')}
      </Text>
      <TouchableOpacity 
        style={styles.exploreButton}
        onPress={() => navigation.navigate("Home")}
      >
        <Text style={styles.exploreButtonText}>{t('favorites.exploreFood')}</Text>
      </TouchableOpacity>
    </View>
  );

  // Loading state
  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t('favorites.title')}</Text>
        </View>
        <View style={styles.loadingContainer}>
          <MaterialIcons name="favorite" size={50} color="#FF3F00" />
          <Text style={styles.loadingText}>{t('favorites.loadingFavorites')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('favorites.title')}</Text>
        {favorites.length > 0 && (
          <TouchableOpacity onPress={clearAllFavorites}>
            <MaterialIcons name="delete-sweep" size={24} color="white" />
          </TouchableOpacity>
        )}
      </View>

      {/* Content */}
      {favorites.length === 0 ? (
        renderEmptyState()
      ) : (
        <>
          {/* Filter and Sort Controls */}
          {renderFilterButtons()}
          {renderSortOptions()}
          
          {/* Favorites List */}
          <FlatList
            data={filteredAndSortedFavorites}
            renderItem={renderFavoriteItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={["#FF3F00"]}
                tintColor="#FF3F00"
              />
            }
            ListFooterComponent={<View style={styles.listFooter} />}
          />
          
          {/* Summary Footer */}
          <View style={styles.summaryFooter}>
            <Text style={styles.summaryText}>
              {t('favorites.showingItems', { 
                count: filteredAndSortedFavorites.length, 
                total: favorites.length 
              })}
            </Text>
            <TouchableOpacity 
              style={styles.continueShoppingButton}
              onPress={() => navigation.navigate("Home")}
            >
              <Text style={styles.continueShoppingText}>{t('favorites.continueShopping')}</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

// Styles remain the same as the original
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#FF3F00",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  filterButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  activeFilter: {
    backgroundColor: "#FF3F00",
    borderColor: "#FF3F00",
  },
  filterText: {
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 6,
  },
  activeFilterText: {
    color: "white",
    fontWeight: "600",
  },
  sortContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  sortLabel: {
    fontSize: 14,
    color: "#666",
    marginRight: 12,
  },
  sortButtonsContainer: {
    flexGrow: 1,
  },
  sortButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    borderRadius: 15,
    backgroundColor: "#f5f5f5",
  },
  activeSortButton: {
    backgroundColor: "#FF3F00",
  },
  sortButtonText: {
    fontSize: 12,
    color: "#666",
  },
  activeSortButtonText: {
    color: "white",
    fontWeight: "600",
  },
  listContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  favoriteItem: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  itemContent: {
    flexDirection: "row",
    padding: 12,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
    marginRight: 8,
  },
  vegBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  vegBadgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  restaurantRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  restaurantName: {
    fontSize: 12,
    color: "#FF3F00",
    fontWeight: "600",
    marginLeft: 4,
  },
  itemDescription: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF3F00",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 12,
    color: "#333",
    fontWeight: "600",
    marginLeft: 4,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },
  actionButtons: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  removeButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#ff3b30",
  },
  addToCartButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#0f8a0f",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
    marginLeft: 6,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  exploreButton: {
    backgroundColor: "#FF3F00",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 25,
  },
  exploreButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
    marginTop: 16,
  },
  listFooter: {
    height: 16,
  },
  summaryFooter: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryText: {
    fontSize: 14,
    color: "#666",
  },
  continueShoppingButton: {
    backgroundColor: "#FF3F00",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  continueShoppingText: {
    color: "white",
    fontWeight: "600",
  },
});

export default FavoritesScreen;