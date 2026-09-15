import React, { useEffect, useState } from "react";
import {
  getNotifications,
  markAsRead
} from "../services/NotificationService";

import "./Notifications.css";

const Notifications = () => {

  const [notifications, setNotifications] = useState([]);

  const loadNotifications = async () => {
    try {
      const res = await getNotifications();

      console.log("Notifications:", res.data);

      setNotifications(
        Array.isArray(res.data)
          ? res.data
          : res.data.content || []
      );

    } catch (error) {
      console.error("Notification Error:", error);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleRead = async (id) => {
    try {
      await markAsRead(id);

      setNotifications(prev =>
        prev.map(notification =>
          notification.id === id
            ? { ...notification, read: true }
            : notification
        )
      );

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="notifications-page">

      <h2>Notifications</h2>

      {notifications.length === 0 ? (
        <p>No notifications available</p>
      ) : (
        notifications.map(notification => (

          <div
            key={notification.id}
            className={`notification-item ${
              notification.read ? "read" : "unread"
            }`}
          >

            <div className="notification-body">

              <p className="notification-message">
                {notification.message}
              </p>

              <small className="notification-date">
                {notification.createdAt}
              </small>

              {!notification.read && (
                <button
                  className="mark-read-btn"
                  onClick={() => handleRead(notification.id)}
                >
                  Mark Read
                </button>
              )}

            </div>

          </div>

        ))
      )}

    </div>
  );
};

export default Notifications;