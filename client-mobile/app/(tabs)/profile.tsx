import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, SafeAreaView, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import Constants from 'expo-constants';
import { useStripe, CardField } from '@stripe/stripe-react-native';
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
  // Payment methods (mocked) state
  const [paymentExpanded, setPaymentExpanded] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<Array<{ id: string; brand: string; last4: string }>>([
    { id: 'pm_1', brand: 'Visa', last4: '4242' }
  ]);
  const [defaultPaymentId, setDefaultPaymentId] = useState<string | null>(paymentMethods[0]?.id ?? null);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const { confirmSetupIntent } = useStripe();
  const BACKEND_URL = Constants.expoConfig?.extra?.apiUrl ?? 'http://10.0.2.2:4000';
  const [addingCard, setAddingCard] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);

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

  const startAddCard = () => {
    setAddingCard(true);
  };

  const handleSaveCard = async () => {
    if (!cardComplete) {
      Alert.alert('Invalid card', 'Please enter complete card details.');
      return;
    }

    try {
      const resp = await axios.post(`${BACKEND_URL}/payments/setup-intent`);
      const clientSecret = resp.data?.clientSecret || resp.data?.client_secret;
      if (!clientSecret) {
        Alert.alert('Error', 'No client secret from server');
        return;
      }

      const { setupIntent, error } = await confirmSetupIntent(clientSecret, { paymentMethodType: 'Card' } as any);
      if (error) {
        Alert.alert('Error', error.message);
        return;
      }

      const paymentMethodId = setupIntent?.payment_method;
      if (!paymentMethodId) {
        Alert.alert('Error', 'No payment method id returned');
        return;
      }

      const saveResp = await axios.post(`${BACKEND_URL}/payments/save-payment-method`, { paymentMethodId, customerId });
      const saved = saveResp.data;
      setCustomerId(saved.customerId ?? customerId);
      setPaymentMethods(prev => [{ id: saved.id, brand: saved.brand, last4: saved.last4 }, ...prev]);
      setDefaultPaymentId(saved.id);
      setAddingCard(false);
      Alert.alert('Saved', 'Card saved for future payments.');
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Unable to save card.');
    }
  };

  const fetchPaymentMethods = async () => {
    try {
      const resp = await axios.post(`${BACKEND_URL}/payments/list`, { customerId });
      const data = resp.data;
      if (Array.isArray(data)) {
        setPaymentMethods(data);
        if (data.length) setDefaultPaymentId(data[0].id);
      } else if (data.data) {
        setPaymentMethods(data.data);
        if (data.data.length) setDefaultPaymentId(data.data[0].id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const confirmRemoveCard = (id: string) => {
    Alert.alert(
      'Remove Card',
      'Are you sure you want to remove this card?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => removeCard(id) }
      ]
    );
  };

  const removeCard = (id: string) => {
    setPaymentMethods(prev => prev.filter(p => p.id !== id));
    if (defaultPaymentId === id) setDefaultPaymentId(prev => (paymentMethods[0] ? paymentMethods[0].id : null));
  };

  const makeDefault = (id: string) => {
    setDefaultPaymentId(id);
    Alert.alert('Default set', 'This card is now your default payment method.');
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
          
          {/* Payment Methods [Stripe section] */}
          <TouchableOpacity style={styles.menuRow} onPress={() => setPaymentExpanded(p => !p)} activeOpacity={0.8}>
            <View style={styles.iconContainer}><Ionicons name="card-outline" size={20} color="#333" /></View>
            <View style={styles.menuContent}>
              <Text style={styles.menuLabel}>Payment Methods</Text>
              <Text style={styles.menuValue}>{paymentMethods.length ? `${paymentMethods.find(p => p.id === defaultPaymentId)?.brand} •••• ${paymentMethods.find(p => p.id === defaultPaymentId)?.last4}` : 'No cards'}</Text>
            </View>
            <Ionicons name={paymentExpanded ? 'chevron-down' : 'chevron-forward'} size={20} color="#ccc" />
          </TouchableOpacity>

          {paymentExpanded && (
            <View style={{ paddingHorizontal: 20, paddingBottom: 12, backgroundColor: '#fff' }}>
              {paymentMethods.map(pm => (
                <View key={pm.id} style={styles.cardRow}>
                  <View style={styles.cardInfo}>
                    <Text style={styles.cardBrand}>{pm.brand}</Text>
                    <Text style={styles.cardLast4}>•••• {pm.last4}</Text>
                    {defaultPaymentId === pm.id && <Text style={{ color: '#2f95dc', fontSize: 12, marginTop: 4 }}>Default</Text>}
                  </View>
                  <View style={styles.cardActions}>
                    {defaultPaymentId !== pm.id && (
                      <TouchableOpacity onPress={() => makeDefault(pm.id)} style={styles.actionButton}>
                        <Text style={{ color: '#2f95dc' }}>Set Default</Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity onPress={() => confirmRemoveCard(pm.id)} style={styles.actionButton}>
                      <Text style={{ color: '#ef4444' }}>Remove</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}

              {!addingCard && (
                <TouchableOpacity style={styles.addButton} onPress={startAddCard} activeOpacity={0.8}>
                  <Text style={{ color: '#fff', fontWeight: '700' }}>Add Payment Method</Text>
                </TouchableOpacity>
              )}

              {addingCard && (
                <View style={{ marginTop: 12 }}>
                  <CardField
                    postalCodeEnabled={false}
                    placeholder={{ number: '4242 4242 4242 4242' }}
                    cardStyle={{ backgroundColor: '#FFFFFF', textColor: '#000000' }}
                    style={{ height: 50 }}
                    onCardChange={(card) => setCardComplete(Boolean(card?.complete))}
                  />

                  <View style={{ flexDirection: 'row', marginTop: 12 }}>
                    <TouchableOpacity style={[styles.addButton, { flex: 1, marginRight: 8 }]} onPress={handleSaveCard}>
                      <Text style={{ color: '#fff', fontWeight: '700' }}>Save Card</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.addButton, { flex: 1, backgroundColor: '#6b7280' }]} onPress={() => setAddingCard(false)}>
                      <Text style={{ color: '#fff', fontWeight: '700' }}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          )}
          
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
  
  // Card / Payment styles
  cardRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderColor: '#f3f4f6' },
  cardInfo: { flex: 1 },
  cardBrand: { fontSize: 15, fontWeight: '600', color: '#111' },
  cardLast4: { fontSize: 13, color: '#6b7280', marginTop: 4 },
  cardActions: { flexDirection: 'row', alignItems: 'center' },
  actionButton: { paddingHorizontal: 10, paddingVertical: 6 },
  addButton: { marginTop: 12, backgroundColor: '#111827', paddingVertical: 12, alignItems: 'center', borderRadius: 8 },

  versionText: { textAlign: 'center', color: '#ccc', fontSize: 12, marginTop: 20 }
});