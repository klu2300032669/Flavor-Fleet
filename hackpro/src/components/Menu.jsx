import React, { useState, useEffect, useRef, useMemo, forwardRef, useImperativeHandle } from "react";
import {
  Container, Grid, Card, CardMedia, CardContent, Typography,
  Button, Box, Chip, useMediaQuery, IconButton, Tooltip,
  alpha, Zoom, AppBar, Toolbar, Fab, Badge, Drawer,
  List, ListItem, ListItemText, Divider, TextField, InputAdornment,
  Rating, Snackbar, Alert, MenuItem as MuiMenuItem, Select, FormControl,
  InputLabel, CircularProgress
} from "@mui/material";
import {
  motion, AnimatePresence, useScroll, useTransform, LayoutGroup, useAnimation
} from "framer-motion";
import { useTheme } from "@mui/material/styles";
import {
  FiHeart, FiChevronUp, FiShoppingCart, FiHome, FiX, FiSearch,
  FiMenu, FiUser, FiLogIn
} from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";

// SearchBar Component
const SearchBar = React.memo(({ onSearch, onSortChange, sortBy }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const theme = useTheme();

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <Box sx={{
      display: "flex",
      gap: { xs: 1, md: 2 },
      mb: { xs: 4, md: 8 },
      alignItems: "center",
      maxWidth: { xs: "95%", md: 1100 },
      mx: "auto",
      background: alpha(theme.palette.common.white, 0.98),
      borderRadius: "24px",
      p: { xs: 1.5, md: 2 },
      boxShadow: `0 10px 35px ${alpha(theme.palette.grey[900], 0.08)}`,
      border: `1px solid ${alpha(theme.palette.grey[200], 0.15)}`,
      transition: "all 0.3s ease",
    }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search for tasty delights..."
        value={searchTerm}
        onChange={handleSearch}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <FiSearch color={theme.palette.grey[600]} size={24} />
            </InputAdornment>
          ),
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "20px",
            border: `1px solid ${alpha(theme.palette.grey[300], 0.25)}`,
            transition: "all 0.4s ease",
            "&:hover": { borderColor: theme.palette.primary.main },
            "&.Mui-focused": { 
              boxShadow: `0 0 0 4px ${alpha(theme.palette.primary.main, 0.1)}`,
              borderColor: theme.palette.primary.main,
            },
            "& .MuiInputBase-input": {
              fontFamily: "'Poppins', sans-serif",
              fontSize: { xs: "1rem", md: "1.2rem" },
              py: { xs: 1.5, md: 1.8 },
              color: theme.palette.text.primary,
            },
          },
        }}
        inputProps={{ "aria-label": "Search menu items" }}
      />
      <FormControl sx={{ minWidth: { xs: 120, md: 150 } }}>
        <InputLabel sx={{ fontFamily: "'Poppins', sans-serif", fontSize: { xs: "1rem", md: "1.1rem" } }}>
          Sort By
        </InputLabel>
        <Select
          value={sortBy}
          onChange={onSortChange}
          label="Sort By"
          sx={{
            borderRadius: "20px",
            border: `1px solid ${alpha(theme.palette.grey[300], 0.25)}`,
            "& .MuiSelect-select": { 
              py: { xs: 1.5, md: 1.8 }, 
              fontFamily: "'Poppins', sans-serif", 
              fontSize: { xs: "0.95rem", md: "1.1rem" },
            },
            "&:hover": { borderColor: theme.palette.primary.main },
            "&.Mui-focused": {
              borderColor: theme.palette.primary.main,
              boxShadow: `0 0 0 4px ${alpha(theme.palette.primary.main, 0.1)}`,
            },
          }}
        >
          <MuiMenuItem value="default">Featured</MuiMenuItem>
          <MuiMenuItem value="price-low">Price: Low to High</MuiMenuItem>
          <MuiMenuItem value="price-high">Price: High to Low</MuiMenuItem>
          <MuiMenuItem value="name">Name (A-Z)</MuiMenuItem>
        </Select>
      </FormControl>
    </Box>
  );
});

