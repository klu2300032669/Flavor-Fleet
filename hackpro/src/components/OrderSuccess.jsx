import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { Box, Typography, Button, Container, List, ListItem, ListItemText, Divider, CircularProgress } from "@mui/material";
import { motion, useAnimation } from "framer-motion";
import { alpha } from "@mui/material/styles";
import { FiCheckCircle } from "react-icons/fi";
import { toast } from "react-toastify";

// Confetti Particle Component
const ConfettiParticle = ({ delay }) => {
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      y: [0, 600],
      x: [(Math.random() - 0.5) * 200, (Math.random() - 0.5) * 200],
      rotate: [0, Math.random() * 360],
      opacity: [1, 0],
      transition: { duration: 2, delay, ease: "easeOut" },
    });
  }, [controls, delay]);

  const colors = ["#ff6f61", "#ff4839", "#ffca28", "#4caf50"];
  const size = Math.random() * 10 + 5;

  return (
    <motion.div
      animate={controls}
      style={{
        position: "absolute",
        width: size,
        height: size,
        backgroundColor: colors[Math.floor(Math.random() * colors.length)],
        borderRadius: "50%",
        top: "-20px",
        left: `${Math.random() * 100}%`,
        zIndex: 0,
      }}
    />
  );
};

const OrderSuccess = () => {
  const navigate = useNavigate();
  const { lastOrder, fetchOrders } = useAuth();
  const [orderDetails, setOrderDetails] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch orders to ensure the orders list is up-to-date
    fetchOrders().catch((err) => {
      console.error("Failed to fetch orders:", err);
      toast.error("Failed to fetch order history.");
    });

    if (!lastOrder) {
      setError("No order details found. Please place an order first.");
      toast.error("No order details found.");
      return;
    }

    // Map lastOrder to the expected orderDetails structure
    setOrderDetails({
      id: lastOrder.id,
      createdAt: lastOrder.createdAt || new Date().toISOString(),
      items: lastOrder.items || [],
      total: lastOrder.totalPrice || 0, // Map totalPrice to total
      name: lastOrder.name || "Customer", // Fallback if name is not set
      addressLine1: lastOrder.addressLine1 || "",
      addressLine2: lastOrder.addressLine2 || "",
      city: lastOrder.city || "",
      pincode: lastOrder.pincode || "",
      paymentMethod: lastOrder.paymentMethod || "Cash",
      estimatedDelivery: lastOrder.estimatedDelivery || "30-40 minutes",
    });
  }, [lastOrder, fetchOrders]);

  if (error) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        <Box sx={{ textAlign: "center", p: 4, bgcolor: alpha("#fff", 0.9), borderRadius: "20px" }}>
          <Typography sx={{ color: "#ff6f61", fontFamily: "'Poppins', sans-serif", mb: 2 }}>
            {error}
          </Typography>
          <Button
            onClick={() => navigate("/menu")}
            sx={{ color: "#ff6f61", fontFamily: "'Poppins', sans-serif" }}
            aria-label="Back to Menu"
          >
            Back to Menu
          </Button>
        </Box>
      </Box>
    );
  }

  if (!orderDetails) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        <CircularProgress sx={{ color: "#ff6f61" }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${alpha("#fef8f5", 0.95)}, ${alpha("#fff", 0.98)})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Poppins', sans-serif",
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
      {Array.from({ length: 30 }).map((_, i) => (
        <ConfettiParticle key={i} delay={i * 0.1} />
      ))}
      <Container maxWidth="sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, type: "spring", bounce: 0.25 }}
        >
          <Box
            sx={{
              textAlign: "center",
              p: { xs: 4, md: 6 },
              borderRadius: "35px",
              background: `linear-gradient(145deg, ${alpha("#fff", 0.97)}, ${alpha("#fef8f5", 0.9)})`,
              boxShadow: `0 20px 50px ${alpha("#ff6f61", 0.2)}`,
              border: `1px solid ${alpha("#ff6f61", 0.08)}`,
              position: "relative",
              zIndex: 1,
              backdropFilter: "blur(5px)",
            }}
          >
            <motion.div
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
            >
              <FiCheckCircle size={64} color="#ff6f61" style={{ marginBottom: "24px" }} />
            </motion.div>
            <Typography
              sx={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 800,
                fontSize: { xs: "2rem", md: "2.8rem" },
                color: "#ff6f61",
                mb: 2,
                letterSpacing: "0.5px",
                textShadow: `0 3px 12px ${alpha("#ff6f61", 0.25)}`,
              }}
            >
              Order Placed Successfully!
            </Typography>
            <Typography
              sx={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: { xs: "1rem", md: "1.3rem" },
                color: "#666",
                mb: 4,
                lineHeight: 1.6,
                maxWidth: "400px",
                mx: "auto",
                opacity: 0.85,
              }}
            >
              Your delicious meal is on its way—get ready to savor the flavor!
            </Typography>
            <Box sx={{ mb: 4, textAlign: "left", maxWidth: "450px", mx: "auto" }}>
              <Typography
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 600,
                  fontSize: "1.5rem",
                  color: "#ff6f61",
                  mb: 2,
                }}
              >
                Order Details
              </Typography>
              <Box sx={{ background: alpha("#ff6f61", 0.05), p: 2, borderRadius: "15px" }}>
                <Typography sx={{ fontFamily: "'Poppins', sans-serif", fontSize: "1rem", color: "#ff6f61", mb: 1 }}>
                  Order ID: <strong>#{orderDetails.id || "N/A"}</strong>
                </Typography>
                <Typography sx={{ fontFamily: "'Poppins', sans-serif", fontSize: "0.9rem", color: "#666", mb: 1 }}>
                  Ordered: {new Date(orderDetails.createdAt).toLocaleDateString()}
                </Typography>
                <List dense sx={{ mb: 1 }}>
                  {orderDetails.items.map((item, index) => (
                    <ListItem key={item.itemId || index} sx={{ py: 0.5 }}>
                      <ListItemText
                        primary={`${item.name} (${item.quantity}x)`}
                        secondary={`₹${(item.price * item.quantity).toFixed(2)}`}
                        primaryTypographyProps={{ fontFamily: "'Poppins', sans-serif", fontWeight: 500, color: "#333" }}
                        secondaryTypographyProps={{ fontFamily: "'Poppins', sans-serif", color: "#666" }}
                      />
                    </ListItem>
                  ))}
                </List>
                <Divider sx={{ my: 1, borderColor: alpha("#ff6f61", 0.1) }} />
                <Typography sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "1.2rem", color: "#ff6f61" }}>
                  Total: ₹{orderDetails.total.toFixed(2)}
                </Typography>
                <Typography sx={{ fontFamily: "'Poppins', sans-serif", fontSize: "0.9rem", color: "#666", mt: 1 }}>
                  Delivery to: {orderDetails.name}, {orderDetails.addressLine1}
                  {orderDetails.addressLine2 ? `, ${orderDetails.addressLine2}` : ""}, {orderDetails.city}, {orderDetails.pincode}
                </Typography>
                <Typography sx={{ fontFamily: "'Poppins', sans-serif", fontSize: "0.9rem", color: "#666", mt: 1 }}>
                  Payment Method: {orderDetails.paymentMethod === "Cash" ? "Cash on Delivery" : orderDetails.paymentMethod}
                </Typography>
                {orderDetails.estimatedDelivery && (
                  <Typography sx={{ fontFamily: "'Poppins', sans-serif", fontSize: "0.9rem", color: "#4caf50", mt: 1 }}>
                    Estimated Delivery: {orderDetails.estimatedDelivery}
                  </Typography>
                )}
              </Box>
            </Box>
            <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
              <motion.div
                whileHover={{ scale: 1.06, rotate: 1 }}
                whileTap={{ scale: 0.94 }}
                transition={{ type: "spring", stiffness: 350 }}
              >
                <Button
                  variant="contained"
                  onClick={() => navigate("/")}
                  sx={{
                    background: `linear-gradient(45deg, #ff6f61, #ff4839)`,
                    borderRadius: "50px",
                    py: { xs: 1.2, md: 1.5 },
                    px: { xs: 5, md: 6 },
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 700,
                    fontSize: { xs: "1rem", md: "1.2rem" },
                    textTransform: "none",
                    boxShadow: `0 12px 30px ${alpha("#ff6f61", 0.4)}`,
                    "&:hover": {
                      background: "#ff4839",
                      transform: "translateY(-2px)",
                      boxShadow: `0 15px 40px ${alpha("#ff6f61", 0.5)}`,
                    },
                    transition: "all 0.3s ease",
                    color: "#fff",
                  }}
                  aria-label="Back to Home"
                >
                  Back to Home
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.06, rotate: 1 }}
                whileTap={{ scale: 0.94 }}
                transition={{ type: "spring", stiffness: 350 }}
              >
                <Button
                  variant="contained"
                  onClick={() => navigate("/menu")}
                  sx={{
                    background: `linear-gradient(45deg, #ff6f61, #ff4839)`,
                    borderRadius: "50px",
                    py: { xs: 1.2, md: 1.5 },
                    px: { xs: 5, md: 6 },
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 700,
                    fontSize: { xs: "1rem", md: "1.2rem" },
                    textTransform: "none",
                    boxShadow: `0 12px 30px ${alpha("#ff6f61", 0.4)}`,
                    "&:hover": {
                      background: "#ff4839",
                      transform: "translateY(-2px)",
                      boxShadow: `0 15px 40px ${alpha("#ff6f61", 0.5)}`,
                    },
                    transition: "all 0.3s ease",
                    color: "#fff",
                  }}
                  aria-label="Back to Menu"
                >
                  Back to Menu
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.06, rotate: 1 }}
                whileTap={{ scale: 0.94 }}
                transition={{ type: "spring", stiffness: 350 }}
              >
                <Button
                  variant="outlined"
                  onClick={() => navigate("/profile")}
                  sx={{
                    borderColor: "#ff6f61",
                    color: "#ff6f61",
                    borderRadius: "50px",
                    py: { xs: 1.2, md: 1.5 },
                    px: { xs: 5, md: 6 },
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 700,
                    fontSize: { xs: "1rem", md: "1.2rem" },
                    textTransform: "none",
                    "&:hover": {
                      borderColor: "#ff4839",
                      color: "#ff4839",
                      transform: "translateY(-2px)",
                    },
                    transition: "all 0.3s ease",
                  }}
                  aria-label="View Profile"
                >
                  View Profile
                </Button>
              </motion.div>
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default OrderSuccess;