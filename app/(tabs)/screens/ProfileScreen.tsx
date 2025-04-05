import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../../utils/AuthContext';
import { getUserAssets, getLastTransaction } from '../../../hooks/database';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));
  const navigation = useNavigation();
  const { isAuthenticated, logout, userId } = useAuth();

  const [userAssets, setUserAssets] = useState([]);
  const [lastTransaction, setLastTransaction] = useState<any | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (userId) {
        const assetsFromDB = await getUserAssets(userId);
        const lastTxn = await getLastTransaction(userId);
        setUserAssets(assetsFromDB || []);
        setLastTransaction(lastTxn || null);
      }
    };

    loadData();
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
    const interval = setInterval(loadData, 1000); 
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    navigation.navigate('Home');
  };

  return (
    <LinearGradient colors={['#4A90E2', '#50C2B2']} style={styles.container}>
      <Animated.View
        style={[
          styles.profileContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Text style={styles.title}>Your Profile</Text>

        <Text style={styles.sectionTitle}>Assets</Text>
        <FlatList
          data={userAssets}
          renderItem={({ item }) => (
            <View style={styles.assetItem}>
              <Text style={styles.assetName}>{item.crypto_name}</Text>
              <Text style={styles.assetDetails}>{item.amount} units</Text>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />

        <Text style={styles.sectionTitle}>Last Transaction</Text>
        {lastTransaction ? (
          <View style={styles.transactionItem}>
            <Text style={styles.transactionType}>
              {lastTransaction.trade_type}
            </Text>
            <Text style={styles.transactionDetails}>
              {lastTransaction.amount} {lastTransaction.crypto_name} on{' '}
              {new Date(lastTransaction.timestamp).toLocaleDateString()}
            </Text>
          </View>
        ) : (
          <Text style={{ color: 'white', fontSize: 16 }}>
            No transactions yet
          </Text>
        )}

        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  profileContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 15,
    padding: 20,
    width: '100%',
    alignSelf: 'center',
    maxWidth: width * 0.9,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 6.27,
    elevation: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginVertical: 10,
  },
  assetItem: {
    backgroundColor: '#1B2A41',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    width: '100%',
  },
  assetName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  assetDetails: {
    fontSize: 16,
    color: '#A0A0A0',
    marginTop: 5,
  },
  transactionItem: {
    backgroundColor: '#1B2A41',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    width: '100%',
  },
  transactionType: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  transactionDetails: {
    fontSize: 16,
    color: '#A0A0A0',
    marginTop: 5,
  },
  logoutButton: {
    marginTop: 5,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#ff4e50',
    borderRadius: 20,
    alignItems: 'center',
    alignSelf: 'center',
    shadowColor: '#ff4e50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
  },
  logoutText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});
