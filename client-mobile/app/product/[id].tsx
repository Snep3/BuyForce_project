import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import MOCK_PRODUCTS from '../../store/mockData';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../../store/useStore'; // Import Store

const { width } = Dimensions.get('window');

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  // Store Hooks
  const { toggleWishlist, isWishlisted, joinGroup, hasJoined } = useStore();
  
  const product = MOCK_PRODUCTS.find((p) => p.id === id);
  const group = product?.active_group;
  const productId = typeof id === 'string' ? id : '';

  // Calculate State
  const isInWishlist = isWishlisted(productId);
  const isJoined = group ? hasJoined(group.id) : false;

  if (!product) {
    return (
      <View style={styles.center}>
        <Text>Product not found</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
            <Text style={{ color: 'blue' }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleJoinPress = () => {
    if (!group) return;
    
    if (isJoined) {
        Alert.alert("Already Joined", "You are already part of this group.");
        return;
    }

    Alert.alert(
      "Join Group",
      `Authorize 1₪ to join the group for ${product.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Confirm (1₪)", 
          onPress: () => {
            joinGroup(group.id); // Update Global State
            Alert.alert("Success!", "You have joined the group. Check 'My Groups'.");
            router.back(); 
          }
        }
      ]
    );
  };

  const progress = group ? group.progress_pct : 0;
  const joined = group ? group.joined_count : 0;
  const target = group ? group.target_members : product.min_members;

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
             <Image source={{ uri: product.image_url }} style={styles.image} resizeMode="cover" />
        </View>

        <View style={styles.content}>
            <Text style={styles.title}>{product.name}</Text>
            <View style={styles.ratingRow}>
                <Ionicons name="star" size={16} color="#F59E0B" />
                <Text style={styles.ratingText}>4.8 (120 reviews)</Text>
            </View>

            <View style={styles.priceBlock}>
                <View>
                    <Text style={styles.label}>Group Price</Text>
                    <Text style={styles.groupPrice}>₪{product.price_group}</Text>
                </View>
                <View style={styles.divider} />
                <View>
                    <Text style={styles.label}>Regular Price</Text>
                    <Text style={styles.regularPrice}>₪{product.price_regular}</Text>
                </View>
                <View style={styles.discountBadge}>
                    <Text style={styles.discountText}>Save {Math.round((product.discount_pct || 0) * 100)}%</Text>
                </View>
            </View>

            <View style={styles.progressSection}>
                <View style={styles.progressRow}>
                    <Text style={styles.progressLabel}>Group Progress</Text>
                    <Text style={styles.progressValue}>
                        <Text style={{fontWeight: 'bold', color: '#2f95dc'}}>{joined}</Text>/{target} joined
                    </Text>
                </View>
                <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: `${Math.min(progress * 100, 100)}%` }]} />
                </View>
            </View>

            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{product.description}</Text>
        </View>
      </ScrollView>

      {/* Floating Header */}
      <View style={[styles.customHeader, { top: insets.top + 10 }]}>
          <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
             <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton} onPress={() => toggleWishlist(productId)}>
             <Ionicons 
                name={isInWishlist ? "heart" : "heart-outline"} 
                size={24} 
                color={isInWishlist ? "#ef4444" : "#333"} 
             />
          </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={[styles.footer, { paddingBottom: insets.bottom }]}>
        <View style={styles.footerContent}>
            <View>
                <Text style={styles.footerLabel}>Pre-auth only</Text>
                <Text style={styles.footerPrice}>1₪</Text>
            </View>
            <TouchableOpacity 
                style={[styles.joinButton, isJoined && styles.disabledButton]} 
                onPress={handleJoinPress}
                disabled={isJoined}
            >
                <Text style={styles.joinButtonText}>
                    {isJoined ? "Joined" : "Join Group"}
                </Text>
            </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  customHeader: { position: 'absolute', left: 20, right: 20, flexDirection: 'row', justifyContent: 'space-between', zIndex: 10 },
  iconButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255, 0.9)', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  imageContainer: { width: width, height: 350, backgroundColor: '#f0f0f0' },
  image: { width: '100%', height: '100%' },
  content: { padding: 20, borderTopLeftRadius: 30, borderTopRightRadius: 30, marginTop: -30, backgroundColor: '#fff' },
  title: { fontSize: 26, fontWeight: 'bold', color: '#111', marginBottom: 8 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  ratingText: { marginLeft: 4, color: '#666', fontSize: 14 },
  priceBlock: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f9f9f9', padding: 16, borderRadius: 16, marginBottom: 24 },
  divider: { width: 1, height: 40, backgroundColor: '#ddd', marginHorizontal: 16 },
  label: { fontSize: 12, color: '#666', marginBottom: 2 },
  groupPrice: { fontSize: 22, fontWeight: '800', color: '#2f95dc' },
  regularPrice: { fontSize: 18, color: '#999', textDecorationLine: 'line-through' },
  discountBadge: { marginLeft: 'auto', backgroundColor: '#dbeafe', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  discountText: { color: '#2563eb', fontWeight: 'bold', fontSize: 12 },
  progressSection: { marginBottom: 24 },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  progressLabel: { fontSize: 14, fontWeight: '600', color: '#333' },
  progressValue: { fontSize: 14, color: '#666' },
  progressBarBg: { height: 10, backgroundColor: '#e5e7eb', borderRadius: 5, overflow: 'hidden', marginBottom: 12 },
  progressBarFill: { height: '100%', backgroundColor: '#2f95dc' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8, marginTop: 8 },
  description: { fontSize: 15, lineHeight: 24, color: '#4b5563', marginBottom: 12 },
  footer: { backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#f0f0f0', paddingTop: 10 },
  footerContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 10 },
  footerLabel: { fontSize: 12, color: '#666' },
  footerPrice: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  joinButton: { backgroundColor: '#2f95dc', paddingVertical: 14, paddingHorizontal: 32, borderRadius: 12 },
  disabledButton: { backgroundColor: '#9ca3af' },
  joinButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});