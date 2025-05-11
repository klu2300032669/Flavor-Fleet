import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Typography, TextField, Button, Box, Grid, useTheme, useMediaQuery,
  IconButton, Paper, styled, alpha, Zoom, Tooltip, Fab, AppBar, Toolbar, Snackbar, Alert
} from '@mui/material';
import { motion, useScroll, useTransform, useSpring, useAnimation } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiArrowRight, FiChevronUp, FiHome, FiMenu, FiSend, FiX } from 'react-icons/fi';

// Theme Colors from AboutUs
const flavorFleetTheme = {
  primary: '#ff6f61', // Coral
  secondary: '#ff4839', // Red-Orange
  light: '#fef8f5', // Soft Peach
};

// Styled Components
const FloatingShape = styled(motion.div)(() => ({
  position: 'absolute',
  background: `linear-gradient(135deg, ${flavorFleetTheme.primary}, ${alpha(flavorFleetTheme.secondary, 0.7)})`,
  borderRadius: '40% 60% 70% 30% / 50% 30% 70% 60%',
  filter: 'blur(90px)',
  opacity: 0.25,
  zIndex: 0,
}));

const ContactCard = styled(motion(Paper))(() => ({
  position: 'relative',
  overflow: 'hidden',
  borderRadius: 24,
  background: `linear-gradient(145deg, ${alpha('#fff', 0.9)}, ${alpha(flavorFleetTheme.light, 0.85)})`,
  backdropFilter: 'blur(20px)',
  boxShadow: '0 12px 40px rgba(255, 111, 97, 0.15)',
  border: `1px solid ${alpha(flavorFleetTheme.primary, 0.1)}`,
  transition: 'all 0.4s ease-in-out',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 20px 50px rgba(255, 111, 97, 0.25)',
  },
}));

// Animation Configurations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.3 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 80 } },
};

