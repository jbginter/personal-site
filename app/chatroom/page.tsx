'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Room {
  id: string;
  name: string;
  description: string;
  isPrivate: boolean;
  createdAt: string;
  createdBy: {
    id: string;
    username: string;
    role: string;
  };
  _count: {
    members: number;
    messages: number;
  };
}

interface User {
  id: string;
  username: string;
  role: 'USER' | 'MODERATOR' | 'ADMIN';
}

export default function ChatroomPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomDescription, setNewRoomDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get or create user (in production, this would be from NextAuth session)
  useEffect(() => {
    const savedUser = localStorage.getItem('chatUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    } else {
      // For demo: create a user with USER role
      // In production, this would be handled by authentication
      const demoUser: User = {
        id: 'demo_' + Math.random().toString(36).substr(2, 9),
        username: 'User' + Math.floor(Math.random() * 1000),
        role: 'USER',
      };
      localStorage.setItem('chatUser', JSON.stringify(demoUser));
      setCurrentUser(demoUser);
    }
  }, []);

  // Fetch rooms from API
  useEffect(() => {
    if (!currentUser) return;

    const fetchRooms = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/rooms?userId=${currentUser.id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch rooms');
        }
        
        const data = await response.json();
        setRooms(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching rooms:', err);
        setError('Failed to load rooms. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [currentUser]);

  const createRoom = async () => {
    if (!newRoomName.trim() || !currentUser) return;

    try {
      const response = await fetch('/api/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newRoomName,
          description: newRoomDescription,
          isPrivate,
          userId: currentUser.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create room');
      }

      const newRoom = await response.json();
      setRooms([newRoom, ...rooms]);

      // Reset form
      setNewRoomName('');
      setNewRoomDescription('');
      setIsPrivate(false);
      setShowCreateModal(false);
    } catch (err) {
      console.error('Error creating room:', err);
      alert('Failed to create room. Please try again.');
    }
  };

  const deleteRoom = async (roomId: string) => {
    if (currentUser?.role !== 'ADMIN' && currentUser?.role !== 'MODERATOR') {
      alert('Only admins and moderators can delete rooms');
      return;
    }

    if (!confirm('Are you sure you want to delete this room?')) {
      return;
    }

    try {
      const response = await fetch(
        `/api/rooms?roomId=${roomId}&userId=${currentUser.id}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete room');
      }

      setRooms(rooms.filter((room) => room.id !== roomId));
    } catch (err) {
      console.error('Error deleting room:', err);
      alert('Failed to delete room. Please try again.');
    }
  };

  const changeRole = () => {
    if (!currentUser) return;
    
    const roles: Array<'USER' | 'MODERATOR' | 'ADMIN'> = ['USER', 'MODERATOR', 'ADMIN'];
    const currentIndex = roles.indexOf(currentUser.role);
    const nextRole = roles[(currentIndex + 1) % roles.length];
    
    const updatedUser = { ...currentUser, role: nextRole };
    setCurrentUser(updatedUser);
    localStorage.setItem('chatUser', JSON.stringify(updatedUser));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Navigation */}
      <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline">
              ← Back to Portfolio
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Chatrooms
            </h1>
          </div>
          
          {currentUser && (
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {currentUser.username}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Role: <span className={`font-semibold ${
                    currentUser.role === 'ADMIN' ? 'text-red-500' :
                    currentUser.role === 'MODERATOR' ? 'text-yellow-500' :
                    'text-green-500'
                  }`}>
                    {currentUser.role}
                  </span>
                </p>
              </div>
              <button
                onClick={changeRole}
                className="text-xs px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Switch Role
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Available Rooms
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Join a room to start chatting
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            + Create Room
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              Loading rooms...
            </p>
          </div>
        ) : (
          <>
            {/* Rooms Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map((room) => (
                <div
                  key={room.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          {room.name}
                        </h3>
                        {room.isPrivate && (
                          <span className="text-xs px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded">
                            Private
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {room.description || 'No description'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        Created by {room.createdBy.username}
                      </p>
                    </div>
                    
                    {(currentUser?.role === 'ADMIN' || currentUser?.role === 'MODERATOR') && (
                      <button
                        onClick={() => deleteRoom(room.id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                        title="Delete room"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {room._count.members} members • {room._count.messages} messages
                    </span>
                    <Link
                      href={`/chatroom/${room.id}`}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      Join Room
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {rooms.length === 0 && !loading && (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  No rooms available. Create one to get started!
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Create Room Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Create New Room
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Room Name *
                </label>
                <input
                  type="text"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  placeholder="Enter room name"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={newRoomDescription}
                  onChange={(e) => setNewRoomDescription(e.target.value)}
                  placeholder="Enter room description"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPrivate"
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="isPrivate" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Make this room private
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={createRoom}
                  disabled={!newRoomName.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Room
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Info Panel */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
          <h3 className="text-lg font-bold text-blue-900 dark:text-blue-300 mb-2">
            Role Permissions
          </h3>
          <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
            <p><strong>Admin:</strong> Can create, delete any room, kick/ban users, send messages</p>
            <p><strong>Moderator:</strong> Can delete rooms, kick users, send messages</p>
            <p><strong>User:</strong> Can create rooms, send messages in accessible rooms</p>
          </div>
          <p className="text-xs text-blue-700 dark:text-blue-300 mt-4">
            Click "Switch Role" to test different permission levels
          </p>
        </div>
      </div>
    </div>
  );
}
