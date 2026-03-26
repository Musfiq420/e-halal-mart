'use client';

import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';

// Initial state
const initialState = {
  items: [],
  isOpen: false,
};

// Action types
const ADD_TO_CART = 'ADD_TO_CART';
const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
const UPDATE_QUANTITY = 'UPDATE_QUANTITY';
const CLEAR_CART = 'CLEAR_CART';
const TOGGLE_CART = 'TOGGLE_CART';
const LOAD_CART = 'LOAD_CART';

// Helper to calculate totals
const calculateTotals = (items) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  return { subtotal, totalItems };
};

// Reducer function
const cartReducer = (state, action) => {
  let newItems;

  switch (action.type) {
    case LOAD_CART:
      return {
        ...state,
        items: action.payload,
      };

    case ADD_TO_CART: {
      const existingItemIndex = state.items.findIndex(
        item => item.id === action.payload.id
      );

      if (existingItemIndex > -1) {
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + (action.payload.quantity || 1) }
            : item
        );
      } else {
        newItems = [...state.items, { ...action.payload, quantity: action.payload.quantity || 1 }];
      }

      return { ...state, items: newItems };
    }

    case REMOVE_FROM_CART:
      newItems = state.items.filter(item => item.id !== action.payload);
      return { ...state, items: newItems };

    case UPDATE_QUANTITY: {
      if (action.payload.quantity <= 0) {
        newItems = state.items.filter(item => item.id !== action.payload.id);
      } else {
        newItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        );
      }
      return { ...state, items: newItems };
    }

    case CLEAR_CART:
      return { ...state, items: [] };

    case TOGGLE_CART:
      return { ...state, isOpen: action.payload ?? !state.isOpen };

    default:
      return state;
  }
};

// Create context
const CartContext = createContext(null);

// Local storage key
const CART_STORAGE_KEY = 'e-halal-mart-cart';

// Provider component
export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        dispatch({ type: LOAD_CART, payload: parsedCart });
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
  }, []);

  // Save cart to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [state.items]);

  // Actions
  const addToCart = useCallback((product, quantity = 1) => {
    dispatch({ type: ADD_TO_CART, payload: { ...product, quantity } });
  }, []);

  const removeFromCart = useCallback((productId) => {
    dispatch({ type: REMOVE_FROM_CART, payload: productId });
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    dispatch({ type: UPDATE_QUANTITY, payload: { id: productId, quantity } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: CLEAR_CART });
  }, []);

  const toggleCart = useCallback((isOpen) => {
    dispatch({ type: TOGGLE_CART, payload: isOpen });
  }, []);

  // Computed values
  const totals = calculateTotals(state.items);
  const itemCount = totals.totalItems;
  const subtotal = totals.subtotal;

  const value = {
    items: state.items,
    isOpen: state.isOpen,
    itemCount,
    subtotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// Custom hook to use cart context
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export default CartContext;
