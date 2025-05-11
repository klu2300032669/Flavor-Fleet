import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import {
  FaUserCircle,
  FaEdit,
  FaShoppingBag,
  FaHeart,
  FaCog,
  FaSignOutAlt,
  FaStar,
  FaTrash,
  FaCartPlus,
  FaMapPin,
  FaLock,
  FaBell,
  FaArrowLeft,
  FaUtensils,
  FaUsers,
  FaPlus,
  FaSave,
  FaEnvelope,
} from "react-icons/fa";
import { FiMapPin, FiCalendar } from "react-icons/fi";
import { toast } from "react-toastify";
import PropTypes from "prop-types";

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
`;

const gradientBG = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const bounce = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.03); }
`;

const slideIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const glow = keyframes`
  0% { box-shadow: 0 0 5px rgba(255, 102, 102, 0.5); }
  50% { box-shadow: 0 0 15px rgba(255, 102, 102, 0.8); }
  100% { box-shadow: 0 0 5px rgba(255, 102, 102, 0.5); }
`;

// Styled Components (unchanged except for new additions)
const ProfileWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #ffecd2, #fce8e6, #e6f0fa, #f4e8ff);
  background-size: 300% 300%;
  animation: ${gradientBG} 12s ease infinite;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  font-family: "Poppins", sans-serif;
  position: relative;
`;

const BackButton = styled.button`
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: transparent;
  color: #ff6666;
  border: 1px solid #ff6666;
  border-radius: 50%;
  padding: 0.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1.2rem;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
  }

  &:focus {
    outline: 2px solid #ff6666;
    outline-offset: 2px;
  }
`;

const ProfileContainer = styled.div`
  width: 100%;
  max-width: 1100px;
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 2rem;
  animation: ${fadeIn} 0.7s ease-out;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 1rem;
  }
`;

const ProfileSidebar = styled.div`
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Avatar = styled.div`
  width: 130px;
  height: 130px;
  border-radius: 50%;
  background: linear-gradient(135deg, #fff0f5, #e6f0fa);
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1.5rem;
  border: 3px solid #fff5f5;
  animation: ${bounce} 2.5s infinite ease-in-out;
  position: relative;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  svg {
    font-size: 4rem;
    color: #ff9999;
  }
`;

const AvatarInput = styled.input`
  display: none;
`;

const AvatarLabel = styled.label`
  position: absolute;
  bottom: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 1);
  }

  svg {
    font-size: 1.2rem;
    color: #ff6666;
  }
`;

const UserName = styled.h2`
  color: #ff6666;
  font-size: 1.7rem;
  font-weight: 600;
  margin-bottom: 0.4rem;
  text-align: center;
`;

const UserEmail = styled.p`
  color: #ff9999;
  font-size: 0.95rem;
  margin-bottom: 1rem;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const UserMemberSince = styled.p`
  color: #ffb3b3;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  margin-bottom: 1rem;

  svg {
    margin-right: 0.5rem;
  }
`;

const NotificationBell = styled.div`
  position: relative;
  margin-bottom: 1rem;
  cursor: pointer;
  color: #ff6666;
  font-size: 1.5rem;
  transition: color 0.3s ease;

  &:hover {
    color: #ff9999;
  }

  span {
    position: absolute;
    top: -5px;
    right: -5px;
    background: #ff4444;
    color: white;
    border-radius: 50%;
    padding: 0.2rem 0.5rem;
    font-size: 0.7rem;
  }
`;

const NotificationDropdown = styled.div`
  position: absolute;
  top: 3rem;
  left: 0;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  width: 250px;
  max-height: 300px;
  overflow-y: auto;
  z-index: 10;
  animation: ${slideIn} 0.3s ease-out;
`;

const NotificationItem = styled.div`
  padding: 0.8rem;
  border-bottom: 1px solid rgba(255, 180, 180, 0.3);
  color: #ff6666;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: rgba(255, 180, 180, 0.2);
  }

  &:last-child {
    border-bottom: none;
  }
`;

const NavMenu = styled.ul`
  width: 100%;
  list-style: none;
  padding: 0;
  margin: 0;
`;

const NavItem = styled.li`
  margin-bottom: 0.6rem;
`;

const NavLink = styled.button.attrs((props) => ({
  $active: props.active, // Use transient prop to prevent passing to DOM
}))`
  width: 100%;
  background: ${({ $active }) => ($active ? "rgba(255, 255, 255, 0.3)" : "transparent")};
  color: #ff6666;
  border: none;
  border-radius: 10px;
  padding: 0.8rem 1rem;
  font-size: 0.95rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: translateX(4px);
  }

  svg {
    margin-right: 0.7rem;
    font-size: 1.2rem;
  }

  &:focus {
    outline: 2px solid #ff6666;
    outline-offset: 2px;
  }
`;

const ProfileContent = styled.div`
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.3);
`;

const ProfileHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const ProfileTitle = styled.h1`
  color: #ff6666;
  font-size: 1.9rem;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;

  svg {
    margin-right: 0.6rem;
  }
`;

const Button = styled.button.attrs((props) => ({
  $secondary: props.secondary, // Use transient prop to prevent passing to DOM
}))`
  background: ${({ $secondary }) => ($secondary ? "transparent" : "rgba(255, 255, 255, 0.3)")};
  color: #ff6666;
  border: ${({ $secondary }) => ($secondary ? "1px solid #ff6666" : "none")};
  border-radius: 10px;
  padding: 0.6rem 1.2rem;
  font-size: 0.9rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${({ $secondary }) => ($secondary ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.4)")};
    transform: translateY(-2px);
  }

  &:focus {
    outline: 2px solid #ff6666;
    outline-offset: 2px;
  }

  svg {
    margin-right: ${({ iconOnly }) => (iconOnly ? "0" : "0.5rem")};
  }
`;

const ProfileSection = styled.div`
  margin-bottom: 2rem;
  animation: ${slideIn} 0.5s ease-out;
`;

const SectionTitle = styled.h3`
  color: #ff6666;
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(255, 180, 180, 0.5);
  display: flex;
  align-items: center;

  svg {
    margin-right: 0.6rem;
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1.5rem;
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  padding: 1.2rem;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: translateY(-4px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.05);
  }
