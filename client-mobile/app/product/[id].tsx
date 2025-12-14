import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, SafeAreaView, StatusBar, Platform, Animated, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MOCK_DEALS, MY_JOINED_GROUP_IDS } from '../../store/mockData';
import { GroupDeal } from '../../types';

const HEADER_HEIGHT = 350; // גובה התמונה

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const [product, setProduct] = useState<GroupDeal | null>(null);
  const [isJoined, setIsJoined] = useState(false);
  const [isWishlist, setIsWishlist] = useState(false);

  // משתנה אנימציה לגלילה
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const found = MOCK_DEALS.find(p => p.id.toString() === id);
    if (found) {
      setProduct(found);
      setIsJoined(MY_JOINED_GROUP_IDS.includes(found.groupId));
    }
  }, [id]);

  if (!product) {
    return (
      <View style={styles.center}>
        <Text>Product not found</Text>
      </View>
    );
  }

  const handleJoin = () => {
    if (isJoined) return;
    Alert.alert(
      "Join Group",
      `Hold ₪1 to join ${product.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Confirm (₪1)", 
          onPress: () => {
            setIsJoined(true);
            Alert.alert("Success", "You're in! 🚀");
          }
        }
      ]
    );
  };

  const progressPercent = Math.round((product.joinedCount / product.target_members) * 100);

  // חישוב האנימציה של התמונה (Parallax)
  const imageTranslateY = scrollY.interpolate({
    inputRange: [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
    outputRange: [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75], // התמונה זזה ב-75% מהירות הגלילה
  });

  const imageScale = scrollY.interpolate({
    inputRange: [-HEADER_HEIGHT, 0],
    outputRange: [2, 1], // זום-אין כשוכללים למעלה (Bounce effect)
    extrapolateRight: 'clamp',
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* 1. תמונת רקע (Parallax) */}
      <Animated.Image 
        source={{ uri: product.image_url }} 
        style={[
          styles.headerImage, 
          { 
            transform: [{ translateY: imageTranslateY }, { scale: imageScale }] 
          }
        ]} 
        resizeMode="cover" 
      />

      {/* 2. כפתור חזרה קבוע (תמיד למעלה) */}
      <SafeAreaView style={styles.fixedHeader}>
        <TouchableOpacity style={styles.roundButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.roundButton}>
          <Ionicons name="share-social-outline" size={24} color="#333" />
        </TouchableOpacity>
      </SafeAreaView>

      {/* 3. תוכן נגלל */}
      <Animated.ScrollView 
        contentContainerStyle={{ paddingTop: HEADER_HEIGHT - 30, paddingBottom: 100 }}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentContainer}>
          {/* מחוון קטן למעלה לעיצוב */}
          <View style={styles.dragHandle} />

          <Text style={styles.categoryLabel}>Electronics</Text>
          <Text style={styles.title}>{product.name}</Text>

          {/* Price Block */}
          <View style={styles.priceRow}>
            <Text style={styles.groupPrice}>₪{product.price_group}</Text>
            <View style={styles.regularPriceContainer}>
              <Text style={styles.regularPriceLabel}>Regular Price</Text>
              <Text style={styles.regularPrice}>₪{product.price_regular}</Text>
            </View>
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>Save {Math.round((1 - product.price_group / product.price_regular) * 100)}%</Text>
            </View>
          </View>

          {/* Group Progress Card */}
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>Group Progress 🔥</Text>
              <Text style={styles.timeLeft}>Ends in 48h</Text>
            </View>
            
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${Math.min(progressPercent, 100)}%` }]} />
            </View>
            
            <View style={styles.statsRow}>
              <Text style={styles.statText}>
                <Text style={{ fontWeight: 'bold', color: '#333' }}>{product.joinedCount}</Text> joined
              </Text>
              <Text style={styles.statText}>Target: {product.target_members}</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{product.description}</Text>
          
          <Text style={styles.sectionTitle}>Specifications</Text>
          <View style={styles.specRow}><Text style={styles.specKey}>Brand</Text><Text>Official Supplier</Text></View>
          <View style={styles.specRow}><Text style={styles.specKey}>Warranty</Text><Text>1 Year</Text></View>
          <View style={styles.specRow}><Text style={styles.specKey}>Delivery</Text><Text>Free (3-5 days)</Text></View>
        </View>
      </Animated.ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity 
          style={styles.wishlistButton}
          onPress={() => setIsWishlist(!isWishlist)}
        >
          <Ionicons 
            name={isWishlist ? "heart" : "heart-outline"} 
            size={28} 
            color={isWishlist ? "red" : "#333"} 
          />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.joinButton, isJoined && styles.joinedButton]}
          onPress={handleJoin}
          disabled={isJoined}
        >
          <Text style={styles.joinButtonText}>
            {isJoined ? "You're In! 🎉" : `Join for ₪1`}
          </Text>
          {!isJoined && <Text style={styles.joinSubText}>Hold only. Pay later.</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  // Parallax Header Styles
  headerImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: '100%',
    height: HEADER_HEIGHT,
    zIndex: 0, // מאחור
  },
  fixedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100, // מעל הכל
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight! + 10 : 10,
  },
  roundButton: {
    width: 40, 
    height: 40, 
    backgroundColor: 'rgba(255,255,255,0.9)', 
    borderRadius: 20, 
    justifyContent: 'center', 
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  // Content Styles
  contentContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
    minHeight: 800, // כדי שיהיה לאן לגלול
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  dragHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 20,
  },
  categoryLabel: { color: '#2f95dc', fontSize: 14, fontWeight: '600', marginBottom: 5 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#333', marginBottom: 15 },
  
  priceRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 25 },
  groupPrice: { fontSize: 32, fontWeight: 'bold', color: '#333', marginRight: 15 },
  regularPriceContainer: { marginRight: 'auto' },
  regularPriceLabel: { fontSize: 10, color: '#888' },
  regularPrice: { fontSize: 16, color: '#888', textDecorationLine: 'line-through' },
  discountBadge: { backgroundColor: '#ffebeb', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4 },
  discountText: { color: '#d93025', fontWeight: 'bold', fontSize: 12 },

  progressCard: { backgroundColor: '#f8f9fa', padding: 15, borderRadius: 12, marginBottom: 25, borderWidth: 1, borderColor: '#eee' },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  progressTitle: { fontWeight: 'bold', color: '#333' },
  timeLeft: { fontSize: 12, color: '#e67e22', fontWeight: '600' },
  progressBarBg: { height: 8, backgroundColor: '#e0e0e0', borderRadius: 4, marginBottom: 8 },
  progressBarFill: { height: '100%', backgroundColor: '#2f95dc', borderRadius: 4 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statText: { fontSize: 12, color: '#666' },

  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 10, marginTop: 10 },
  description: { fontSize: 15, color: '#555', lineHeight: 22, marginBottom: 10 },
  specRow: { flexDirection: 'row', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  specKey: { width: 100, fontWeight: '600', color: '#333' },

  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#fff', flexDirection: 'row', padding: 15, paddingBottom: Platform.OS === 'ios' ? 25 : 15,
    borderTopWidth: 1, borderTopColor: '#eee', elevation: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: -3 }, shadowOpacity: 0.1, shadowRadius: 5
  },
  wishlistButton: {
    width: 50, height: 50, justifyContent: 'center', alignItems: 'center',
    backgroundColor: '#f0f0f0', borderRadius: 12, marginRight: 15
  },
  joinButton: {
    flex: 1, backgroundColor: '#2f95dc', borderRadius: 12,
    justifyContent: 'center', alignItems: 'center'
  },
  joinedButton: {
    backgroundColor: '#4caf50',
  },
  joinButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  joinSubText: { color: 'rgba(255,255,255,0.8)', fontSize: 12 }
});