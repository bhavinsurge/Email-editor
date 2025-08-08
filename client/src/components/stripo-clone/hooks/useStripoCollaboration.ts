import { useState, useCallback, useRef, useEffect } from 'react';
import { 
  StripoUser, 
  StripoComment, 
  StripoCollaborationEvent,
  StripoCommentReply 
} from '../types/stripo.types';
import { nanoid } from 'nanoid';

interface UseStripoCollaborationReturn {
  collaborators: StripoUser[];
  activeUsers: StripoUser[];
  comments: StripoComment[];
  addComment: (componentId: string, content: string, position?: { x: number; y: number }) => void;
  resolveComment: (commentId: string) => void;
  addCommentReply: (commentId: string, content: string) => void;
  sendCursor: (position: { x: number; y: number }, componentId?: string) => void;
  broadcastChange: (event: Omit<StripoCollaborationEvent, 'timestamp'>) => void;
  inviteUser: (email: string, role: StripoUser['role']) => void;
  removeUser: (userId: string) => void;
  updateUserRole: (userId: string, role: StripoUser['role']) => void;
  isConnected: boolean;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
}

// Mock WebSocket for demonstration (replace with real implementation)
class MockWebSocket {
  private listeners: { [event: string]: Function[] } = {};
  private isOpen = false;
  
  constructor(private url: string) {
    // Simulate connection
    setTimeout(() => {
      this.isOpen = true;
      this.emit('open', {});
    }, 1000);
  }

  on(event: string, callback: Function) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  emit(event: string, data: any) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }

  send(data: string) {
    if (this.isOpen) {
      // Simulate receiving the message back (for testing)
      setTimeout(() => {
        this.emit('message', { data });
      }, 100);
    }
  }

  close() {
    this.isOpen = false;
    this.emit('close', {});
  }
}

