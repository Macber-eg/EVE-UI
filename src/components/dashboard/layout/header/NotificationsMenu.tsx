import { useState, useRef, useEffect } from 'react';
import { Bell, Brain, TrendingUp, Zap } from 'lucide-react';
import { useNotifications } from '../../../../hooks/useNotifications';

export function NotificationsMenu() {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  const menuRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  
  const unreadCount = notifications.filter(n => !n.read).length;

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'performance':
        return <TrendingUp className="h-4 w-4 text-[#72f68e]" />;
      case 'system':
        return <Zap className="h-4 w-4 text-[#72f68e]" />;
      default:
        return <Brain className="h-4 w-4 text-[#72f68e]" />;
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative text-gray-400 hover:text-white transition-colors"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-4 w-4 bg-[#72f68e] text-[#040707] text-xs flex items-center justify-center rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-[#040707]/95 border border-white/10 rounded-lg shadow-lg py-1 z-50">
          <div className="px-4 py-2 border-b border-white/10">
            <h3 className="text-sm font-medium text-white">Notifications</h3>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <Brain className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-400">No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`px-4 py-3 hover:bg-white/5 transition-colors cursor-pointer ${
                    !notification.read ? 'bg-[#72f68e]/5' : ''
                  }`}
                  onClick={() => {
                    markAsRead(notification.id);
                    if (notification.metadata?.url) {
                      window.location.href = notification.metadata.url;
                    }
                  }}
                >
                  <div className="flex items-start space-x-3">
                    <div className="p-1 rounded-lg bg-[#72f68e]/10">
                      {getIcon(notification.type)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{notification.title}</p>
                      <p className="text-sm text-gray-400 mt-0.5">{notification.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatTime(notification.created_at)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className="px-4 py-2 border-t border-white/10">
              <button 
                className="text-sm text-[#72f68e] hover:text-[#72f68e]/80 transition-colors"
                onClick={() => {
                  markAllAsRead();
                  setIsOpen(false);
                }}
              >
                Mark all as read
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}