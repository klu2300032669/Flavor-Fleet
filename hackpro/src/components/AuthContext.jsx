import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [orders, setOrders] = useState([]);
  const [lastOrder, setLastOrder] = useState(null); // Add lastOrder state
  const navigate = useNavigate();

  const API_BASE_URL = "http://localhost:8885";

  const getProfile = useCallback(async (authToken = token) => {
    if (!authToken) return null;
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Profile fetch failed with status: ${response.status}`);
      }

      const profile = await response.json();
      return {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        role: profile.role,
        profilePicture: profile.profilePicture,
        ordersCount: profile.ordersCount,
        cartItemsCount: profile.cartItemsCount,
        favoriteItemsCount: profile.favoriteItemsCount,
        addresses: profile.addresses,
      };
    } catch (error) {
      console.error("Profile fetch error:", error);
      throw error;
    }
  }, [token]);

  const fetchCart = useCallback(async (authToken = token) => {
    if (!authToken) return [];
    try {
      const response = await fetch(`${API_BASE_URL}/api/cart`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch cart");
      }
      const data = await response.json();
      setCart(data);
      return data;
    } catch (error) {
      console.error("Fetch cart error:", error);
      return [];
    }
  }, [token]);

  const fetchFavorites = useCallback(async (authToken = token) => {
    if (!authToken) return [];
    try {
      const response = await fetch(`${API_BASE_URL}/api/favorites`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch favorites");
      }
      const data = await response.json();
      setFavorites(data);
      return data;
    } catch (error) {
      console.error("Fetch favorites error:", error);
      return [];
    }
  }, [token]);

  const fetchOrders = useCallback(async (authToken = token) => {
    if (!authToken) return [];
    try {
      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch orders");
      }
      const data = await response.json();
      setOrders(data);
      return data;
    } catch (error) {
      console.error("Fetch orders error:", error);
      return [];
    }
  }, [token]);

  const fetchMenu = useCallback(async () => {
    try {
      console.log(`Fetching menu from ${API_BASE_URL}/api/menu`);
      const response = await fetch(`${API_BASE_URL}/api/menu`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Menu fetch response status:", response.status);
      console.log("Menu fetch response headers:", response.headers.get("Content-Type"));

      const contentType = response.headers.get("Content-Type");
      if (!response.ok) {
        let errorMessage = "Failed to fetch menu";
        if (response.status === 403) {
          errorMessage = "Access to menu is forbidden. Please try again later.";
        } else if (contentType?.includes("application/json")) {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } else {
          errorMessage = await response.text() || errorMessage;
        }
        throw new Error(errorMessage);
      }

      if (!contentType?.includes("application/json")) {
        const text = await response.text();
        throw new Error(`Expected JSON but received: ${text}`);
      }

      const data = await response.json();
      console.log("Fetched menu data:", data);
      return data;
    } catch (error) {
      console.error("Fetch menu error:", error);
      toast.error(error.message || "Failed to fetch menu");
      throw error;
    }
  }, []);

  const updateProfile = useCallback(async (updatedData) => {
    if (!token) {
      toast.error("Please log in to update your profile");
      return { success: false };
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update profile");
      }

      const data = await response.json();
      const updatedProfile = await getProfile(token);
      setUser(updatedProfile);
      localStorage.setItem("user", JSON.stringify(updatedProfile));
      toast.success(data.message || "Profile updated successfully!");
      return { success: true, user: updatedProfile };
    } catch (error) {
      console.error("Update profile error:", error);
      toast.error(error.message || "Failed to update profile");
      return { success: false, error: error.message };
    }
  }, [token, getProfile]);

  const fetchAllUsers = useCallback(async () => {
    if (!token || user?.role !== "ADMIN") {
      toast.error("Unauthorized access");
      return [];
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch users");
      }
      return await response.json();
    } catch (error) {
      console.error("Fetch all users error:", error);
      toast.error(error.message || "Failed to fetch users");
      return [];
    }
  }, [token, user]);

  const updateUser = useCallback(async (userId, updates) => {
    if (!token || user?.role !== "ADMIN") {
      toast.error("Unauthorized access");
      return { success: false };
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update user");
      }
      toast.success("User updated successfully!");
      return { success: true };
    } catch (error) {
      console.error("Update user error:", error);
      toast.error(error.message || "Failed to update user");
      return { success: false, error: error.message };
    }
  }, [token, user]);

  const fetchAllOrders = useCallback(async () => {
    if (!token || user?.role !== "ADMIN") {
      toast.error("Unauthorized access");
      return [];
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch orders");
      }
      return await response.json();
    } catch (error) {
      console.error("Fetch all orders error:", error);
      toast.error(error.message || "Failed to fetch orders");
      return [];
    }
  }, [token, user]);

  const updateOrderStatus = useCallback(async (orderId, status) => {
    if (!token || user?.role !== "ADMIN") {
      toast.error("Unauthorized access");
      return { success: false };
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/orders/${orderId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update order status");
      }
      toast.success("Order status updated!");
      return { success: true };
    } catch (error) {
      console.error("Update order status error:", error);
      toast.error(error.message || "Failed to update order status");
      return { success: false, error: error.message };
    }
  }, [token, user]);

  const addMenuItem = useCallback(async (item) => {
    if (!token || user?.role !== "ADMIN") {
      toast.error("Unauthorized access");
      return { success: false };
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/menu`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(item),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add menu item");
      }
      const newItem = await response.json();
      toast.success("Menu item added successfully!");
      return { success: true, item: newItem };
    } catch (error) {
      console.error("Add menu item error:", error);
      toast.error(error.message || "Failed to add menu item");
      return { success: false, error: error.message };
    }
  }, [token, user]);

  const updateMenuItem = useCallback(async (id, item) => {
    if (!token || user?.role !== "ADMIN") {
      toast.error("Unauthorized access");
      return { success: false };
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/menu/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(item),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update menu item");
      }
      const updatedItem = await response.json();
      toast.success("Menu item updated successfully!");
      return { success: true, item: updatedItem };
    } catch (error) {
      console.error("Update menu item error:", error);
      toast.error(error.message || "Failed to update menu item");
      return { success: false, error: error.message };
    }
  }, [token, user]);

  const deleteMenuItem = useCallback(async (id) => {
    if (!token || user?.role !== "ADMIN") {
      toast.error("Unauthorized access");
      return { success: false };
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/menu/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete menu item");
      }
      toast.success("Menu item deleted successfully!");
      return { success: true };
    } catch (error) {
      console.error("Delete menu item error:", error);
      toast.error(error.message || "Failed to delete menu item");
      return { success: false, error: error.message };
    }
  }, [token, user]);

  const fetchContactMessages = useCallback(async () => {
    if (!token || user?.role !== "ADMIN") {
      toast.error("Unauthorized access");
      return [];
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/contact`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch contact messages");
      }
      const messages = await response.json();
      console.log("Fetched contact messages:", messages);
      return messages;
    } catch (error) {
      console.error("Fetch contact messages error:", error);
      toast.error(error.message || "Failed to fetch contact messages");
      return [];
    }
  }, [token, user]);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");
      const storedLastOrder = localStorage.getItem("lastOrder"); // Load lastOrder from localStorage

      if (storedToken && storedUser) {
        try {
          setToken(storedToken);
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);

          if (storedLastOrder) {
            setLastOrder(JSON.parse(storedLastOrder)); // Restore lastOrder
          }

          const [profile, cartData, favoritesData, ordersData] = await Promise.all([
            getProfile(storedToken).catch(() => null),
            fetchCart(storedToken).catch(() => []),
            fetchFavorites(storedToken).catch(() => []),
            fetchOrders(storedToken).catch(() => []),
          ]);

          if (profile) {
            setUser(profile);
            localStorage.setItem("user", JSON.stringify(profile));
          }
          setCart(cartData || []);
          setFavorites(favoritesData || []);
          setOrders(ordersData || []);
        } catch (error) {
          console.error("Auth initialization error:", error);
          if (error.message?.includes("401")) {
            logout();
            toast.error("Session expired. Please log in again.");
          }
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, [getProfile, fetchCart, fetchFavorites, fetchOrders]);

  const login = async (email, password) => {
    try {
      setAuthLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Invalid email or password");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      const userProfile = await getProfile(data.token);
      localStorage.setItem("user", JSON.stringify(userProfile));
      setToken(data.token);
      setUser(userProfile);

      const [cartData, favoritesData, ordersData] = await Promise.all([
        fetchCart(data.token),
        fetchFavorites(data.token),
        fetchOrders(data.token),
      ]);

      setCart(cartData || []);
      setFavorites(favoritesData || []);
      setOrders(ordersData || []);

      toast.success(`Welcome back, ${data.name}!`);
      navigate("/");
      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.message || "Login failed");
      return { success: false, error: error.message };
    } finally {
      setAuthLoading(false);
    }
  };

  const signup = async (name, email, password) => {
    try {
      setAuthLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Signup failed");
      }

      const data = await response.json();
      toast.success(data.message || "OTP sent to your email!");
      return { success: true, email };
    } catch (error) {
      console.error("Signup error:", error);
      toast.error(error.message || "Signup failed");
      return { success: false, error: error.message };
    } finally {
      setAuthLoading(false);
    }
  };

  const verifySignupOtp = async (email, otp) => {
    try {
      setAuthLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/auth/verify-signup-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "OTP verification failed");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      const userProfile = await getProfile(data.token);
      localStorage.setItem("user", JSON.stringify(userProfile));
      setToken(data.token);
      setUser(userProfile);

      setCart([]);
      setFavorites([]);
      setOrders([]);
      setLastOrder(null); // Clear lastOrder on signup
      localStorage.removeItem("lastOrder");

      toast.success(`Welcome aboard, ${data.name}!`);
      navigate("/");
      return { success: true };
    } catch (error) {
      console.error("OTP verification error:", error);
      toast.error(error.message || "OTP verification failed");
      return { success: false, error: error.message };
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("lastOrder"); // Clear lastOrder on logout
    setToken(null);
    setUser(null);
    setCart([]);
    setFavorites([]);
    setOrders([]);
    setLastOrder(null);
    toast.info("Logged out successfully");
    navigate("/login");
  };

  const placeOrder = async (orderDetails) => {
    if (!token) {
      toast.error("Please log in to place an order");
      return { success: false };
    }

    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      toast.error("Cannot place order: Your cart is empty");
      return { success: false };
    }

    try {
      const simplifiedCartItems = cart.map(item => ({
        itemId: item.itemId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      }));

      const payload = {
        ...orderDetails,
        items: simplifiedCartItems,
        totalPrice: orderDetails.totalPrice || cart.reduce((total, item) => total + item.price * item.quantity, 0),
      };

      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to place order");
      }

      const savedOrder = await response.json();

      // Update orders state
      setOrders((prevOrders) => [...prevOrders, savedOrder]);

      // Set lastOrder state with additional details
      const lastOrderDetails = {
        ...savedOrder,
        addressLine1: orderDetails.addressLine1,
        addressLine2: orderDetails.addressLine2,
        city: orderDetails.city,
        pincode: orderDetails.pincode,
        totalPrice: payload.totalPrice,
        items: simplifiedCartItems,
        createdAt: new Date().toISOString(),
        estimatedDelivery: "30-40 minutes", // Example estimated delivery time
      };
      setLastOrder(lastOrderDetails);
      localStorage.setItem("lastOrder", JSON.stringify(lastOrderDetails)); // Persist to localStorage

      // Clear the cart and refresh data
      setCart([]);
      await Promise.all([fetchCart(), fetchOrders()]);

      toast.success("Order placed successfully!");
      return { success: true, order: savedOrder };
    } catch (error) {
      console.error("Place order error:", error);
      toast.error(error.message || "Failed to place order");
      return { success: false, error: error.message };
    }
  };

  const addToCart = async (item) => {
    if (!token) {
      toast.error("Please log in to add items to cart");
      return;
    }
    try {
      const cartItem = {
        itemId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity || 1,
        image: item.image,
      };
      const response = await fetch(`${API_BASE_URL}/api/cart`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cartItem),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add to cart");
      }

      const savedItem = await response.json();
      setCart((prevCart) => {
        const existingItemIndex = prevCart.findIndex((i) => i.itemId === savedItem.itemId);
        if (existingItemIndex >= 0) {
          const updatedCart = [...prevCart];
          updatedCart[existingItemIndex] = savedItem;
          return updatedCart;
        }
        return [...prevCart, savedItem];
      });
      toast.success(`${item.name} added to cart!`);
    } catch (error) {
      console.error("Add to cart error:", error);
      toast.error(error.message || "Failed to add to cart");
    }
  };

  const removeFromCart = async (itemId) => {
    if (!token) {
      toast.error("Please log in to remove items from cart");
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/cart/${itemId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to remove from cart");
      }

      setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
      toast.success("Item removed from cart!");
    } catch (error) {
      console.error("Remove from cart error:", error);
      toast.error(error.message || "Failed to remove from cart");
    }
  };

  const updateCartItem = async (itemId, newQuantity) => {
    if (!token) {
      toast.error("Please log in to update cart");
      return;
    }
    if (newQuantity < 1) {
      await removeFromCart(itemId);
      return;
    }
    try {
      const cartItem = cart.find((item) => item.id === itemId);
      if (!cartItem) throw new Error("Item not found in cart");

      const updatedItem = { ...cartItem, quantity: newQuantity };
      const response = await fetch(`${API_BASE_URL}/api/cart`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedItem),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update cart item");
      }

      const savedItem = await response.json();
      setCart((prevCart) => prevCart.map((item) => (item.id === itemId ? savedItem : item)));
      toast.success(`Updated ${cartItem.name} to ${newQuantity}`);
    } catch (error) {
      console.error("Update cart item error:", error);
      toast.error(error.message || "Failed to update cart item");
    }
  };

  const addToFavorites = async (item) => {
    if (!token) {
      toast.error("Please log in to add items to favorites");
      return;
    }
    try {
      const favoriteItem = {
        itemId: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
      };
      const response = await fetch(`${API_BASE_URL}/api/favorites`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(favoriteItem),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add to favorites");
      }

      const savedItem = await response.json();
      setFavorites((prevFavorites) => {
        if (prevFavorites.some((fav) => fav.itemId === savedItem.itemId)) {
          return prevFavorites;
        }
        return [...prevFavorites, savedItem];
      });
      toast.success(`${item.name} added to favorites!`);
    } catch (error) {
      console.error("Add to favorites error:", error);
      toast.error(error.message || "Failed to add to favorites");
    }
  };

  const removeFromFavorites = async (itemId) => {
    if (!token) {
      toast.error("Please log in to remove items from favorites");
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/favorites/${itemId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to remove from favorites");
      }

      setFavorites((prevFavorites) => prevFavorites.filter((item) => item.id !== itemId));
      toast.success("Item removed from favorites!");
    } catch (error) {
      console.error("Remove from favorites error:", error);
      toast.error(error.message || "Failed to remove from favorites");
    }
  };

  const forgotPassword = async (email) => {
    try {
      setAuthLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const contentType = response.headers.get("Content-Type");
      const data = contentType?.includes("application/json")
        ? await response.json()
        : { message: await response.text() };

      if (!response.ok) {
        throw new Error(data.message || "Failed to send OTP");
      }

      toast.success(data.message || "OTP sent to your email!");
      return { success: true };
    } catch (error) {
      console.error("Forgot password error:", error);
      toast.error(error.message || "Failed to send OTP");
      return { success: false, error: error.message };
    } finally {
      setAuthLoading(false);
    }
  };

  const resetPassword = async (email, otp, newPassword, confirmPassword) => {
    try {
      setAuthLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword, confirmPassword }),
      });

      const contentType = response.headers.get("Content-Type");
      const data = contentType?.includes("application/json")
        ? await response.json()
        : { message: await response.text() };

      if (!response.ok) {
        throw new Error(data.message || "Password reset failed");
      }

      toast.success(data.message || "Password reset successfully!");
      navigate("/login");
      return { success: true };
    } catch (error) {
      console.error("Reset password error:", error);
      toast.error(error.message || "Password reset failed");
      return { success: false, error: error.message };
    } finally {
      setAuthLoading(false);
    }
  };

  const value = {
    user,
    token,
    loading,
    authLoading,
    cart,
    favorites,
    orders,
    lastOrder, // Add lastOrder to context
    login,
    signup,
    verifySignupOtp,
    logout,
    getProfile,
    addToCart,
    removeFromCart,
    updateCartItem,
    addToFavorites,
    removeFromFavorites,
    forgotPassword,
    resetPassword,
    placeOrder,
    fetchOrders,
    fetchCart,
    fetchFavorites,
    fetchMenu,
    updateProfile,
    fetchAllUsers,
    updateUser,
    fetchAllOrders,
    updateOrderStatus,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    fetchContactMessages,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};