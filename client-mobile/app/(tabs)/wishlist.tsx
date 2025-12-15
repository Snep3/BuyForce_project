import React from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import MOCK_PRODUCTS from '../../store/mockData';
import ProductCard from '../../components/ProductCard';
import { useStore } from '../../store/useStore';

const { width } = Dimensions.get('window');

export default function WishlistScreen() {
  const router = useRouter();
  
  // שליפת ה-IDs מה-Store הגלובלי (במקום State מקומי)
  const wishlistIds = useStore((state) => state.wishlistIds);

  // סינון המוצרים מתוך כלל המוצרים לפי ה-IDs שנשמרו ב-Store
  const wishlistItems = MOCK_PRODUCTS.filter(p => wishlistIds.includes(p.id));

  const handleBrowseDeals = () => {
    router.push('/'); // חזרה לדף הבית
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerSpacer} />

      <FlatList
        data={wishlistItems}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        
        renderItem={({ item }) => (
          <View style={styles.cardContainer}>
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

        ListEmptyComponent={
          <View style={styles.emptyState}>
            <View style={styles.iconCircle}>
                <Ionicons name="heart-outline" size={60} color="#ccc" />
            </View>
            <Text style={styles.emptyTitle}>Your wishlist is empty</Text>
            <Text style={styles.emptySubtitle}>
              Save items you want to track and join groups when the price is right.
            </Text>
            <TouchableOpacity style={styles.browseButton} onPress={handleBrowseDeals}>
              <Text style={styles.browseButtonText}>Browse Deals</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  headerSpacer: { 
    height: 20 
  },
  listContent: { 
    paddingHorizontal: 15, 
    paddingTop: 10,
    paddingBottom: 20,
  },
  row: { 
    justifyContent: 'flex-start',
    gap: 15,
    marginBottom: 15 
  },
  cardContainer: {
    // אופציונלי: התאמת רוחב דינמית
  },
  
  // Empty State Styles
  emptyState: { 
    marginTop: 80, 
    alignItems: 'center', 
    paddingHorizontal: 40 
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f9fafb',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#333', 
    marginBottom: 10 
  },
  emptySubtitle: { 
    fontSize: 16, 
    color: '#9ca3af', 
    textAlign: 'center', 
    lineHeight: 24, 
    marginBottom: 30 
  },
  browseButton: { 
    backgroundColor: '#2f95dc', 
    paddingVertical: 14, 
    paddingHorizontal: 32, 
    borderRadius: 12,
    width: '100%',
    alignItems: 'center'
  },
  browseButtonText: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 16 
  }
});