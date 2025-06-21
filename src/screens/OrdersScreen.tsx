"use client"

import React, { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Image,
  StatusBar,
  Platform,
  Animated,
  RefreshControl,
  ActivityIndicator,
  Dimensions,
  Modal,
  Easing,
  ScrollView,
} from "react-native"
import { useOrders } from "../components/OrderContext"
import { useColorScheme } from "react-native"
import Icon from "react-native-vector-icons/MaterialIcons"
import { useNavigation } from "@react-navigation/native"
import { useTranslation } from 'react-i18next'

// Define types for the order items and orders
interface OrderItem {
  id: string
  name: string
  price: string
  quantity: number
  image: any
}

interface Order {
  id: string
  date: string
  status: string
  items: OrderItem[]
  total: number
  restaurant?: string
  deliveryAddress?: string
  paymentMethod?: string
}

// Filter options for orders
type FilterOption = "all" | "pending" | "delivered" | "cancelled"

const OrdersScreen = () => {
  const { orders, cancelOrder } = useOrders()
  const colorScheme = useColorScheme()
  const isDarkMode = colorScheme === "dark"
  const navigation = useNavigation()
  const { t } = useTranslation()

  // State for animations, filtering, and loading
  const [refreshing, setRefreshing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>("all")
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(orders)
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null)
  const fadeAnim = React.useRef(new Animated.Value(0)).current
  const screenWidth = Dimensions.get("window").width
  const [trackingModalVisible, setTrackingModalVisible] = useState(false)
  const [currentTrackedOrder, setCurrentTrackedOrder] = useState<Order | null>(null)
  const trackingAnimation = React.useRef(new Animated.Value(0)).current

  // Apply filters when selected filter changes
  useEffect(() => {
    if (selectedFilter === "all") {
      setFilteredOrders(orders)
    } else {
      setFilteredOrders(orders.filter((order) => order.status.toLowerCase() === selectedFilter))
    }

    // Animate the content fade-in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start()
  }, [selectedFilter, orders])

  // Function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Function to get status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "#FF9800"
      case "delivered":
        return "#4CAF50"
      case "cancelled":
        return "#F44336"
      case "processing":
        return "#2196F3"
      default:
        return "#757575"
    }
  }

  // Function to get translated status
  const getTranslatedStatus = (status: string) => {
    const statusKey = status.toLowerCase()
    return t(`orders.status.${statusKey}`, status)
  }

  // Function to handle order cancellation with confirmation
  const handleCancelOrder = (orderId: string) => {
    setLoading(true)
    setTimeout(() => {
      cancelOrder(orderId)
      setLoading(false)
    }, 800)
  }

  // Function to handle reorder
  const handleReorder = (order: Order) => {
    console.log("Reordering items from order:", order.id)
  }

  // Function to handle pull-to-refresh
  const onRefresh = React.useCallback(() => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
    }, 1500)
  }, [])

  // Toggle expanded order details
  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId)
  }

  // Render filter tabs
  const renderFilterTabs = () => (
    <View style={styles.filterContainer}>
      <ScrollableFilterTabs
        selectedFilter={selectedFilter}
        onSelectFilter={setSelectedFilter}
        isDarkMode={isDarkMode}
      />
    </View>
  )

  // Render empty state
  const renderEmptyState = () => (
    <Animated.View style={[styles.emptyContainer, { opacity: fadeAnim }]}>
      <Icon name="receipt-long" size={80} color={isDarkMode ? "#555" : "#ddd"} />
      <Text style={[styles.emptyTitle, isDarkMode && styles.darkText]}>
        {t('orders.empty')}
      </Text>
      <Text style={[styles.emptySubtitle, isDarkMode && styles.darkSubText]}>
        {t('orders.emptySubtitle')}
      </Text>
      <TouchableOpacity 
        style={styles.browseButton} 
        onPress={() => navigation.navigate("Home" as never)}
      >
        <Text style={styles.browseButtonText}>{t('orders.browseRestaurants')}</Text>
      </TouchableOpacity>
    </Animated.View>
  )

  // Function to handle tracking order
  const handleTrackOrder = (order: Order) => {
    setCurrentTrackedOrder(order)
    setTrackingModalVisible(true)

    trackingAnimation.setValue(0)
    Animated.timing(trackingAnimation, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: false,
      easing: Easing.linear,
    }).start()
  }

  // Render individual order item
  const renderOrderItem = ({ item, index }: { item: Order; index: number }) => {
    const isExpanded = expandedOrderId === item.id

    return (
      <Animated.View
        style={[
          styles.orderCard,
          isDarkMode && styles.darkOrderCard,
          index === filteredOrders.length - 1 && styles.lastOrderCard,
          { opacity: fadeAnim },
        ]}
      >
        <TouchableOpacity 
          style={styles.orderHeader} 
          onPress={() => toggleOrderDetails(item.id)} 
          activeOpacity={0.7}
        >
          <View>
            <Text style={[styles.orderDate, isDarkMode && styles.darkText]}>
              {formatDate(item.date)}
            </Text>
            <Text style={[styles.orderId, isDarkMode && styles.darkSubText]}>
              {t('orders.orderNumber', { number: item.id.slice(-6) })}
            </Text>
          </View>
          <View style={styles.headerRight}>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + "20" }]}>
              <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                {getTranslatedStatus(item.status)}
              </Text>
            </View>
            <Icon
              name={isExpanded ? "keyboard-arrow-up" : "keyboard-arrow-down"}
              size={24}
              color={isDarkMode ? "#aaa" : "#777"}
              style={styles.expandIcon}
            />
          </View>
        </TouchableOpacity>

        {item.restaurant && (
          <View style={styles.restaurantRow}>
            <Icon name="store" size={16} color={isDarkMode ? "#aaa" : "#777"} />
            <Text style={[styles.restaurantName, isDarkMode && styles.darkSubText]}>
              {item.restaurant}
            </Text>
          </View>
        )}

        <View style={styles.orderItems}>
          {item.items.slice(0, isExpanded ? item.items.length : 2).map((orderItem: OrderItem, idx: number) => (
            <View key={orderItem.id} style={styles.orderItem}>
              <Image source={orderItem.image} style={styles.itemImage} />
              <View style={styles.itemDetails}>
                <Text style={[styles.itemName, isDarkMode && styles.darkText]}>
                  {orderItem.name}
                </Text>
                <View style={styles.itemPriceRow}>
                  <Text style={[styles.itemPrice, isDarkMode && styles.darkSubText]}>
                    {orderItem.price}
                  </Text>
                  <Text style={[styles.itemQuantity, isDarkMode && styles.darkSubText]}>
                    × {orderItem.quantity}
                  </Text>
                </View>
              </View>
            </View>
          ))}
          {!isExpanded && item.items.length > 2 && (
            <TouchableOpacity 
              style={styles.viewMoreButton} 
              onPress={() => toggleOrderDetails(item.id)}
            >
              <Text style={[styles.viewMoreText, isDarkMode && styles.darkAccentText]}>
                {t('orders.moreItems', { count: item.items.length - 2 })}
              </Text>
              <Icon name="keyboard-arrow-down" size={16} color={isDarkMode ? "#FF5722" : "#FF3F00"} />
            </TouchableOpacity>
          )}
        </View>

        {isExpanded && (
          <View style={styles.expandedDetails}>
            {item.deliveryAddress && (
              <View style={styles.detailRow}>
                <Icon name="location-on" size={16} color={isDarkMode ? "#aaa" : "#777"} />
                <Text style={[styles.detailText, isDarkMode && styles.darkSubText]}>
                  {item.deliveryAddress}
                </Text>
              </View>
            )}

            {item.paymentMethod && (
              <View style={styles.detailRow}>
                <Icon name="payment" size={16} color={isDarkMode ? "#aaa" : "#777"} />
                <Text style={[styles.detailText, isDarkMode && styles.darkSubText]}>
                  {t('orders.paidVia', { method: item.paymentMethod })}
                </Text>
              </View>
            )}
          </View>
        )}

        <View style={styles.orderFooter}>
          <View>
            <Text style={[styles.totalLabel, isDarkMode && styles.darkSubText]}>
              {t('common.total')}
            </Text>
            <Text style={[styles.totalAmount, isDarkMode && styles.darkText]}>
              Rs.{item.total.toFixed(2)}
            </Text>
          </View>

          <View style={styles.actionButtons}>
            {item.status.toLowerCase() === "pending" && (
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => handleCancelOrder(item.id)}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#F44336" />
                ) : (
                  <Text style={styles.cancelButtonText}>{t('orders.cancelOrder')}</Text>
                )}
              </TouchableOpacity>
            )}

            {item.status.toLowerCase() === "delivered" && (
              <TouchableOpacity style={styles.reorderButton} onPress={() => handleReorder(item)}>
                <Icon name="replay" size={14} color="#fff" style={styles.buttonIcon} />
                <Text style={styles.reorderButtonText}>{t('orders.reorder')}</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.trackButton, item.status.toLowerCase() === "delivered" && styles.rateButton]}
              onPress={() =>
                item.status.toLowerCase() === "delivered"
                  ? console.log("Navigate to rate order", item.id)
                  : handleTrackOrder(item)
              }
            >
              <Icon
                name={item.status.toLowerCase() === "delivered" ? "star" : "local-shipping"}
                size={14}
                color="#FF3F00"
                style={styles.buttonIcon}
              />
              <Text style={styles.trackButtonText}>
                {item.status.toLowerCase() === "delivered" ? t('orders.rateOrder') : t('orders.trackOrder')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    )
  }

  // Render order tracking modal
  const renderTrackingModal = () => {
    if (!currentTrackedOrder) return null

    const status = currentTrackedOrder.status.toLowerCase()
    const isCancelled = status === "cancelled"
    const isPending = status === "pending"
    const isProcessing = status === "processing"
    const isOnTheWay = status === "on the way"
    const isDelivered = status === "delivered"

    // Calculate progress based on status
    let progressValue = 0
    if (isPending || isProcessing) progressValue = 1
    if (isOnTheWay) progressValue = 2
    if (isDelivered) progressValue = 3

    // Animation interpolations
    const progressWidth = trackingAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: ["0%", `${(progressValue / 3) * 100}%`],
    })

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={trackingModalVisible}
        onRequestClose={() => setTrackingModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.trackingModalContent, isDarkMode && styles.darkTrackingModalContent]}>
            <View style={styles.trackingModalHeader}>
              <Text style={[styles.trackingModalTitle, isDarkMode && styles.darkText]}>
                {isCancelled ? t('orders.orderCancelled') : t('orders.orderStatus')}
              </Text>
              <TouchableOpacity onPress={() => setTrackingModalVisible(false)}>
                <Icon name="close" size={24} color={isDarkMode ? "#fff" : "#333"} />
              </TouchableOpacity>
            </View>

            <View style={styles.orderInfoCard}>
              <Text style={[styles.orderInfoTitle, isDarkMode && styles.darkText]}>
                {t('orders.orderNumber', { number: currentTrackedOrder.id.slice(-6) })}
              </Text>
              <Text style={[styles.orderInfoDate, isDarkMode && styles.darkSubText]}>
                {formatDate(currentTrackedOrder.date)}
              </Text>
              {currentTrackedOrder.restaurant && (
                <View style={styles.orderInfoRow}>
                  <Icon name="store" size={16} color={isDarkMode ? "#aaa" : "#777"} />
                  <Text style={[styles.orderInfoText, isDarkMode && styles.darkSubText]}>
                    {currentTrackedOrder.restaurant}
                  </Text>
                </View>
              )}
              <View style={styles.orderInfoRow}>
                <Icon name="receipt" size={16} color={isDarkMode ? "#aaa" : "#777"} />
                <Text style={[styles.orderInfoText, isDarkMode && styles.darkSubText]}>
                  {currentTrackedOrder.items.length} {t('orders.items')} · Rs.{currentTrackedOrder.total.toFixed(2)}
                </Text>
              </View>
            </View>

            {isCancelled ? (
              <View style={styles.cancelledContainer}>
                <View style={styles.cancelledIconContainer}>
                  <Icon name="cancel" size={60} color="#F44336" />
                </View>
                <Text style={styles.cancelledTitle}>{t('orders.orderCancelled')}</Text>
                <Text style={styles.cancelledMessage}>{t('orders.orderCancelledMessage')}</Text>
                <View style={styles.cancelledDetails}>
                  <Text style={[styles.cancelledLabel, isDarkMode && styles.darkSubText]}>
                    {t('orders.cancellationDate')}
                  </Text>
                  <Text style={[styles.cancelledValue, isDarkMode && styles.darkText]}>
                    {formatDate(currentTrackedOrder.date)}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.reorderCancelledButton}
                  onPress={() => {
                    setTrackingModalVisible(false)
                    handleReorder(currentTrackedOrder)
                  }}
                >
                  <Icon name="replay" size={16} color="#fff" style={styles.buttonIcon} />
                  <Text style={styles.reorderCancelledButtonText}>{t('orders.reorderItems')}</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <View style={styles.trackingContainer}>
                  <View style={styles.trackingProgressContainer}>
                    <Animated.View style={[styles.trackingProgressBar, { width: progressWidth }]} />
                  </View>

                  <View style={styles.trackingSteps}>
                    <View style={styles.trackingStep}>
                      <View style={[styles.trackingStepCircle, progressValue >= 1 && styles.activeTrackingStep]}>
                        <Icon
                          name="restaurant"
                          size={18}
                          color={progressValue >= 1 ? "#fff" : isDarkMode ? "#555" : "#ccc"}
                        />
                      </View>
                      <Text
                        style={[
                          styles.trackingStepText,
                          progressValue >= 1 && styles.activeTrackingStepText,
                          isDarkMode && styles.darkText,
                        ]}
                      >
                        {isPending ? t('orders.status.pending') : t('orders.status.processing')}
                      </Text>
                      {progressValue === 1 && (
                        <Text style={styles.currentStatusText}>
                          {isPending ? t('orders.tracking.pending') : t('orders.tracking.preparing')}
                        </Text>
                      )}
                    </View>

                    <View style={styles.trackingStep}>
                      <View style={[styles.trackingStepCircle, progressValue >= 2 && styles.activeTrackingStep]}>
                        <Icon
                          name="delivery-dining"
                          size={18}
                          color={progressValue >= 2 ? "#fff" : isDarkMode ? "#555" : "#ccc"}
                        />
                      </View>
                      <Text
                        style={[
                          styles.trackingStepText,
                          progressValue >= 2 && styles.activeTrackingStepText,
                          isDarkMode && styles.darkText,
                        ]}
                      >
                        {t('orders.status.onTheWay')}
                      </Text>
                      {progressValue === 2 && (
                        <Text style={styles.currentStatusText}>
                          {t('orders.tracking.onTheWay')}
                        </Text>
                      )}
                    </View>

                    <View style={styles.trackingStep}>
                      <View style={[styles.trackingStepCircle, progressValue >= 3 && styles.activeTrackingStep]}>
                        <Icon
                          name="check-circle"
                          size={18}
                          color={progressValue >= 3 ? "#fff" : isDarkMode ? "#555" : "#ccc"}
                        />
                      </View>
                      <Text
                        style={[
                          styles.trackingStepText,
                          progressValue >= 3 && styles.activeTrackingStepText,
                          isDarkMode && styles.darkText,
                        ]}
                      >
                        {t('orders.status.delivered')}
                      </Text>
                      {progressValue === 3 && (
                        <Text style={styles.currentStatusText}>
                          {t('orders.tracking.delivered')}
                        </Text>
                      )}
                    </View>
                  </View>
                </View>

                <View style={styles.deliveryInfoContainer}>
                  <Text style={[styles.deliveryInfoTitle, isDarkMode && styles.darkText]}>
                    {t('orders.deliveryDetails')}
                  </Text>

                  <View style={styles.deliveryInfoCard}>
                    <View style={styles.deliveryInfoRow}>
                      <Icon name="access-time" size={20} color="#FF3F00" />
                      <View style={styles.deliveryInfoTextContainer}>
                        <Text style={[styles.deliveryInfoLabel, isDarkMode && styles.darkSubText]}>
                          {isDelivered ? t('orders.deliveredAt') : t('orders.estimatedDelivery')}
                        </Text>
                        <Text style={[styles.deliveryInfoValue, isDarkMode && styles.darkText]}>
                          {isDelivered
                            ? formatDate(currentTrackedOrder.date)
                            : isPending
                              ? t('orders.waitingConfirmation')
                              : "30-45 minutes"}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.deliveryInfoRow}>
                      <Icon name="location-on" size={20} color="#FF3F00" />
                      <View style={styles.deliveryInfoTextContainer}>
                        <Text style={[styles.deliveryInfoLabel, isDarkMode && styles.darkSubText]}>
                          {t('orders.deliveryAddress')}
                        </Text>
                        <Text style={[styles.deliveryInfoValue, isDarkMode && styles.darkText]}>
                          {currentTrackedOrder.deliveryAddress || t('orders.addressNotAvailable')}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.deliveryInfoRow}>
                      <Icon name="person" size={20} color="#FF3F00" />
                      <View style={styles.deliveryInfoTextContainer}>
                        <Text style={[styles.deliveryInfoLabel, isDarkMode && styles.darkSubText]}>
                          {t('orders.deliveryPartner')}
                        </Text>
                        <Text style={[styles.deliveryInfoValue, isDarkMode && styles.darkText]}>
                          {isPending
                            ? t('orders.waitingConfirmation')
                            : isProcessing
                              ? t('orders.assigningPartner')
                              : "Rahul S."}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </>
            )}

            <TouchableOpacity
              style={styles.supportButton}
              onPress={() => {
                setTrackingModalVisible(false)
              }}
            >
              <Icon name="headset-mic" size={16} color="#fff" style={styles.buttonIcon} />
              <Text style={styles.supportButtonText}>{t('orders.contactSupport')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    )
  }

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.darkContainer]}>
      <View style={[styles.header, isDarkMode && styles.darkHeader]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('orders.title')}</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Icon name="search" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {renderFilterTabs()}

      <View style={styles.listContainer}>
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => item.id}
          renderItem={renderOrderItem}
          contentContainerStyle={filteredOrders.length === 0 ? styles.emptyList : styles.list}
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={true}
          initialNumToRender={5}
          maxToRenderPerBatch={10}
          windowSize={10}
          removeClippedSubviews={Platform.OS === "android"}
          ListFooterComponent={<View style={styles.listFooter} />}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#FF3F00"]}
              tintColor={isDarkMode ? "#FF5722" : "#FF3F00"}
              title={t('orders.pullToRefresh')}
              titleColor={isDarkMode ? "#aaa" : "#777"}
            />
          }
        />
      </View>
      {renderTrackingModal()}
    </SafeAreaView>
  )
}

