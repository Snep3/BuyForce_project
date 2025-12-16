import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, SafeAreaView, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Mock User Data [cite: 1217-1223]
const MOCK_USER = {
  name: "John Doe",
  email: "john.doe@example.com",
  avatar: "https://i.pravatar.cc/150?img=68",
};

type MenuRowProps = {
  icon: string;
  label: string;
  value?: string;
  onPress?: () => void;
  isDestructive?: boolean;
  showChevron?: boolean;
};

// רכיב שורה בתפריט לשימוש חוזר
const MenuRow = ({ icon, label, value, onPress, isDestructive = false, showChevron = true }: MenuRowProps) => (
  <TouchableOpacity style={styles.menuRow} onPress={onPress} activeOpacity={0.7}>
    <View style={[styles.iconContainer, isDestructive && styles.destructiveIconBg]}>
      <Ionicons name={icon as any} size={20} color={isDestructive ? '#ef4444' : '#333'} />
    </View>
    <View style={styles.menuContent}>
      <Text style={[styles.menuLabel, isDestructive && styles.destructiveText]}>{label}</Text>
      {value && <Text style={styles.menuValue}>{value}</Text>}
    </View>
    {showChevron && (
      <Ionicons name="chevron-forward" size={20} color="#ccc" />
    )}
  </TouchableOpacity>
);

export default function ProfileScreen() {
  const router = useRouter();
  
  // הגדרות מקומיות (Mock) - [cite: 475]
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Log Out", 
          style: "destructive",
          onPress: () => {
            // כאן תהיה לוגיקת מחיקת טוקן
            console.log("User logged out");
            router.replace('/(auth)/login'); // ניווט למסך התחברות (כשיהיה קיים)
          } 
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* 1. User Header [cite: 463] */}
        <View style={styles.header}>
          <Image source={{ uri: MOCK_USER.avatar }} style={styles.avatar} />
          <Text style={styles.userName}>{MOCK_USER.name}</Text>
          <Text style={styles.userEmail}>{MOCK_USER.email}</Text>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* 2. Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          {/* Payment Methods [cite: 464] */}
          <MenuRow 
            icon="card-outline" 
            label="Payment Methods" 
            value="Visa •••• 4242"
            onPress={() => console.log("Nav to Payments")} 
          />
          
          {/* My Addresses (Future/Standard) */}
          <MenuRow 
            icon="location-outline" 
            label="Shipping Address" 
            onPress={() => console.log("Nav to Address")} 
          />
        </View>

        {/* 3. Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          {/* Notifications [cite: 475] */}
          <View style={styles.menuRow}>
            <View style={styles.iconContainer}>
              <Ionicons name="notifications-outline" size={20} color="#333" />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuLabel}>Push Notifications</Text>
            </View>
            <Switch 
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#e5e7eb', true: '#2f95dc' }}
            />
          </View>

          {/* Language [cite: 466] */}
          <MenuRow 
            icon="globe-outline" 
            label="Language" 
            value="English"
            onPress={() => console.log("Change Language")} 
          />
        </View>

        {/* 4. Support Section [cite: 467] */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <MenuRow 
            icon="help-circle-outline" 
            label="Help Center" 
            onPress={() => console.log("Help")} 
          />
          <MenuRow 
            icon="document-text-outline" 
            label="Terms & Privacy" 
            onPress={() => console.log("Terms")} 
          />
        </View>

        {/* 5. Logout [cite: 468] */}
        <View style={[styles.section, styles.lastSection]}>
          <MenuRow 
            icon="log-out-outline" 
            label="Log Out" 
            isDestructive 
            showChevron={false}
            onPress={handleLogout} 
          />
        </View>

        <Text style={styles.versionText}>Version 1.0.0 (MVP)</Text>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  scrollContent: { paddingBottom: 40 },
  
  // Header Styles
  header: { 
    alignItems: 'center', 
    paddingVertical: 30, 
    backgroundColor: '#fff', 
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  avatar: { width: 80, height: 80, borderRadius: 40, marginBottom: 12 },
  userName: { fontSize: 20, fontWeight: 'bold', color: '#111' },
  userEmail: { fontSize: 14, color: '#666', marginBottom: 16 },
  editButton: { 
    paddingVertical: 8, 
    paddingHorizontal: 16, 
    borderRadius: 20, 
    borderWidth: 1, 
    borderColor: '#e5e7eb' 
  },
  editButtonText: { fontSize: 13, fontWeight: '600', color: '#333' },

  // Section Styles
  section: { 
    backgroundColor: '#fff', 
    marginBottom: 20, 
    paddingVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0'
  },
  lastSection: { marginBottom: 0 },
  sectionTitle: { 
    fontSize: 13, 
    fontWeight: '700', 
    color: '#9ca3af', 
    textTransform: 'uppercase', 
    marginLeft: 20, 
    marginBottom: 8, 
    marginTop: 8 
  },

  // Menu Row Styles
  menuRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 12, 
    paddingHorizontal: 20,
    backgroundColor: '#fff'
  },
  iconContainer: { 
    width: 32, 
    height: 32, 
    borderRadius: 8, 
    backgroundColor: '#f3f4f6', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 16 
  },
  menuContent: { flex: 1 },
  menuLabel: { fontSize: 16, color: '#1f2937' },
  menuValue: { fontSize: 14, color: '#9ca3af', marginTop: 2 },
  
  // Destructive Styles
  destructiveText: { color: '#ef4444', fontWeight: '600' },
  destructiveIconBg: { backgroundColor: '#fee2e2' },

  versionText: { textAlign: 'center', color: '#ccc', fontSize: 12, marginTop: 20 }
});