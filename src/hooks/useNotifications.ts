import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useCompanyStore } from '../store/companyStore';

interface Notification {
  id: string;
  title: string;
  description: string;
  type: 'eve' | 'performance' | 'system';
  read: boolean;
  created_at: string;
  metadata?: Record<string, any>;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { company } = useCompanyStore();

  useEffect(() => {
    if (!company) return;

    // Load initial notifications
    const loadNotifications = async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('company_id', company.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setNotifications(data);
      }
    };

    loadNotifications();

    // Subscribe to new notifications
    const channel = supabase
      .channel(`notifications:${company.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `company_id=eq.${company.id}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setNotifications(prev => [payload.new as Notification, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setNotifications(prev => prev.map(n => 
              n.id === payload.new.id ? payload.new as Notification : n
            ));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [company]);

  const markAsRead = async (id: string) => {
    if (!company) return;

    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id)
      .eq('company_id', company.id);

    if (!error) {
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === id
            ? { ...notification, read: true }
            : notification
        )
      );
    }
  };

  const markAllAsRead = async () => {
    if (!company) return;

    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('company_id', company.id)
      .eq('read', false);

    if (!error) {
      setNotifications(prev =>
        prev.map(notification => ({ ...notification, read: true }))
      );
    }
  };

  return {
    notifications,
    markAsRead,
    markAllAsRead
  };
}