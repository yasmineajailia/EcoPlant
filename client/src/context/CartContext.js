import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (plant, quantity = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.plant._id === plant._id);
      
      if (existingItem) {
        return prevCart.map((item) =>
          item.plant._id === plant._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      return [...prevCart, { plant, quantity }];
    });
  };

  const removeFromCart = (plantId) => {
    setCart((prevCart) => prevCart.filter((item) => item.plant._id !== plantId));
  };

  const updateQuantity = (plantId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(plantId);
      return;
    }
    
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.plant._id === plantId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const price = item.plant.onPromotion && item.plant.promotionPrice
        ? item.plant.promotionPrice
        : item.plant.price;
      return total + price * item.quantity;
    }, 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