// OffersCarousel Component
const OffersCarousel = React.memo(({ offersRef, offers }) => {
  const [activeOffer, setActiveOffer] = useState(0);
  const theme = useTheme();

  useEffect(() => {
    const timer = setInterval(() => setActiveOffer((prev) => (prev + 1) % offers.length), 5000);
    return () => clearInterval(timer);
  }, [offers]);

  return (
    <Box ref={offersRef} sx={{
      position: "relative",
      overflow: "hidden",
      height: { xs: 400, sm: 500, md: 650 },
      mb: { xs: 6, md: 10 },
      borderRadius: "28px",
      boxShadow: `0 12px 50px ${alpha(theme.palette.grey[900], 0.15)}`,
      border: `1px solid ${alpha(theme.palette.grey[200], 0.1)}`,
    }}>
      <AnimatePresence initial={false}>
        <motion.div
          key={activeOffer}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
          style={{ position: "absolute", width: "100%", height: "100%" }}
        >
          <Box sx={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            backgroundImage: `url(${offers[activeOffer].image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "relative",
            px: { xs: 3, md: 12 },
          }}>
            <Box sx={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(135deg, ${alpha(theme.palette.grey[900], 0.85)} 0%, transparent 70%)`,
              borderRadius: "28px",
            }} />
            <Box sx={{
              position: "relative",
              zIndex: 1,
              p: { xs: 3, md: 6 },
              borderRadius: "24px",
              color: "white",
              maxWidth: { xs: "100%", md: 650 },
              background: alpha(theme.palette.common.black, 0.2),
              boxShadow: `0 10px 40px ${alpha(theme.palette.grey[900], 0.25)}`,
            }}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                <Typography variant="h3" sx={{
                  fontWeight: 800,
                  mb: 3,
                  fontSize: { xs: "2rem", sm: "2.8rem", md: "4rem" },
                  fontFamily: "'Poppins', sans-serif",
                  letterSpacing: "1.8px",
                  textShadow: `0 4px 15px ${alpha(theme.palette.common.black, 0.5)}`,
                }}>
                  {offers[activeOffer].title}
                </Typography>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
              >
                <Typography variant="h6" sx={{
                  fontWeight: 400,
                  mb: 4,
                  fontSize: { xs: "1rem", sm: "1.3rem", md: "1.7rem" },
                  fontFamily: "'Poppins', sans-serif",
                  opacity: 0.92,
                  lineHeight: 1.6,
                  textShadow: `0 2px 10px ${alpha(theme.palette.common.black, 0.4)}`,
                }}>
                  {offers[activeOffer].subtitle}
                </Typography>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}
                  sx={{
                    bgcolor: "#ff6f61",
                    color: "white",
                    fontWeight: 700,
                    px: { xs: 6, md: 8 },
                    py: { xs: 1.5, md: 2 },
                    borderRadius: "50px",
                    fontSize: { xs: "1rem", md: "1.2rem" },
                    textTransform: "none",
                    boxShadow: `0 8px 30px ${alpha("#ff6f61", 0.5)}`,
                    "&:hover": {
                      bgcolor: "#ff4839",
                      transform: "translateY(-4px)",
                      boxShadow: `0 12px 40px ${alpha("#ff6f61", 0.6)}`,
                    },
                    transition: "all 0.4s ease",
                    fontFamily: "'Poppins', sans-serif",
                  }}
                  aria-label="Order Now"
                >
                  Order Now
                </Button>
              </motion.div>
            </Box>
          </Box>
        </motion.div>
      </AnimatePresence>
      <Box sx={{
        position: "absolute",
        bottom: 20,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        gap: 2.5,
        zIndex: 2,
      }}>
        {offers.map((_, index) => (
          <motion.div
            key={index}
            onClick={() => setActiveOffer(index)}
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: activeOffer === index ? "#ff6f61" : alpha(theme.palette.grey[400], 0.7),
              cursor: "pointer",
              border: `2px solid ${theme.palette.common.white}`,
            }}
            whileHover={{ scale: 1.4 }}
            transition={{ type: "spring", stiffness: 400 }}
            role="button"
            aria-label={`Go to offer ${index + 1}`}
          />
        ))}
      </Box>
    </Box>
  );
});