`;

const AdminCard = styled(Card)`
  background: rgba(255, 180, 180, 0.3);
  border: 1px solid #ff6666;
  animation: ${glow} 2s infinite ease-in-out;

  &:hover {
    background: rgba(255, 180, 180, 0.4);
  }
`;

const InfoLabel = styled.p`
  color: #ffb3b3;
  font-size: 0.8rem;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const InfoValue = styled.p`
  color: #ff6666;
  font-size: 1rem;
  font-weight: 500;
  margin: 0;
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const StatCard = styled(Card)`
  text-align: center;
`;

const StatNumber = styled.div`
  color: #ff6666;
  font-size: 1.6rem;
  font-weight: 700;
  margin-bottom: 0.3rem;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    margin-right: 0.4rem;
    color: #ffd700;
  }
`;

const StatLabel = styled.div`
  color: #ffb3b3;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const OrderCard = styled(Card)`
  margin-bottom: 1.2rem;
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.8rem;
`;

const OrderId = styled.div`
  font-weight: 600;
  color: #ff6666;
  font-size: 0.95rem;
`;

const OrderStatus = styled.div`
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
  background: ${(props) =>
    props.status === "Delivered"
      ? "rgba(40, 167, 69, 0.2)"
      : props.status === "Pending"
      ? "rgba(255, 193, 7, 0.2)"
      : "rgba(220, 53, 69, 0.2)"};
  color: ${(props) =>
    props.status === "Delivered" ? "#28a745" : props.status === "Pending" ? "#ffc107" : "#dc3545"};
`;

const OrderDetails = styled.div`
  display: flex;
`;

const OrderImage = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  margin-right: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    font-size: 1.8rem;
    color: #ff9999;
  }
`;

const OrderInfo = styled.div`
  flex-grow: 1;
`;

const OrderTitle = styled.h4`
  color: #ff6666;
  font-size: 1rem;
  margin: 0 0 0.3rem 0;
`;

const OrderMeta = styled.div`
  color: #ffb3b3;
  font-size: 0.85rem;
`;

const OrderMetaContent = styled.span`
  display: flex;
  align-items: center;
  svg {
    margin-right: 0.4rem;
  }
`;

const OrderItems = styled.div`
  margin-top: 0.5rem;
`;

const OrderItem = styled.div`
  color: #ff6666;
  font-size: 0.9rem;
  margin-bottom: 0.3rem;
`;

const FavoriteItem = styled(Card)`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const FavoriteImage = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  margin-right: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    font-size: 1.8rem;
    color: #ff9999;
  }
`;

const FavoriteContent = styled.div`
  flex-grow: 1;
`;

const FavoriteTitle = styled.h4`
  color: #ff6666;
  font-size: 1rem;
  margin: 0 0 0.3rem 0;
`;

const FavoriteMeta = styled.div`
  color: #ffb3b3;
  font-size: 0.85rem;
  display: flex;
  align-items: center;

  svg {
    margin-right: 0.4rem;
    color: #ffd700;
  }
`;

const ModalOverlay = styled.div.attrs((props) => ({
  $isOpen: props.isOpen, // Use transient prop to prevent passing to DOM
}))`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: ${fadeIn} 0.3s ease-out;
`;

const ModalContent = styled.div`
  background: #fff;
  border-radius: 20px;
  padding: 2rem;
  width: 100%;
  max-width: 500px;
  animation: ${slideIn} 0.3s ease-out;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ModalTitle = styled.h2`
  color: #ff6666;
  font-size: 1.5rem;
  font-weight: 600;
`;

const ModalClose = styled.button`
  background: none;
  border: none;
  color: #ff6666;
  font-size: 1.2rem;
  cursor: pointer;

  &:hover {
    color: #ff9999;
  }

  &:focus {
    outline: 2px solid #ff6666;
    outline-offset: 2px;
  }
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const FormLabel = styled.label`
  color: #ff6666;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`;

const FormInput = styled.input`
  padding: 0.8rem;
  border: 1px solid #ffb3b3;
  border-radius: 8px;
  font-size: 1rem;
  color: #333;

  &:focus {
    outline: none;
    border-color: #ff6666;
    box-shadow: 0 0 5px rgba(255, 102, 102, 0.3);
  }
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const FilterButton = styled.button.attrs((props) => ({
  $active: props.active, // Use transient prop to prevent passing to DOM
}))`
  background: ${({ $active }) => ($active ? "rgba(255, 255, 255, 0.3)" : "transparent")};
  color: #ff6666;
  border: 1px solid #ff6666;
  border-radius: 10px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  &:focus {
    outline: 2px solid #ff6666;
    outline-offset: 2px;
  }
`;

const AddressCard = styled(Card)`
  position: relative;
`;

const AddressActions = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  gap: 0.5rem;
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: 2rem;
`;

const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 180, 180, 0.3);
  border-top: 4px solid #ff6666;
  border-radius: 50%;
  animation: spin 2s linear infinite;
  margin: 0 auto 1rem;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  color: #ff6666;
  font-size: 1.2rem;
  font-weight: 500;
`;

const ErrorMessage = styled.div`
  background: rgba(255, 150, 150, 0.2);
  border-radius: 12px;
  padding: 1.2rem;
  text-align: center;
  color: #ff6666;
  font-size: 1.1rem;
`;

const AdminTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
`;

const AdminTableHeader = styled.th`
  background: rgba(255, 180, 180, 0.3);
  color: #ff6666;
  padding: 0.8rem;
  text-align: left;
  font-size: 0.9rem;
`;

const AdminTableRow = styled.tr`
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const AdminTableCell = styled.td`
  padding: 0.8rem;
  color: #ff6666;
  font-size: 0.9rem;
  border-bottom: 1px solid rgba(255, 180, 180, 0.3);
`;

const AdminSelect = styled.select`
  padding: 0.5rem;
  border: 1px solid #ffb3b3;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.2);
  color: #ff6666;
  font-size: 0.9rem;

  &:focus {
    outline: none;
    border-color: #ff6666;
  }
`;

const AdminFormInput = styled(FormInput)`
  width: 100%;
