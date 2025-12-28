import React from 'react';
import { View, FlatList, StyleSheet, SafeAreaView, Text, ScrollView, TouchableOpacity } from 'react-native';
import { MOCK_PRODUCTS } from '../../store/mockData';
import ProductCard from '../../components/ProductCard';

export default function HomeScreen() {
  
  // 1. Data Logic
  // CHANGED: No longer slicing. This variable now holds the full list.
  const allDeals = MOCK_PRODUCTS; 
  
  const almostDoneDeals = MOCK_PRODUCTS.filter(p => (p.active_group?.progress_pct || 0) > 0.8);
  const newDeals = [...MOCK_PRODUCTS].reverse(); 

  // 2. Reusable Section Renderer
  const DealSection = ({ title, subtitle, data }) => (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>{title}</Text>
          <Text style={styles.sectionSubtitle}>{subtitle}</Text>
        </View>
        <TouchableOpacity onPress={() => console.log('Navigate to Grid View')}>
          <Text style={styles.viewAllBtn}>View All</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.carouselContainer}>
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.cardWrapper}>
              <ProductCard 
                id={item.id}
                title={item.name}
                regularPrice={item.price_regular}
                groupPrice={item.price_group}
                joinedCount={item.active_group?.joined_count || 0}
                targetCount={item.active_group?.target_members || item.min_members}
                progress={item.active_group?.progress_pct || 0}
                image={item.image_url}
                endsAt={item.active_group?.deadline}
              />
            </View>
          )}
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View style={styles.headerSpacer} />


        {/* --- SECTION 1: All Products (Full List) --- */}
        <DealSection 
          title="All Products" 
          subtitle="Explore our full catalog"
          data={allDeals} 
        />

        {/* --- SECTION 2: Almost Done --- */}
        {almostDoneDeals.length > 0 && (
          <DealSection 
            title="Almost Done! 🔥" 
            subtitle="Closing soon"
            data={almostDoneDeals} 
          />
        )}

        {/* --- SECTION 3: New Deals --- */}
        <DealSection 
          title="New Arrivals" 
          subtitle="Just added"
          data={newDeals} 
        />

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  headerSpacer: {
    height: 10,
  },
  mainHeader: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#000',
  },
  appSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  sectionContainer: {
    marginTop: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#888',
  },
  viewAllBtn: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  carouselContainer: {
    height: 250,
    flexGrow: 0,
  },
  cardWrapper: {
    width: 220, 
    height: '100%', 
    marginRight: -30, // CHANGED: Reduced from 8 to 4
  },
  listContent: { 
    paddingHorizontal: 20, 
    alignItems: 'center', 
  }
});