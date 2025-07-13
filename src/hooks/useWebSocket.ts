/// <reference types="socket.io-client" />
import { useEffect, useCallback, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
// @ts-ignore
import { io, Socket } from 'socket.io-client';

let globalSocket: Socket | null = null;
let globalConnectionState = false;
let globalCallbacks: Set<(submissionId: string, data: any) => void> = new Set();

const getUserIdFromToken = (token: string): string | null => {
  try {
    console.log('🔍 Extracting userId from token...');
    const payload = JSON.parse(atob(token.split('.')[1]));
    const userId = payload.userId || null;
    console.log('👤 Extracted userId:', userId);
    console.log('📋 Full JWT payload:', payload);
    return userId;
  } catch (error) {
    console.error('❌ Error extracting userId from token:', error);
    return null;
  }
};

const createSocketConnection = (token: string) => {
  if (globalSocket && globalSocket.connected) return;
  if (globalSocket && globalSocket.connected === false) return;

  const userId = getUserIdFromToken(token);
  if (!userId) {
    console.error('❌v No userId found in token, cannot create connections');
    return;
  }

  console.log('🚀 Creating Socket.IO connection for user:', userId);
  globalSocket = io('https://13.203.239.166', {
    transports: ['websocket'],
    withCredentials: false,
  });

  globalSocket.on('connect', () => {
    console.log('✅ Socket.IO connected, sending auth for user:', userId);
    globalConnectionState = true;
    globalSocket!.emit('auth', { userId });
    toast.success('Connected to real-time updates');
  });

  globalSocket.on('submission_update', (message: any) => {
    console.log('📨 Received submission update:', message);
    if (message.submissionId && message.data) {
      globalCallbacks.forEach(callback => {
        callback(message.submissionId, message.data);
      });
      const status = message.data.status;
      if (status === 'Success') toast.success('Submission completed successfully!');
      else if (status === 'Failed') toast.error('Submission failed');
      else if (status === 'Running') toast.loading('Processing submission...', { id: message.submissionId });
      else toast.error(`Submission ${status}`);
    }
  });

  globalSocket.on('connection', (message: any) => {
    console.log('🤝 Received connection confirmation:', message);
    if (message && message.message) {
      toast.success(message.message);
    }
  });

  globalSocket.on('disconnect', () => {
    console.log('🔌 Socket.IO disconnected');
    globalConnectionState = false;
    toast.error('Lost connection to real-time updates');
  });

  globalSocket.on('connect_error', (err: Error) => {
    console.error('❌ Socket.IO connection error:', err);
    globalConnectionState = false;
    toast.error('Socket.IO connection error');
  });
};

export const useWebSocket = (
  onSubmissionUpdate?: (submissionId: string, data: any) => void
) => {
  const { token } = useAuth();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (onSubmissionUpdate) globalCallbacks.add(onSubmissionUpdate);
    return () => { if (onSubmissionUpdate) globalCallbacks.delete(onSubmissionUpdate); };
  }, [onSubmissionUpdate]);

  useEffect(() => {
    if (token) createSocketConnection(token);
  }, [token]);

  useEffect(() => {
    const interval = setInterval(() => setIsConnected(globalConnectionState), 1000);
    return () => clearInterval(interval);
  }, []);

  const sendMessage = useCallback((message: any) => {
    if (globalSocket && globalSocket.connected) {
      globalSocket.emit('message', message);
    } else {
      console.warn('⚠️ Socket.IO is not connected');
    }
  }, []);

  return { sendMessage, isConnected };
}; 