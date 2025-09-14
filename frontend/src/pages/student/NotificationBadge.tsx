import React, { createContext, useContext, useState } from "react";

interface NotificationContextProps {
  unreadCount: number;
  setUnread: (count: number) => void;
  decrementUnread: () => void;
  resetUnread: () => void;
}

const NotificationContext = createContext<NotificationContextProps>({
  unreadCount: 0,
  setUnread: () => {},
  decrementUnread: () => {},
  resetUnread: () => {},
});

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);

  const setUnread = (count: number) => setUnreadCount(count);
  const decrementUnread = () => setUnreadCount((c) => Math.max(c - 1, 0));
  const resetUnread = () => setUnreadCount(0);

  return (
    <NotificationContext.Provider value={{ unreadCount, setUnread, decrementUnread, resetUnread }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
