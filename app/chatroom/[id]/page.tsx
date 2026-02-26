'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Message {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    username: string;
    role: 'USER' | 'MODERATOR' | 'ADMIN';
  };
}

interface User {
  id: string;
  username: string;
  role: 'USER' | 'MODERATOR' | 'ADMIN';
}

interface Room {
  id: string;
  name: string;
  description: string;
  isPrivate: boolean;
  createdBy: {
    username: string;
  };
}

interface ModerationData {
  bans: Array<{ userId: string; user: { username: string } }>;
  mutes: Array<{ userId: string; user: { username: string } }>;
}

export default async function ChatRoomPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [room, setRoom] = useState<Room | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [moderation, setModeration] = useState<ModerationData>({ bans: [], mutes: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const { id } = await params;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Get current user
  useEffect(() => {
    const savedUser = localStorage.getItem('chatUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    } else {
      alert('Please go back to the chatroom list to set up your profile');
      router.push('/chatroom');
    }
  }, [router]);

  // Fetch room details and check if banned
  useEffect(() => {
    if (!currentUser) return;

    const fetchRoom = async () => {
      try {
        const response = await fetch(`/api/rooms?userId=${currentUser.id}`);
        if (!response.ok) throw new Error('Failed to fetch rooms');
        
        const rooms = await response.json();
        const currentRoom = rooms.find((r: Room) => r.id === id);
        
        if (!currentRoom) {
          alert('Room not found');
          router.push('/chatroom');
          return;
        }
        
        setRoom(currentRoom);
      } catch (err) {
        console.error('Error fetching room:', err);
        setError('Failed to load room');
      }
    };

    fetchRoom();
  }, [currentUser, id, router]);

  // Fetch moderation data
  useEffect(() => {
    if (!id) return;

    const fetchModeration = async () => {
      try {
        const response = await fetch(`/api/moderation?roomId=${id}`);
        if (!response.ok) throw new Error('Failed to fetch moderation data');
        
        const data = await response.json();
        setModeration(data);

        // Check if current user is banned
        if (currentUser && data.bans.some((ban: any) => ban.userId === currentUser.id)) {
          alert('You have been banned from this room');
          router.push('/chatroom');
        }
      } catch (err) {
        console.error('Error fetching moderation data:', err);
      }
    };

    fetchModeration();
  }, [id, currentUser, router]);

  // Fetch messages initially and set up polling
  useEffect(() => {
    if (!id) return;

    const fetchMessages = async () => {
      try {
        const response = await fetch(`/api/messages?roomId=${id}&limit=50`);
        if (!response.ok) throw new Error('Failed to fetch messages');
        
        const data = await response.json();
        setMessages(data);
        setError(null);
        scrollToBottom();
      } catch (err) {
        console.error('Error fetching messages:', err);
        setError('Failed to load messages');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    // Poll for new messages every 2 seconds (in production, use WebSockets)
    pollIntervalRef.current = setInterval(fetchMessages, 2000);

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !currentUser || !room) return;

    // Check if user is muted
    if (moderation.mutes.some(mute => mute.userId === currentUser.id)) {
      alert('You have been muted in this room');
      return;
    }

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newMessage,
          roomId: id,
          userId: currentUser.id,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to send message');
      }

      const message = await response.json();
      setMessages([...messages, message]);
      setNewMessage('');
      scrollToBottom();
    } catch (err: any) {
      console.error('Error sending message:', err);
      alert(err.message || 'Failed to send message');
    }
  };

  const deleteMessage = async (messageId: string, messageUserId: string) => {
    if (!currentUser) return;

    // Check permissions
    if (
      currentUser.role !== 'ADMIN' &&
      currentUser.role !== 'MODERATOR' &&
      currentUser.id !== messageUserId
    ) {
      alert('You do not have permission to delete this message');
      return;
    }

    try {
      const response = await fetch(
        `/api/messages?messageId=${messageId}&userId=${currentUser.id}`,
        { method: 'DELETE' }
      );

      if (!response.ok) throw new Error('Failed to delete message');

      setMessages(messages.filter((msg) => msg.id !== messageId));
    } catch (err) {
      console.error('Error deleting message:', err);
      alert('Failed to delete message');
    }
  };

  const performModeration = async (
    action: 'kick' | 'ban' | 'mute' | 'unmute',
    targetUserId: string,
    username: string
  ) => {
    if (!currentUser) return;

    const actionMessages = {
      kick: `Kick ${username} from this room?`,
      ban: `Ban ${username} from this room permanently?`,
      mute: `Mute ${username}?`,
      unmute: `Unmute ${username}?`,
    };

    if (!confirm(actionMessages[action])) return;

    try {
      const response = await fetch(`/api/moderation?action=${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomId: id,
          targetUserId,
          moderatorId: currentUser.id,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Moderation action failed');
      }

      // Refresh moderation data
      const modResponse = await fetch(`/api/moderation?roomId=${id}`);
      if (modResponse.ok) {
        const data = await modResponse.json();
        setModeration(data);
      }

      // Remove messages if kicked or banned
      if (action === 'kick' || action === 'ban') {
        setMessages(messages.filter((msg) => msg.user.id !== targetUserId));
      }

      alert(`Successfully ${action}ed ${username}`);
    } catch (err: any) {
      console.error(`Error ${action}ing user:`, err);
      alert(err.message || `Failed to ${action} user`);
    }
  };

  const clearChat = async () => {
    if (!currentUser || currentUser.role !== 'ADMIN') {
      alert('Only admins can clear the chat');
      return;
    }

    if (!confirm('Clear all messages in this room?')) return;

    try {
      const response = await fetch(`/api/moderation?action=clear`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomId: id,
          targetUserId: '', // Not needed for clear
          moderatorId: currentUser.id,
        }),
      });

      if (!response.ok) throw new Error('Failed to clear chat');

      setMessages([]);
      alert('Chat cleared successfully');
    } catch (err) {
      console.error('Error clearing chat:', err);
      alert('Failed to clear chat');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'MODERATOR':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    }
  };

  const isUserMuted = (userId: string) => {
    return moderation.mutes.some(mute => mute.userId === userId);
  };

  if (loading || !room || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link
              href="/chatroom"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              ← Back to Rooms
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {room.name}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {room.description || 'No description'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {currentUser.username}
              </p>
              <span className={`text-xs px-2 py-1 rounded ${getRoleBadgeColor(currentUser.role)}`}>
                {currentUser.role}
              </span>
            </div>

            {currentUser.role === 'ADMIN' && (
              <button
                onClick={clearChat}
                className="text-sm px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Clear Chat
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mx-6 mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No messages yet. Start the conversation!
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.user.id === currentUser.id ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-4 ${
                  message.user.id === currentUser.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-sm">{message.user.username}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${getRoleBadgeColor(message.user.role)}`}>
                    {message.user.role}
                  </span>
                  {isUserMuted(message.user.id) && (
                    <span className="text-xs px-2 py-0.5 rounded bg-gray-500 text-white">
                      muted
                    </span>
                  )}
                </div>
                <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-xs opacity-70">
                    {new Date(message.createdAt).toLocaleTimeString()}
                  </span>

                  {/* Message Actions */}
                  {(currentUser.role === 'ADMIN' ||
                    currentUser.role === 'MODERATOR' ||
                    message.user.id === currentUser.id) && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => deleteMessage(message.id, message.user.id)}
                        className="text-xs opacity-70 hover:opacity-100"
                        title="Delete message"
                      >
                        🗑️
                      </button>

                      {/* Moderation actions */}
                      {message.user.id !== currentUser.id &&
                        (currentUser.role === 'ADMIN' || currentUser.role === 'MODERATOR') && (
                          <>
                            <button
                              onClick={() => 
                                performModeration(
                                  isUserMuted(message.user.id) ? 'unmute' : 'mute',
                                  message.user.id,
                                  message.user.username
                                )
                              }
                              className="text-xs opacity-70 hover:opacity-100"
                              title={isUserMuted(message.user.id) ? "Unmute user" : "Mute user"}
                            >
                              {isUserMuted(message.user.id) ? '🔊' : '🔇'}
                            </button>
                            <button
                              onClick={() => performModeration('kick', message.user.id, message.user.username)}
                              className="text-xs opacity-70 hover:opacity-100"
                              title="Kick user"
                            >
                              👢
                            </button>
                            {currentUser.role === 'ADMIN' && (
                              <button
                                onClick={() => performModeration('ban', message.user.id, message.user.username)}
                                className="text-xs opacity-70 hover:opacity-100"
                                title="Ban user"
                              >
                                🚫
                              </button>
                            )}
                          </>
                        )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4">
        {isUserMuted(currentUser.id) ? (
          <div className="text-center py-4 text-red-500">
            You have been muted in this room
          </div>
        ) : (
          <div className="flex gap-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              Send
            </button>
          </div>
        )}
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
          Press Enter to send, Shift+Enter for new line • Messages refresh every 2 seconds
        </p>
      </div>
    </div>
  );
}