export function useStripoCollaboration(
  currentUser?: StripoUser,
  enabled: boolean = true
): UseStripoCollaborationReturn {
  const [collaborators, setCollaborators] = useState<StripoUser[]>([]);
  const [activeUsers, setActiveUsers] = useState<StripoUser[]>([]);
  const [comments, setComments] = useState<StripoComment[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  
  const wsRef = useRef<MockWebSocket | null>(null);
  const heartbeatRef = useRef<NodeJS.Timeout>();
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  // Initialize WebSocket connection
  useEffect(() => {
    if (!enabled || !currentUser) return;

    const connectWebSocket = () => {
      setConnectionStatus('connecting');
      
      // Replace with real WebSocket URL
      wsRef.current = new MockWebSocket(`ws://localhost:8080/collaboration/${currentUser.id}`);
      
      wsRef.current.on('open', () => {
        setConnectionStatus('connected');
        
        // Send initial user info
        wsRef.current?.send(JSON.stringify({
          type: 'user_join',
          userId: currentUser.id,
          data: currentUser
        }));

        // Start heartbeat
        heartbeatRef.current = setInterval(() => {
          wsRef.current?.send(JSON.stringify({ type: 'ping' }));
        }, 30000);
      });

      wsRef.current.on('message', (event) => {
        try {
          const message = JSON.parse(event.data);
          handleCollaborationEvent(message);
        } catch (error) {
          console.error('Error parsing collaboration message:', error);
        }
      });

      wsRef.current.on('close', () => {
        setConnectionStatus('disconnected');
        if (heartbeatRef.current) {
          clearInterval(heartbeatRef.current);
        }
        
        // Attempt to reconnect
        reconnectTimeoutRef.current = setTimeout(() => {
          connectWebSocket();
        }, 5000);
      });

      wsRef.current.on('error', () => {
        setConnectionStatus('error');
      });
    };

    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (heartbeatRef.current) {
        clearInterval(heartbeatRef.current);
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [enabled, currentUser]);

  const handleCollaborationEvent = useCallback((event: StripoCollaborationEvent) => {
    switch (event.type) {
      case 'user_join':
        setActiveUsers(prev => {
          const existing = prev.find(u => u.id === event.userId);
          if (existing) return prev;
          return [...prev, event.data as StripoUser];
        });
        break;

      case 'user_leave':
        setActiveUsers(prev => prev.filter(u => u.id !== event.userId));
        break;

      case 'cursor_move':
        setActiveUsers(prev => prev.map(user => 
          user.id === event.userId 
            ? { ...user, cursor: event.data }
            : user
        ));
        break;

      case 'comment_add':
        setComments(prev => [...prev, event.data as StripoComment]);
        break;

      case 'comment_resolve':
        setComments(prev => prev.map(comment =>
          comment.id === event.data.commentId
            ? { ...comment, resolved: true, resolvedBy: event.userId, resolvedAt: new Date().toISOString() }
            : comment
        ));
        break;

      default:
        break;
    }
  }, []);

  const addComment = useCallback((
    componentId: string, 
    content: string, 
    position?: { x: number; y: number }
  ) => {
    if (!currentUser) return;

    const comment: StripoComment = {
      id: nanoid(),
      componentId,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      content,
      timestamp: new Date().toISOString(),
      resolved: false,
      replies: [],
      position
    };

    setComments(prev => [...prev, comment]);

    // Broadcast to other users
    broadcastChange({
      type: 'comment_add',
      userId: currentUser.id,
      data: comment
    });
  }, [currentUser]);

  const resolveComment = useCallback((commentId: string) => {
    if (!currentUser) return;

    setComments(prev => prev.map(comment =>
      comment.id === commentId
        ? { 
            ...comment, 
            resolved: true, 
            resolvedBy: currentUser.id, 
            resolvedAt: new Date().toISOString() 
          }
        : comment
    ));

    // Broadcast to other users
    broadcastChange({
      type: 'comment_resolve',
      userId: currentUser.id,
      data: { commentId }
    });
  }, [currentUser]);

  const addCommentReply = useCallback((commentId: string, content: string) => {
    if (!currentUser) return;

    const reply: StripoCommentReply = {
      id: nanoid(),
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      content,
      timestamp: new Date().toISOString()
    };

    setComments(prev => prev.map(comment =>
      comment.id === commentId
        ? { ...comment, replies: [...(comment.replies || []), reply] }
        : comment
    ));

    // Broadcast to other users
    broadcastChange({
      type: 'comment_add',
      userId: currentUser.id,
      data: { commentId, reply }
    });
  }, [currentUser]);

  const sendCursor = useCallback((position: { x: number; y: number }, componentId?: string) => {
    if (!currentUser) return;

    const cursorData = { ...position, componentId };
    
    // Update local state
    setActiveUsers(prev => prev.map(user =>
      user.id === currentUser.id
        ? { ...user, cursor: cursorData }
        : user
    ));

    // Broadcast to other users
    broadcastChange({
      type: 'cursor_move',
      userId: currentUser.id,
      data: cursorData
    });
  }, [currentUser]);

  const broadcastChange = useCallback((event: Omit<StripoCollaborationEvent, 'timestamp'>) => {
    if (!wsRef.current || connectionStatus !== 'connected') return;

    const fullEvent: StripoCollaborationEvent = {
      ...event,
      timestamp: Date.now()
    };

    wsRef.current.send(JSON.stringify(fullEvent));
  }, [connectionStatus]);

  const inviteUser = useCallback((email: string, role: StripoUser['role']) => {
    // In a real implementation, this would send an invitation email
    const newUser: StripoUser = {
      id: nanoid(),
      name: email.split('@')[0],
      email,
      role,
      isOnline: false
    };

    setCollaborators(prev => [...prev, newUser]);

    // Broadcast to other users
    broadcastChange({
      type: 'user_join',
      userId: newUser.id,
      data: newUser
    });
  }, [broadcastChange]);

  const removeUser = useCallback((userId: string) => {
    setCollaborators(prev => prev.filter(u => u.id !== userId));
    setActiveUsers(prev => prev.filter(u => u.id !== userId));

    // Broadcast to other users
    broadcastChange({
      type: 'user_leave',
      userId,
      data: {}
    });
  }, [broadcastChange]);

  const updateUserRole = useCallback((userId: string, role: StripoUser['role']) => {
    setCollaborators(prev => prev.map(user =>
      user.id === userId ? { ...user, role } : user
    ));

    setActiveUsers(prev => prev.map(user =>
      user.id === userId ? { ...user, role } : user
    ));
  }, []);

  // Mock some initial collaborators for demonstration
  useEffect(() => {
    if (enabled && collaborators.length === 0) {
      setCollaborators([
        {
          id: 'user-1',
          name: 'John Doe',
          email: 'john@example.com',
          role: 'editor',
          isOnline: true,
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
        },
        {
          id: 'user-2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          role: 'viewer',
          isOnline: false,
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face'
        }
      ]);

      setActiveUsers([
        {
          id: 'user-1',
          name: 'John Doe',
          email: 'john@example.com',
          role: 'editor',
          isOnline: true,
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
        }
      ]);
    }
  }, [enabled, collaborators.length]);

  return {
    collaborators,
    activeUsers,
    comments,
    addComment,
    resolveComment,
    addCommentReply,
    sendCursor,
    broadcastChange,
    inviteUser,
    removeUser,
    updateUserRole,
    isConnected: connectionStatus === 'connected',
    connectionStatus
  };
}