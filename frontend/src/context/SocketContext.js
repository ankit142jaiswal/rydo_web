import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const newSocket = io(
      process.env.REACT_APP_SOCKET_URL || 'https://rydo-web.onrender.com',
      { auth: { token: localStorage.getItem('token') } }
    );

    newSocket.on('connect', () => {
      setConnected(true);
      // Join the room for this user so targeted events are delivered
      const userId = user._id || user.id || user.userId;
      if (userId) {
        if (user.role === 'driver') {
          newSocket.emit('join_driver', userId);
        } else if (user.role === 'customer') {
          newSocket.emit('join_customer', userId);
        }
      }
    });

    newSocket.on('disconnect', () => setConnected(false));

    setSocket(newSocket);
    return () => newSocket.close();
  }, [user?._id, user?.id]);

  return (
    <SocketContext.Provider value={{ socket, connected }}>
      {children}
    </SocketContext.Provider>
  );
};