// Scrollable filter tabs component
const ScrollableFilterTabs = ({
  selectedFilter,
  onSelectFilter,
  isDarkMode,
}: {
  selectedFilter: FilterOption
  onSelectFilter: (filter: FilterOption) => void
  isDarkMode: boolean
}) => {
  const { t } = useTranslation()
  
  const filters: { value: FilterOption; label: string; icon: string }[] = [
    { value: "all", label: t('orders.filters.all'), icon: "receipt-long" },
    { value: "pending", label: t('orders.filters.pending'), icon: "pending" },
    { value: "delivered", label: t('orders.filters.delivered'), icon: "check-circle" },
    { value: "cancelled", label: t('orders.filters.cancelled'), icon: "cancel" },
  ]

  return (
    <View style={styles.tabsContainer}>
      {filters.map((filter) => (
        <TouchableOpacity
          key={filter.value}
          style={[
            styles.filterTab,
            selectedFilter === filter.value && styles.activeFilterTab,
            isDarkMode && styles.darkFilterTab,
            selectedFilter === filter.value && isDarkMode && styles.darkActiveFilterTab,
          ]}
          onPress={() => onSelectFilter(filter.value)}
        >
          <Icon
            name={filter.icon}
            size={16}
            color={
              selectedFilter === filter.value ? (isDarkMode ? "#FF5722" : "#FF3F00") : isDarkMode ? "#aaa" : "#777"
            }
            style={styles.filterIcon}
          />
          <Text
            style={[
              styles.filterText,
              selectedFilter === filter.value && styles.activeFilterText,
              isDarkMode && styles.darkFilterText,
              selectedFilter === filter.value && isDarkMode && styles.darkActiveFilterText,
            ]}
          >
            {filter.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}

// Keep all your existing styles here
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  darkContainer: {
    backgroundColor: "#121212",
  },
  listContainer: {
    flex: 1,
  },
  header: {
    backgroundColor: "#FF3F00",
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  darkHeader: {
    backgroundColor: "#8B0000",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "white",
    textAlign: "center",
    flex: 1,
  },
  backButton: {
    padding: 5,
  },
  searchButton: {
    padding: 5,
  },
  filterContainer: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  tabsContainer: {
    flexDirection: "row",
    paddingHorizontal: 15,
  },
  filterTab: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
  },
  activeFilterTab: {
    backgroundColor: "#FFECE5",
  },
  darkFilterTab: {
    backgroundColor: "#333",
  },
  darkActiveFilterTab: {
    backgroundColor: "#3A2A20",
  },
  filterIcon: {
    marginRight: 5,
  },
  filterText: {
    fontSize: 13,
    color: "#777",
    fontWeight: "500",
  },
  activeFilterText: {
    color: "#FF3F00",
    fontWeight: "600",
  },
  darkFilterText: {
    color: "#aaa",
  },
  darkActiveFilterText: {
    color: "#FF5722",
  },
  list: {
    padding: 15,
    paddingBottom: 80,
  },
  emptyList: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  orderCard: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 15,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  lastOrderCard: {
    marginBottom: 50,
  },
  darkOrderCard: {
    backgroundColor: "#222",
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  expandIcon: {
    marginLeft: 8,
  },
  orderDate: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  darkText: {
    color: "#f0f0f0",
  },
  darkSubText: {
    color: "#aaa",
  },
  darkAccentText: {
    color: "#FF5722",
  },
  orderId: {
    fontSize: 13,
    color: "#777",
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  restaurantRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  restaurantName: {
    fontSize: 13,
    color: "#777",
    marginLeft: 6,
  },
  orderItems: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#f0f0f0",
    paddingVertical: 12,
    marginBottom: 12,
  },
  orderItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  itemImage: {
    width: 45,
    height: 45,
    borderRadius: 8,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 3,
  },
  itemPriceRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemPrice: {
    fontSize: 13,
    color: "#777",
  },
  itemQuantity: {
    fontSize: 13,
    color: "#777",
    marginLeft: 5,
  },
  viewMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
  },
  viewMoreText: {
    fontSize: 13,
    color: "#FF3F00",
    fontWeight: "500",
    marginRight: 3,
  },
  expandedDetails: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  detailText: {
    fontSize: 13,
    color: "#777",
    marginLeft: 6,
    flex: 1,
  },
  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 13,
    color: "#777",
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
  actionButtons: {
    flexDirection: "row",
  },
  cancelButton: {
    backgroundColor: "#ffeeee",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  cancelButtonText: {
    color: "#F44336",
    fontSize: 13,
    fontWeight: "600",
  },
  reorderButton: {
    backgroundColor: "#FF3F00",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  reorderButtonText: {
    color: "white",
    fontSize: 13,
    fontWeight: "600",
  },
  trackButton: {
    backgroundColor: "#FFF3EB",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  rateButton: {
    backgroundColor: "#FFF3EB",
  },
  trackButtonText: {
    color: "#FF3F00",
    fontSize: 13,
    fontWeight: "600",
  },
  buttonIcon: {
    marginRight: 4,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginTop: 15,
    marginBottom: 5,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#777",
    textAlign: "center",
    marginBottom: 20,
  },
  browseButton: {
    backgroundColor: "#FF3F00",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  browseButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  listFooter: {
    height: 30,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  trackingModalContent: {
    width: "90%",
    maxHeight: "85%",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  darkTrackingModalContent: {
    backgroundColor: "#222",
  },
  trackingModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  trackingModalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  orderInfoCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  orderInfoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  orderInfoDate: {
    fontSize: 13,
    color: "#777",
    marginBottom: 10,
  },
  orderInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  orderInfoText: {
    fontSize: 13,
    color: "#777",
    marginLeft: 8,
  },
  trackingContainer: {
    marginBottom: 20,
  },
  trackingProgressContainer: {
    height: 4,
    backgroundColor: "#f0f0f0",
    borderRadius: 2,
    marginBottom: 15,
    overflow: "hidden",
  },
  trackingProgressBar: {
    height: "100%",
    backgroundColor: "#FF3F00",
    borderRadius: 2,
  },
  trackingSteps: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  trackingStep: {
    alignItems: "center",
    width: "30%",
  },
  trackingStepCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  activeTrackingStep: {
    backgroundColor: "#FF3F00",
  },
  trackingStepText: {
    fontSize: 12,
    color: "#777",
    fontWeight: "500",
    marginBottom: 5,
  },
  activeTrackingStepText: {
    color: "#FF3F00",
    fontWeight: "600",
  },
  currentStatusText: {
    fontSize: 10,
    color: "#FF3F00",
    textAlign: "center",
  },
  deliveryInfoContainer: {
    marginBottom: 20,
  },
  deliveryInfoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  deliveryInfoCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 15,
  },
  deliveryInfoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  deliveryInfoTextContainer: {
    marginLeft: 10,
    flex: 1,
  },
  deliveryInfoLabel: {
    fontSize: 12,
    color: "#777",
    marginBottom: 2,
  },
  deliveryInfoValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  supportButton: {
    backgroundColor: "#FF3F00",
    borderRadius: 10,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  supportButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  cancelledContainer: {
    alignItems: "center",
    padding: 20,
    marginBottom: 20,
  },
  cancelledIconContainer: {
    marginBottom: 15,
  },
  cancelledTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#F44336",
    marginBottom: 10,
  },
  cancelledMessage: {
    fontSize: 14,
    color: "#777",
    textAlign: "center",
    marginBottom: 20,
  },
  cancelledDetails: {
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 20,
  },
  cancelledLabel: {
    fontSize: 14,
    color: "#777",
    marginBottom: 5,
  },
  cancelledValue: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  reorderCancelledButton: {
    backgroundColor: "#FF3F00",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  reorderCancelledButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
})

export default OrdersScreen