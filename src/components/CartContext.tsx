import React, { createContext, useState, useContext, type ReactNode } from "react"
import { ImageSourcePropType } from "react-native"

// Add a unique ID for cart items
interface BiryaniItem {
  id: string
  name: string
  price: string
  image: ImageSourcePropType
  description: string
  tag: string
  rating: number
  restaurantName?: string // Add restaurant name
}

// Add a cart item interface with a unique cart ID
interface CartItem extends BiryaniItem {
  cartId: string
  quantity: number
}

interface CartContextType {
  cart: CartItem[]
  addToCart: (item: BiryaniItem) => void
  removeFromCart: (cartId: string) => void
  clearCart: () => void
  getCartCount: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

interface CartProviderProps {
  children: ReactNode
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([])

  const addToCart = (item: BiryaniItem) => {
    // Check if the item already exists in the cart
    const existingItemIndex = cart.findIndex((cartItem) => cartItem.id === item.id)

    if (existingItemIndex >= 0) {
      // If item exists, increase quantity
      const updatedCart = [...cart]
      updatedCart[existingItemIndex].quantity += 1
      setCart(updatedCart)
    } else {
      // If item doesn't exist, add it with a unique cartId
      const cartId = `${item.id}-${Date.now()}`
      setCart((prevCart) => [...prevCart, { ...item, cartId, quantity: 1 }])
    }
  }

  const removeFromCart = (cartId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.cartId !== cartId))
  }

  // Clear cart
  const clearCart = () => {
    setCart([])
  }

  const getCartCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, getCartCount }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = (): CartContextType => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}