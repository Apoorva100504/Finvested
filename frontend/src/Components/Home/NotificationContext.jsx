// context/NotificationContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [priceAlerts, setPriceAlerts] = useState([]);

  // Load notifications from localStorage on mount
  useEffect(() => {
    const savedNotifications = localStorage.getItem('stockNotifications');
    const savedAlerts = localStorage.getItem('priceAlerts');
    
    if (savedNotifications) {
      const parsed = JSON.parse(savedNotifications);
      setNotifications(parsed);
      setUnreadCount(parsed.filter(n => !n.read).length);
    }
    
    if (savedAlerts) {
      setPriceAlerts(JSON.parse(savedAlerts));
    }
    
    // Start checking for price alerts
    startPriceAlertChecker();
  }, []);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('stockNotifications', JSON.stringify(notifications));
    setUnreadCount(notifications.filter(n => !n.read).length);
  }, [notifications]);

  const startPriceAlertChecker = () => {
    // Check price alerts every 30 seconds (in real app, use WebSocket)
    setInterval(checkPriceAlerts, 30000);
  };

  const checkPriceAlerts = () => {
    // Mock current prices - in real app, fetch from API
    const mockCurrentPrices = {
      'AAPL': { price: 182.63, change: 1.24 },
      'RELIANCE': { price: 2856.75, change: 12.25 },
      'TCS': { price: 3892.45, change: -8.55 },
      'INFY': { price: 1523.80, change: 4.20 },
    };

    priceAlerts.forEach(alert => {
      const currentStock = mockCurrentPrices[alert.symbol];
      if (!currentStock) return;

      let shouldTrigger = false;
      let message = '';

      if (alert.type === 'price_above' && currentStock.price >= alert.targetPrice) {
        shouldTrigger = true;
        message = `${alert.symbol} reached ₹${currentStock.price.toFixed(2)} (above ₹${alert.targetPrice})`;
      } else if (alert.type === 'price_below' && currentStock.price <= alert.targetPrice) {
        shouldTrigger = true;
        message = `${alert.symbol} dropped to ₹${currentStock.price.toFixed(2)} (below ₹${alert.targetPrice})`;
      } else if (alert.type === 'percent_change' && Math.abs(currentStock.changePercent) >= alert.percentChange) {
        shouldTrigger = true;
        const direction = currentStock.changePercent >= 0 ? 'up' : 'down';
        message = `${alert.symbol} changed ${Math.abs(currentStock.changePercent)}% ${direction}`;
      }

      if (shouldTrigger && !alert.triggered) {
        // Create notification
        addNotification({
          id: Date.now(),
          type: 'price_alert',
          title: 'Price Alert Triggered',
          message,
          symbol: alert.symbol,
          timestamp: new Date().toISOString(),
          read: false,
          priority: 'high'
        });

        // Show toast
        toast.info(`📈 ${message}`, {
          position: "top-right",
          autoClose: 5000,
        });

        // Mark alert as triggered
        const updatedAlerts = priceAlerts.map(a => 
          a.id === alert.id ? { ...a, triggered: true, triggeredAt: new Date().toISOString() } : a
        );
        setPriceAlerts(updatedAlerts);
        localStorage.setItem('priceAlerts', JSON.stringify(updatedAlerts));
      }
    });
  };

  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      read: false,
      ...notification
    };
    
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const addPriceAlert = (alert) => {
    const newAlert = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      triggered: false,
      ...alert
    };
    
    const updatedAlerts = [...priceAlerts, newAlert];
    setPriceAlerts(updatedAlerts);
    localStorage.setItem('priceAlerts', JSON.stringify(updatedAlerts));
    
    // Add a notification about creating the alert
    addNotification({
      type: 'alert_created',
      title: 'Price Alert Set',
      message: `${alert.symbol} alert set at ₹${alert.targetPrice || alert.percentChange}%`,
      symbol: alert.symbol,
      priority: 'medium'
    });
  };

  const deletePriceAlert = (id) => {
    const updatedAlerts = priceAlerts.filter(alert => alert.id !== id);
    setPriceAlerts(updatedAlerts);
    localStorage.setItem('priceAlerts', JSON.stringify(updatedAlerts));
  };

  const getUnreadNotifications = () => {
    return notifications.filter(n => !n.read);
  };

  const getNotificationsByType = (type) => {
    return notifications.filter(n => n.type === type);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        priceAlerts,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAllNotifications,
        addPriceAlert,
        deletePriceAlert,
        getUnreadNotifications,
        getNotificationsByType
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};