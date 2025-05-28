import React, { useState, useEffect, useContext, useRef } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { FaBell, FaCheck, FaCircle, FaTrash } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import { io } from "socket.io-client";
import {
  colors,
  typography,
  shadows,
  transitions,
  borderRadius,
} from "../styles/theme";
import { format } from "date-fns";

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const Backdrop = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: ${(props) => (props.$isOpen ? "block" : "none")};
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
  }
`;

const NotificationButton = styled.button`
  position: relative;
  background: none;
  border: none;
  color: ${colors.text.secondary};
  width: 40px;
  height: 40px;
  border-radius: ${borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: ${transitions.default};
  cursor: pointer;

  svg {
    font-size: 1.2rem;
    transition: ${transitions.default};
  }

  &:hover {
    background: ${colors.background.secondary};
    color: ${colors.secondary};
    transform: translateY(-2px);
  }

  .notification-dot {
    position: absolute;
    top: 2px;
    right: 2px;
    min-width: 18px;
    height: 18px;
    background: #dc2626; /* red-600 color */
    border-radius: ${borderRadius.full};
    border: 2px solid ${colors.background.primary};
    color: white;
    font-size: 0.7rem;
    font-weight: ${typography.fontWeights.bold};
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 4px;
  }
`;

const DropdownContent = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  width: 320px;
  max-height: 400px;
  overflow-y: auto;
  background: ${colors.background.primary};
  border: 1px solid ${colors.background.accent};
  border-radius: ${borderRadius.xl};
  box-shadow: ${shadows.xl};
  z-index: 1000;
  margin-top: 0.75rem;
  padding: 0.75rem;
  display: ${(props) => (props.$isOpen ? "block" : "none")};

  @media (max-width: 768px) {
    position: fixed;
    top: auto;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    max-height: 80vh;
    margin: 0;
    border-radius: ${borderRadius.xl} ${borderRadius.xl} 0 0;
    border-bottom: none;
    z-index: 1000;
  }

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${colors.background.secondary};
    border-radius: ${borderRadius.full};
  }

  &::-webkit-scrollbar-thumb {
    background: ${colors.background.accent};
    border-radius: ${borderRadius.full};
  }
`;

const NotificationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  border-bottom: 1px solid ${colors.background.accent};
  margin-bottom: 0.75rem;

  h3 {
    margin: 0;
    font-size: 1rem;
    font-weight: ${typography.fontWeights.semibold};
    color: ${colors.text.primary};
    display: flex;
    align-items: center;
    gap: 0.5rem;

    .count {
      font-size: 0.8rem;
      color: ${colors.text.secondary};
    }
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const MarkAllRead = styled.button`
  background: none;
  border: none;
  color: ${colors.secondary};
  font-size: 0.875rem;
  cursor: pointer;
  transition: ${transitions.default};

  &:hover {
    color: ${colors.primary};
    text-decoration: underline;
  }
`;

const ClearButton = styled.button`
  background: none;
  border: none;
  color: ${colors.text.light};
  font-size: 1rem;
  cursor: pointer;
  transition: ${transitions.default};
  display: flex;
  align-items: center;
  padding: 0.25rem;
  border-radius: ${borderRadius.full};

  &:hover {
    color: ${colors.secondary};
    background: ${colors.background.secondary};
  }
`;

const NotificationItem = styled.div`
  padding: 0.75rem;
  border-radius: ${borderRadius.lg};
  background: ${(props) =>
    props.$read ? "transparent" : colors.background.secondary};
  cursor: pointer;
  transition: ${transitions.default};
  margin-bottom: 0.5rem;

  &:hover {
    background: ${colors.background.accent}40;
  }

  .title {
    font-weight: ${typography.fontWeights.semibold};
    color: ${colors.text.primary};
    margin-bottom: 0.25rem;
    font-size: 0.9rem;
  }

  .message {
    color: ${colors.text.secondary};
    font-size: 0.85rem;
    margin-bottom: 0.5rem;
  }

  .meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.75rem;
    color: ${colors.text.light};

    .unread-indicator {
      color: ${colors.accent};
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem 1rem;
  color: ${colors.text.secondary};
  font-size: 0.9rem;
`;

const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [socketConnected, setSocketConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { authAxios, userInfo } = useContext(AuthContext);
  const navigate = useNavigate();
  const socketRef = useRef(null);
  const initialFetchDone = useRef(false);

  const fetchData = async () => {
    if (!socketConnected || !userInfo || initialFetchDone.current) return;

    try {
      setIsLoading(true);
      const [notificationsRes, countRes] = await Promise.all([
        authAxios.get("/api/notifications"),
        authAxios.get("/api/notifications/unread-count"),
      ]);

      // console.log("Initial data fetch:", {
      //   notifications: notificationsRes.data,
      //   unreadCount: countRes.data.count,
      // });

      setNotifications(notificationsRes.data);
      setUnreadCount(countRes.data.count);
      initialFetchDone.current = true;
    } catch (error) {
      // console.error("Error fetching initial data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Effect for socket connection
  useEffect(() => {
    let mounted = true;

    const initializeSocket = () => {
      if (!userInfo || socketRef.current) return;

      try {
        // console.log("Initializing socket connection...");
        socketRef.current = io(SOCKET_URL, {
          withCredentials: true,
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          reconnectionAttempts: 5,
          transports: ["websocket", "polling"],
          forceNew: true,
          timeout: 10000,
          autoConnect: true,
        });

        const socket = socketRef.current;

        socket.on("connect", () => {
          // console.log("Socket connected successfully with ID:", socket.id);
          if (mounted) {
            setSocketConnected(true);
            socket.emit("join", userInfo._id, (error) => {
              if (error) {
                // console.error("Error joining room:", error);
                setTimeout(() => {
                  socket.emit("join", userInfo._id);
                }, 1000);
              } else {
                // console.log("Successfully joined room");
              }
            });
          }
        });

        socket.on("connect_error", (error) => {
          // console.error("Socket connection error:", error);
          if (mounted) {
            setSocketConnected(false);
            const reconnectDelay = Math.min(
              1000 * Math.pow(2, socket.io.reconnectionAttempts),
              5000
            );
            setTimeout(() => {
              if (mounted && !socket.connected) {
                socket.connect();
              }
            }, reconnectDelay);
          }
        });

        socket.on("disconnect", (reason) => {
          // console.log("Socket disconnected:", reason);
          if (mounted) {
            setSocketConnected(false);
            if (reason !== "io client disconnect") {
              socket.connect();
            }
          }
        });

        socket.on("reconnect", (attemptNumber) => {
          // console.log(`Socket reconnected after ${attemptNumber} attempts`);
          if (mounted) {
            setSocketConnected(true);
            initialFetchDone.current = false;
            socket.emit("join", userInfo._id);
            fetchData();
          }
        });

        socket.on("reconnect_error", (error) => {
          // console.error("Socket reconnection error:", error);
        });

        socket.on("reconnect_failed", () => {
          // console.error("Socket reconnection failed after all attempts");
          if (mounted) {
            setSocketConnected(false);
          }
        });

        socket.on("newNotification", (notification, callback) => {
          // console.log("Received new notification:", notification);
          if (mounted) {
            setNotifications((prev) => {
              const exists = prev.some((n) => n._id === notification._id);
              if (exists) return prev;
              return [notification, ...prev].slice(0, 50);
            });
            setUnreadCount((prev) => prev + 1);
          }
          if (callback) callback();
        });

        socket.on("notifications", (updatedNotifications, callback) => {
          // console.log("Received notifications update:", updatedNotifications);
          if (mounted) {
            setNotifications(updatedNotifications);
          }
          if (callback) callback();
        });

        socket.on("unreadCount", (count, callback) => {
          // console.log("Received unread count update:", count);
          if (mounted) {
            setUnreadCount(count);
          }
          if (callback) callback();
        });
      } catch (error) {
        // console.error("Error initializing socket:", error);
        if (mounted) {
          setSocketConnected(false);
        }
      }
    };

    initializeSocket();

    return () => {
      mounted = false;
      if (socketRef.current) {
        // console.log("Cleaning up socket connection");
        const socket = socketRef.current;
        socket.off("newNotification");
        socket.off("notifications");
        socket.off("unreadCount");
        socket.disconnect();
        socketRef.current = null;
        setSocketConnected(false);
      }
    };
  }, [userInfo]);

  // Effect for data fetching after socket connection
  useEffect(() => {
    fetchData();
  }, [socketConnected, userInfo]);

  // Debug logging
  useEffect(() => {
    // console.log(
    //   "Socket connection status:",
    //   socketConnected ? "Connected" : "Disconnected"
    // );
  }, [socketConnected]);

  const handleNotificationClick = async (notification) => {
    try {
      if (!notification.read) {
        await authAxios.put(`/api/notifications/${notification._id}/read`);

        setNotifications((prev) =>
          prev.map((n) =>
            n._id === notification._id ? { ...n, read: true } : n
          )
        );

        setUnreadCount((prev) => Math.max(0, prev - 1));
      }

      if (notification.link) {
        navigate(notification.link);
      }
      setIsOpen(false);
    } catch (error) {
      // console.error("Error marking notification as read:", error);
    }
  };

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleMarkAllRead = async () => {
    try {
      await authAxios.put("/api/notifications/mark-all-read");

      // Update all notifications in local state
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      // console.error("Error marking all notifications as read:", error);
    }
  };

  const handleClearNotifications = async () => {
    try {
      await authAxios.delete("/api/notifications");
      // Update local state after successful deletion
      setNotifications([]);
      setUnreadCount(0);
      setIsOpen(false); // Close the dropdown after clearing
    } catch (error) {
      // console.error("Error clearing notifications:", error);
    }
  };

  // Add debug logging for state changes
  useEffect(() => {
    // console.log("Notifications state updated:", notifications);
  }, [notifications]);

  useEffect(() => {
    // console.log("Unread count updated:", unreadCount);
  }, [unreadCount]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setIsOpen(false);
    }
  };

  return (
    <>
      <DropdownContainer>
        <NotificationButton
          onClick={handleToggleDropdown}
          title="Notifications"
        >
          <FaBell />
          {unreadCount > 0 && (
            <div className="notification-dot">
              {unreadCount > 99 ? "99+" : unreadCount}
            </div>
          )}
        </NotificationButton>

        <DropdownContent $isOpen={isOpen}>
          <NotificationHeader>
            <h3>
              Notifications
              {notifications.length > 0 && (
                <span className="count">({unreadCount} unread)</span>
              )}
            </h3>
            <HeaderActions>
              {unreadCount > 0 && (
                <MarkAllRead onClick={handleMarkAllRead}>
                  Mark all as read
                </MarkAllRead>
              )}
              {notifications.length > 0 && (
                <ClearButton
                  onClick={handleClearNotifications}
                  title="Clear all notifications"
                >
                  <FaTrash />
                </ClearButton>
              )}
            </HeaderActions>
          </NotificationHeader>

          {isLoading ? (
            <EmptyState>Loading notifications...</EmptyState>
          ) : notifications.length > 0 ? (
            notifications.map((notification) => (
              <NotificationItem
                key={notification._id}
                $read={notification.read}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="title">{notification.title}</div>
                <div className="message">{notification.message}</div>
                <div className="meta">
                  <span>
                    {format(new Date(notification.createdAt), "MMM d, h:mm a")}
                  </span>
                  {!notification.read && (
                    <span className="unread-indicator">
                      <FaCircle size={8} />
                      New
                    </span>
                  )}
                </div>
              </NotificationItem>
            ))
          ) : (
            <EmptyState>No notifications yet</EmptyState>
          )}
        </DropdownContent>
      </DropdownContainer>
      <Backdrop $isOpen={isOpen} onClick={handleBackdropClick} />
    </>
  );
};

export default NotificationDropdown;
