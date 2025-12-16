import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { useStore } from '../../store/useStore';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
  Pressable,
} from 'react-native';

/* =========================
   TYPES
   ========================= */

type AgeGroup = '0-18' | '19-26' | '27-40' | '40-50' | '50+';
type TechLevel = 'Beginner' | 'Intermediate' | 'Expert';
type Occupation =
  | 'Student'
  | 'Software Developer / Engineer'
  | 'Designer / Creative Professional'
  | 'Product Manager'
  | 'Data / Business Analyst'
  | 'IT / Tech Support'
  | 'Marketing / Social Media'
  | 'Retail / Service Worker'
  | 'Administrative / Office Worker'
  | 'Content Creator'
  | 'Other';

/* =========================
   COMPONENT
   ========================= */

export default function LoginScreen() {
    
    const router = useRouter();
    const login = useStore((state) => state.login);

  /* =========================
     STATE
     ========================= */

     
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [showRegister, setShowRegister] = useState(false);

  // Register-only
  const [ageGroup, setAgeGroup] = useState<AgeGroup | null>(null);
  const [techLevel, setTechLevel] = useState<TechLevel | null>(null);
  const [occupation, setOccupation] = useState<Occupation | null>(null);

  /* =========================
     HANDLERS
     ========================= */

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill email and password');
      return;
    }

    
    login(); 
     router.replace('/(tabs)');

    Alert.alert('Success', 'Logged in');
  };

  const handleRegister = () => {
    if (!email || !password || !ageGroup || !techLevel || !occupation) {
      Alert.alert('Error', 'Please fill all registration fields');
      return;
    }
        login(); 
         router.replace('/(tabs)');


    Alert.alert('Success', 'Registered');
  };

  /* =========================
     UI HELPERS
     ========================= */

  const Option = ({
    label,
    selected,
    onPress,
  }: {
    label: string;
    selected: boolean;
    onPress: () => void;
  }) => (
    <Pressable
      onPress={onPress}
      style={[
        styles.option,
        selected && styles.optionSelected,
      ]}
    >
      <Text
        style={[
          styles.optionText,
          selected && styles.optionTextSelected,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );

  /* =========================
     RENDER
     ========================= */

  return (
    <View style={styles.container}>
      <Text style={styles.title}>BuyForce</Text>

      {/* EMAIL */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      {/* PASSWORD */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* TOGGLE */}
      <Pressable
        onPress={() => setShowRegister(!showRegister)}
        style={styles.link}
      >
        <Text style={styles.linkText}>
          {showRegister
            ? 'Already have an account? Login'
            : 'New here? Register'}
        </Text>
      </Pressable>

      {/* REGISTER FIELDS */}
      {showRegister && (
        <>
          {/* AGE GROUP */}
          <Text style={styles.sectionTitle}>Age Group</Text>
          <View style={styles.row}>
            {(['0-18', '19-26', '27-40', '40-50', '50+'] as AgeGroup[]).map(
              (g) => (
                <Option
                  key={g}
                  label={g}
                  selected={ageGroup === g}
                  onPress={() => setAgeGroup(g)}
                />
              )
            )}
          </View>

          {/* TECH LEVEL */}
          <Text style={styles.sectionTitle}>Tech Level</Text>
          <View style={styles.row}>
            {(['Beginner', 'Intermediate', 'Expert'] as TechLevel[]).map(
              (l) => (
                <Option
                  key={l}
                  label={l}
                  selected={techLevel === l}
                  onPress={() => setTechLevel(l)}
                />
              )
            )}
          </View>

          {/* OCCUPATION */}
          <Text style={styles.sectionTitle}>Occupation</Text>
          <View style={styles.row}>
            {([
                 'Student',
              'Software Developer / Engineer',
              'Designer / Creative Professional',
              'Product Manager',
              'Data / Business Analyst',
              'IT / Tech Support',
              'Marketing / Social Media',
              'Retail / Service Worker',
             'Administrative / Office Worker',
              'Content Creator',
              'Other',
            ] as Occupation[]).map((job) => (
              <Option
                key={job}
                label={job}
                selected={occupation === job}
                onPress={() => setOccupation(job)}
              />
            ))}
          </View>
        </>
      )}

      {/* ACTION BUTTONS */}
      <View style={styles.buttonRow}>
        <Pressable style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </Pressable>

        {showRegister && (
          <Pressable
            style={styles.registerButton}
            onPress={handleRegister}
          >
            <Text style={styles.buttonText}>Register</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

/* =========================
   STYLES
   ========================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 80,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    marginBottom: 25,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  link: {
    alignItems: 'center',
    marginVertical: 10,
  },
  linkText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  sectionTitle: {
    fontWeight: '700',
    marginTop: 10,
    marginBottom: 6,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  option: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 8,
    marginBottom: 8,
  },
  optionSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  optionText: {
    fontSize: 13,
    color: '#333',
  },
  optionTextSelected: {
    color: '#fff',
    fontWeight: '700',
  },
  buttonRow: {
    marginTop: 20,
  },
  loginButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  registerButton: {
    backgroundColor: '#10b981',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