// MenuItem Component
const MenuItem = React.memo(({ item, addToCart, addToFavorites, removeFromFavorites, isFavorite, itemRef }) => {
  const [liked, setLiked] = useState(isFavorite);
  const [added, setAdded] = useState(false);
  const theme = useTheme();
  const controls = useAnimation();

  const handleAddToCart = async () => {
    setAdded(true);
    try {
      await addToCart(item);
      await controls.start({
        scale: [1, 1.3, 1],
        rotate: [0, 10, -10, 0],
        transition: { duration: 0.6 },
      });
    } catch (err) {
      toast.error("Failed to add to cart");
    }
    setTimeout(() => setAdded(false), 1500);
  };

  const handleToggleFavorite = async () => {
    setLiked(!liked);
    try {
      if (!liked) {
        await addToFavorites(item);
      } else {
        await removeFromFavorites(item.id);
      }
    } catch (err) {
      setLiked(liked); // Revert on error
      toast.error("Failed to update favorites");
    }
  };

  return (
    <motion.div
      ref={itemRef}
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      whileHover={{ scale: 1.05, y: -10 }}
      whileTap={{ scale: 0.95 }}
    >
      <Card sx={{
        borderRadius: "28px",
        overflow: "hidden",
        position: "relative",
        background: "white",
        boxShadow: `0 12px 35px ${alpha(theme.palette.grey[300], 0.15)}`,
        transition: "all 0.5s ease",
        "&:hover": {
          boxShadow: `0 18px 50px ${alpha(theme.palette.grey[400], 0.25)}`,
          "& .food-image": { transform: "scale(1.1) rotate(-2deg)" },
        },
      }}>
        <Box sx={{ position: "relative", overflow: "hidden", paddingTop: "70%" }}>
          <CardMedia
            component="img"
            image={item.image || "https://via.placeholder.com/300"}
            alt={item.name}
            className="food-image"
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.7s cubic-bezier(0.25, 1, 0.5, 1)",
            }}
          />
          <Box sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(180deg, ${alpha(theme.palette.common.black, 0)} 40%, ${alpha(theme.palette.common.black, 0.8)} 100%)`,
          }} />
          {item.offer && (
            <Box
              sx={{
                position: "absolute",
                top: 20,
                left: -50,
                background: "#ff6f61",
                color: "white",
                padding: "8px 50px",
                transform: "rotate(-45deg)",
                fontWeight: 700,
                boxShadow: `0 6px 25px ${alpha("#ff6f61", 0.35)}`,
                zIndex: 1,
                fontSize: { xs: "0.9rem", md: "1rem" },
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              {item.offer}
            </Box>
          )}
          <Chip
            label={item.category === "veg" ? "Veg" : "Non-Veg"}
            color={item.category === "veg" ? "success" : "error"}
            sx={{
              position: "absolute",
              top: 20,
              right: 20,
              fontWeight: 700,
              padding: "6px 12px",
              borderRadius: "20px",
              fontFamily: "'Poppins', sans-serif",
              boxShadow: `0 4px 12px ${alpha(theme.palette.grey[900], 0.15)}`,
            }}
          />
        </Box>

        <CardContent sx={{ p: { xs: 3, md: 4 }, position: "relative" }}>
          <Box sx={{
            position: "absolute",
            top: -35,
            right: 20,
            display: "flex",
            gap: 1.5,
          }}>
            <motion.div whileTap={{ scale: 0.85 }} transition={{ type: "spring", stiffness: 400 }}>
              <IconButton
                onClick={handleToggleFavorite}
                sx={{
                  bgcolor: alpha(theme.palette.background.paper, 0.9),
                  color: liked ? "#ff6f61" : "grey.600",
                  "&:hover": { bgcolor: "white" },
                  boxShadow: `0 6px 20px ${alpha(theme.palette.grey[400], 0.2)}`,
                  width: 40,
                  height: 40,
                }}
                aria-label={liked ? `Remove ${item.name} from favorites` : `Add ${item.name} to favorites`}
              >
                <FiHeart size={20} />
              </IconButton>
            </motion.div>
          </Box>

          <Typography variant="h6" sx={{
            fontWeight: 700,
            color: "text.primary",
            mb: 2,
            minHeight: { xs: 40, md: 50 },
            lineHeight: 1.3,
            fontFamily: "'Poppins', sans-serif",
            letterSpacing: "0.5px",
            fontSize: { xs: "1.1rem", md: "1.25rem" },
          }}>
            {item.name}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
            <Rating
              value={item.rating || 4.5}
              readOnly
              precision={0.5}
              sx={{ color: "#ffca28" }}
              aria-label={`Rating: ${item.rating || 4.5} out of 5`}
            />
            <Typography variant="body2" color="text.secondary" sx={{ fontFamily: "'Poppins', sans-serif", fontSize: "0.9rem" }}>
              ({item.reviews || "New"})
            </Typography>
          </Box>

          <Typography variant="body2" sx={{
            mb: 3,
            color: "text.secondary",
            minHeight: { xs: 50, md: 60 },
            lineHeight: 1.6,
            fontFamily: "'Poppins', sans-serif",
            fontSize: { xs: "0.85rem", md: "0.95rem" },
            opacity: 0.9,
          }}>
            {item.description || "Delicious and freshly prepared."}
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 1.5 }}>
            <Typography variant="h6" sx={{
              fontWeight: 700,
              color: "#ff6f61",
              display: "flex",
              alignItems: "center",
              gap: 1,
              fontFamily: "'Poppins', sans-serif",
              fontSize: { xs: "1.2rem", md: "1.5rem" },
            }}>
              <motion.span
                animate={added ? {
                  scale: [1, 1.5, 1],
                  color: ["#ff6f61", theme.palette.primary.main, "#ff6f61"],
                } : {}}
                transition={{ duration: 0.8 }}
              >
                ₹{item.price.toFixed(2)}
              </motion.span>
            </Typography>

            <motion.div
              animate={controls}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Button
                variant="contained"
                onClick={handleAddToCart}
                startIcon={<FiShoppingCart />}
                sx={{
                  background: "#ff6f61",
                  "&:hover": { background: "#ff4839" },
                  borderRadius: "40px",
                  px: { xs: 4, md: 5 },
                  py: 1.2,
                  fontWeight: 700,
                  textTransform: "none",
                  boxShadow: `0 8px 25px ${alpha("#ff6f61", 0.35)}`,
                  fontSize: { xs: "0.95rem", md: "1.1rem" },
                  fontFamily: "'Poppins', sans-serif",
                }}
                aria-label={`Add ${item.name} to cart`}
              >
                {added ? "Added!" : "Add"}
              </Button>
            </motion.div>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
});

// CartDrawer Component
const CartDrawer = React.memo(({ open, onClose, cartItems, removeFromCart, navigate, updateQuantity, user }) => {
  const theme = useTheme();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const totalPrice = useMemo(() => 
    cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0), 
    [cartItems]
  );

  const handleCheckout = () => {
    if (!user) {
      toast.error("Please log in to proceed to checkout");
      navigate("/?login=true");
      onClose();
      return;
    }
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      onClose();
      navigate("/checkout");
    }, 500);
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          width: { xs: "90%", sm: 480 },
          background: "linear-gradient(180deg, #ffffff 0%, #f9fafb 100%)",
          boxShadow: `0 15px 60px ${alpha(theme.palette.grey[900], 0.25)}`,
          borderRadius: "24px 0 0 24px",
          border: `1px solid ${alpha(theme.palette.grey[200], 0.1)}`,
          overflow: "hidden",
        },
      }}
    >
      <Box sx={{
        p: 4,
        background: "linear-gradient(135deg, #ff6f61 0%, #ff4839 100%)",
        color: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderRadius: "24px 0 0 0",
        boxShadow: `0 8px 25px ${alpha("#ff6f61", 0.35)}`,
      }}>
        <Typography variant="h5" sx={{ 
          fontFamily: "'Poppins', sans-serif", 
          fontWeight: 700, 
          letterSpacing: "1px",
          textShadow: `0 2px 10px ${alpha(theme.palette.common.black, 0.3)}`,
        }}>
          Your Cart ({cartItems.length})
        </Typography>
        <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
          <IconButton onClick={onClose} aria-label="Close cart">
            <FiX size={28} color="white" />
          </IconButton>
        </motion.div>
      </Box>

      <List sx={{ flexGrow: 1, overflowY: "auto", p: 3 }}>
        {cartItems.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h5" color="text.secondary" sx={{ 
              fontFamily: "'Poppins', sans-serif", 
              fontWeight: 600, 
              fontSize: "1.5rem",
              mb: 2,
            }}>
              Your Cart is Empty
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ 
              fontFamily: "'Poppins', sans-serif", 
              fontSize: "1rem",
              mb: 3,
              opacity: 0.8,
            }}>
              Add some delicious items to get started!
            </Typography>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="contained"
                onClick={() => { onClose(); navigate("/menu"); }}
                sx={{
                  borderRadius: "50px",
                  bgcolor: "#ff6f61",
                  "&:hover": { bgcolor: "#ff4839" },
                  py: 1.5,
                  px: 4,
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 600,
                  fontSize: "1.1rem",
                  boxShadow: `0 8px 25px ${alpha("#ff6f61", 0.3)}`,
                }}
                aria-label="Explore Menu"
              >
                Explore Menu
              </Button>
            </motion.div>
          </Box>
        ) : (
          cartItems.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <ListItem sx={{ 
                py: 2.5, 
                px: 3,
                mb: 2,
                borderRadius: "16px",
                background: "white",
                boxShadow: `0 6px 20px ${alpha(theme.palette.grey[300], 0.15)}`,
                "&:hover": { 
                  background: "#fef8f5",
                  boxShadow: `0 8px 25px ${alpha(theme.palette.grey[400], 0.2)}`,
                },
                transition: "all 0.3s ease",
              }}>
                <CardMedia
                  component="img"
                  image={item.image || "https://via.placeholder.com/70"}
                  alt={item.name}
                  sx={{ 
                    width: 70, 
                    height: 70, 
                    borderRadius: "12px", 
                    mr: 3, 
                    boxShadow: `0 4px 15px ${alpha(theme.palette.grey[400], 0.2)}`,
                  }}
                />
                <ListItemText
                  primary={
                    <Typography sx={{ 
                      fontFamily: "'Poppins', sans-serif", 
                      fontWeight: 600, 
                      fontSize: "1.1rem",
                      color: theme.palette.text.primary,
                    }}>
                      {item.name}
                    </Typography>
                  }
                  secondary={
                    <Box sx={{ mt: 1.5 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            sx={{ 
                              minWidth: 36, 
                              height: 36,
                              borderRadius: "50%", 
                              borderColor: "#ff6f61", 
                              color: "#ff6f61",
                              "&:hover": { borderColor: "#ff4839", color: "#ff4839" },
                            }}
                            aria-label={`Decrease quantity of ${item.name}`}
                          >
                            -
                          </Button>
                        </motion.div>
                        <Typography sx={{ 
                          fontFamily: "'Poppins', sans-serif", 
                          fontSize: "1.1rem", 
                          fontWeight: 500,
                          minWidth: 30,
                          textAlign: "center",
                        }}>
                          {item.quantity}
                        </Typography>
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            sx={{ 
                              minWidth: 36, 
                              height: 36,
                              borderRadius: "50%", 
                              borderColor: "#ff6f61", 
                              color: "#ff6f61",
                              "&:hover": { borderColor: "#ff4839", color: "#ff4839" },
                            }}
                            aria-label={`Increase quantity of ${item.name}`}
                          >
                            +
                          </Button>
                        </motion.div>
                      </Box>
                      <Typography sx={{ 
                        fontFamily: "'Poppins', sans-serif", 
                        color: "#ff6f61", 
                        fontWeight: 700, 
                        fontSize: "1.2rem",
                      }}>
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </Typography>
                    </Box>
                  }
                />
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }}>
                  <Button
                    variant="text"
                    color="error"
                    onClick={() => removeFromCart(item.id)}
                    sx={{ 
                      fontFamily: "'Poppins', sans-serif", 
                      fontWeight: 600, 
                      fontSize: "0.95rem",
                      textTransform: "none",
                      "&:hover": { bgcolor: "#ffebee" },
                    }}
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    Remove
                  </Button>
                </motion.div>
              </ListItem>
            </motion.div>
          ))
        )}
      </List>

      {cartItems.length > 0 && (
        <Box sx={{ 
          p: 4, 
          borderTop: `1px solid ${alpha(theme.palette.grey[200], 0.25)}`,
          background: "white",
          borderRadius: "0 0 24px 0",
          boxShadow: `0 -8px 25px ${alpha(theme.palette.grey[200], 0.15)}`,
        }}>
          <Box sx={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center", 
            mb: 3,
            px: 2,
          }}>
            <Typography variant="h6" sx={{ 
              fontFamily: "'Poppins', sans-serif", 
              fontWeight: 600, 
              fontSize: "1.3rem",
              color: theme.palette.text.primary,
            }}>
              Subtotal
            </Typography>
            <Typography variant="h5" sx={{ 
              fontFamily: "'Poppins', sans-serif", 
              fontWeight: 700, 
              color: "#ff6f61",
              fontSize: "1.6rem",
            }}>
              ₹{totalPrice.toFixed(2)}
            </Typography>
          </Box>
          <motion.div 
            whileHover={{ scale: 1.03 }} 
            whileTap={{ scale: 0.97 }}
            animate={isCheckingOut ? { scale: [1, 1.05, 1] } : {}}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Button
              variant="contained"
              fullWidth
              onClick={handleCheckout}
              disabled={isCheckingOut}
              sx={{
                borderRadius: "50px",
                py: 2,
                fontSize: "1.2rem",
                fontWeight: 700,
                fontFamily: "'Poppins', sans-serif",
                textTransform: "none",
                bgcolor: "#ff6f61",
                "&:hover": { 
                  bgcolor: "#ff4839",
                  boxShadow: `0 12px 40px ${alpha("#ff6f61", 0.5)}`,
                },
                boxShadow: `0 10px 30px ${alpha("#ff6f61", 0.4)}`,
                "&:disabled": { bgcolor: "#ff6f6190" },
              }}
              aria-label="Proceed to Checkout"
            >
              {isCheckingOut ? "Processing..." : "Proceed to Checkout"}
            </Button>
          </motion.div>
        </Box>
      )}
    </Drawer>
  );
});

// Main Menu Component
const Menu = forwardRef((props, ref) => {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [selectedType, setSelectedType] = useState("all");
  const [cartOpen, setCartOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { user, cart, favorites, addToCart, removeFromCart, addToFavorites, removeFromFavorites, updateCartItem, fetchMenu, fetchFavorites, fetchCart } = useAuth();
  const foodTypes = ["all", "biryani", "burger", "pizza", "icecream", "starter", "main", "dessert"];
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const filterRef = useRef(null);
  const itemRefs = useRef(new Map());
  const offersRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useImperativeHandle(ref, () => ({
    scrollToOffers: () => {
      if (offersRef.current) {
        offersRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    },
  }));

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [menuData, favoritesData, cartData] = await Promise.all([
          fetchMenu().catch((err) => {
            console.error("Fetch menu failed:", err);
            throw new Error("Failed to fetch menu: " + err.message);
          }),
          user ? fetchFavorites().catch((err) => {
            console.error("Failed to fetch favorites:", err);
            return [];
          }) : Promise.resolve([]),
          user ? fetchCart().catch((err) => {
            console.error("Failed to fetch cart:", err);
            return [];
          }) : Promise.resolve([]),
        ]);
        console.log("Fetched menu items:", menuData);
        setMenuItems(menuData || []);
        setOffers([
          { title: "50% Off First Order", subtitle: "Use code: FIRST50", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc926" },
          { title: "Free Delivery", subtitle: "On orders above ₹500", image: "https://images.unsplash.com/photo-1513106580091-1d82408b8cd6" },
          { title: "Combo Deal", subtitle: "Buy 2, Get 1 Free", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38" },
        ]);
      } catch (err) {
        setError("Failed to load menu: " + err.message);
        toast.error("Failed to load menu: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [fetchMenu, fetchFavorites, fetchCart, user]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchQuery = params.get("search");
    if (searchQuery) {
      const decodedSearch = decodeURIComponent(searchQuery);
      setSearchTerm(decodedSearch);
      const firstMatch = menuItems.find((item) =>
        item.name.toLowerCase().includes(decodedSearch.toLowerCase())
      );
      if (firstMatch && itemRefs.current.get(firstMatch.id)) {
        setTimeout(() => {
          itemRefs.current.get(firstMatch.id).scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }, 100);
      }
    }
  }, [location.search, menuItems]);

  const sortedAndFilteredItems = useMemo(() => {
    let items = menuItems.filter(
      (item) =>
        (selectedType === "all" ? true : item.type === selectedType) &&
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    switch (sortBy) {
      case "price-low":
        return items.sort((a, b) => a.price - b.price);
      case "price-high":
        return items.sort((a, b) => b.price - a.price);
      case "name":
        return items.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return items;
    }
  }, [selectedType, searchTerm, sortBy, menuItems]);

  useEffect(() => {
    const handleScroll = () => setScrolled(scrollY.get() > 100);
    const unsubscribe = scrollY.onChange(handleScroll);
    return () => unsubscribe();
  }, [scrollY]);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const handleHomeClick = () => navigate("/");

  const handleAddToCart = async (item) => {
    if (!user) {
      toast.error("Please log in to add items to cart");
      navigate("/?login=true");
      return;
    }
    try {
      await addToCart({ ...item, quantity: 1 });
      setSnackbarMessage(`${item.name} added to cart!`);
      setSnackbarOpen(true);
    } catch (err) {
      toast.error("Failed to add to cart");
    }
  };

  const handleRemoveFromCart = async (itemId) => {
    try {
      await removeFromCart(itemId);
    } catch (err) {
      toast.error("Failed to remove from cart");
    }
  };

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity >= 1) {
      try {
        await updateCartItem(itemId, newQuantity);
      } catch (err) {
        toast.error("Failed to update quantity");
      }
    }
  };

  const totalItems = useMemo(() => 
    cart.reduce((total, item) => total + item.quantity, 0), 
    [cart]
  );

  const handleLoginClick = () => {
    navigate("/?login=true");
  };

  // Move useTransform after all state hooks
  const y = useTransform(scrollY, [0, 600], [0, -300]);

  if (loading) {
    return (
      <Box sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Poppins', sans-serif",
      }}>
        <CircularProgress sx={{ color: "#ff6f61" }} />
        <Typography sx={{ ml: 2, color: "#ff6f61", fontFamily: "'Poppins', sans-serif" }}>
          Loading menu...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Poppins', sans-serif",
      }}>
        <Box sx={{ textAlign: "center", p: 4, bgcolor: alpha("#fff", 0.9), borderRadius: "20px" }}>
          <Typography sx={{ color: "#ff6f61", fontFamily: "'Poppins', sans-serif", mb: 2 }}>
            {error}
          </Typography>
          <Button
            onClick={() => window.location.reload()}
            sx={{ color: "#ff6f61", fontFamily: "'Poppins', sans-serif" }}
            aria-label="Retry"
          >
            Retry
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{
      background: "linear-gradient(180deg, #fef8f5 0%, #f9fafb 100%)",
      minHeight: "100vh",
      position: "relative",
      fontFamily: "'Poppins', sans-serif",
      overflowX: "hidden",
    }}>
      <AppBar
        position="fixed"
        sx={{
          background: scrolled ? alpha(theme.palette.common.white, 0.98) : alpha(theme.palette.grey[900], 0.05),
          boxShadow: scrolled ? `0 6px 25px ${alpha(theme.palette.grey[900], 0.08)}` : "none",
          transition: "all 0.4s ease",
          py: { xs: 1, md: 1.5 },
          borderBottom: scrolled ? `1px solid ${alpha(theme.palette.grey[200], 0.15)}` : "none",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", maxWidth: "xl", mx: "auto", width: "100%", px: { xs: 2, md: 3 } }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, md: 2 } }}>
            {isMobile && (
              <IconButton onClick={() => setMenuOpen(true)} sx={{ color: scrolled ? "#ff6f61" : "white" }} aria-label="Open menu">
                <FiMenu size={26} />
              </IconButton>
            )}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Typography variant="h5" sx={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 800,
                color: scrolled ? "#ff6f61" : "white",
                letterSpacing: "1.5px",
                fontSize: { xs: "1.5rem", md: "2rem" },
                textShadow: scrolled ? "none" : `0 3px 15px ${alpha(theme.palette.common.black, 0.25)}`,
              }}>
                Flavor Fleet
              </Typography>
            </motion.div>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1.5, md: 3 } }}>
            {!isMobile && (
              <>
                <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                  <IconButton
                    onClick={handleHomeClick}
                    sx={{ color: scrolled ? "#ff6f61" : "white" }}
                    aria-label="Go to home"
                  >
                    <FiHome size={26} />
                  </IconButton>
                </motion.div>
                <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                  <IconButton 
                    onClick={user ? () => navigate("/profile") : handleLoginClick}
                    sx={{ color: scrolled ? "#ff6f61" : "white" }}
                    aria-label={user ? "Go to profile" : "Log in"}
                  >
                    {user ? <FiUser size={26} /> : <FiLogIn size={26} />}
                  </IconButton>
                </motion.div>
              </>
            )}
            <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
              <IconButton
                onClick={() => setCartOpen(true)}
                sx={{ color: scrolled ? "#ff6f61" : "white" }}
                aria-label={`Open cart with ${totalItems} items`}
              >
                <Badge badgeContent={totalItems} color="error">
                  <FiShoppingCart size={26} />
                </Badge>
              </IconButton>
            </motion.div>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        sx={{ "& .MuiDrawer-paper": { 
          width: { xs: 260, sm: 300 }, 
          borderRadius: "0 24px 24px 0", 
          background: alpha(theme.palette.common.white, 0.98), 
          boxShadow: `0 12px 40px ${alpha(theme.palette.grey[900], 0.2)}` 
        } }}
      >
        <Box sx={{ p: 4 }}>
          <Typography variant="h6" sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: "#ff6f61", fontSize: "1.5rem" }}>
            Menu
          </Typography>
          <Divider sx={{ my: 2, borderColor: alpha(theme.palette.grey[200], 0.3) }} />
          <List>
            <ListItem button onClick={handleHomeClick}>
              <ListItemText primary="Home" primaryTypographyProps={{ fontFamily: "'Poppins', sans-serif", fontWeight: 500, fontSize: "1.1rem" }} />
            </ListItem>
            <ListItem button onClick={user ? () => navigate("/profile") : handleLoginClick}>
              <ListItemText primary={user ? "Profile" : "Log In"} primaryTypographyProps={{ fontFamily: "'Poppins', sans-serif", fontWeight: 500, fontSize: "1.1rem" }} />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cart}
        removeFromCart={handleRemoveFromCart}
        navigate={navigate}
        updateQuantity={handleUpdateQuantity}
        user={user}
      />

      <Box sx={{
        height: { xs: "80vh", sm: "85vh", md: "95vh" },
        position: "relative",
        overflow: "hidden",
        mb: { xs: 6, md: 10 },
      }}>
        <motion.div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: `url('https://images.unsplash.com/photo-1543353071-10c8ba85a904')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            y,
            filter: "brightness(0.5)",
          }}
        />
        <Box sx={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(135deg, ${alpha("#ff6f61", 0.7)} 0%, ${alpha(theme.palette.secondary.main, 0.6)} 100%)`,
        }} />

        <Container maxWidth="xl" sx={{ height: "100%", position: "relative" }}>
          <Box sx={{
            position: "absolute",
            top: "50%",
            left: 0,
            right: 0,
            transform: "translateY(-50%)",
            textAlign: "center",
            px: { xs: 3, md: 5 },
            zIndex: 1,
          }}>
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, delay: 0.3 }}
            >
              <Typography variant="h2" sx={{
                color: "common.white",
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 800,
                fontSize: { xs: "2.8rem", sm: "4rem", md: "6rem" },
                mb: 3,
                letterSpacing: "2px",
                textShadow: `0 8px 25px ${alpha(theme.palette.common.black, 0.6)}`,
              }}>
                Flavor Fleet
              </Typography>
              <Typography variant="h5" sx={{
                color: "rgba(255,255,255,0.95)",
                maxWidth: 900,
                mx: "auto",
                fontWeight: 400,
                fontSize: { xs: "1.2rem", sm: "1.5rem", md: "2rem" },
                fontFamily: "'Poppins', sans-serif",
                textShadow: `0 4px 15px ${alpha(theme.palette.common.black, 0.4)}`,
                lineHeight: 1.5,
              }}>
                Savor the Flavor, Delivered Fresh
              </Typography>
            </motion.div>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl">
        <OffersCarousel offersRef={offersRef} offers={offers} />
      </Container>

      <Container maxWidth="xl">
        <SearchBar onSearch={setSearchTerm} onSortChange={(e) => setSortBy(e.target.value)} sortBy={sortBy} />
      </Container>

      <Box ref={filterRef} sx={{
        position: "sticky",
        top: { xs: 60, md: 80 },
        zIndex: 1100,
        py: { xs: 3, md: 4 },
        mb: { xs: 6, md: 8 },
        background: alpha(theme.palette.common.white, 0.98),
        boxShadow: `0 8px 30px ${alpha(theme.palette.grey[900], 0.08)}`,
        borderRadius: "24px",
        border: `1px solid ${alpha(theme.palette.grey[200], 0.1)}`,
      }}>
        <Container maxWidth="xl">
          <Box sx={{
            display: "flex",
            gap: { xs: 1.5, md: 2.5 },
            overflowX: "auto",
            pb: 1,
            "&::-webkit-scrollbar": { height: 6 },
            "&::-webkit-scrollbar-thumb": { background: alpha(theme.palette.grey[400], 0.5), borderRadius: 3 },
            justifyContent: "center",
            alignItems: "center",
          }}>
            <LayoutGroup>
              {foodTypes.map((type) => (
                <motion.div key={type} layoutId={type} transition={{ type: "spring", stiffness: 350 }}>
                  <Chip
                    label={
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, px: 0.5 }}>
                        {type === "biryani" && "🍚"}
                        {type === "burger" && "🍔"}
                        {type === "pizza" && "🍕"}
                        {type === "icecream" && "🍨"}
                        {type === "starter" && "🍢"}
                        {type === "main" && "🍽️"}
                        {type === "dessert" && "🍰"}
                        {type === "all" ? "All" : type.charAt(0).toUpperCase() + type.slice(1)}
                      </Box>
                    }
                    onClick={() => setSelectedType(type)}
                    sx={{
                      px: { xs: 2, md: 3 },
                      py: 0.9,
                      fontSize: { xs: "0.9rem", md: "1rem" },
                      fontWeight: 600,
                      backgroundColor: selectedType === type ? "#ff6f61" : alpha(theme.palette.grey[200], 0.9),
                      color: selectedType === type ? "white" : "text.primary",
                      "&:hover": {
                        backgroundColor: selectedType === type ? "#ff4839" : alpha(theme.palette.grey[300], 0.95),
                      },
                      transition: "all 0.4s ease",
                      borderRadius: "40px",
                      fontFamily: "'Poppins', sans-serif",
                      boxShadow: `0 4px 15px ${alpha(theme.palette.grey[900], 0.08)}`,
                    }}
                    aria-label={`Filter by ${type}`}
                  />
                </motion.div>
              ))}
            </LayoutGroup>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: { xs: 6, md: 8 } }}>
        {sortedAndFilteredItems.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h5" sx={{ fontFamily: "'Poppins', sans-serif", color: "#ff6f61", mb: 2 }}>
              No items found
            </Typography>
            <Button
              onClick={() => { setSearchTerm(""); setSelectedType("all"); setSortBy("default"); }}
              sx={{ color: "#ff6f61", fontFamily: "'Poppins', sans-serif" }}
              aria-label="Reset filters"
            >
              Reset Filters
            </Button>
          </Box>
        ) : (
          <Grid container spacing={{ xs: 3, md: 5 }} sx={{ mb: { xs: 8, md: 12 } }}>
            <AnimatePresence mode="wait">
              <LayoutGroup>
                {sortedAndFilteredItems.map((item) => (
                  <Grid item key={item.id} xs={12} sm={6} md={4} lg={3}>
                    <MenuItem 
                      item={item} 
                      addToCart={handleAddToCart}
                      addToFavorites={addToFavorites}
                      removeFromFavorites={removeFromFavorites}
                      isFavorite={favorites.some(fav => fav.itemId === item.id)} // Updated to use itemId
                      itemRef={(el) => itemRefs.current.set(item.id, el)}
                    />
                  </Grid>
                ))}
              </LayoutGroup>
            </AnimatePresence>
          </Grid>
        )}
      </Container>

      <Zoom in={scrolled}>
        <Box
          onClick={scrollToTop}
          role="presentation"
          sx={{ position: "fixed", bottom: { xs: 20, md: 40 }, right: { xs: 20, md: 40 }, zIndex: 1000 }}
        >
          <Tooltip title="Back to Top" placement="left" arrow>
            <Fab
              color="primary"
              size="large"
              sx={{
                boxShadow: `0 8px 25px ${alpha("#ff6f61", 0.35)}`,
                "&:hover": { transform: "scale(1.15)" },
                transition: "all 0.4s ease",
                background: "#ff6f61",
                width: { xs: 50, md: 60 },
                height: { xs: 50, md: 60 },
              }}
              aria-label="Back to top"
            >
              <FiChevronUp size={30} />
            </Fab>
          </Tooltip>
        </Box>
      </Zoom>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          sx={{
            width: "100%",
            borderRadius: "16px",
            boxShadow: `0 8px 25px ${alpha(theme.palette.success.main, 0.25)}`,
            fontFamily: "'Poppins', sans-serif",
            fontSize: "1.1rem",
            background: alpha(theme.palette.success.light, 0.95),
            border: `1px solid ${alpha(theme.palette.success.main, 0.15)}`,
            py: 1,
            px: 3,
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Box sx={{
        width: "100%",
        py: { xs: 4, md: 6 },
        background: `linear-gradient(180deg, ${theme.palette.grey[900]} 0%, ${theme.palette.grey[800]} 100%)`,
        color: "common.white",
        textAlign: "center",
      }}>
        <Typography variant="body1" sx={{ fontFamily: "'Poppins', sans-serif", fontSize: { xs: "0.95rem", md: "1.1rem" }, letterSpacing: "0.6px" }}>
          © {new Date().getFullYear()} Flavor Fleet. All Rights Reserved.
        </Typography>
      </Box>
    </Box>
  );
});

Menu.displayName = "Menu";

export default React.memo(Menu);