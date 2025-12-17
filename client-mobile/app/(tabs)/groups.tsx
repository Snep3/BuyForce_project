import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { MOCK_DEALS } from '../../store/mockData'; // הסרנו את MY_JOINED_GROUP_IDS כי זה מגיע מה-Store
import ProductCard from '../../components/ProductCard';
import { GroupDeal, GroupStatus } from '../../types';
import { useStore } from '../../store/useStore';

// PRD: My Groups Page - Segmentation
type TabType = 'ACTIVE' | 'WON' | 'MISSED';

export default function GroupsScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('ACTIVE');
  
  // שליפת ה-IDs של הקבוצות שהצטרפנו אליהן מה-Store
  const joinedGroupIds = useStore((state) => state.joinedGroupIds);

  // סינון העסקאות (Deals) הרלוונטיות לפי ה-Store
  const myDeals = MOCK_DEALS.filter(deal => joinedGroupIds.includes(deal.groupId));

  // פילטור לפי הטאב הנבחר (סטטוס)
  const getFilteredDeals = () => {
    return myDeals.filter(deal => {
      const s = deal.groupStatus;
      
      switch (activeTab) {
        case 'ACTIVE':
          // OPEN, REACHED_TARGET (70%+), LOCKED (Finished but not charged yet)
          return s === 'OPEN' || s === 'REACHED_TARGET' || s === 'LOCKED';
        case 'WON':
          // Transaction complete
          return s === 'CHARGED';
        case 'MISSED':
          // Group failed or money returned
          return s === 'FAILED' || s === 'REFUNDED';
        default:
          return false;
      }
    });
  };

  const filteredData = getFilteredDeals();

  // Helper for Status Badge Color
  const getStatusColor = (status: GroupStatus) => {
    switch (status) {
      case 'CHARGED': return { bg: '#d1fae5', text: '#065f46' }; // Green
      case 'FAILED': 
      case 'REFUNDED': return { bg: '#fee2e2', text: '#991b1b' }; // Red
      case 'REACHED_TARGET': return { bg: '#fef3c7', text: '#92400e' }; // Orange/Yellow
      case 'LOCKED': return { bg: '#e0f2fe', text: '#075985' }; // Blue
      default: return { bg: '#f3f4f6', text: '#374151' }; // Gray
    }
  };

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
    <SafeAreaView style={styles.container}>
      <View style={styles.headerSpacer} />
      
      {/* Tabs Section */}
      <View style={styles.tabsContainer}>
        {renderTab('Active', 'ACTIVE')}
        {renderTab('Completed', 'WON')}
        {renderTab('Missed', 'MISSED')}
      </View>

      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
            const statusStyle = getStatusColor(item.groupStatus);
            
            return (
                <View style={styles.cardWrapper}>
                    <ProductCard 
                        id={item.productId} // שימוש ב-Product ID לניווט
                        title={item.name}
                        regularPrice={item.price_regular}
                        groupPrice={item.price_group}
                        joinedCount={item.joinedCount}
                        targetCount={item.target_members}
                        progress={item.joinedCount / item.target_members}
                        image={item.image_url}
                        endsAt={item.deadline}
                    />
                    
                    {/* Status Indicator */}
                    <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                        <Text style={[styles.statusText, { color: statusStyle.text }]}>
                            {item.groupStatus.replace('_', ' ')}
                        </Text>
                    </View>
                </View>
            );
        }}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No groups found in "{activeTab}".</Text>
            {activeTab === 'ACTIVE' && (
                <Text style={{ marginTop: 8, color: '#ccc', fontSize: 12 }}>
                    Join a group from the Home screen to see it here.
                </Text>
            )}
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerSpacer: { height: 20 },
  tabsContainer: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  tab: { marginRight: 25, paddingBottom: 10, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  activeTab: { borderBottomColor: '#2f95dc' },
  tabText: { fontSize: 16, color: '#9ca3af', fontWeight: '600' },
  activeTabText: { color: '#2f95dc', fontWeight: 'bold' },
  listContent: { paddingHorizontal: 20, paddingBottom: 20, paddingTop: 10 },
  cardWrapper: { marginBottom: 24, alignItems: 'center' },
  statusBadge: { 
    marginTop: 8, 
    paddingVertical: 4, 
    paddingHorizontal: 12, 
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginLeft: 4 
  },
  statusText: { fontSize: 11, fontWeight: '800', textTransform: 'uppercase' },
  emptyState: { marginTop: 80, alignItems: 'center' },
  emptyText: { color: '#9ca3af', fontSize: 16 }
});