import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cart')) || [] }
    catch { return [] }
  })

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  const addToCart = (product, quantity = 1) => {
    const stock = product.quantity ?? product.stock ?? Infinity
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, existing._stock ?? Infinity)
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: newQty } : item
        )
      }
      return [...prev, { ...product, quantity: Math.min(quantity, stock), _stock: stock }]
    })
  }

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) return removeFromCart(productId)
    setCart(prev =>
      prev.map(item => {
        if (item.id !== productId) return item
        const maxQty = item._stock ?? Infinity
        return { ...item, quantity: Math.min(quantity, maxQty) }
      })
    )
  }

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId))
  }

  const clearCart = () => setCart([])

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider value={{
      cart, addToCart, updateQuantity, removeFromCart, clearCart, total, itemCount
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)