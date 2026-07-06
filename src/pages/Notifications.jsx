import React, { useEffect, useState } from "react";
import {
  getNotifications,
  markAsRead
} from "../services/NotificationService";

const Notifications = () => {

  const [notifications, setNotifications] = useState([]);

  const loadNotifications = async () => {
  try {
    const res = await getNotifications();
    console.log("Notifications:", res.data);
    setNotifications(res.data);
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
    <div className="container mt-4">
      <h2>Notifications</h2>

      {notifications.length === 0 ? (
        <p>No notifications available</p>
      ) : (
        notifications.map(notification => (
          <div
            key={notification.id}
            className={`card mb-2 ${
              notification.read ? "border-secondary" : "border-primary"
            }`}
          >
            <div className="card-body">
              <p>{notification.message}</p>

              <small>
                {notification.createdAt}
              </small>

              {!notification.read && (
                <button
                  className="btn btn-sm btn-success ms-3"
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