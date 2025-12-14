import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { MOCK_DEALS, MY_JOINED_GROUP_IDS } from '../../store/mockData';
import ProductCard from '../../components/ProductCard';

// הגדרת הטאבים לפי ה-PRD Categories [cite: 436]
type TabType = 'ACTIVE' | 'WON' | 'MISSED';

export default function GroupsScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('ACTIVE');

  // 1. שליפת הקבוצות שהמשתמש הצטרף אליהן
  const myDeals = MOCK_DEALS.filter(deal => MY_JOINED_GROUP_IDS.includes(deal.groupId));

  // 2. פילטור לפי הטאב הנבחר [cite: 436-441]
  const getFilteredDeals = () => {
    return myDeals.filter(deal => {
      const s = deal.groupStatus;
      
      if (activeTab === 'ACTIVE') {
        return s === 'OPEN' || s === 'REACHED_TARGET' || s === 'LOCKED';
      }
      if (activeTab === 'WON') {
        return s === 'CHARGED';
      }
      if (activeTab === 'MISSED') {
        return s === 'FAILED' || s === 'REFUNDED';
      }
      return false;
    });
  };

  const filteredData = getFilteredDeals();

  const renderTab = (label: string, value: TabType) => (
    <TouchableOpacity 
      style={[styles.tab, activeTab === value && styles.activeTab]} 
      onPress={() => setActiveTab(value)}
    >
      <Text style={[styles.tabText, activeTab === value && styles.activeTabText]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>

      
      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {renderTab('Active', 'ACTIVE')}
        {renderTab('Completed', 'WON')}
        {renderTab('Missed', 'MISSED')}
      </View>

      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <ProductCard 
              id={Number(item.id)} // המרה ל-number כי כרגע ProductCard מצפה למספר
              title={item.name}
              regularPrice={item.price_regular}
              groupPrice={item.price_group}
              joinedCount={item.joinedCount}
              targetCount={item.target_members}
              progress={item.joinedCount / item.target_members}
              image={{ uri: item.image_url }}
              endsAt={item.deadline}
            />
            {/* Status Badge */}
            <View style={[styles.statusBadge, 
                item.groupStatus === 'CHARGED' ? { backgroundColor: '#d1fae5' } : 
                item.groupStatus === 'FAILED' ? { backgroundColor: '#fee2e2' } : {}
            ]}>
                <Text style={styles.statusText}>Status: {item.groupStatus}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No groups found in this tab.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', margin: 20, color: '#333' },
  tabsContainer: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 20 },
  tab: { marginRight: 20, paddingBottom: 8, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  activeTab: { borderBottomColor: '#2f95dc' },
  tabText: { fontSize: 16, color: '#888', fontWeight: '600' },
  activeTabText: { color: '#2f95dc', fontWeight: 'bold' },
  listContent: { paddingHorizontal: 20, paddingBottom: 20 },
  cardWrapper: { marginBottom: 20, alignItems: 'center' },
  statusBadge: { marginTop: 10, paddingVertical: 4, paddingHorizontal: 8, backgroundColor: '#f0f0f0', borderRadius: 4 },
  statusText: { fontSize: 12, color: '#555', fontWeight: 'bold' },
  emptyState: { marginTop: 50, alignItems: 'center' },
  emptyText: { color: '#999', fontSize: 16 }
});