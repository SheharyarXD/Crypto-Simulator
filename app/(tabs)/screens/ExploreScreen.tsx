import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Platform,
  Linking,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { WebView } from 'react-native-webview';

const screenWidth = Dimensions.get('window').width;

export default function ExploreScreen() {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.9));
  const [slideAnim] = useState(new Animated.Value(50));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 900,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const openYouTube = () => {
    Linking.openURL('https://www.youtube.com/watch?v=Yb6825iv0Vk');
  };

  return (
    <LinearGradient colors={['#0F2027', '#203A43', '#2C5364']} style={styles.container}>
      <Animated.View style={[styles.header, {
        opacity: fadeAnim,
        transform: [{ scale: scaleAnim }, { translateY: slideAnim }],
      }]}>
        <Text style={styles.title}>💡 Dive Into Crypto</Text>
        <Text style={styles.subtitle}>Master the basics with engaging video content</Text>
      </Animated.View>

      <Animated.View style={[styles.videoContainer, {
        opacity: fadeAnim,
        transform: [{ scale: scaleAnim }],
      }]}>
        {Platform.OS === 'ios' || Platform.OS === 'android' ? (
          <WebView
            style={styles.video}
            source={{ uri: 'https://www.youtube.com/embed/Yb6825iv0Vk' }}
            allowsFullscreenVideo={true}
            javaScriptEnabled={true}  // Make sure JS is enabled for proper video playback
            domStorageEnabled={true}  // Ensure DOM storage is enabled for smooth video playback
          />
        ) : (
          <TouchableOpacity onPress={openYouTube} activeOpacity={0.9} style={styles.webPreview}>
            <Image
              source={{ uri: 'https://img.youtube.com/vi/Yb6825iv0Vk/maxresdefault.jpg' }}
              style={styles.previewImage}
              resizeMode="cover"
            />
            <Text style={styles.watchText}>▶ Watch on YouTube</Text>
          </TouchableOpacity>
        )}
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 80,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    textShadowColor: '#00e0ff',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
  subtitle: {
    fontSize: 16,
    color: '#C0C0C0',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  videoContainer: {
    width: screenWidth * 0.9,
    height: 220,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#000',
    elevation: 10,
    shadowColor: '#00f0ff',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  video: {
    width: '100%',
    height: '100%',
  },
  webPreview: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111',
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  watchText: {
    position: 'absolute',
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    textAlign: 'center',
  },
});
