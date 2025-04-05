import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { initializeDatabase, getUserAssets, handleBuy, handleSell, getLastTransaction } from '../../../hooks/database';
import { useAuth } from '../../../utils/AuthContext';
import { LineChart } from 'react-native-chart-kit';

export default function TradingScreen() {
  const [prices, setPrices] = useState<any>({});
  const [portfolio, setPortfolio] = useState<any>({ bitcoin: 0, ethereum: 0, balance: 100000, ripple: 0, litecoin: 0 });
  const [selectedCoin, setSelectedCoin] = useState<string | null>(null);
  const [candleData, setCandleData] = useState<any[]>([]);
  const { isAuthenticated, logout, userId } = useAuth();

  // Initialize Database
  useEffect(() => {
    initializeDatabase();
  }, []);

   useEffect(() => {
    const fetchCryptoPrices = async () => {
      if (Object.keys(prices).length === 0) { // Only fetch if prices are not already available
        try {
          const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,litecoin,ripple&vs_currencies=usd');
          const data = await response.json();
          setPrices(data);
        } catch (error) {
          console.error('Error fetching crypto prices:', error);
        }
      }
    };

    fetchCryptoPrices(); // Fetch once when the component mounts
  }, [prices]);
  // Fetch user's assets from database
  useEffect(() => {
    const fetchUserAssets = async () => {
      const assets = await getUserAssets(userId);
      let newPortfolio = { bitcoin: 0, ethereum: 0, balance: 100000, ripple: 0, litecoin: 0 };

      assets.forEach((asset: any) => {
        if (asset.crypto_name === 'bitcoin') {
          newPortfolio.bitcoin = asset.amount;
        } else if (asset.crypto_name === 'ethereum') {
          newPortfolio.ethereum = asset.amount;
        } else if (asset.crypto_name === 'litecoin') {
          newPortfolio.litecoin = asset.amount;
        } else if (asset.crypto_name === 'ripple') {
          newPortfolio.ripple = asset.amount;
        }
      });

      setPortfolio(newPortfolio);
    };
    fetchUserAssets();
  }, [userId]); // Dependency on userId to refetch if it changes

  // Handle Buy action
  const handleBuyAction = (crypto: string) => {
    const price = prices[crypto]?.usd;
    if (price && portfolio.balance >= price) {
      handleBuy(userId, crypto, price, 1); // Buy 1 unit of selected crypto
      setPortfolio((prev) => ({
        ...prev,
        [crypto]: prev[crypto] + 1,
        balance: prev.balance - price,
      }));
    }
  };

  // Handle Sell action
  const handleSellAction = (crypto: string) => {
    console.log('Portfolio Before Sell: ',portfolio);
    console.log('Selling: ', selectedCoin);
 console.log('Crypto: ', crypto);
    console.log('Selected Coin Price: ', prices[crypto]?.usd);

    if (portfolio[crypto] > 0) {
      const price = prices[crypto]?.usd;
      if (price) {
        handleSell(userId, crypto, price, 1); // Sell 1 unit of selected crypto
        setPortfolio((prev) => ({
          ...prev,
          [crypto]: prev[crypto] - 1,
          balance: prev.balance + price,
        }));
      }
    }
  };

  // Fetch candlestick data
  const fetchCandlestickData = async (coin: string) => {
    try {
      const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coin}/ohlc?vs_currency=usd&days=1`);
      const data = await response.json();
      setCandleData(data);
    } catch (error) {
      console.error('Error fetching candlestick data:', error);
    }
  };

  // Handle coin selection
  const handleSelectCoin = (coin: string) => {
    setSelectedCoin(coin);
    fetchCandlestickData(coin);
  };

  // Go back to the market view
  const handleGoBack = () => {
    setSelectedCoin(null); // Reset coin selection to go back to market view
  };

  return (
    <LinearGradient colors={['#1A1A2E', '#16213E']} style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Portfolio Balance */}
      <Text style={styles.title}>Trading Dashboard</Text>
      <Text style={styles.balance}>Balance: ${portfolio.balance.toFixed(2)}</Text>

      {/* Display Coin List or Chart based on selection */}
      {selectedCoin === null ? (
        <ScrollView style={styles.scrollView}>
          {['bitcoin', 'ethereum', 'litecoin', 'ripple'].map((coin) => (
            <View key={coin} style={styles.marketContainer}>
              <TouchableOpacity onPress={() => handleSelectCoin(coin)}>
                <Text style={styles.cryptoName}>
                  {coin.charAt(0).toUpperCase() + coin.slice(1)} ({prices[coin]?.usd ? `$${prices[coin]?.usd}` : 'Loading...'})
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.chartContainer}>
          <TouchableOpacity onPress={handleGoBack} style={styles.goBackButton}>
            <Text style={styles.buttonText}>Back to Market</Text>
          </TouchableOpacity>
          <Text style={styles.chartTitle}>Candle Chart for {selectedCoin.charAt(0).toUpperCase() + selectedCoin.slice(1)}</Text>
          {candleData && candleData.length > 0 && (
  <LineChart
    data={{
      labels: candleData.map((data) =>
        new Date(data[0] * 1000).toLocaleTimeString()
      ),
      datasets: [{ data: candleData.map((data) => data[4]) }],
    }}
    width={350}
    height={200}
    yAxisLabel="$"
    chartConfig={{
      backgroundColor: '#1A1A2E',
      backgroundGradientFrom: '#22254B',
      backgroundGradientTo: '#1A1A2E',
      decimalPlaces: 2,
      color: (opacity = 1) => `rgba(75, 192, 192, ${opacity})`,
    }}
    bezier
    style={{ borderRadius: 10, marginTop: 20 }}
  />
)}



          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.buyButton} onPress={() => handleBuyAction(selectedCoin)}>
              <Text style={styles.buttonText}>Buy</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sellButton} onPress={() => handleSellAction(selectedCoin)}>
              <Text style={styles.buttonText}>Sell</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Portfolio Overview */}
      {selectedCoin === null && (
        <View style={styles.portfolio}>
          <Text style={styles.cryptoHolding}>BTC Holdings: {portfolio.bitcoin}</Text>
          <Text style={styles.cryptoHolding}>ETH Holdings: {portfolio.ethereum}</Text>
          <Text style={styles.cryptoHolding}>LTC Holdings: {portfolio.litecoin}</Text>
          <Text style={styles.cryptoHolding}>RIPPLE Holdings: {portfolio.ripple}</Text>
        </View>
      )}
    </LinearGradient>
  );
}

// Styles for the screen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 10,
  },
  balance: {
    fontSize: 18,
    color: '#A0A0A0',
    marginBottom: 20,
  },
  marketContainer: {
    backgroundColor: '#22254B',
    borderRadius: 12,
    padding: 15,
    width: '100%',
    marginBottom: 15,
  },
  cryptoName: {
    fontSize: 18,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buyButton: {
    backgroundColor: '#4ECCA3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  sellButton: {
    backgroundColor: '#FF4C4C',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A2E',
  },
  portfolio: {
    backgroundColor: '#22254B',
    borderRadius: 12,
    padding: 15,
    width: '100%',
    marginTop: 20,
  },
  cryptoHolding: {
    fontSize: 16,
    color: '#00FFB9',
    textAlign: 'center',
    marginBottom: 5,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 20,
  },
  chartContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  scrollView: {
    width: '100%',
    marginBottom: 20,
  },
  goBackButton: {
    backgroundColor: '#4ECCA3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 20,
  },
});
