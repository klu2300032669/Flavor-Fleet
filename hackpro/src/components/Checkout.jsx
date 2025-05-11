import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import {
  Box, Typography, TextField, Button, MenuItem, FormControl, InputLabel, Select, List, ListItem, ListItemText,
  Divider, Stepper, Step, StepLabel, IconButton, Container, Paper, alpha, CircularProgress, Modal, InputAdornment,
} from "@mui/material";
import { motion } from "framer-motion";
import { FiArrowLeft, FiMapPin, FiCreditCard } from "react-icons/fi";
import { toast } from "react-toastify";

const Checkout = () => {
  const navigate = useNavigate();
  const { user, token, cart, placeOrder, fetchCart } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    pincode: "",
    paymentMethod: "Cash",
  });
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });
  const [upiDetails, setUpiDetails] = useState({
    upiId: "",
  });
  const steps = ["Cart", "Delivery", "Payment"];

  useEffect(() => {
    if (!token) {
      toast.error("Please log in to proceed with checkout.");
      navigate("/", { state: { showLoginModal: true, intendedPath: "/checkout" } });
      return;
    }

    // Pre-populate address fields from user profile if available
    if (user?.addresses && user.addresses.length > 0) {
      const primaryAddress = user.addresses[0];
      setFormData((prev) => ({
        ...prev,
        addressLine1: primaryAddress.addressLine1 || "",
        addressLine2: primaryAddress.addressLine2 || "",
        city: primaryAddress.city || "",
        pincode: primaryAddress.pincode || "",
      }));
    }

    fetchCartItems();
  }, [token, navigate, user]);

  const fetchCartItems = async () => {
    setLoading(true);
    try {
      const cartItems = await fetchCart();
      if (!Array.isArray(cartItems)) {
        throw new Error("Invalid cart data received from server");
      }
      setTotalPrice(cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0));
    } catch (error) {
      console.error("Error fetching cart items:", error);
      toast.error(`Failed to fetch cart items: ${error.message}`);
      setTotalPrice(0);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const detectLocation = () => {
    setLocationLoading(true);
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Mock an address based on coordinates (since Google Maps API isn't used)
        const { latitude, longitude } = position.coords;
        setFormData({
          ...formData,
          addressLine1: `Mock Street ${Math.floor(Math.random() * 1000)}`,
          addressLine2: `Near Landmark ${Math.floor(Math.random() * 100)}`,
          city: "Mock City",
          pincode: `5600${Math.floor(Math.random() * 99)}`,
        });
        toast.success("Location detected successfully (mocked address used)!");
        setLocationLoading(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        toast.error("Unable to detect location. Please allow location access or enter manually.");
        setLocationLoading(false);
      }
    );
  };

  const handlePaymentModalClose = () => {
    setPaymentModalOpen(false);
    setCardDetails({ cardNumber: "", expiryDate: "", cvv: "" });
    setUpiDetails({ upiId: "" });
  };

  const handleCardPayment = async () => {
    // Mock card payment validation
    if (!cardDetails.cardNumber || !cardDetails.expiryDate || !cardDetails.cvv) {
      toast.error("Please fill in all card details.");
      return;
    }
    if (!/^\d{16}$/.test(cardDetails.cardNumber)) {
      toast.error("Card number must be 16 digits.");
      return;
    }
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardDetails.expiryDate)) {
      toast.error("Expiry date must be in MM/YY format.");
      return;
    }
    if (!/^\d{3}$/.test(cardDetails.cvv)) {
      toast.error("CVV must be 3 digits.");
      return;
    }

    setLoading(true);
    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await placeOrderAndNavigate();
    } catch (error) {
      toast.error("Payment processing failed. Please try again.");
      setLoading(false);
    }
  };

  const handleUpiPayment = async () => {
    // Mock UPI payment validation
    if (!upiDetails.upiId || !/^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/.test(upiDetails.upiId)) {
      toast.error("Please enter a valid UPI ID (e.g., user@bank).");
      return;
    }

    setLoading(true);
    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await placeOrderAndNavigate();
    } catch (error) {
      toast.error("Payment processing failed. Please try again.");
      setLoading(false);
    }
  };

  const placeOrderAndNavigate = async () => {
    const order = {
      name: formData.name,
      addressLine1: formData.addressLine1,
      addressLine2: formData.addressLine2 || null,
      city: formData.city,
      pincode: formData.pincode,
      paymentMethod: formData.paymentMethod,
      totalPrice: totalPrice, // Ensure this matches what AuthContext expects
    };

    const result = await placeOrder(order);
    if (result.success) {
      toast.success("Order placed successfully!");
      handlePaymentModalClose();
      navigate("/order-success");
    } else {
      throw new Error(result.error || "Unknown error occurred");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      toast.error("Your cart is empty. Add items before placing an order.");
      return;
    }

    // Validate address fields
    if (!formData.name || !formData.addressLine1 || !formData.city || !formData.pincode) {
      toast.error("Please fill in all required fields (Name, Address Line 1, City, Pincode).");
      return;
    }

    if (formData.paymentMethod === "Cash") {
      setLoading(true);
      try {
        await placeOrderAndNavigate();
      } catch (error) {
        console.error("Error placing order:", error);
        toast.error(`Failed to place order: ${error.message}`);
        setLoading(false);
      }
    } else {
      // Open payment modal for Card or UPI
      setPaymentModalOpen(true);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${alpha("#fef8f5", 0.95)}, ${alpha("#fff", 0.98)})`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url('https://images.unsplash.com/photo-1543353071-10c8ba85a904')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.06,
          filter: "blur(3px)",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: "-60px",
          left: "-60px",
          width: "180px",
          height: "180px",
          borderRadius: "50%",
          background: alpha("#ff6f61", 0.12),
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "-70px",
          right: "-70px",
          width: "220px",
          height: "220px",
          borderRadius: "50%",
          background: alpha("#ff4839", 0.08),
          zIndex: 0,
        }}
      />
      <Container maxWidth="md" sx={{ py: 8 }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, type: "spring", bounce: 0.25 }}
        >
          <Paper
            sx={{
              p: 4,
              borderRadius: "35px",
              background: `linear-gradient(145deg, ${alpha("#fff", 0.97)}, ${alpha("#fef8f5", 0.9)})`,
              boxShadow: `0 20px 50px ${alpha("#ff6f61", 0.2)}`,
              border: `1px solid ${alpha("#ff6f61", 0.08)}`,
              position: "relative",
              zIndex: 1,
              backdropFilter: "blur(5px)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
              <IconButton onClick={() => navigate("/menu")} sx={{ color: "#ff6f61" }}>
                <FiArrowLeft size={24} />
              </IconButton>
              <Typography
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 700,
                  fontSize: "2rem",
                  color: "#ff6f61",
                  flexGrow: 1,
                }}
              >
                Checkout
              </Typography>
            </Box>
            <Stepper activeStep={1} alternativeLabel sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel
                    sx={{
                      "& .MuiStepLabel-label": {
                        fontFamily: "'Poppins', sans-serif",
                        fontWeight: 600,
                        color: "#ff6f61",
                      },
                    }}
                  >
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
                <CircularProgress sx={{ color: "#ff6f61" }} />
                <Typography sx={{ ml: 2, color: "#ff6f61" }}>Processing...</Typography>
              </Box>
            ) : (
              <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 4 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    sx={{
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 600,
                      fontSize: "1.5rem",
                      color: "#ff6f61",
                      mb: 2,
                    }}
                  >
                    Order Summary
                  </Typography>
                  <List>
                    {cart.length === 0 ? (
                      <Typography sx={{ fontFamily: "'Poppins', sans-serif", color: "#666" }}>
                        Your cart is empty. Add items from the menu!
                      </Typography>
                    ) : (
                      cart.map((item) => (
                        <ListItem key={item.id}>
                          <ListItemText
                            primary={item.name}
                            secondary={`₹${(item.price * item.quantity).toFixed(2)} (${item.quantity}x)`}
                            primaryTypographyProps={{
                              fontFamily: "'Poppins', sans-serif",
                              fontWeight: 600,
                            }}
                            secondaryTypographyProps={{
                              fontFamily: "'Poppins', sans-serif",
                              color: "#666",
                            }}
                          />
                        </ListItem>
                      ))
                    )}
                  </List>
                  <Divider sx={{ my: 2, borderColor: alpha("#ff6f61", 0.1) }} />
                  <Typography
                    sx={{
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 700,
                      fontSize: "1.5rem",
                      color: "#ff6f61",
                    }}
                  >
                    Total: ₹{totalPrice.toFixed(2)}
                  </Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <form onSubmit={handleSubmit}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      sx={{
                        mb: 2,
                        "& .MuiOutlinedInput-root": { borderRadius: "20px" },
                        "& label": { fontFamily: "'Poppins', sans-serif" },
                      }}
                    />
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <TextField
                        fullWidth
                        label="Address Line 1"
                        name="addressLine1"
                        value={formData.addressLine1}
                        onChange={handleChange}
                        required
                        sx={{
                          "& .MuiOutlinedInput-root": { borderRadius: "20px" },
                          "& label": { fontFamily: "'Poppins', sans-serif" },
                        }}
                      />
                      <IconButton
                        onClick={detectLocation}
                        disabled={locationLoading}
                        sx={{ ml: 1, color: "#ff6f61" }}
                      >
                        {locationLoading ? (
                          <CircularProgress size={24} sx={{ color: "#ff6f61" }} />
                        ) : (
                          <FiMapPin size={24} />
                        )}
                      </IconButton>
                    </Box>
                    <TextField
                      fullWidth
                      label="Address Line 2 (Optional)"
                      name="addressLine2"
                      value={formData.addressLine2}
                      onChange={handleChange}
                      sx={{
                        mb: 2,
                        "& .MuiOutlinedInput-root": { borderRadius: "20px" },
                        "& label": { fontFamily: "'Poppins', sans-serif" },
                      }}
                    />
                    <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                      <TextField
                        fullWidth
                        label="City"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        sx={{
                          "& .MuiOutlinedInput-root": { borderRadius: "20px" },
                          "& label": { fontFamily: "'Poppins', sans-serif" },
                        }}
                      />
                      <TextField
                        fullWidth
                        label="Pincode"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        required
                        sx={{
                          "& .MuiOutlinedInput-root": { borderRadius: "20px" },
                          "& label": { fontFamily: "'Poppins', sans-serif" },
                        }}
                      />
                    </Box>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel
                        sx={{
                          fontFamily: "'Poppins', sans-serif",
                          "&.Mui-focused": { color: "#ff6f61" },
                        }}
                      >
                        Payment Method
                      </InputLabel>
                      <Select
                        name="paymentMethod"
                        value={formData.paymentMethod}
                        onChange={handleChange}
                        sx={{
                          borderRadius: "20px",
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: alpha("#ff6f61", 0.3),
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#ff6f61",
                          },
                        }}
                      >
                        <MenuItem value="Cash">Cash on Delivery</MenuItem>
                        <MenuItem value="Card">Credit/Debit Card</MenuItem>
                        <MenuItem value="UPI">UPI</MenuItem>
                      </Select>
                    </FormControl>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loading}
                      sx={{
                        backgroundColor: "#ff6f61",
                        borderRadius: "25px",
                        padding: "12px 0",
                        fontFamily: "'Poppins', sans-serif",
                        fontWeight: 600,
                        fontSize: "1rem",
                        textTransform: "none",
                        width: "100%",
                        "&:hover": {
                          backgroundColor: "#ff4839",
                          boxShadow: `0 8px 20px ${alpha("#ff6f61", 0.4)}`,
                        },
                      }}
                    >
                      {loading ? (
                        <CircularProgress size={24} sx={{ color: "#fff" }} />
                      ) : (
                        "Place Order"
                      )}
                    </Button>
                  </form>
                </Box>
              </Box>
            )}
          </Paper>
        </motion.div>
      </Container>

      {/* Payment Modal */}
      <Modal open={paymentModalOpen} onClose={handlePaymentModalClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 400 },
            bgcolor: "white",
            borderRadius: "20px",
            boxShadow: 24,
            p: 4,
          }}
        >
          {formData.paymentMethod === "Card" && (
            <>
              <Typography
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 600,
                  fontSize: "1.5rem",
                  color: "#ff6f61",
                  mb: 2,
                }}
              >
                Enter Card Details
              </Typography>
              <TextField
                fullWidth
                label="Card Number"
                value={cardDetails.cardNumber}
                onChange={(e) =>
                  setCardDetails({ ...cardDetails, cardNumber: e.target.value })
                }
                placeholder="1234 5678 9012 3456"
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": { borderRadius: "20px" },
                  "& label": { fontFamily: "'Poppins', sans-serif" },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FiCreditCard />
                    </InputAdornment>
                  ),
                }}
              />
              <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <TextField
                  fullWidth
                  label="Expiry Date"
                  value={cardDetails.expiryDate}
                  onChange={(e) =>
                    setCardDetails({ ...cardDetails, expiryDate: e.target.value })
                  }
                  placeholder="MM/YY"
                  sx={{
                    "& .MuiOutlinedInput-root": { borderRadius: "20px" },
                    "& label": { fontFamily: "'Poppins', sans-serif" },
                  }}
                />
                <TextField
                  fullWidth
                  label="CVV"
                  value={cardDetails.cvv}
                  onChange={(e) =>
                    setCardDetails({ ...cardDetails, cvv: e.target.value })
                  }
                  placeholder="123"
                  sx={{
                    "& .MuiOutlinedInput-root": { borderRadius: "20px" },
                    "& label": { fontFamily: "'Poppins', sans-serif" },
                  }}
                />
              </Box>
              <Button
                variant="contained"
                onClick={handleCardPayment}
                disabled={loading}
                sx={{
                  backgroundColor: "#ff6f61",
                  borderRadius: "25px",
                  padding: "12px 0",
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 600,
                  fontSize: "1rem",
                  textTransform: "none",
                  width: "100%",
                  "&:hover": {
                    backgroundColor: "#ff4839",
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ color: "#fff" }} />
                ) : (
                  "Pay Now"
                )}
              </Button>
            </>
          )}
          {formData.paymentMethod === "UPI" && (
            <>
              <Typography
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 600,
                  fontSize: "1.5rem",
                  color: "#ff6f61",
                  mb: 2,
                }}
              >
                Enter UPI Details
              </Typography>
              <TextField
                fullWidth
                label="UPI ID"
                value={upiDetails.upiId}
                onChange={(e) =>
                  setUpiDetails({ ...upiDetails, upiId: e.target.value })
                }
                placeholder="example@upi"
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": { borderRadius: "20px" },
                  "& label": { fontFamily: "'Poppins', sans-serif" },
                }}
              />
              <Typography
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "0.9rem",
                  color: "#666",
                  mb: 2,
                }}
              >
                Or scan the QR code below (mocked):
              </Typography>
              <Box
                sx={{
                  width: "150px",
                  height: "150px",
                  bgcolor: "#f0f0f0",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 2,
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "'Poppins', sans-serif",
                    color: "#666",
                    fontSize: "0.9rem",
                  }}
                >
                  Mock QR Code
                </Typography>
              </Box>
              <Button
                variant="contained"
                onClick={handleUpiPayment}
                disabled={loading}
                sx={{
                  backgroundColor: "#ff6f61",
                  borderRadius: "25px",
                  padding: "12px 0",
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 600,
                  fontSize: "1rem",
                  textTransform: "none",
                  width: "100%",
                  "&:hover": {
                    backgroundColor: "#ff4839",
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ color: "#fff" }} />
                ) : (
                  "Pay Now"
                )}
              </Button>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default Checkout;