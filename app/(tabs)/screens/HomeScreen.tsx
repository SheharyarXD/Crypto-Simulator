import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

// Define navigation types
type RootStackParamList = {
  Trading: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Trading'>;

export default function HomeScreen({ navigation }: Props) {
  const [btcPrice, setBtcPrice] = useState<string | null>(null);
  const [ethPrice, setEthPrice] = useState<string | null>(null);

  useEffect(() => {
    const fetchCryptoPrices = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd');
        const data = await response.json();
        setBtcPrice(`$${data.bitcoin.usd.toLocaleString()}`);
        setEthPrice(`$${data.ethereum.usd.toLocaleString()}`);
      } catch (error) {
        console.error('Error fetching crypto prices:', error);
      }
    };

    fetchCryptoPrices();
    const interval = setInterval(fetchCryptoPrices, 10000); // Refresh every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <LinearGradient colors={['#1A1A2E', '#16213E']} style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* App Logo */}
      <Image source={require('../../../assets/images/logo.png')} style={styles.logo} />

      {/* Title Section */}
      <Text style={styles.title}>Crypto Simulator</Text>
      <Text style={styles.subtitle}>Simulate Real-Time Trading in a Risk-Free Environment</Text>

      {/* Market Overview Section */}
      <View style={styles.marketContainer}>
        <View style={styles.marketItem}>
          <Text style={styles.cryptoName}>Bitcoin (BTC)</Text>
          <Text style={styles.cryptoPrice}>{btcPrice || 'Loading...'}</Text>
        </View>
        <View style={styles.marketItem}>
          <Text style={styles.cryptoName}>Ethereum (ETH)</Text>
          <Text style={styles.cryptoPrice}>{ethPrice || 'Loading...'}</Text>
        </View>
      </View>

      {/* Get Started Button */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Trading')}>
        <Text style={styles.buttonText}>Start Trading</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

// Styles for the screen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#A0A0A0',
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 20,
  },
  marketContainer: {
    backgroundColor: '#22254B',
    borderRadius: 12,
    padding: 15,
    width: '100%',
    marginBottom: 20,
  },
  marketItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  cryptoName: {
    fontSize: 16,
    color: '#ffffff',
  },
  cryptoPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00FFB9',
  },
  button: {
    backgroundColor: '#4ECCA3',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A2E',
  },
});

