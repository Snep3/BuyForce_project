import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ProductCard from '../../components/ProductCard';
// יבוא הנתונים המרכזיים
import { MOCK_DEALS } from '../../store/mockData';
import { GroupDeal } from '../../types';

const MOCK_CATEGORIES = [
  { id: 1, name: 'Electronics' },
  { id: 2, name: 'Fashion' },
  { id: 3, name: 'Home' },
  { id: 4, name: 'Beauty' },
  { id: 5, name: 'Sports' },
];

export default function HomeScreen() {
  const [categories] = useState(MOCK_CATEGORIES);
  
  // לוגיקה עסקית לפי PRD:
  // Near Goal = קבוצות שעברו 50% מהיעד
  const [nearGoalProducts] = useState<GroupDeal[]>(
    MOCK_DEALS.filter(d => (d.joinedCount / d.target_members) >= 0.5 && d.groupStatus === 'OPEN')
  );
  
  // New Arrivals = כרגע כל השאר (במציאות נמיין לפי תאריך יצירה)
  const [newArrivals] = useState<GroupDeal[]>(MOCK_DEALS);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const filterList = (list: GroupDeal[]) => {
    let filtered = list;

    if (selectedCategory !== null) {
      filtered = filtered.filter(item => item.categoryId === selectedCategory);
    }

    if (searchQuery) {
      const regex = new RegExp(`\\b${searchQuery}`, 'i');
      filtered = filtered.filter(item => regex.test(item.name));
    }
    
    return filtered;
  };

  const renderCategoryItem = ({ item }: { item: any }) => {
    const isSelected = selectedCategory === item.id;
    return (
      <TouchableOpacity 
        style={styles.categoryItem}
        onPress={() => setSelectedCategory(isSelected ? null : item.id)}
      >
        <View style={[styles.categoryIconContainer, isSelected && { backgroundColor: '#2f95dc' }]}>
          <Ionicons name="apps-outline" size={24} color={isSelected ? '#fff' : '#555'} />
        </View>
        <Text style={[styles.categoryText, isSelected && { color: '#2f95dc', fontWeight: 'bold' }]}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderProductItem = ({ item }: { item: GroupDeal }) => (
    <ProductCard 
      id={item.id}
      title={item.name}
      regularPrice={item.price_regular}
      groupPrice={item.price_group}
      joinedCount={item.joinedCount}
      targetCount={item.target_members}
      progress={item.joinedCount / item.target_members}
      image={{ uri: item.image_url }}
      endsAt={item.deadline}
    />
  );

  const filteredNearGoal = filterList(nearGoalProducts);
  const filteredNewArrivals = filterList(newArrivals);

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput 
          placeholder="Search for products..." 
          style={styles.searchInput}
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#888" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* Categories */}
        <View style={styles.categoriesSection}>
          <FlatList
            data={categories}
            renderItem={renderCategoryItem}
            keyExtractor={item => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </View>

        {/* Near Goal Section */}
        {filteredNearGoal.length > 0 && (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Near Goal 🔥</Text>
              <TouchableOpacity><Text style={styles.seeAll}>See All</Text></TouchableOpacity>
            </View>
            <FlatList
              data={filteredNearGoal}
              renderItem={renderProductItem}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.productsList}
            />
          </View>
        )}

        {/* New Arrivals Section */}
        {filteredNewArrivals.length > 0 && (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>New Arrivals</Text>
              <TouchableOpacity><Text style={styles.seeAll}>See All</Text></TouchableOpacity>
            </View>
            <FlatList
              data={filteredNewArrivals}
              renderItem={renderProductItem}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.productsList}
            />
          </View>
        )}

        {filteredNearGoal.length === 0 && filteredNewArrivals.length === 0 && (
          <View style={{ alignItems: 'center', marginTop: 50 }}>
            <Text style={{ color: '#888', fontSize: 16 }}>
              No products found {selectedCategory ? 'in this category' : ''}
              {searchQuery ? ` matching "${searchQuery}"` : ''}
            </Text>
          </View>
        )}
        <View style={{ height: 20 }} /> 
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f5f5f5', margin: 15, paddingHorizontal: 15, height: 45, borderRadius: 25 },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 16, color: '#333' },
  categoriesSection: { marginBottom: 20 },
  categoriesList: { paddingHorizontal: 10 },
  categoryItem: { alignItems: 'center', marginHorizontal: 8, width: 70 },
  categoryIconContainer: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#eef2f5', justifyContent: 'center', alignItems: 'center', marginBottom: 5 },
  categoryText: { fontSize: 12, color: '#555', textAlign: 'center', marginTop: 4 },
  sectionContainer: { marginBottom: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15, marginBottom: 10 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  seeAll: { fontSize: 14, color: '#2f95dc' },
  productsList: { paddingHorizontal: 15 },
});