`;

// New Styled Component for Contact Messages Loading/Error
const MessagesLoadingContainer = styled(LoadingContainer)`
  padding: 1rem;
`;

const MessagesErrorMessage = styled(ErrorMessage)`
  margin-top: 1rem;
`;

// Reusable Modal Component
const Modal = ({ isOpen, onClose, title, children }) => {
  const modalRef = useRef();

  useEffect(() => {
    if (isOpen) {
      modalRef.current?.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <ModalOverlay $isOpen={isOpen}>
      <ModalContent
        role="dialog"
        aria-labelledby="modal-title"
        tabIndex={-1}
        ref={modalRef}
      >
        <ModalHeader>
          <ModalTitle id="modal-title">{title}</ModalTitle>
          <ModalClose onClick={onClose} aria-label="Close modal">
            ✕
          </ModalClose>
        </ModalHeader>
        {children}
      </ModalContent>
    </ModalOverlay>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

// Profile Component
const Profile = () => {
  const {
    user,
    token,
    getProfile,
    logout,
    favorites,
    orders,
    fetchOrders,
    addToCart,
    removeFromFavorites,
    updateProfile,
    fetchContactMessages,
    contactMessages, // Use contactMessages from AuthContext
    fetchAllUsers,
    updateUser,
    fetchAllOrders,
    updateOrderStatus,
    fetchMenu,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
  } = useAuth();
  const navigate = useNavigate();

  // State Management
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isMenuItemModalOpen, setIsMenuItemModalOpen] = useState(false);
  const [editAddress, setEditAddress] = useState(null);
  const [editMenuItem, setEditMenuItem] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", profilePicture: "" });
  const [addressForm, setAddressForm] = useState({
    line1: "",
    line2: "",
    city: "",
    pincode: "",
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [menuItemForm, setMenuItemForm] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
  });
  const [addresses, setAddresses] = useState([]);
  const [orderFilter, setOrderFilter] = useState("All");
  const [pendingOrders, setPendingOrders] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false); // Loading state for contact messages
  const [messagesError, setMessagesError] = useState(""); // Error state for contact messages

  // Fetch Profile and Admin Data
  useEffect(() => {
    let isMounted = true;

    const fetchProfileAndData = async () => {
      if (!token) {
        if (isMounted) {
          setError("Please log in to view your profile");
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);
        console.log("Fetching profile data...");

        const timeout = (promise, time) =>
          Promise.race([
            promise,
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error("Request timed out")), time)
            ),
          ]);

        // Fetch profile
        const profile = await timeout(getProfile(), 5000);
        console.log("Profile fetched:", profile);

        if (isMounted) {
          if (profile) {
            setProfileData(profile);
            setFormData({
              name: profile.name || "",
              email: profile.email || "",
              profilePicture: profile.profilePicture || "",
            });
            setAddresses(profile.addresses || []);
            setProfilePicture(profile.profilePicture || null);
          } else {
            throw new Error("Failed to load profile data");
          }

          // Fetch orders
          console.log("Fetching orders...");
          await timeout(fetchOrders(), 5000);
          console.log("Orders fetched:", orders);

          // Fetch admin data if admin
          if (user?.role === "ADMIN") {
            const [usersData, ordersData, menuData] = await Promise.all([
              fetchAllUsers().catch(() => []),
              fetchAllOrders().catch(() => []),
              fetchMenu().catch(() => []),
            ]);
            setAllUsers(usersData || []);
            setAllOrders(ordersData || []);
            setMenuItems(menuData || []);
            const pending = (ordersData || []).filter((o) => o.status === "Pending");
            setPendingOrders(pending);
            console.log("Admin data fetched:", { usersData, ordersData, menuData, pending });
          }
        }
      } catch (err) {
        console.error("Error in fetchProfileAndData:", err);
        if (isMounted) {
          setError(`Failed to load profile: ${err.message}`);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
          console.log("Loading state set to false");
        }
      }
    };

    fetchProfileAndData();

    return () => {
      isMounted = false;
      console.log("Cleanup: Component unmounted or re-rendered");
    };
  }, [token, getProfile, fetchOrders, user, fetchAllUsers, fetchAllOrders, fetchMenu]);

  // Fetch Contact Messages when the tab is opened
  useEffect(() => {
    if (user?.role === "ADMIN" && activeTab === "contact-messages") {
      const loadMessages = async () => {
        setMessagesLoading(true);
        setMessagesError("");
        try {
          await fetchContactMessages();
        } catch (err) {
          setMessagesError(`Failed to fetch contact messages: ${err.message}`);
          toast.error("Failed to fetch contact messages");
        } finally {
          setMessagesLoading(false);
        }
      };
      loadMessages();
    }
  }, [user, activeTab, fetchContactMessages]);

  // Handlers
  const handleLogout = () => {
    logout();
    toast.dismiss();
    toast.success("Logged out successfully!", {
      toastId: "logout-unique",
      style: {
        background: "#fff0f0",
        color: "#ff6666",
        borderRadius: "12px",
        boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
      },
    });
  };

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result;
        setProfilePicture(base64Image);
        try {
          const result = await updateProfile({ ...formData, profilePicture: base64Image });
          if (result.success) {
            setProfileData((prev) => ({ ...prev, profilePicture: base64Image }));
            setFormData((prev) => ({ ...prev, profilePicture: base64Image }));
            toast.success("Profile picture updated successfully!");
          } else {
            throw new Error(result.error || "Failed to update profile picture");
          }
        } catch (err) {
          toast.error("Failed to update profile picture: " + err.message);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const result = await updateProfile(formData);
      if (result.success) {
        setProfileData((prev) => ({ ...prev, ...formData }));
        setIsEditModalOpen(false);
        toast.success("Profile updated successfully!");
      } else {
        throw new Error(result.error || "Failed to update profile");
      }
    } catch (err) {
      toast.error("Failed to update profile: " + err.message);
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editAddress) {
        const result = await updateAddress(editAddress.id, addressForm);
        if (result.success) {
          setAddresses((prev) =>
            prev.map((addr) => (addr.id === editAddress.id ? result.address : addr))
          );
          toast.success("Address updated successfully!");
        } else {
          throw new Error(result.error || "Failed to update address");
        }
      } else {
        const result = await addAddress(addressForm);
        if (result.success) {
          setAddresses((prev) => [...prev, result.address]);
          toast.success("Address added successfully!");
        } else {
          throw new Error(result.error || "Failed to add address");
        }
      }
      setIsAddressModalOpen(false);
      setAddressForm({ line1: "", line2: "", city: "", pincode: "" });
      setEditAddress(null);
    } catch (err) {
      toast.error("Failed to save address: " + err.message);
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      const result = await deleteAddress(id);
      if (result.success) {
        setAddresses((prev) => prev.filter((addr) => addr.id !== id));
        toast.success("Address deleted successfully!");
      } else {
        throw new Error(result.error || "Failed to delete address");
      }
    } catch (err) {
      toast.error("Failed to delete address: " + err.message);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    try {
      const result = await updatePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        confirmPassword: passwordForm.confirmPassword,
      });
      if (result.success) {
        setIsPasswordModalOpen(false);
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        toast.success("Password updated successfully!");
      } else {
        throw new Error(result.error || "Failed to update password");
      }
    } catch (err) {
      toast.error("Failed to update password: " + err.message);
    }
  };

  const handleReorder = async (order) => {
    try {
      if (Array.isArray(order.items)) {
        for (const item of order.items) {
          await addToCart({ ...item, id: item.id, quantity: item.quantity });
        }
        toast.success("Items added to cart for reorder!");
      } else {
        toast.error("No items found in this order to reorder.");
      }
    } catch (err) {
      toast.error("Failed to reorder: " + err.message);
    }
  };

  const handleGoBack = () => {
    navigate("/");
  };

  const handleViewOrder = (orderId) => {
    navigate(`/admin/orders/${orderId}`);
    setShowNotifications(false);
  };

  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
  };

  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      const result = await updateUser(userId, { role: newRole });
      if (result.success) {
        setAllUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        );
        toast.success("User role updated successfully!");
      } else {
        throw new Error(result.error || "Failed to update user role");
      }
    } catch (err) {
      toast.error("Failed to update user role: " + err.message);
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const result = await updateOrderStatus(orderId, newStatus);
      if (result.success) {
        setAllOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
        setPendingOrders((prev) =>
          prev.filter((o) => o.id !== orderId || newStatus === "Pending")
        );
        toast.success("Order status updated successfully!");
      } else {
        throw new Error(result.error || "Failed to update order status");
      }
    } catch (err) {
      toast.error("Failed to update order status: " + err.message);
    }
  };

  const handleAddMenuItem = async (e) => {
    e.preventDefault();
    try {
      const result = editMenuItem
        ? await updateMenuItem(editMenuItem.id, menuItemForm)
        : await addMenuItem(menuItemForm);
      if (result.success) {
        setMenuItems((prev) =>
          editMenuItem
            ? prev.map((item) => (item.id === editMenuItem.id ? result.item : item))
            : [...prev, result.item]
        );
        setIsMenuItemModalOpen(false);
        setMenuItemForm({ name: "", price: "", description: "", image: "" });
        setEditMenuItem(null);
        toast.success(editMenuItem ? "Menu item updated successfully!" : "Menu item added successfully!");
      } else {
        throw new Error(result.error || "Failed to save menu item");
      }
    } catch (err) {
      toast.error("Failed to save menu item: " + err.message);
    }
  };

  const handleEditMenuItem = (item) => {
    setEditMenuItem(item);
    setMenuItemForm({
      name: item.name || "",
      price: item.price ? item.price.toString() : "",
      description: item.description || "",
      image: item.image || "",
    });
    setIsMenuItemModalOpen(true);
  };

  const handleDeleteMenuItem = async (id) => {
    try {
      const result = await deleteMenuItem(id);
      if (result.success) {
        setMenuItems((prev) => prev.filter((item) => item.id !== id));
        toast.success("Menu item deleted successfully!");
      } else {
        throw new Error(result.error || "Failed to delete menu item");
      }
    } catch (err) {
      toast.error("Failed to delete menu item: " + err.message);
    }
  };

  const handleFetchContactMessages = async () => {
    setMessagesLoading(true);
    setMessagesError("");
    try {
      await fetchContactMessages();
      toast.success("Contact messages fetched successfully!");
    } catch (err) {
      setMessagesError(`Failed to fetch contact messages: ${err.message}`);
      toast.error("Failed to fetch contact messages");
    } finally {
      setMessagesLoading(false);
    }
  };

  const filteredOrders = orders.filter((order) =>
    orderFilter === "All" ? true : order.status === orderFilter
  );

  // Render Loading State
  if (loading) {
    return (
      <ProfileWrapper>
        <LoadingContainer>
          <Spinner />
          <LoadingText>Loading your lovely profile...</LoadingText>
        </LoadingContainer>
      </ProfileWrapper>
    );
  }

  // Render Error State
  if (error) {
    return (
      <ProfileWrapper>
        <ProfileContainer>
          <ProfileContent>
            <ErrorMessage>{error}</ErrorMessage>
          </ProfileContent>
        </ProfileContainer>
      </ProfileWrapper>
    );
  }

  return (
    <ProfileWrapper>
      <BackButton onClick={handleGoBack} aria-label="Go back to homepage">
        <FaArrowLeft />
      </BackButton>
      <ProfileContainer>
        {/* Sidebar */}
        <ProfileSidebar>
          <Avatar>
            {profilePicture ? (
              <img src={profilePicture} alt="Profile" />
            ) : (
              <FaUserCircle />
            )}
            <AvatarLabel htmlFor="profile-pic-upload">
              <FaEdit />
            </AvatarLabel>
          </Avatar>
          <AvatarInput
            id="profile-pic-upload"
            type="file"
            accept="image/*"
            onChange={handleProfilePictureChange}
            aria-label="Upload profile picture"
          />
          <UserName>{profileData?.name || user?.name || "Sweet User"}</UserName>
          <UserEmail>
            {profileData?.email || user?.email || "sweetie@example.com"}
          </UserEmail>
          <UserMemberSince>
            <FiCalendar /> Since{" "}
            {new Date().toLocaleDateString("default", {
              month: "short",
              year: "numeric",
            })}
          </UserMemberSince>
          {user?.role === "ADMIN" && (
            <div style={{ position: "relative" }}>
              <NotificationBell
                onClick={toggleNotifications}
                aria-label="View notifications"
              >
                <FaBell />
                {pendingOrders.length > 0 && <span>{pendingOrders.length}</span>}
              </NotificationBell>
              {showNotifications && (
                <NotificationDropdown>
                  {pendingOrders.length > 0 ? (
                    pendingOrders.map((order) => (
                      <NotificationItem
                        key={order.id}
                        onClick={() => handleViewOrder(order.id)}
                      >
                        Order #{order.id} - Pending
                      </NotificationItem>
                    ))
                  ) : (
                    <NotificationItem>No pending orders</NotificationItem>
                  )}
                </NotificationDropdown>
              )}
            </div>
          )}
          <NavMenu>
            <NavItem>
              <NavLink
                active={activeTab === "profile"}
                onClick={() => setActiveTab("profile")}
                aria-current={activeTab === "profile" ? "page" : undefined}
              >
                <FaUserCircle /> Profile
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                active={activeTab === "orders"}
                onClick={() => setActiveTab("orders")}
                aria-current={activeTab === "orders" ? "page" : undefined}
              >
                <FaShoppingBag /> Orders
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                active={activeTab === "favorites"}
                onClick={() => setActiveTab("favorites")}
                aria-current={activeTab === "favorites" ? "page" : undefined}
              >
                <FaHeart /> Favorites
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                active={activeTab === "settings"}
                onClick={() => setActiveTab("settings")}
                aria-current={activeTab === "settings" ? "page" : undefined}
              >
                <FaCog /> Settings
              </NavLink>
            </NavItem>
            {user?.role === "ADMIN" && (
              <>
                <NavItem>
                  <NavLink
                    active={activeTab === "admin"}
                    onClick={() => setActiveTab("admin")}
                    aria-current={activeTab === "admin" ? "page" : undefined}
                  >
                    <FaUtensils /> Admin Profile
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    active={activeTab === "contact-messages"}
                    onClick={() => setActiveTab("contact-messages")} // Fetch is handled by useEffect
                    aria-current={activeTab === "contact-messages" ? "page" : undefined}
                  >
                    <FaEnvelope /> Contact Messages
                  </NavLink>
                </NavItem>
              </>
            )}
            <NavItem>
              <NavLink onClick={handleLogout} aria-label="Logout">
                <FaSignOutAlt /> Logout
              </NavLink>
            </NavItem>
          </NavMenu>
        </ProfileSidebar>

        {/* Main Content */}
        <ProfileContent>
          <ProfileHeader>
            <ProfileTitle>
              {activeTab === "profile" && <FaUserCircle />}
              {activeTab === "orders" && <FaShoppingBag />}
              {activeTab === "favorites" && <FaHeart />}
              {activeTab === "settings" && <FaCog />}
              {activeTab === "admin" && <FaUtensils />}
              {activeTab === "contact-messages" && <FaEnvelope />}
              {activeTab === "profile" && "My Profile"}
              {activeTab === "orders" && "My Orders"}
              {activeTab === "favorites" && "Favorite Treats"}
              {activeTab === "settings" && "Settings"}
              {activeTab === "admin" && "Admin Profile"}
              {activeTab === "contact-messages" && "Contact Messages"}
            </ProfileTitle>
            {activeTab === "profile" && (
              <Button onClick={() => setIsEditModalOpen(true)}>
                <FaEdit /> Edit Profile
              </Button>
            )}
            {activeTab === "contact-messages" && (
              <Button onClick={handleFetchContactMessages}>
                Refresh Messages
              </Button>
            )}
          </ProfileHeader>

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <>
              <ProfileSection>
                <SectionTitle>Personal Info</SectionTitle>
                <InfoGrid>
                  <Card>
                    <InfoLabel>Name</InfoLabel>
                    <InfoValue>
                      {profileData?.name || user?.name || "Sweet User"}
                    </InfoValue>
                  </Card>
                  <Card>
                    <InfoLabel>Email</InfoLabel>
                    <InfoValue>
                      {profileData?.email || user?.email || "sweetie@example.com"}
                    </InfoValue>
                  </Card>
                  <Card>
                    <InfoLabel>Member Since</InfoLabel>
                    <InfoValue>
                      {new Date().toLocaleDateString("default", {
                        month: "short",
                        year: "numeric",
                      })}
                    </InfoValue>
                  </Card>
                  <Card>
                    <InfoLabel>Role</InfoLabel>
                    <InfoValue>{user?.role || "USER"}</InfoValue>
                  </Card>
                </InfoGrid>
              </ProfileSection>
              <ProfileSection>
                <SectionTitle>
                  <FaMapPin /> Delivery Addresses
                  <Button
                    $secondary
                    onClick={() => {
                      setEditAddress(null);
                      setAddressForm({
                        line1: "",
                        line2: "",
                        city: "",
                        pincode: "",
                      });
                      setIsAddressModalOpen(true);
                    }}
                    style={{ marginLeft: "1rem", padding: "0.4rem 0.8rem" }}
                  >
                    Add Address
                  </Button>
                </SectionTitle>
                {addresses.length === 0 ? (
                  <Card>
                    <InfoValue>No addresses saved. Add one now!</InfoValue>
                  </Card>
                ) : (
                  <InfoGrid>
                    {addresses.map((address) => (
                      <AddressCard key={address.id}>
                        <InfoLabel>Address</InfoLabel>
                        <InfoValue>
                          {address.line1}
                          {address.line2 ? `, ${address.line2}` : ""}, {address.city},{" "}
                          {address.pincode}
                        </InfoValue>
                        <AddressActions>
                          <Button
                            $secondary
                            onClick={() => {
                              setEditAddress(address);
                              setAddressForm({
                                line1: address.line1,
                                line2: address.line2 || "",
                                city: address.city,
                                pincode: address.pincode,
                              });
                              setIsAddressModalOpen(true);
                            }}
                          >
                            <FaEdit />
                          </Button>
                          <Button
                            $secondary
                            onClick={() => handleDeleteAddress(address.id)}
                          >
                            <FaTrash />
                          </Button>
                        </AddressActions>
                      </AddressCard>
                    ))}
                  </InfoGrid>
                )}
              </ProfileSection>
              <ProfileSection>
                <SectionTitle>My Stats</SectionTitle>
                <StatsContainer>
                  <StatCard>
                    <StatNumber>
                      <FaShoppingBag /> {profileData?.ordersCount || orders.length || 0}
                    </StatNumber>
                    <StatLabel>Orders</StatLabel>
                  </StatCard>
                  <StatCard>
                    <StatNumber>
                      <FaHeart />{" "}
                      {profileData?.favoriteItemsCount || favorites.length || 0}
                    </StatNumber>
                    <StatLabel>Favorites</StatLabel>
                  </StatCard>
                  <StatCard>
                    <StatNumber>
                      <FaStar /> 4.8
                    </StatNumber>
                    <StatLabel>Avg Rating</StatLabel>
                  </StatCard>
                  {user?.role === "ADMIN" && (
                    <StatCard>
                      <StatNumber>
                        <FaUtensils /> {menuItems.length || 0}
                      </StatNumber>
                      <StatLabel>Menu Items</StatLabel>
                    </StatCard>
                  )}
                </StatsContainer>
              </ProfileSection>
            </>
          )}

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <ProfileSection>
              <SectionTitle>
                <FaShoppingBag /> Recent Orders
              </SectionTitle>
              <FilterContainer>
                {["All", "Delivered", "Pending", "Cancelled"].map((status) => (
                  <FilterButton
                    key={status}
                    active={orderFilter === status}
                    onClick={() => setOrderFilter(status)}
                  >
                    {status}
                  </FilterButton>
                ))}
              </FilterContainer>
              {filteredOrders.length === 0 ? (
                <Card>
                  <InfoValue>
                    {orderFilter === "All"
                      ? "No orders yet. Start shopping!"
                      : `No ${orderFilter.toLowerCase()} orders.`}
                  </InfoValue>
                </Card>
              ) : (
                filteredOrders.map((order) => (
                  <OrderCard key={order.id}>
                    <OrderHeader>
                      <OrderId>#{order.id}</OrderId>
                      <OrderStatus status={order.status}>{order.status}</OrderStatus>
                    </OrderHeader>
                    <OrderDetails>
                      <OrderImage>
                        <FaShoppingBag />
                      </OrderImage>
                      <OrderInfo>
                        <OrderTitle>{order.name || "Order Details"}</OrderTitle>
                        <OrderItems>
                          {Array.isArray(order.items) && order.items.length > 0 ? (
                            order.items.map((item) => (
                              <OrderItem key={item.id}>
                                {item.name} - {item.quantity}x ($
                                {item.price && item.quantity
                                  ? (item.price * item.quantity).toFixed(2)
                                  : "0.00"})
                              </OrderItem>
                            ))
                          ) : (
                            <OrderItem>No items available</OrderItem>
                          )}
                        </OrderItems>
                        <OrderMeta>
                          <OrderMetaContent>
                            <FiMapPin /> {order.addressLine1 || "N/A"},{" "}
                            {order.addressLine2 ? `${order.addressLine2}, ` : ""}
                            {order.city || "N/A"}, {order.pincode || "N/A"} • Total: $
                            {order.total ? order.total.toFixed(2) : "0.00"}
                          </OrderMetaContent>
                        </OrderMeta>
                        <Button
                          $secondary
                          onClick={() => handleReorder(order)}
                          style={{ marginTop: "0.5rem" }}
                        >
                          <FaCartPlus /> Reorder
                        </Button>
                      </OrderInfo>
                    </OrderDetails>
                  </OrderCard>
                ))
              )}
            </ProfileSection>
          )}

          {/* Favorites Tab */}
          {activeTab === "favorites" && (
            <ProfileSection>
              <SectionTitle>
                <FaHeart /> Favorite Treats
              </SectionTitle>
              {favorites.length === 0 ? (
                <Card>
                  <InfoValue>No favorites yet. Add some from the menu!</InfoValue>
                </Card>
              ) : (
                favorites.map((favorite) => (
                  <FavoriteItem key={favorite.id}>
                    <FavoriteImage>
                      <FaHeart />
                    </FavoriteImage>
                    <FavoriteContent>
                      <FavoriteTitle>{favorite.name || "N/A"}</FavoriteTitle>
                      <FavoriteMeta>
                        <FaStar /> ${favorite.price ? favorite.price.toFixed(2) : "0.00"}
                      </FavoriteMeta>
                      <div>
                        <Button
                          $secondary
                          onClick={() => addToCart(favorite)}
                          style={{ marginRight: "0.5rem" }}
                        >
                          <FaCartPlus /> Add to Cart
                        </Button>
                        <Button
                          $secondary
                          onClick={() => removeFromFavorites(favorite.id)}
                        >
                          <FaTrash /> Remove
                        </Button>
                      </div>
                    </FavoriteContent>
                  </FavoriteItem>
                ))
              )}
            </ProfileSection>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <ProfileSection>
              <SectionTitle>
                <FaCog /> Account Settings
              </SectionTitle>
              <InfoGrid>
                <Card>
                  <InfoLabel>Password</InfoLabel>
                  <InfoValue>
                    <Button
                      $secondary
                      onClick={() => setIsPasswordModalOpen(true)}
                    >
                      <FaLock /> Change Password
                    </Button>
                  </InfoValue>
                </Card>
                <Card>
                  <InfoLabel>Notifications</InfoLabel>
                  <InfoValue>
                    <Button $secondary>
                      <FaBell /> Manage Alerts
                    </Button>
                  </InfoValue>
                </Card>
              </InfoGrid>
            </ProfileSection>
          )}

          {/* Admin Profile Tab */}
          {activeTab === "admin" && user?.role === "ADMIN" && (
            <>
              <ProfileSection>
                <SectionTitle>
                  <FaUsers /> User Management
                </SectionTitle>
                {allUsers.length === 0 ? (
                  <Card>
                    <InfoValue>No users found.</InfoValue>
                  </Card>
                ) : (
                  <AdminTable>
                    <thead>
                      <tr>
                        <AdminTableHeader>ID</AdminTableHeader>
                        <AdminTableHeader>Name</AdminTableHeader>
                        <AdminTableHeader>Email</AdminTableHeader>
                        <AdminTableHeader>Role</AdminTableHeader>
                        <AdminTableHeader>Actions</AdminTableHeader>
                      </tr>
                    </thead>
                    <tbody>
                      {allUsers.map((u) => (
                        <AdminTableRow key={u.id}>
                          <AdminTableCell>{u.id || "N/A"}</AdminTableCell>
                          <AdminTableCell>{u.name || "N/A"}</AdminTableCell>
                          <AdminTableCell>{u.email || "N/A"}</AdminTableCell>
                          <AdminTableCell>
                            <AdminSelect
                              value={u.role || "USER"}
                              onChange={(e) => handleUpdateUserRole(u.id, e.target.value)}
                            >
                              <option value="USER">User</option>
                              <option value="ADMIN">Admin</option>
                            </AdminSelect>
                          </AdminTableCell>
                          <AdminTableCell>
                            <Button
                              $secondary
                              onClick={() => handleUpdateUserRole(u.id, u.role === "ADMIN" ? "USER" : "ADMIN")}
                            >
                              Toggle Role
                            </Button>
                          </AdminTableCell>
                        </AdminTableRow>
                      ))}
                    </tbody>
                  </AdminTable>
                )}
              </ProfileSection>

              <ProfileSection>
                <SectionTitle>
                  <FaShoppingBag /> Order Management
                </SectionTitle>
                {allOrders.length === 0 ? (
                  <Card>
                    <InfoValue>No orders found.</InfoValue>
                  </Card>
                ) : (
                  <AdminTable>
                    <thead>
                      <tr>
                        <AdminTableHeader>ID</AdminTableHeader>
                        <AdminTableHeader>User</AdminTableHeader>
                        <AdminTableHeader>Total</AdminTableHeader>
                        <AdminTableHeader>Status</AdminTableHeader>
                        <AdminTableHeader>Actions</AdminTableHeader>
                      </tr>
                    </thead>
                    <tbody>
                      {allOrders.map((order) => (
                        <AdminTableRow key={order.id}>
                          <AdminTableCell>{order.id || "N/A"}</AdminTableCell>
                          <AdminTableCell>{order.userName || "Unknown"}</AdminTableCell>
                          <AdminTableCell>
                            ${order.total ? order.total.toFixed(2) : "0.00"}
                          </AdminTableCell>
                          <AdminTableCell>
                            <AdminSelect
                              value={order.status || "Pending"}
                              onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </AdminSelect>
                          </AdminTableCell>
                          <AdminTableCell>
                            <Button
                              $secondary
                              onClick={() => navigate(`/admin/orders/${order.id}`)}
                            >
                              View
                            </Button>
                          </AdminTableCell>
                        </AdminTableRow>
                      ))}
                    </tbody>
                  </AdminTable>
                )}
              </ProfileSection>

              <ProfileSection>
                <SectionTitle>
                  <FaUtensils /> Menu Management
                  <Button
                    $secondary
                    onClick={() => {
                      setEditMenuItem(null);
                      setMenuItemForm({
                        name: "",
                        price: "",
                        description: "",
                        image: "",
                      });
                      setIsMenuItemModalOpen(true);
                    }}
                    style={{ marginLeft: "1rem", padding: "0.4rem 0.8rem" }}
                  >
                    <FaPlus /> Add Menu Item
                  </Button>
                </SectionTitle>
                {menuItems.length === 0 ? (
                  <Card>
                    <InfoValue>No menu items found. Add one now!</InfoValue>
                  </Card>
                ) : (
                  <AdminTable>
                    <thead>
                      <tr>
                        <AdminTableHeader>ID</AdminTableHeader>
                        <AdminTableHeader>Name</AdminTableHeader>
                        <AdminTableHeader>Price</AdminTableHeader>
                        <AdminTableHeader>Description</AdminTableHeader>
                        <AdminTableHeader>Actions</AdminTableHeader>
                      </tr>
                    </thead>
                    <tbody>
                      {menuItems.map((item) => (
                        <AdminTableRow key={item.id}>
                          <AdminTableCell>{item.id || "N/A"}</AdminTableCell>
                          <AdminTableCell>{item.name || "N/A"}</AdminTableCell>
                          <AdminTableCell>
                            ${item.price ? item.price.toFixed(2) : "0.00"}
                          </AdminTableCell>
                          <AdminTableCell>{item.description || "N/A"}</AdminTableCell>
                          <AdminTableCell>
                            <Button
                              $secondary
                              onClick={() => handleEditMenuItem(item)}
                              style={{ marginRight: "0.5rem" }}
                            >
                              <FaEdit />
                            </Button>
                            <Button
                              $secondary
                              onClick={() => handleDeleteMenuItem(item.id)}
                            >
                              <FaTrash />
                            </Button>
                          </AdminTableCell>
                        </AdminTableRow>
                      ))}
                    </tbody>
                  </AdminTable>
                )}
              </ProfileSection>
            </>
          )}

          {/* Contact Messages Tab */}
          {activeTab === "contact-messages" && user?.role === "ADMIN" && (
            <ProfileSection>
              <SectionTitle>
                <FaEnvelope /> Contact Messages
              </SectionTitle>
              {messagesLoading ? (
                <MessagesLoadingContainer>
                  <Spinner />
                  <LoadingText>Loading messages...</LoadingText>
                </MessagesLoadingContainer>
              ) : messagesError ? (
                <MessagesErrorMessage>{messagesError}</MessagesErrorMessage>
              ) : contactMessages.length === 0 ? (
                <Card>
                  <InfoValue>No contact messages found.</InfoValue>
                </Card>
              ) : (
                <AdminTable>
                  <thead>
                    <tr>
                      <AdminTableHeader>ID</AdminTableHeader>
                      <AdminTableHeader>Name</AdminTableHeader>
                      <AdminTableHeader>Email</AdminTableHeader>
                      <AdminTableHeader>Message</AdminTableHeader>
                      <AdminTableHeader>Received At</AdminTableHeader>
                    </tr>
                  </thead>
                  <tbody>
                    {contactMessages.map((message) => (
                      <AdminTableRow key={message.id}>
                        <AdminTableCell>{message.id || "N/A"}</AdminTableCell>
                        <AdminTableCell>
                          {`${message.firstName || ""} ${message.lastName || ""}`.trim() || "N/A"}
                        </AdminTableCell>
                        <AdminTableCell>{message.email || "N/A"}</AdminTableCell>
                        <AdminTableCell>{message.message || "N/A"}</AdminTableCell>
                        <AdminTableCell>
                          {message.createdAt
                            ? new Date(message.createdAt).toLocaleString()
                            : "N/A"}
                        </AdminTableCell>
                      </AdminTableRow>
                    ))}
                  </tbody>
                </AdminTable>
              )}
            </ProfileSection>
          )}
        </ProfileContent>
      </ProfileContainer>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Profile"
      >
        <Form onSubmit={handleProfileUpdate}>
          <FormGroup>
            <FormLabel htmlFor="name">Name</FormLabel>
            <FormInput
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              required
            />
          </FormGroup>
          <FormGroup>
            <FormLabel htmlFor="email">Email</FormLabel>
            <FormInput
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              required
            />
          </FormGroup>
          <Button type="submit">Save Changes</Button>
        </Form>
      </Modal>

      {/* Address Modal */}
      <Modal
        isOpen={isAddressModalOpen}
        onClose={() => {
          setIsAddressModalOpen(false);
          setEditAddress(null);
        }}
        title={editAddress ? "Edit Address" : "Add Address"}
      >
        <Form onSubmit={handleAddressSubmit}>
          <FormGroup>
            <FormLabel htmlFor="line1">Address Line 1</FormLabel>
            <FormInput
              id="line1"
              type="text"
              value={addressForm.line1}
              onChange={(e) =>
                setAddressForm((prev) => ({ ...prev, line1: e.target.value }))
              }
              required
            />
          </FormGroup>
          <FormGroup>
            <FormLabel htmlFor="line2">Address Line 2 (Optional)</FormLabel>
            <FormInput
              id="line2"
              type="text"
              value={addressForm.line2}
              onChange={(e) =>
                setAddressForm((prev) => ({ ...prev, line2: e.target.value }))
              }
            />
          </FormGroup>
          <FormGroup>
            <FormLabel htmlFor="city">City</FormLabel>
            <FormInput
              id="city"
              type="text"
              value={addressForm.city}
              onChange={(e) =>
                setAddressForm((prev) => ({ ...prev, city: e.target.value }))
              }
              required
            />
          </FormGroup>
          <FormGroup>
            <FormLabel htmlFor="pincode">Pincode</FormLabel>
            <FormInput
              id="pincode"
              type="text"
              value={addressForm.pincode}
              onChange={(e) =>
                setAddressForm((prev) => ({ ...prev, pincode: e.target.value }))
              }
              required
            />
          </FormGroup>
          <Button type="submit">Save Address</Button>
        </Form>
      </Modal>

      {/* Password Modal */}
      <Modal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        title="Change Password"
      >
        <Form onSubmit={handlePasswordUpdate}>
          <FormGroup>
            <FormLabel htmlFor="current-password">Current Password</FormLabel>
            <FormInput
              id="current-password"
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) =>
                setPasswordForm((prev) => ({
                  ...prev,
                  currentPassword: e.target.value,
                }))
              }
              required
            />
          </FormGroup>
          <FormGroup>
            <FormLabel htmlFor="new-password">New Password</FormLabel>
            <FormInput
              id="new-password"
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) =>
                setPasswordForm((prev) => ({
                  ...prev,
                  newPassword: e.target.value,
                }))
              }
              required
            />
          </FormGroup>
          <FormGroup>
            <FormLabel htmlFor="confirm-password">Confirm New Password</FormLabel>
            <FormInput
              id="confirm-password"
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) =>
                setPasswordForm((prev) => ({
                  ...prev,
                  confirmPassword: e.target.value,
                }))
              }
              required
            />
          </FormGroup>
          <Button type="submit">Update Password</Button>
        </Form>
      </Modal>

      {/* Menu Item Modal */}
      <Modal
        isOpen={isMenuItemModalOpen}
        onClose={() => {
          setIsMenuItemModalOpen(false);
          setEditMenuItem(null);
        }}
        title={editMenuItem ? "Edit Menu Item" : "Add Menu Item"}
      >
        <Form onSubmit={handleAddMenuItem}>
          <FormGroup>
            <FormLabel htmlFor="menu-name">Name</FormLabel>
            <AdminFormInput
              id="menu-name"
              type="text"
              value={menuItemForm.name}
              onChange={(e) =>
                setMenuItemForm((prev) => ({ ...prev, name: e.target.value }))
              }
              required
            />
          </FormGroup>
          <FormGroup>
            <FormLabel htmlFor="menu-price">Price</FormLabel>
            <AdminFormInput
              id="menu-price"
              type="number"
              step="0.01"
              value={menuItemForm.price}
              onChange={(e) =>
                setMenuItemForm((prev) => ({ ...prev, price: e.target.value }))
              }
              required
            />
          </FormGroup>
          <FormGroup>
            <FormLabel htmlFor="menu-description">Description (Optional)</FormLabel>
            <AdminFormInput
              id="menu-description"
              type="text"
              value={menuItemForm.description}
              onChange={(e) =>
                setMenuItemForm((prev) => ({ ...prev, description: e.target.value }))
              }
            />
          </FormGroup>
          <FormGroup>
            <FormLabel htmlFor="menu-image">Image URL (Optional)</FormLabel>
            <AdminFormInput
              id="menu-image"
              type="text"
              value={menuItemForm.image}
              onChange={(e) =>
                setMenuItemForm((prev) => ({ ...prev, image: e.target.value }))
              }
            />
          </FormGroup>
          <Button type="submit">
            <FaSave /> {editMenuItem ? "Update Item" : "Add Item"}
          </Button>
        </Form>
      </Modal>
    </ProfileWrapper>
  );
};

export default Profile;