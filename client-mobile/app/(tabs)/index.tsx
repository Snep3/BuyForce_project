import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, 
  FlatList, 
  View, 
  Text, 
  ActivityIndicator, 
  RefreshControl,
  SafeAreaView,
  TouchableOpacity
} from 'react-native';
import { useRouter } from 'expo-router';

// ייבוא השירות והטיפוסים
import { fetchHomeGroups } from '../../services/groupService';
import { Product } from '../../types';
import { useStore } from '../../store/useStore'; 

// ייבוא הקומפוננטה
import ProductCard from '../../components/ProductCard';

export default function HomeScreen() {
  const router = useRouter();
  const isLoggedIn = useStore((state) => state.isLoggedIn); 
  
  const [groups, setGroups] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // הגנה על העמוד
  useEffect(() => {
    if (!isLoggedIn) {
      router.replace('/(auth)/login');
    }
  }, [isLoggedIn]);

  const loadData = async () => {
    try {
      const data = await fetchHomeGroups();
      setGroups(data || []);
    } catch (error) {
      console.error("Home Screen Load Error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      loadData();
    }
  }, [isLoggedIn]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  if (loading && isLoggedIn) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 10 }}>טוען מוצרים עבורך...</Text>
      </View>
    );
  }

  if (!isLoggedIn) return null;

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={groups}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            tintColor="#007AFF"
            colors={["#007AFF"]} 
          />
        }
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            {/* מיפוי מ-Product (מה-API) ל-ProductCardProps */}
            <ProductCard 
              id={item.id}
              title={item.name}
              regularPrice={item.price_regular}
              groupPrice={item.price_group}
              image={item.image_url} // בשירות שלך זה image_url, הקארד מצפה ל-image
              joinedCount={item.active_group?.joined_count || 0}
              targetCount={item.active_group?.target_members || item.min_members}
              progress={(item.active_group?.progress_pct || 0) / 100} // הקארד מצפה ל-0-1 (progress * 100)
              endsAt={item.active_group?.deadline}
            />
            
            {/* לוגיקה נוספת של ה-Home במידה ותרצה להוסיף טקסט מתחת לקארד */}
            {item.active_group && (
              <View style={styles.quickStatus}>
                <Text style={styles.statusText}>
                  🔥 עוד {item.active_group.target_members - item.active_group.joined_count} רוכשים והדיל יוצא!
                </Text>
              </View>
            )}
          </View>
        )}
        ListHeaderComponent={<Text style={styles.mainTitle}>BuyForce - דילים חמים</Text>}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.emptyText}>אין קבוצות רכישה פעילות כרגע</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: '800',
    marginVertical: 20,
    textAlign: 'right',
    paddingHorizontal: 15,
    color: '#1a1a1a'
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: 30,
    paddingHorizontal: 10,
  },
  cardWrapper: {
    marginBottom: 20,
    alignItems: 'center', // כדי שהקארד (שרוחבו 160) יסתדר יפה או שתשנה את רוחב הקארד ב-ProductCard ל-100%
  },
  quickStatus: {
    marginTop: -5,
    backgroundColor: '#fff',
    width: 160, // תואם לרוחב הקארד שלך
    padding: 8,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    borderTopWidth: 0,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#e74c3c',
    textAlign: 'center'
  },
  emptyText: {
    color: '#999',
    fontSize: 16,
    marginTop: 50,
  }
});