import React from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import ProductCard from '../../components/ProductCard';
import CustomHeader from '../../components/CustomHeader'; // החזרתי את השימוש ב-Header שלך
import MOCK_PRODUCTS from '../../store/mockData';

export default function HomeScreen() {
  
  // Filter logic based on PRD: "Near Goal" [cite: 368]
  const nearGoalProducts = MOCK_PRODUCTS.filter(p => (p.active_group?.progress_pct || 0) > 0.7);
  const newArrivals = MOCK_PRODUCTS; // [cite: 370]

  return (
    <SafeAreaView style={styles.container}>
      {/* הסתרת ה-Header של המערכת כדי להציג את שלך */}
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* השימוש בקומפוננטה שלך */}
      <CustomHeader />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
        
        {/* Section: Near Goal */}
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Near Goal</Text>
            <TouchableOpacity><Text style={styles.seeAll}>See All</Text></TouchableOpacity>
        </View>
        <FlatList
          horizontal
          data={nearGoalProducts.length > 0 ? nearGoalProducts : MOCK_PRODUCTS}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ProductCard
              id={item.id}
              title={item.name}
              image={item.image_url}
              regularPrice={item.price_regular}
              groupPrice={item.price_group}
              joinedCount={item.active_group?.joined_count || 0}
              targetCount={item.active_group?.target_members || 1}
              progress={item.active_group?.progress_pct || 0}
              endsAt={item.active_group?.deadline}
            />
          )}
        />

        {/* Section: New Arrivals */}
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>New Arrivals</Text>
            <TouchableOpacity><Text style={styles.seeAll}>See All</Text></TouchableOpacity>
        </View>
        <FlatList
          horizontal
          data={newArrivals}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ProductCard
              id={item.id}
              title={item.name}
              image={item.image_url}
              regularPrice={item.price_regular}
              groupPrice={item.price_group}
              joinedCount={item.active_group?.joined_count || 0}
              targetCount={item.active_group?.target_members || 1}
              progress={item.active_group?.progress_pct || 0}
              endsAt={item.active_group?.deadline}
            />
          )}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#333' },
  seeAll: { color: '#2f95dc', fontSize: 14, fontWeight: '600' },
  listContent: { paddingHorizontal: 20 },
});