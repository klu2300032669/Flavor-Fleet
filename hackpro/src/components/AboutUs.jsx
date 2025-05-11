  import React, { useState, useEffect } from 'react';
  import {
    Container, Typography, Box, Grid, Paper, useTheme, useMediaQuery, alpha, Chip, Button,
    IconButton, AppBar, Toolbar, Card, CardMedia, Modal, Fab, Zoom, Tooltip, Drawer
  } from '@mui/material';
  import { motion, AnimatePresence, useScroll, useTransform, useAnimation } from 'framer-motion';
  import { FiAward, FiTruck, FiHeart, FiUsers, FiMapPin, FiHome, FiCoffee, FiStar, FiX, FiChevronUp, FiMenu } from 'react-icons/fi';
  import { TbChefHat, TbHistory } from 'react-icons/tb';
  import { useNavigate } from 'react-router-dom';

  const flavorFleetTheme = {
    primary: '#ff6f61', // Coral
    secondary: '#ff4839', // Red-Orange
    light: '#fef8f5', // Soft Peach
  };

  const teamMembers = [
    { id: 1, name: "Saketh Surubhotla", role: "Founder & CEO", image: '/saketh.jpg', bio: "Visionary leader with 15+ years in culinary tech innovation" },
    { id: 2, name: "Chakradhar Suthapalli", role: "Head Chef", image: '/chakradhar.jpg', bio: "Michelin-starred chef curating our premium restaurant network" },
    { id: 3, name: "Eswar", role: "CTO", bio: "Tech architect behind our seamless delivery platform" },
  ];

  const locations = [
    { city: "Mumbai", image: "https://rb.gy/n2s61o", restaurants: 150 },
    { city: "Delhi", image: "https://rb.gy/t41any", restaurants: 120 },
    { city: "Bangalore", image: "https://rb.gy/vleq70", restaurants: 100 },
    { city: "Chennai", image: "https://rb.gy/0e75cf", restaurants: 80 },
    { city: "Kolkata", image: "https://rb.gy/6fyvof", restaurants: 70 },
    { city: "Hyderabad", image: "https://rb.gy/fh974o", restaurants: 90 },
  ];

  const AboutUs = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [activeSection, setActiveSection] = useState('story');
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [scrolled, setScrolled] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const navigate = useNavigate();
    const { scrollY } = useScroll();
    const controls = useAnimation();

    const sections = [
      { id: 'story', label: 'Our Story', icon: <TbHistory /> },
      { id: 'team', label: 'Our Team', icon: <FiUsers /> },
      { id: 'values', label: 'Values', icon: <FiHeart /> },
      { id: 'locations', label: 'Locations', icon: <FiMapPin /> },
    ];

    // Debounced scroll handler for performance
    useEffect(() => {
      const debounce = (func, wait) => {
        let timeout;
        return (...args) => {
          clearTimeout(timeout);
          timeout = setTimeout(() => func(...args), wait);
        };
      };
      const handleScroll = debounce(() => {
        const currentScrollY = window.scrollY;
        setScrolled(currentScrollY > 50);
        controls.start(currentScrollY > 50 ? 'scrolled' : 'initial');
      }, 100);
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, [controls]);

    const handleHomeClick = () => navigate('/');
    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    const HeroSection = () => {
      const yText = useTransform(scrollY, [0, 500], [0, -50]); // Parallax effect for title
      return (
        <Box sx={{
          height: { xs: '50vh', md: '80vh' },
          position: 'relative',
          overflow: 'hidden',
          mb: { xs: 4, md: 6 },
        }}>
          <motion.div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '120%',
              backgroundImage: `url('https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              y: useTransform(scrollY, [0, 500], [0, -150]),
            }}
          />
          <Box sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: `radial-gradient(circle at center, ${alpha(flavorFleetTheme.primary, 0.25)}, rgba(0,0,0,0.65)), linear-gradient(135deg, rgba(0,0,0,0.6), ${alpha(flavorFleetTheme.secondary, 0.35)})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Container maxWidth="xl">
              <Box sx={{ textAlign: 'center' }}>
                <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
                  <Typography
                    variant="h1"
                    style={{ y: yText }}
                    sx={{
                      color: '#fff',
                      fontFamily: "'Playfair Display', serif",
                      fontWeight: 900,
                      textShadow: '0 6px 25px rgba(0,0,0,0.5)',
                      fontSize: { xs: '2rem', md: '5rem' },
                      mb: 2,
                      letterSpacing: { xs: 1, md: 2 },
                    }}
                  >
                    Flavor Fleet
                  </Typography>
                  <Typography variant="h5" sx={{
                    color: '#fff',
                    fontFamily: "'Roboto', sans-serif",
                    fontWeight: 400,
                    textShadow: '0 3px 10px rgba(0,0,0,0.3)',
                    fontSize: { xs: '1rem', md: '1.6rem' },
                    mb: 3,
                    letterSpacing: 0.5,
                  }}>
                    Savor India's Finest, Delivered
                  </Typography>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/menu')}
                    sx={{
                      px: { xs: 3, md: 6 },
                      py: 1.5,
                      fontSize: { xs: '0.9rem', md: '1.2rem' },
                      borderRadius: '50px',
                      background: `linear-gradient(45deg, ${flavorFleetTheme.primary}, ${flavorFleetTheme.secondary})`,
                      color: '#fff',
                      boxShadow: `0 8px 25px ${alpha(flavorFleetTheme.primary, 0.5)}`,
                      fontFamily: "'Roboto', sans-serif",
                      fontWeight: 600,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: `linear-gradient(45deg, ${flavorFleetTheme.secondary}, ${flavorFleetTheme.primary})`,
                        transform: 'scale(1.05)',
                        boxShadow: `0 12px 35px ${alpha(flavorFleetTheme.primary, 0.7)}`,
                        animation: 'pulse 1.8s infinite ease-in-out',
                      },
                    }}
                  >
                    Discover Menu
                  </Button>
                </motion.div>
              </Box>
            </Container>
          </Box>
        </Box>
      );
    };

    const TeamMemberCard = ({ member }) => (
      <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <Paper elevation={10} sx={{
          p: { xs: 2, md: 3 },
          borderRadius: 4,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          background: `linear-gradient(145deg, #ffffff, ${flavorFleetTheme.light})`,
          border: `1px solid ${alpha(flavorFleetTheme.primary, 0.15)}`,
          boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            boxShadow: `0 12px 40px ${alpha(flavorFleetTheme.primary, 0.3)}, inset 0 0 10px ${alpha(flavorFleetTheme.primary, 0.2)}`,
            border: `1px solid ${flavorFleetTheme.primary}`,
            '& img': { transform: 'scale(1.1)' },
          },
        }}>
          <Box
            component="img"
            src={member.image || 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg'}
            alt={member.name}
            sx={{
              width: { xs: 120, md: 180 },
              height: { xs: 120, md: 180 },
              borderRadius: '16px',
              mb: 2,
              boxShadow: `0 6px 20px ${alpha(flavorFleetTheme.primary, 0.2)}`,
              objectFit: 'cover',
              border: `3px solid ${flavorFleetTheme.primary}`,
              transition: 'transform 0.3s ease',
            }}
          />
          <Typography variant="h6" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, mb: 1, color: '#333', fontSize: { xs: '1rem', md: '1.2rem' } }}>
            {member.name}
          </Typography>
          <Chip label={member.role} sx={{ mb: 2, background: flavorFleetTheme.primary, color: '#fff', fontWeight: 600, borderRadius: '16px', fontSize: { xs: '0.8rem', md: '0.9rem' } }} />
          <Typography variant="body2" sx={{ fontFamily: "'Roboto', sans-serif", color: '#666', fontSize: { xs: '0.85rem', md: '1rem' }, lineHeight: 1.8 }}>
            {member.bio}
          </Typography>
        </Paper>
      </motion.div>
    );

    const LocationCard = ({ location }) => (
      <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <Card sx={{
          height: '100%',
          cursor: 'pointer',
          borderRadius: 4,
          overflow: 'hidden',
          boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
          background: `linear-gradient(145deg, rgba(255,255,255,0.95), ${alpha(flavorFleetTheme.light, 0.9)})`,
          backdropFilter: 'blur(8px)',
          border: `1px solid ${alpha(flavorFleetTheme.primary, 0.2)}`,
          position: 'relative',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            boxShadow: `0 16px 50px ${alpha(flavorFleetTheme.primary, 0.4)}, inset 0 0 10px ${alpha(flavorFleetTheme.primary, 0.2)}`,
            border: `1px solid ${flavorFleetTheme.primary}`,
            '& img': { transform: 'scale(1.1)' },
          },
        }} onClick={() => { setSelectedLocation(location); setModalOpen(true); }}>
          <CardMedia
            component="img"
            height={isMobile ? 180 : 220}
            image={location.image}
            alt={location.city}
            sx={{
              objectFit: 'cover',
              filter: 'brightness(85%)',
              transition: 'transform 0.3s ease',
            }}
          />
          <Box sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            p: 2,
            background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
            color: '#fff',
            textAlign: 'center',
          }}>
            <Typography variant="h6" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, mb: 0.5, textShadow: '0 2px 10px rgba(0,0,0,0.5)', fontSize: { xs: '1rem', md: '1.2rem' } }}>
              {location.city}
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: "'Roboto', sans-serif", fontWeight: 500, fontSize: { xs: '0.8rem', md: '0.9rem' }, letterSpacing: 0.5 }}>
              {location.restaurants} Restaurants
            </Typography>
          </Box>
        </Card>
      </motion.div>
    );

    const LocationModal = () => (
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} aria-labelledby="location-modal-title" aria-describedby="location-modal-description">
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1, boxShadow: `0 0 20px ${alpha(flavorFleetTheme.primary, 0.3)}` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '85%', sm: '70%', md: '50%' },
            bgcolor: '#fff',
            boxShadow: `0 25px 70px ${alpha(flavorFleetTheme.primary, 0.15)}`,
            p: { xs: 2, md: 4 },
            borderRadius: 4,
            background: `linear-gradient(145deg, #ffffff, ${flavorFleetTheme.light})`,
            border: `1px solid ${alpha(flavorFleetTheme.primary, 0.2)}`,
          }}>
            <IconButton
              aria-label="close"
              onClick={() => setModalOpen(false)}
              sx={{ position: 'absolute', right: 8, top: 8, color: flavorFleetTheme.primary, '&:hover': { background: alpha(flavorFleetTheme.primary, 0.1) } }}
            >
              <FiX size={isMobile ? 20 : 24} />
            </IconButton>
            {selectedLocation && (
              <>
                <Typography id="location-modal-title" variant="h5" sx={{ mb: 2, fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#333', fontSize: { xs: '1.5rem', md: '1.8rem' }, letterSpacing: 0.5 }}>
                  {selectedLocation.city}
                </Typography>
                <Box component="img" src={selectedLocation.image} alt={selectedLocation.city} sx={{ width: '100%', height: 'auto', borderRadius: 3, mb: 2, boxShadow: `0 6px 20px ${alpha(flavorFleetTheme.primary, 0.2)}` }} />
                <Typography id="location-modal-description" variant="body1" sx={{ fontFamily: "'Roboto', sans-serif", color: '#666', lineHeight: 1.8, fontSize: { xs: '0.9rem', md: '1rem' }, letterSpacing: 0.3 }}>
                  In {selectedLocation.city}, Flavor Fleet collaborates with {selectedLocation.restaurants} restaurants to deliver the city’s signature flavors right to your door.
                </Typography>
              </>
            )}
          </Box>
        </motion.div>
      </Modal>
    );

    return (
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        background: `linear-gradient(180deg, ${alpha('#fff', 0.95)}, ${alpha(flavorFleetTheme.light, 0.9)}), url('https://www.transparenttextures.com/patterns/noise.png')`,
        backgroundSize: 'cover',
        // animation: 'textureMove 20s infinite linear', // Commented out for performance; uncomment if desired
      }}>
        <AppBar
          position="fixed"
          elevation={0}
          sx={{
            background: `linear-gradient(90deg, ${alpha(flavorFleetTheme.light, 0.98)}, ${alpha(flavorFleetTheme.primary, 0.15)})`,
            backdropFilter: 'blur(15px)',
            boxShadow: scrolled
              ? `0 4px 20px ${alpha(flavorFleetTheme.primary, 0.25)}`
              : `0 2px 10px ${alpha(flavorFleetTheme.primary, 0.1)}`,
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
                      boxShadow: `0 0 15px ${alpha(flavorFleetTheme.primary, 0.3)}`,
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
                letterSpacing: 1.5,
                textShadow: `0 2px 10px ${alpha(flavorFleetTheme.primary, 0.2)}`,
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
                onClick={() => setDrawerOpen(true)}
                sx={{
                  color: flavorFleetTheme.primary,
                  '&:hover': { background: alpha(flavorFleetTheme.primary, 0.1) },
                }}
              >
                <FiMenu size={isMobile ? 20 : 24} />
              </IconButton>
            ) : (
              <Box sx={{ width: 48 }} />
            )}
          </Toolbar>
        </AppBar>
        <Toolbar sx={{ minHeight: { xs: 56, md: 64 } }} />

        <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
          <Box sx={{ width: 250, p: 2, background: `linear-gradient(145deg, #fff, ${flavorFleetTheme.light})`, boxShadow: `0 4px 15px ${alpha(flavorFleetTheme.primary, 0.1)}` }}>
            <IconButton onClick={() => setDrawerOpen(false)} sx={{ mb: 2, color: flavorFleetTheme.primary }}>
              <FiX size={isMobile ? 20 : 24} />
            </IconButton>
            {sections.map((section) => (
              <Button
                key={section.id}
                onClick={() => { setActiveSection(section.id); setDrawerOpen(false); }}
                startIcon={section.icon}
                sx={{
                  display: 'block',
                  fontFamily: "'Roboto', sans-serif",
                  fontWeight: 700,
                  fontSize: '1rem',
                  color: activeSection === section.id ? flavorFleetTheme.primary : '#666',
                  py: 1.5,
                  '&:hover': { color: flavorFleetTheme.primary, backgroundColor: alpha(flavorFleetTheme.primary, 0.1) },
                  transition: 'all 0.3s ease',
                }}
              >
                {section.label}
              </Button>
            ))}
          </Box>
        </Drawer>

        <HeroSection />

        <Container maxWidth="xl" sx={{ flexGrow: 1, pb: { xs: 4, md: 6 } }}>
          {!isMobile && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: scrolled ? 1 : 0.9 }}
              transition={{ duration: 0.4 }}
            >
              <Box sx={{
                position: 'sticky',
                top: { xs: 56, md: 64 },
                zIndex: 1100,
                py: 2,
                mb: { xs: 4, md: 6 },
                bgcolor: alpha('#fff', 0.98),
                backdropFilter: 'blur(15px)',
                borderBottom: `1px solid ${alpha(flavorFleetTheme.primary, 0.3)}`,
                boxShadow: scrolled ? `0 6px 25px ${alpha(flavorFleetTheme.primary, 0.15)}` : 'none',
                transition: 'all 0.4s ease-in-out',
                borderRadius: 3,
              }}>
                <Grid container justifyContent="center" spacing={3}>
                  {sections.map((section) => (
                    <Grid item key={section.id}>
                      <Button
                        onClick={() => setActiveSection(section.id)}
                        startIcon={section.icon}
                        sx={{
                          fontFamily: "'Roboto', sans-serif",
                          fontWeight: 700,
                          fontSize: '1.1rem',
                          color: activeSection === section.id ? flavorFleetTheme.primary : '#666',
                          borderBottom: activeSection === section.id ? `3px solid ${flavorFleetTheme.primary}` : '3px solid transparent',
                          borderRadius: 0,
                          px: 2.5,
                          py: 1,
                          position: 'relative',
                          transition: 'all 0.3s ease-in-out',
                          '&:hover': {
                            backgroundColor: 'transparent',
                            color: flavorFleetTheme.primary,
                            transform: 'translateY(-2px)',
                          },
                          '&::after': activeSection === section.id ? {
                            content: '""',
                            position: 'absolute',
                            bottom: -3,
                            left: 0,
                            width: '100%',
                            height: '3px',
                            background: `linear-gradient(90deg, ${flavorFleetTheme.primary}, ${flavorFleetTheme.secondary})`,
                            animation: 'underline 1.5s infinite alternate',
                          } : {},
                        }}
                      >
                        {section.label}
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            <motion.div key={activeSection} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }}>
              {activeSection === 'story' && (
                <Box sx={{ mb: { xs: 6, md: 10 } }}>
                  <Grid container spacing={isMobile ? 2 : 6} alignItems="center">
                    <Grid item xs={12} md={6}>
                      <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                        <Typography variant="h3" sx={{ mb: 3, fontFamily: "'Playfair Display', serif", color: '#333', fontSize: { xs: '1.8rem', md: '2.5rem' }, letterSpacing: 1 }}>
                          Redefining Food Delivery
                        </Typography>
                        <Typography variant="body1" paragraph sx={{ fontFamily: "'Roboto', sans-serif", fontSize: { xs: '0.9rem', md: '1.1rem' }, color: '#666', lineHeight: 1.8, letterSpacing: 0.3 }}>
                          Born in the heart of the pandemic, Flavor Fleet turned a challenge into an opportunity—connecting food lovers with local restaurants. 
                          From a humble start, we’ve grown into a nationwide culinary network, celebrating India’s rich flavors.
                        </Typography>
                        <Typography variant="body1" paragraph sx={{ fontFamily: "'Roboto', sans-serif", fontSize: { xs: '0.9rem', md: '1.1rem' }, color: '#666', lineHeight: 1.8, letterSpacing: 0.3 }}>
                          Our mission blends passion, innovation, and authenticity, delivering not just meals but experiences that honor every region’s cuisine.
                        </Typography>
                      </motion.div>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                        <Paper elevation={8} sx={{ p: { xs: 1, md: 2 }, borderRadius: 4, overflow: 'hidden', background: `linear-gradient(145deg, #fff, ${flavorFleetTheme.light})`, boxShadow: `0 6px 20px ${alpha(flavorFleetTheme.primary, 0.1)}` }}>
                          <Box
                            component="img"
                            src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg"
                            alt="Our Story"
                            sx={{
                              width: '100%',
                              borderRadius: 3,
                              transition: 'transform 0.4s ease-in-out',
                              '&:hover': { transform: 'scale(1.05)' },
                            }}
                          />
                        </Paper>
                      </motion.div>
                    </Grid>
                  </Grid>
                </Box>
              )}

              {activeSection === 'team' && (
                <Box sx={{ mb: { xs: 6, md: 10 } }}>
                  <Typography variant="h3" align="center" sx={{ mb: { xs: 4, md: 6 }, fontFamily: "'Playfair Display', serif", color: '#333', fontSize: { xs: '1.8rem', md: '2.5rem' }, letterSpacing: 1 }}>
                    Meet the Visionaries
                  </Typography>
                  <Grid container spacing={isMobile ? 2 : 4}>
                    {teamMembers.map((member) => (
                      <Grid item xs={12} sm={6} md={4} key={member.id}>
                        <TeamMemberCard member={member} />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}

              {activeSection === 'values' && (
                <Box sx={{ mb: { xs: 6, md: 10 } }}>
                  <Typography variant="h3" align="center" sx={{ mb: { xs: 4, md: 6 }, fontFamily: "'Playfair Display', serif", color: '#333', fontSize: { xs: '1.8rem', md: '2.5rem' }, letterSpacing: 1 }}>
                    Our Core Values
                  </Typography>
                  <Grid container spacing={isMobile ? 2 : 4}>
                    {[
                      { icon: <TbChefHat />, title: "Culinary Excellence", description: "Partnering with top chefs for unmatched taste." },
                      { icon: <FiTruck />, title: "Swift Delivery", description: "Fast, fresh, and reliable every time." },
                      { icon: <FiHeart />, title: "Community First", description: "Empowering local restaurants and cultures." },
                      { icon: <FiCoffee />, title: "Customer Delight", description: "Your satisfaction fuels our passion." },
                      { icon: <FiStar />, title: "Innovation", description: "Redefining food delivery with tech." },
                      { icon: <FiAward />, title: "Quality", description: "Uncompromising standards in every bite." },
                    ].map((value, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <motion.div whileHover={{ y: -10 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }}>
                          <Paper elevation={6} sx={{
                            p: { xs: 2, md: 3 },
                            textAlign: 'center',
                            borderRadius: 4,
                            background: `linear-gradient(145deg, ${alpha('#fff', 0.95)}, ${alpha(flavorFleetTheme.light, 0.9)})`,
                            backdropFilter: 'blur(10px)',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            transition: 'all 0.4s ease-in-out',
                            '&:hover': { boxShadow: `0 0 25px ${alpha(flavorFleetTheme.primary, 0.4)}, inset 0 0 10px ${alpha(flavorFleetTheme.primary, 0.2)}` },
                          }}>
                            <Box sx={{ fontSize: { xs: 36, md: 60 }, mb: 2, color: flavorFleetTheme.primary }}>
                              {value.icon}
                            </Box>
                            <Typography variant="h5" sx={{ mb: 1, fontFamily: "'Playfair Display', serif", color: '#333', fontSize: { xs: '1.1rem', md: '1.5rem' }, fontWeight: 600 }}>
                              {value.title}
                            </Typography>
                            <Typography variant="body2" sx={{ fontFamily: "'Roboto', sans-serif", color: '#666', fontSize: { xs: '0.85rem', md: '1rem' }, lineHeight: 1.8, letterSpacing: 0.3 }}>
                              {value.description}
                            </Typography>
                          </Paper>
                        </motion.div>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}

              {activeSection === 'locations' && (
                <Box sx={{ mb: { xs: 6, md: 10 } }}>
                  <Typography variant="h3" align="center" sx={{ mb: { xs: 4, md: 6 }, fontFamily: "'Playfair Display', serif", color: '#333', fontSize: { xs: '1.8rem', md: '2.5rem' }, letterSpacing: 1 }}>
                    Our Culinary Cities
                  </Typography>
                  <Grid container spacing={isMobile ? 2 : 4}>
                    {locations.map((location, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <LocationCard location={location} />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
            </motion.div>
          </AnimatePresence>
        </Container>

        <LocationModal />

        <Zoom in={scrolled}>
          <Box onClick={scrollToTop} role="presentation" sx={{ position: 'fixed', bottom: { xs: 16, md: 32 }, right: { xs: 16, md: 32 }, zIndex: 1000 }}>
            <Tooltip title="Scroll to top" placement="left" arrow>
              <Fab
                aria-label="Scroll back to top"
                sx={{
                  background: `linear-gradient(45deg, ${flavorFleetTheme.primary}, ${flavorFleetTheme.secondary})`,
                  color: '#fff',
                  '&:hover': { background: `linear-gradient(45deg, ${flavorFleetTheme.secondary}, ${flavorFleetTheme.primary})`, transform: 'scale(1.1)' },
                  boxShadow: `0 6px 20px ${alpha(flavorFleetTheme.primary, 0.4)}`,
                  width: { xs: 48, md: 56 },
                  height: { xs: 48, md: 56 },
                  transition: 'all 0.3s ease',
                }}
              >
                <FiChevronUp size={isMobile ? 20 : 24} />
              </Fab>
            </Tooltip>
          </Box>
        </Zoom>
      </Box>
    );
  };

  export default React.memo(AboutUs);

  const keyframes = `
    @keyframes underline {
      0% { transform: scaleX(0.9); }
      100% { transform: scaleX(1); }
    }
    @keyframes pulse {
      0% { box-shadow: 0 8px 25px rgba(255,111,97,0.5); }
      50% { box-shadow: 0 12px 35px rgba(255,111,97,0.8); }
      100% { box-shadow: 0 8px 25px rgba(255,111,97,0.5); }
    }
    @keyframes textureMove {
      0% { background-position: 0 0; }
      100% { background-position: 100px 100px; }
    }
  `;

  const styleSheet = document.createElement("style");
  styleSheet.textContent = keyframes;
  document.head.appendChild(styleSheet);