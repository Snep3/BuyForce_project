import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // Standard in Expo

// --- Types (Based on PRD 1708) ---
type NotificationType = 'GROUP_JOINED' | 'GROUP_SUCCESS' | 'GROUP_FAILED' | 'GROUP_NEAR_GOAL' | 'PAYMENT_FAILED';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
  payload: {
    groupId?: string;
    productId?: string;
  };
}

// --- Mock Data ---
const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'GROUP_SUCCESS',
    title: 'Your group succeeded!',
    body: 'Payment processed for Sony 65" 4K TV. Shipment will start soon.',
    isRead: false,
    createdAt: '2025-11-20T14:30:00Z',
    payload: { productId: 'p1', groupId: 'g1' },
  },
  {
    id: '2',
    type: 'GROUP_NEAR_GOAL',
    title: 'Almost there! 95% Full',
    body: 'Your group for Dyson V15 is about to close. Share with friends!',
    isRead: false,
    createdAt: '2025-11-19T09:15:00Z',
    payload: { productId: 'p2', groupId: 'g2' },
  },
  {
    id: '3',
    type: 'GROUP_JOINED',
    title: 'You joined a group',
    body: '1₪ pre-auth successful. You will be notified when the group fills up.',
    isRead: true,
    createdAt: '2025-11-18T18:00:00Z',
    payload: { productId: 'p2', groupId: 'g2' },
  },
];

// --- Helper: Get Icon & Color based on Type ---
const getNotificationStyle = (type: NotificationType) => {
  switch (type) {
    case 'GROUP_SUCCESS':
      return { icon: 'checkmark-circle', color: '#10B981', bg: '#D1FAE5' }; // Green
    case 'GROUP_FAILED':
    case 'PAYMENT_FAILED':
      return { icon: 'alert-circle', color: '#EF4444', bg: '#FEE2E2' }; // Red
    case 'GROUP_NEAR_GOAL':
      return { icon: 'flame', color: '#F59E0B', bg: '#FEF3C7' }; // Orange
    case 'GROUP_JOINED':
    default:
      return { icon: 'notifications', color: '#3B82F6', bg: '#DBEAFE' }; // Blue
  }
};

// --- Component ---
export default function NotificationsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);

  const handlePress = (item: Notification) => {
    // 1. Mark as read
    const updated = notifications.map((n) =>
      n.id === item.id ? { ...n, isRead: true } : n
    );
    setNotifications(updated);

    // 2. Navigate to relevant screen (PRD 1737)
    // In a real app, use item.payload.groupId
    console.log(`Navigating to group: ${item.payload.groupId}`);
    // router.push(`/group/${item.payload.groupId}`); 
  };

  const renderItem = ({ item }: { item: Notification }) => {
    const style = getNotificationStyle(item.type);
    const date = new Date(item.createdAt).toLocaleDateString('en-IL', {
        hour: '2-digit',
        minute: '2-digit'
    });

    return (
      <Pressable
        style={[styles.itemContainer, !item.isRead && styles.unreadContainer]}
        onPress={() => handlePress(item)}
      >
        {/* Icon Column */}
        <View style={[styles.iconContainer, { backgroundColor: style.bg }]}>
          <Ionicons name={style.icon as any} size={24} color={style.color} />
        </View>

        {/* Text Column */}
        <View style={styles.textContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
            <Text style={styles.date}>{date}</Text>
          </View>
          <Text style={styles.body} numberOfLines={2}>{item.body}</Text>
        </View>

        {/* Unread Indicator */}
        {!item.isRead && <View style={styles.unreadDot} />}
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
            <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No new notifications</Text>
            </View>
        }
      />
    </View>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB', // Light gray bg
  },
  listContent: {
    padding: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    // Elevation for Android
    elevation: 2,
  },
  unreadContainer: {
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6', // Blue highlight for unread
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  date: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 8,
  },
  body: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3B82F6',
    marginLeft: 8,
  },
  emptyState: {
    marginTop: 100,
    alignItems: 'center',
  },
  emptyText: {
    color: '#9CA3AF',
    fontSize: 16,
  }
});