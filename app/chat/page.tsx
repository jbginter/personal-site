'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface AuthUser {
  id: number;
  username: string;
  role: 'admin' | 'moderator' | 'user';
}

interface Message {
  id: number;
  content: string;
  created_at: string;
  deleted: boolean;
  user_id: number;
  username: string;
  role: 'admin' | 'moderator' | 'user';
}

interface UserRecord {
  id: number;
  username: string;
  role: 'admin' | 'moderator' | 'user';
  created_at: string;
}

type Room = 'general' | 'random';

const ROOMS: Room[] = ['general', 'random'];

export default function ChatPage() {
  const router = useRouter();
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [activeRoom, setActiveRoom] = useState<Room>('general');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [adminPanelOpen, setAdminPanelOpen] = useState(false);
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [roleEdits, setRoleEdits] = useState<Record<number, string>>({});
  const [savingRole, setSavingRole] = useState<number | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);
  const latestCreatedAt = useRef<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const messagesRef = useRef<Message[]>([]);

  messagesRef.current = messages;

  // Auth check on mount
  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => {
        if (res.status === 401) {
          router.push('/chat/login');
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data?.user) setAuthUser(data.user);
      })
      .catch(() => router.push('/chat/login'));
  }, [router]);

  // Load messages for current room
  const loadMessages = useCallback(async (room: Room) => {
    try {
      const res = await fetch(`/api/messages?room=${room}`);
      if (res.status === 401) { router.push('/chat/login'); return; }
      const data = await res.json();
      const msgs: Message[] = data.messages ?? [];
      setMessages(msgs);
      if (msgs.length > 0) {
        latestCreatedAt.current = msgs[msgs.length - 1].created_at;
      } else {
        latestCreatedAt.current = null;
      }
    } catch {
      // ignore
    }
  }, [router]);

  // Poll for new messages
  const pollMessages = useCallback(async (room: Room) => {
    const since = latestCreatedAt.current;
    const url = since
      ? `/api/messages?room=${room}&since=${encodeURIComponent(since)}`
      : `/api/messages?room=${room}`;

    try {
      const res = await fetch(url);
      if (res.status === 401) { router.push('/chat/login'); return; }
      const data = await res.json();
      const newMsgs: Message[] = data.messages ?? [];
      if (newMsgs.length > 0) {
        setMessages((prev) => {
          const existingIds = new Set(prev.map((m) => m.id));
          const appended = newMsgs.filter((m) => !existingIds.has(m.id));
          return appended.length > 0 ? [...prev, ...appended] : prev;
        });
        latestCreatedAt.current = newMsgs[newMsgs.length - 1].created_at;
      }
    } catch {
      // ignore
    }
  }, [router]);

  // Room change: clear and reload
  useEffect(() => {
    if (!authUser) return;
    latestCreatedAt.current = null;
    setMessages([]);
    loadMessages(activeRoom);
  }, [activeRoom, authUser, loadMessages]);

  // Polling setup
  useEffect(() => {
    if (!authUser) return;
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(() => pollMessages(activeRoom), 3000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [activeRoom, authUser, pollMessages]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load users for admin panel
  const loadUsers = useCallback(async () => {
    try {
      const res = await fetch('/api/users');
      if (!res.ok) return;
      const data = await res.json();
      setUsers(data.users ?? []);
      const edits: Record<number, string> = {};
      (data.users ?? []).forEach((u: UserRecord) => { edits[u.id] = u.role; });
      setRoleEdits(edits);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (authUser?.role === 'admin' && adminPanelOpen) {
      loadUsers();
    }
  }, [authUser, adminPanelOpen, loadUsers]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/chat/login');
  };

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const content = input.trim();
    if (!content || sending) return;
    setSending(true);
    setInput('');
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, room: activeRoom }),
      });
      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => {
          const exists = prev.some((m) => m.id === data.message.id);
          return exists ? prev : [...prev, data.message];
        });
        latestCreatedAt.current = data.message.created_at;
      }
    } catch {
      // ignore
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleDelete = async (msgId: number) => {
    try {
      const res = await fetch(`/api/messages/${msgId}`, { method: 'DELETE' });
      if (res.ok) {
        setMessages((prev) =>
          prev.map((m) => m.id === msgId ? { ...m, deleted: true } : m)
        );
      }
    } catch {
      // ignore
    }
  };

  const handleSaveRole = async (userId: number) => {
    const role = roleEdits[userId];
    if (!role) return;
    setSavingRole(userId);
    try {
      await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });
      setUsers((prev) =>
        prev.map((u) => u.id === userId ? { ...u, role: role as UserRecord['role'] } : u)
      );
    } catch {
      // ignore
    } finally {
      setSavingRole(null);
    }
  };

  const canDelete = (msg: Message) => {
    if (!authUser) return false;
    return (
      msg.user_id === authUser.id ||
      authUser.role === 'admin' ||
      authUser.role === 'moderator'
    );
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!authUser) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: 'var(--background)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--muted)',
          fontFamily: 'var(--font-space-mono)',
          fontSize: '13px',
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--background)',
        color: 'var(--foreground)',
        fontFamily: 'var(--font-space-grotesk)',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--border)',
          backgroundColor: 'var(--card-bg)',
          padding: '0 20px',
          flexShrink: 0,
          height: '52px',
        }}
      >
        {/* Room tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0', height: '100%' }}>
          <span
            style={{
              fontFamily: 'var(--font-space-mono)',
              fontSize: '11px',
              letterSpacing: '0.12em',
              color: 'var(--muted)',
              textTransform: 'uppercase',
              marginRight: '20px',
            }}
          >
            #
          </span>
          {ROOMS.map((room) => (
            <button
              key={room}
              onClick={() => setActiveRoom(room)}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: activeRoom === room ? '2px solid var(--accent)' : '2px solid transparent',
                color: activeRoom === room ? 'var(--foreground)' : 'var(--muted)',
                cursor: 'pointer',
                fontFamily: 'var(--font-space-grotesk)',
                fontSize: '14px',
                fontWeight: activeRoom === room ? '600' : '400',
                padding: '0 12px',
                height: '100%',
                transition: 'color 0.15s, border-color 0.15s',
              }}
            >
              {room}
            </button>
          ))}
        </div>

        {/* User info + admin + logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {authUser.role === 'admin' && (
            <button
              onClick={() => setAdminPanelOpen((o) => !o)}
              style={{
                background: 'none',
                border: '1px solid var(--border)',
                borderColor: adminPanelOpen ? 'var(--accent)' : 'var(--border)',
                color: adminPanelOpen ? 'var(--accent)' : 'var(--muted)',
                cursor: 'pointer',
                fontFamily: 'var(--font-space-mono)',
                fontSize: '10px',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                padding: '4px 10px',
                borderRadius: '2px',
                transition: 'color 0.15s, border-color 0.15s',
              }}
            >
              Users
            </button>
          )}

          <span
            style={{
              fontFamily: 'var(--font-space-mono)',
              fontSize: '12px',
              color: 'var(--muted)',
            }}
          >
            {authUser.username}
            {authUser.role !== 'user' && (
              <span
                style={{
                  marginLeft: '6px',
                  fontSize: '10px',
                  letterSpacing: '0.08em',
                  fontWeight: '700',
                  color: authUser.role === 'admin' ? 'var(--accent)' : '#60a5fa',
                }}
              >
                {authUser.role.toUpperCase()}
              </span>
            )}
          </span>

          <button
            onClick={handleLogout}
            style={{
              background: 'none',
              border: '1px solid var(--border)',
              color: 'var(--muted)',
              cursor: 'pointer',
              fontFamily: 'var(--font-space-mono)',
              fontSize: '10px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              padding: '4px 10px',
              borderRadius: '2px',
              transition: 'color 0.15s',
            }}
            onMouseEnter={(e) => { (e.target as HTMLButtonElement).style.color = 'var(--foreground)'; }}
            onMouseLeave={(e) => { (e.target as HTMLButtonElement).style.color = 'var(--muted)'; }}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Admin panel */}
      {authUser.role === 'admin' && adminPanelOpen && (
        <div
          style={{
            borderBottom: '1px solid var(--border)',
            backgroundColor: 'var(--card-bg)',
            padding: '16px 20px',
            flexShrink: 0,
            maxHeight: '220px',
            overflowY: 'auto',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-space-mono)',
              fontSize: '10px',
              letterSpacing: '0.12em',
              color: 'var(--accent)',
              textTransform: 'uppercase',
              marginBottom: '12px',
            }}
          >
            User Management
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {users.map((u) => (
              <div
                key={u.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '6px 10px',
                  backgroundColor: 'var(--background)',
                  border: '1px solid var(--border)',
                  borderRadius: '2px',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-space-mono)',
                    fontSize: '13px',
                    color: 'var(--foreground)',
                    minWidth: '120px',
                  }}
                >
                  {u.username}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-space-mono)',
                    fontSize: '10px',
                    color: 'var(--muted)',
                    flexGrow: 1,
                  }}
                >
                  id:{u.id}
                </span>
                <select
                  value={roleEdits[u.id] ?? u.role}
                  onChange={(e) =>
                    setRoleEdits((prev) => ({ ...prev, [u.id]: e.target.value }))
                  }
                  disabled={u.id === authUser.id}
                  style={{
                    backgroundColor: 'var(--card-bg)',
                    border: '1px solid var(--border)',
                    color: 'var(--foreground)',
                    fontFamily: 'var(--font-space-mono)',
                    fontSize: '12px',
                    padding: '3px 8px',
                    borderRadius: '2px',
                    cursor: u.id === authUser.id ? 'not-allowed' : 'pointer',
                    opacity: u.id === authUser.id ? 0.5 : 1,
                  }}
                >
                  <option value="user">user</option>
                  <option value="moderator">moderator</option>
                  <option value="admin">admin</option>
                </select>
                <button
                  onClick={() => handleSaveRole(u.id)}
                  disabled={u.id === authUser.id || savingRole === u.id}
                  style={{
                    backgroundColor: 'var(--accent)',
                    color: '#111',
                    border: 'none',
                    fontFamily: 'var(--font-space-mono)',
                    fontSize: '10px',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    padding: '4px 10px',
                    borderRadius: '2px',
                    cursor: u.id === authUser.id ? 'not-allowed' : 'pointer',
                    opacity: u.id === authUser.id ? 0.4 : 1,
                    fontWeight: '700',
                  }}
                >
                  {savingRole === u.id ? '...' : 'Save'}
                </button>
              </div>
            ))}
            {users.length === 0 && (
              <div
                style={{
                  fontFamily: 'var(--font-space-mono)',
                  fontSize: '12px',
                  color: 'var(--muted)',
                }}
              >
                No users found.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Message area */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '2px',
        }}
      >
        {messages.length === 0 && (
          <div
            style={{
              color: 'var(--muted)',
              fontFamily: 'var(--font-space-mono)',
              fontSize: '12px',
              textAlign: 'center',
              marginTop: '40px',
            }}
          >
            No messages yet in #{activeRoom}. Say hello!
          </div>
        )}

        {messages.map((msg) => {
          const isOwn = msg.user_id === authUser.id;
          return (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                padding: '6px 10px',
                borderLeft: isOwn ? '2px solid rgba(245,158,11,0.35)' : '2px solid transparent',
                borderRadius: '2px',
                backgroundColor: isOwn ? 'rgba(245,158,11,0.03)' : 'transparent',
                transition: 'background-color 0.1s',
              }}
            >
              {/* Time */}
              <span
                style={{
                  fontFamily: 'var(--font-space-mono)',
                  fontSize: '10px',
                  color: 'var(--muted)',
                  flexShrink: 0,
                  marginTop: '2px',
                  userSelect: 'none',
                }}
              >
                {formatTime(msg.created_at)}
              </span>

              {/* Username + role badge */}
              <span
                style={{
                  fontFamily: 'var(--font-space-mono)',
                  fontSize: '12px',
                  fontWeight: '700',
                  color: isOwn ? 'var(--accent)' : 'var(--foreground)',
                  flexShrink: 0,
                  minWidth: '80px',
                }}
              >
                {msg.username}
                {msg.role !== 'user' && (
                  <span
                    style={{
                      marginLeft: '5px',
                      fontSize: '9px',
                      letterSpacing: '0.06em',
                      color: msg.role === 'admin' ? 'var(--accent)' : '#60a5fa',
                      fontWeight: '700',
                    }}
                  >
                    {msg.role === 'admin' ? 'ADMIN' : 'MOD'}
                  </span>
                )}
              </span>

              {/* Content */}
              <span
                style={{
                  fontFamily: 'var(--font-space-grotesk)',
                  fontSize: '14px',
                  color: msg.deleted ? 'var(--muted)' : 'var(--foreground)',
                  fontStyle: msg.deleted ? 'italic' : 'normal',
                  flex: 1,
                  wordBreak: 'break-word',
                  lineHeight: '1.5',
                }}
              >
                {msg.deleted ? '[message deleted]' : msg.content}
              </span>

              {/* Delete button */}
              {!msg.deleted && canDelete(msg) && (
                <button
                  onClick={() => handleDelete(msg.id)}
                  title="Delete message"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--muted)',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-space-mono)',
                    fontSize: '11px',
                    padding: '0 4px',
                    flexShrink: 0,
                    opacity: 0.6,
                    transition: 'opacity 0.15s, color 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.target as HTMLButtonElement;
                    el.style.opacity = '1';
                    el.style.color = '#f87171';
                  }}
                  onMouseLeave={(e) => {
                    const el = e.target as HTMLButtonElement;
                    el.style.opacity = '0.6';
                    el.style.color = 'var(--muted)';
                  }}
                >
                  del
                </button>
              )}
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div
        style={{
          borderTop: '1px solid var(--border)',
          backgroundColor: 'var(--card-bg)',
          padding: '12px 20px',
          flexShrink: 0,
        }}
      >
        <form
          onSubmit={handleSend}
          style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}
        >
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'var(--background)',
              border: '1px solid var(--border)',
              borderRadius: '3px',
              padding: '0 12px',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-space-mono)',
                fontSize: '12px',
                color: 'var(--muted)',
                marginRight: '8px',
                userSelect: 'none',
                flexShrink: 0,
              }}
            >
              #{activeRoom}
            </span>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              rows={1}
              style={{
                flex: 1,
                background: 'none',
                border: 'none',
                outline: 'none',
                color: 'var(--foreground)',
                fontFamily: 'var(--font-space-grotesk)',
                fontSize: '14px',
                resize: 'none',
                padding: '10px 0',
                lineHeight: '1.4',
              }}
            />
          </div>
          <button
            type="submit"
            disabled={sending || !input.trim()}
            style={{
              backgroundColor: sending || !input.trim() ? 'var(--border)' : 'var(--accent)',
              color: sending || !input.trim() ? 'var(--muted)' : '#111111',
              border: 'none',
              padding: '10px 18px',
              fontFamily: 'var(--font-space-mono)',
              fontSize: '11px',
              fontWeight: '700',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              cursor: sending || !input.trim() ? 'not-allowed' : 'pointer',
              borderRadius: '3px',
              transition: 'background-color 0.15s, color 0.15s',
              flexShrink: 0,
              height: '42px',
            }}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
