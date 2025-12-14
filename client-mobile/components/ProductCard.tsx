import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; // <--- Import

interface ProductCardProps {
  id: string; // ID הוא סטרינג
  title: string;
  regularPrice: number;
  groupPrice: number;
  joinedCount: number;
  targetCount: number;
  progress: number;
  image: any;
  endsAt?: string;
}

export default function ProductCard({
  id,
  title,
  regularPrice,
  groupPrice,
  joinedCount,
  targetCount,
  progress,
  image,
  endsAt
}: ProductCardProps) {
  
  const router = useRouter(); // <--- Hook

  // חישוב זמן נותר
  const getTimeLeft = (deadline: string) => {
    const total = Date.parse(deadline) - Date.now();
    if (total <= 0) return "Ended";
    
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);

    if (days > 0) return `${days}d ${hours}h left`;
    return `${hours}h left`; 
  };

  return (
    <TouchableOpacity 
      style={styles.card}
      // לחיצה מעבירה לעמוד המוצר עם ה-ID
      onPress={() => router.push(`/product/${id}`)} 
    >
      <View style={styles.imageContainer}>
        <Image source={image} style={styles.image} resizeMode="cover" />
        
        {endsAt && (
            <View style={styles.timeBadge}>
                <Ionicons name="time-outline" size={12} color="#fff" style={{ marginRight: 4 }} />
                <Text style={styles.timeText}>{getTimeLeft(endsAt)}</Text>
            </View>
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>{title}</Text>

        <View style={styles.priceContainer}>
          <Text style={styles.groupPrice}>₪{groupPrice}</Text>
          <Text style={styles.regularPrice}>₪{regularPrice}</Text>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${Math.min(progress * 100, 100)}%` }]} />
          </View>
          <View style={styles.progressTextContainer}>
            <Text style={styles.progressText}>
              <Text style={{ fontWeight: 'bold', color: '#2f95dc' }}>{joinedCount}</Text>/{targetCount} joined
            </Text>
            <Text style={styles.percentageText}>{Math.round(progress * 100)}%</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// Styles נשארים אותו דבר...
const styles = StyleSheet.create({
  card: { width: 160, backgroundColor: '#fff', borderRadius: 12, marginRight: 15, marginBottom: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3, overflow: 'hidden' },
  imageContainer: { height: 100, width: '100%', backgroundColor: '#f0f0f0', position: 'relative' },
  image: { width: '100%', height: '100%' },
  timeBadge: { position: 'absolute', top: 8, left: 8, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2, flexDirection: 'row', alignItems: 'center' },
  timeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  content: { padding: 10 },
  title: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 6, height: 36 },
  priceContainer: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 8 },
  groupPrice: { fontSize: 16, fontWeight: 'bold', color: '#2f95dc', marginRight: 6 },
  regularPrice: { fontSize: 12, color: '#999', textDecorationLine: 'line-through' },
  progressContainer: { marginTop: 'auto' },
  progressBarBg: { height: 6, backgroundColor: '#e0e0e0', borderRadius: 3, marginBottom: 4 },
  progressBarFill: { height: '100%', backgroundColor: '#2f95dc', borderRadius: 3 },
  progressTextContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  progressText: { fontSize: 10, color: '#666' },
  percentageText: { fontSize: 10, fontWeight: 'bold', color: '#333' },
});