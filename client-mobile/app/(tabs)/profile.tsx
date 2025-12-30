import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView, 
  Switch, 
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import Constants from 'expo-constants';
import { useStripe, CardField } from '@stripe/stripe-react-native';
import { useRouter } from 'expo-router';

// Mock User Data
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
  
  // Settings State
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Payment State
  const [paymentExpanded, setPaymentExpanded] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<Array<{ id: string; brand: string; last4: string }>>([
    { id: 'pm_mock_1', brand: 'Visa', last4: '4242' }
  ]);
  const [defaultPaymentId, setDefaultPaymentId] = useState<string | null>('pm_mock_1');
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [addingCard, setAddingCard] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);
  const [loading, setLoading] = useState(false);

  // Stripe Hooks & Config
  const { confirmSetupIntent } = useStripe();
  const BACKEND_URL = Constants.expoConfig?.extra?.apiUrl ?? 'http://10.0.2.2:4000';

  // --- Logic Functions ---

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
            console.log("User logged out");
            router.replace('/(auth)/login');
          } 
        }
      ]
    );
  };

  const fetchPaymentMethods = async () => {
    try {
      if (!customerId) return;
      
      const resp = await axios.post(`${BACKEND_URL}/payments/list`, { customerId });
      const data = resp.data;
      
      let methods = [];
      if (Array.isArray(data)) {
        methods = data;
      } else if (data.data) {
        methods = data.data;
      }

      setPaymentMethods(methods);
      if (methods.length > 0 && !defaultPaymentId) {
        setDefaultPaymentId(methods[0].id);
      }
    } catch (err) {
      console.error("Failed fetching payment methods:", err);
    }
  };

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const startAddCard = () => {
    setAddingCard(true);
  };

  const handleSaveCard = async () => {
    if (!cardComplete) {
      Alert.alert('Invalid card', 'Please enter complete card details.');
      return;
    }
    setLoading(true);

    try {
      const resp = await axios.post(`${BACKEND_URL}/payments/setup-intent`);
      const clientSecret = resp.data?.clientSecret || resp.data?.client_secret;
      
      if (!clientSecret) {
        throw new Error('No client secret from server');
      }

      const { setupIntent, error } = await confirmSetupIntent(clientSecret, { 
        paymentMethodType: 'Card',
      });
      
      if (error) {
        Alert.alert('Error', error.message);
        setLoading(false);
        return;
      }

      // --- TIKUN 1: camelCase (paymentMethod) ---
      const paymentMethodResult = setupIntent?.paymentMethod; 

      if (!paymentMethodResult) {
        throw new Error('No payment method id returned');
      }

      // --- TIKUN 2: Fix Casting (as unknown as string) ---
      // Stripe returns an object or string depending on version. We force it to string for our logic.
      const paymentMethodId = typeof paymentMethodResult === 'string' 
        ? paymentMethodResult 
        : (paymentMethodResult as any).id; 

      const saveResp = await axios.post(`${BACKEND_URL}/payments/save-payment-method`, { 
        paymentMethodId, 
        customerId 
      });
      
      const saved = saveResp.data;
      
      setCustomerId(saved.customerId ?? customerId);
      
      const newCard = { 
        id: saved.id || paymentMethodId, 
        brand: saved.brand || 'Card', 
        last4: saved.last4 || '****' 
      };
      
      setPaymentMethods(prev => [newCard, ...prev]);
      setDefaultPaymentId(newCard.id);
      
      setAddingCard(false);
      Alert.alert('Saved', 'Card saved successfully.');

    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Unable to save card. Check backend connection.');
    } finally {
      setLoading(false);
    }
  };

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
    if (defaultPaymentId === id) {
      const remaining = paymentMethods.filter(p => p.id !== id);
      setDefaultPaymentId(remaining[0]?.id || null);
    }
  };

  const makeDefault = (id: string) => {
    setDefaultPaymentId(id);
    Alert.alert('Default set', 'This card is now your default payment method.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* 1. User Header */}
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
          
          <TouchableOpacity style={styles.menuRow} onPress={() => setPaymentExpanded(p => !p)} activeOpacity={0.7}>
            <View style={styles.iconContainer}>
              <Ionicons name="card-outline" size={20} color="#333" />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuLabel}>Payment Methods</Text>
              <Text style={styles.menuValue}>
                {paymentMethods.length 
                  ? `${paymentMethods.find(p => p.id === defaultPaymentId)?.brand || 'Card'} •••• ${paymentMethods.find(p => p.id === defaultPaymentId)?.last4 || '****'}` 
                  : 'Add a card'}
              </Text>
            </View>
            <Ionicons name={paymentExpanded ? 'chevron-down' : 'chevron-forward'} size={20} color="#ccc" />
          </TouchableOpacity>

          {/* Expanded Payment Content */}
          {paymentExpanded && (
            <View style={styles.expandedContainer}>
              {paymentMethods.map(pm => (
                <View key={pm.id} style={styles.cardRow}>
                  <View style={styles.cardInfo}>
                    <Text style={styles.cardBrand}>{pm.brand}</Text>
                    <Text style={styles.cardLast4}>•••• {pm.last4}</Text>
                    {defaultPaymentId === pm.id && (
                      <Text style={styles.defaultBadge}>Default</Text>
                    )}
                  </View>
                  <View style={styles.cardActions}>
                    {defaultPaymentId !== pm.id && (
                      <TouchableOpacity onPress={() => makeDefault(pm.id)} style={styles.actionButton}>
                        <Text style={styles.linkText}>Set Default</Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity onPress={() => confirmRemoveCard(pm.id)} style={styles.actionButton}>
                      <Ionicons name="trash-outline" size={18} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}

              {!addingCard && (
                <TouchableOpacity style={styles.addButton} onPress={startAddCard} activeOpacity={0.8}>
                  <Text style={styles.addButtonText}>Add New Card</Text>
                </TouchableOpacity>
              )}

              {addingCard && (
                <View style={styles.addCardForm}>
                  {/* --- TIKUN 3: placeholders (plural) --- */}
                  <CardField
                    postalCodeEnabled={false}
                    placeholders={{ number: '4242 4242 4242 4242' }}
                    cardStyle={{ 
                      backgroundColor: '#FFFFFF', 
                      textColor: '#000000', 
                      borderWidth: 1, 
                      borderColor: '#ccc', 
                      borderRadius: 8 
                    }}
                    style={{ height: 50, marginBottom: 12 }}
                    onCardChange={(card) => setCardComplete(Boolean(card?.complete))}
                  />

                  <View style={{ flexDirection: 'row', gap: 10 }}>
                    <TouchableOpacity 
                      style={[styles.addButton, { flex: 1, backgroundColor: loading ? '#666' : '#111827' }]} 
                      onPress={handleSaveCard}
                      disabled={loading}
                    >
                      {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.addButtonText}>Save Card</Text>}
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={[styles.addButton, { flex: 1, backgroundColor: '#e5e7eb' }]} 
                      onPress={() => setAddingCard(false)}
                    >
                      <Text style={[styles.addButtonText, { color: '#333' }]}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          )}
          
          <MenuRow 
            icon="location-outline" 
            label="Shipping Address" 
            onPress={() => console.log("Nav to Address")} 
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
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
          <MenuRow 
            icon="globe-outline" 
            label="Language" 
            value="English"
            onPress={() => console.log("Change Language")} 
          />
        </View>

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
  destructiveText: { color: '#ef4444', fontWeight: '600' },
  destructiveIconBg: { backgroundColor: '#fee2e2' },
  expandedContainer: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: '#f9fafb',
    borderTopWidth: 1,
    borderColor: '#f0f0f0'
  },
  cardRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingVertical: 12, 
    borderBottomWidth: 1, 
    borderColor: '#e5e7eb' 
  },
  cardInfo: { flex: 1 },
  cardBrand: { fontSize: 15, fontWeight: '600', color: '#111' },
  cardLast4: { fontSize: 13, color: '#6b7280', marginTop: 2 },
  defaultBadge: { color: '#2f95dc', fontSize: 12, marginTop: 4, fontWeight: '500' },
  cardActions: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  actionButton: { padding: 4 },
  linkText: { color: '#2f95dc', fontSize: 13, fontWeight: '500' },
  addButton: { 
    marginTop: 12, 
    backgroundColor: '#111827', 
    paddingVertical: 12, 
    alignItems: 'center', 
    borderRadius: 8 
  },
  addButtonText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  addCardForm: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb'
  },
  versionText: { textAlign: 'center', color: '#ccc', fontSize: 12, marginTop: 20 }
});