const ContactUs = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: '',
  });
  const [notification, setNotification] = useState({ open: false, type: null, message: '' });
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const controls = useAnimation();
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '35%']);
  const ySpring = useSpring(y, { stiffness: 200, damping: 60 });

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 50);
      controls.start(currentScrollY > 50 ? 'scrolled' : 'initial');
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [controls]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { firstName, lastName, email, message } = formData;

    // Client-side validation
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !message.trim()) {
      setNotification({ open: true, type: 'error', message: 'Please fill out all fields!' });
      return;
    }

    // Prepare the data to send to the backend
    const contactMessage = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      message: message.trim(),
      createdAt: new Date().getTime(), // Note: Backend now sets this, but included for compatibility
    };

    try {
      const response = await fetch('http://localhost:8080/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactMessage),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send message');
      }

      // Reset form and show success notification
      setFormData({ firstName: '', lastName: '', email: '', message: '' });
      setNotification({ open: true, type: 'success', message: 'Message Sent Successfully!' });
    } catch (error) {
      console.error('Error sending contact message:', error);
      setNotification({ open: true, type: 'error', message: error.message || 'Failed to send message' });
    }
  };

  const handleCloseNotification = () => {
    setNotification({ open: false, type: null, message: '' });
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const handleHomeClick = () => navigate('/');

  return (
    <Box
      ref={containerRef}
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(180deg, ${alpha(flavorFleetTheme.light, 0.95)}, ${alpha('#fff', 0.8)})`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* AppBar and other UI components remain unchanged */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          background: `linear-gradient(90deg, ${alpha(flavorFleetTheme.light, 0.95)}, ${alpha(flavorFleetTheme.primary, 0.2)})`,
          backdropFilter: 'blur(15px)',
          boxShadow: scrolled
            ? '0 4px 20px rgba(255, 111, 97, 0.25)'
            : '0 2px 10px rgba(255, 111, 97, 0.1)',
          borderBottom: `1px solid ${alpha(flavorFleetTheme.primary, 0.15)}`,
          transition: 'all 0.4s ease-in-out',
        }}
      >
        <Toolbar
          sx={{
            minHeight: { xs: 56, md: 64 },
            px: { xs: 1.5, md: 3 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Tooltip title="Back to Home" arrow>
              <IconButton
                edge="start"
                onClick={handleHomeClick}
                sx={{
                  mr: { xs: 1, md: 2 },
                  color: flavorFleetTheme.primary,
                  '&:hover': {
                    background: alpha(flavorFleetTheme.primary, 0.1),
                    boxShadow: '0 0 15px rgba(255, 111, 97, 0.3)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <FiHome size={isMobile ? 20 : 24} />
                </motion.div>
              </IconButton>
            </Tooltip>
          </motion.div>
          <Typography
            variant="h5"
            sx={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
              background: `linear-gradient(45deg, ${flavorFleetTheme.primary}, ${flavorFleetTheme.secondary})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              flexGrow: 1,
              textAlign: 'center',
              fontSize: { xs: '1.5rem', md: '2rem' },
              letterSpacing: 1,
              textShadow: '0 2px 10px rgba(255, 111, 97, 0.2)',
            }}
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, type: 'spring', stiffness: 80 }}
            >
              Flavor Fleet
            </motion.span>
          </Typography>
          {isMobile ? (
            <IconButton
              onClick={() => setMenuOpen(!menuOpen)}
              sx={{
                color: flavorFleetTheme.primary,
                '&:hover': { background: alpha(flavorFleetTheme.primary, 0.1) },
              }}
            >
              <FiMenu size={22} />
            </IconButton>
          ) : (
            <Box sx={{ width: 48 }} />
          )}
        </Toolbar>
      </AppBar>
      <Toolbar sx={{ minHeight: { xs: 56, md: 64 } }} />

      {/* Parallax Background */}
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `url('https://images.unsplash.com/photo-1543353071-10c8ba85a904')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          y: ySpring,
          opacity: 0.15,
        }}
      />

      {/* Floating Shape */}
      <FloatingShape
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, 180],
          borderRadius: ['40% 60% 70% 30% / 50% 30% 70% 60%', '60% 40% 30% 70% / 30% 60% 40% 70%'],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        style={{ width: 600, height: 600, top: -150, left: -150 }}
      />

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: { xs: 8, md: 12 }, position: 'relative', zIndex: 1 }}>
        <motion.div initial="hidden" animate="visible" variants={containerVariants} style={{ marginBottom: '3rem' }}>
          <motion.div variants={itemVariants}>
            <Typography
              variant="h1"
              sx={{
                fontWeight: 900,
                fontSize: { xs: '2.5rem', md: '5rem' },
                fontFamily: "'Playfair Display', serif",
                textAlign: 'center',
                mb: 2,
                background: `linear-gradient(45deg, ${flavorFleetTheme.primary}, ${flavorFleetTheme.secondary})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 4px 15px rgba(255, 111, 97, 0.3)',
              }}
            >
              Let's Connect
            </Typography>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Typography
              variant="h5"
              sx={{
                color: '#666',
                maxWidth: { xs: 500, md: 700 },
                mx: 'auto',
                textAlign: 'center',
                fontFamily: "'Lato', sans-serif",
                mb: { xs: 3, md: 6 },
                fontSize: { xs: '1rem', md: '1.5rem' },
                lineHeight: 1.5,
              }}
            >
              Have questions, suggestions, or just want to chat about food? We're all ears and can't wait to hear from you!
            </Typography>
          </motion.div>
        </motion.div>

        {/* Contact Grid */}
        <Grid container spacing={isMobile ? 3 : 6} sx={{ mb: 6 }}>
          {/* Contact Information */}
          <Grid item xs={12} md={5}>
            <ContactCard
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: 'spring', stiffness: 50 }}
              elevation={8}
            >
              <Box sx={{ p: { xs: 3, md: 5 } }}>
                <motion.div variants={containerVariants}>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 700,
                      mb: 4,
                      fontFamily: "'Playfair Display', serif",
                      fontSize: { xs: '1.75rem', md: '2.5rem' },
                      color: flavorFleetTheme.primary,
                    }}
                  >
                    Contact Information
                  </Typography>
                  {[
                    { icon: <FiMail />, title: 'Email Address', content: 'hello@flavorfleet.com', link: 'mailto:hello@flavorfleet.com' },
                    { icon: <FiPhone />, title: 'Phone Number', content: '+91 123 456 7890', link: 'tel:+911234567890' },
                    { icon: <FiMapPin />, title: 'Our Location', content: 'Mumbai, India', link: 'https://maps.app.goo.gl/' },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      whileHover={{ scale: 1.02, x: 5 }}
                      transition={{ type: 'spring', stiffness: 200 }}
                    >
                      <Box
                        component="a"
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          display: 'block',
                          p: { xs: 2, md: 3 },
                          mb: 2,
                          borderRadius: 4,
                          textDecoration: 'none',
                          background: alpha(flavorFleetTheme.primary, 0.08),
                          transition: 'all 0.3s ease',
                          '&:hover': { background: alpha(flavorFleetTheme.primary, 0.15) },
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 2, md: 3 } }}>
                          <motion.div whileHover={{ rotate: 10 }}>
                            <Box
                              sx={{
                                width: { xs: 36, md: 50 },
                                height: { xs: 36, md: 50 },
                                borderRadius: '50%',
                                background: `linear-gradient(45deg, ${flavorFleetTheme.primary}, ${flavorFleetTheme.secondary})`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#fff',
                                boxShadow: '0 4px 15px rgba(255, 111, 97, 0.2)',
                              }}
                            >
                              {item.icon}
                            </Box>
                          </motion.div>
                          <Box>
                            <Typography
                              variant="subtitle1"
                              sx={{ fontWeight: 600, fontSize: { xs: '0.9rem', md: '1.1rem' }, color: '#333' }}
                            >
                              {item.title}
                            </Typography>
                            <Typography
                              variant="body1"
                              sx={{ color: 'text.secondary', fontSize: { xs: '0.85rem', md: '1rem' } }}
                            >
                              {item.content}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </motion.div>
                  ))}
                </motion.div>
              </Box>
            </ContactCard>
          </Grid>

          {/* Contact Form */}
          <Grid item xs={12} md={7}>
            <ContactCard
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: 'spring', stiffness: 50, delay: 0.1 }}
              elevation={8}
            >
              <Box component="form" onSubmit={handleSubmit} sx={{ p: { xs: 3, md: 5 } }}>
                <motion.div variants={containerVariants}>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 700,
                      mb: 4,
                      fontFamily: "'Playfair Display', serif",
                      fontSize: { xs: '1.75rem', md: '2.5rem' },
                      color: flavorFleetTheme.primary,
                    }}
                  >
                    Send Us a Message
                  </Typography>
                  <Grid container spacing={isMobile ? 2 : 3}>
                    {[
                      { label: 'First Name', name: 'firstName', gridProps: { xs: 12, sm: 6 } },
                      { label: 'Last Name', name: 'lastName', gridProps: { xs: 12, sm: 6 } },
                      { label: 'Email', name: 'email', gridProps: { xs: 12 }, type: 'email' },
                      { label: 'Message', name: 'message', gridProps: { xs: 12 }, multiline: true, rows: 4 },
                    ].map((field, index) => (
                      <Grid key={index} item {...field.gridProps}>
                        <motion.div
                          variants={itemVariants}
                          whileHover={{ scale: 1.01 }}
                          transition={{ type: 'spring', stiffness: 150 }}
                        >
                          <TextField
                            fullWidth
                            label={field.label}
                            name={field.name}
                            value={formData[field.name]}
                            onChange={handleInputChange}
                            variant="outlined"
                            type={field.type || 'text'}
                            multiline={field.multiline}
                            rows={field.rows}
                            required
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 3,
                                fieldset: { borderColor: alpha(flavorFleetTheme.primary, 0.2) },
                                '&:hover fieldset': { borderColor: flavorFleetTheme.primary },
                                '&.Mui-focused fieldset': { borderColor: flavorFleetTheme.secondary },
                              },
                              '& .MuiInputBase-input': { fontSize: { xs: '0.85rem', md: '1rem' } },
                            }}
                          />
                        </motion.div>
                      </Grid>
                    ))}
                  </Grid>
                  <Box sx={{ mt: 4, textAlign: 'right' }}>
                    <motion.div
                      variants={itemVariants}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        endIcon={<FiArrowRight />}
                        sx={{
                          px: { xs: 3, md: 5 },
                          py: { xs: 1, md: 1.5 },
                          borderRadius: 3,
                          fontSize: { xs: '0.85rem', md: '1rem' },
                          fontWeight: 600,
                          background: `linear-gradient(45deg, ${flavorFleetTheme.primary}, ${flavorFleetTheme.secondary})`,
                          boxShadow: '0 6px 20px rgba(255, 111, 97, 0.2)',
                          '&:hover': {
                            background: `linear-gradient(45deg, ${flavorFleetTheme.secondary}, ${flavorFleetTheme.primary})`,
                            boxShadow: '0 8px 25px rgba(255, 111, 97, 0.3)',
                          },
                        }}
                      >
                        Send Message
                      </Button>
                    </motion.div>
                  </Box>
                </motion.div>
              </Box>
            </ContactCard>
          </Grid>
        </Grid>

        {/* Snackbar Notification */}
        <Snackbar
          open={notification.open}
          autoHideDuration={3000}
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={handleCloseNotification}
            severity={notification.type === 'success' ? 'success' : 'error'}
            icon={notification.type === 'success' ? <FiSend size={18} /> : <FiX size={18} />}
            sx={{
              width: '100%',
              background: notification.type === 'success'
                ? `linear-gradient(135deg, ${flavorFleetTheme.primary}, ${flavorFleetTheme.secondary})`
                : alpha('#fff', 0.9),
              color: notification.type === 'success' ? '#fff' : flavorFleetTheme.secondary,
              boxShadow: '0 4px 15px rgba(255, 111, 97, 0.2)',
              '& .MuiAlert-icon': {
                color: notification.type === 'success' ? '#fff' : flavorFleetTheme.secondary,
                display: 'flex',
                alignItems: 'center',
              },
            }}
          >
            {notification.message}
          </Alert>
        </Snackbar>

        {/* Scroll to Top */}
        <Zoom in={scrolled} style={{ transitionDelay: scrolled ? '300ms' : '0ms' }}>
          <Box
            onClick={scrollToTop}
            sx={{
              position: 'fixed',
              bottom: { xs: 16, md: 32 },
              right: { xs: 16, md: 32 },
              zIndex: 1000,
            }}
          >
            <Tooltip title="Scroll to top" placement="left" arrow>
              <Fab
                sx={{
                  background: `linear-gradient(45deg, ${flavorFleetTheme.primary}, ${flavorFleetTheme.secondary})`,
                  color: '#fff',
                  '&:hover': { background: `linear-gradient(45deg, ${flavorFleetTheme.secondary}, ${flavorFleetTheme.primary})` },
                  boxShadow: '0 4px 15px rgba(255, 111, 97, 0.2)',
                }}
                size={isMobile ? 'small' : 'large'}
              >
                <motion.div animate={{ y: [0, -3, 0] }} transition={{ duration: 1.2, repeat: Infinity }}>
                  <FiChevronUp size={isMobile ? 20 : 26} />
                </motion.div>
              </Fab>
            </Tooltip>
          </Box>
        </Zoom>
      </Container>
    </Box>
  );
};

export default ContactUs;