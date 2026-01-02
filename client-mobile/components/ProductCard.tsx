import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// קבלת רוחב המסך כדי להתאים את הכרטיס
const { width } = Dimensions.get('window');

interface ProductCardProps {
  id: string;
  title: string;
  regularPrice: number;
  groupPrice: number;
  joinedCount: number;
  targetCount: number;
  progress: number;
  image: string | any;
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
  
  const router = useRouter();

  const getTimeLeft = (deadline: string) => {
    if (!deadline) return "";
    const total = Date.parse(deadline) - Date.now();
    if (total <= 0) return "הסתיים";
    
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);

    if (days > 0) return `נותרו ${days} ימים ו-${hours} שעות`;
    return `נותרו ${hours} שעות`; 
  };

  const imageSource = typeof image === 'string' && image.startsWith('http') 
    ? { uri: image } 
    : (typeof image === 'string' ? { uri: 'https://placehold.co/600x400?text=No+Image' } : image);

  return (
    <TouchableOpacity 
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => router.push(`/product/${id}`)}
    >
      <View style={styles.imageContainer}>
        <Image 
            source={imageSource} 
            style={styles.image} 
            resizeMode="cover"
        />
        
        {endsAt && (
            <View style={styles.timeBadge}>
                <Ionicons name="time-outline" size={12} color="#fff" style={{ marginLeft: 4 }} />
                <Text style={styles.timeText}>{getTimeLeft(endsAt)}</Text>
            </View>
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>{title}</Text>

        <View style={styles.priceRow}>
          <View style={styles.priceContainer}>
            <Text style={styles.groupPrice}>₪{groupPrice}</Text>
            <Text style={styles.regularPrice}>₪{regularPrice}</Text>
          </View>
          
          {regularPrice > groupPrice && (
            <View style={styles.discountBadge}>
               <Text style={styles.discountText}>
                 {Math.round(((regularPrice - groupPrice) / regularPrice) * 100)}% הנחה
               </Text>
            </View>
          )}
        </View>

        <View style={styles.progressSection}>
          <View style={styles.progressInfo}>
            <Text style={styles.percentageText}>{Math.round((progress || 0) * 100)}%</Text>
            <Text style={styles.progressText}>
              <Text style={{ fontWeight: 'bold', color: '#007AFF' }}>{joinedCount}</Text> מתוך {targetCount} הצטרפו
            </Text>
          </View>
          
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${Math.min((progress || 0) * 100, 100)}%` }]} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { 
    width: width - 30, // רוחב מלא פחות פדינג
    backgroundColor: '#fff', 
    borderRadius: 16, 
    marginBottom: 15, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 8, 
    elevation: 4, 
    overflow: 'hidden' 
  },
  imageContainer: { height: 180, width: '100%', backgroundColor: '#f0f0f0' },
  image: { width: '100%', height: '100%' },
  timeBadge: { 
    position: 'absolute', 
    top: 12, 
    right: 12, // שינוי לצד ימין בגלל העברית
    backgroundColor: 'rgba(0,0,0,0.7)', 
    borderRadius: 20, 
    paddingHorizontal: 10, 
    paddingVertical: 5, 
    flexDirection: 'row-reverse', 
    alignItems: 'center' 
  },
  timeText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  content: { padding: 16 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 10, textAlign: 'right' },
  priceRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  priceContainer: { flexDirection: 'row-reverse', alignItems: 'baseline' },
  groupPrice: { fontSize: 22, fontWeight: 'bold', color: '#007AFF', marginLeft: 8 },
  regularPrice: { fontSize: 14, color: '#999', textDecorationLine: 'line-through' },
  discountBadge: { backgroundColor: '#E3F2FD', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  discountText: { color: '#007AFF', fontSize: 12, fontWeight: 'bold' },
  progressSection: { marginTop: 5 },
  progressInfo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  progressText: { fontSize: 12, color: '#666' },
  percentageText: { fontSize: 12, fontWeight: 'bold', color: '#007AFF' },
  progressBarBg: { height: 8, backgroundColor: '#E0E0E0', borderRadius: 4 },
  progressBarFill: { height: '100%', backgroundColor: '#007AFF', borderRadius: 4 },
});