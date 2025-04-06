import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Animated,Alert,TouchableOpacity  } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { loginUser } from '../../../hooks/database';
import { useAuth } from '../../../utils/AuthContext';
import { useNavigation } from '@react-navigation/native';  


export default function LoginScreen() {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const navigation = useNavigation();
  const handleLogin = () => {
    loginUser(email, password, (success, message) => {
      if (success) {
        console.log('Logged in successfully');
      } else {
        console.log('Login failed:', message);
      }
    }, login);  
  };
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <LinearGradient colors={['#4A90E2', '#50C2B2']} style={styles.container}>
      <Animated.View style={[styles.loginBox, { opacity: fadeAnim }]}>
        <Text style={styles.title}>Login</Text>

        <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#ccc"  onChangeText={setEmail} />
        <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#ccc" secureTextEntry  onChangeText={setPassword}/>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>

        <Text style={styles.signupText}>Don't have an account? <TouchableOpacity style={styles.signupLink}  onPress={() => navigation.navigate('SignUp')}>Sign Up</TouchableOpacity></Text>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loginBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 30,
    borderRadius: 20,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 6.27,
    elevation: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    backgroundColor: '#2C3E50',
    color: '#fff',
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#3498db',
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  signupText: {
    color: '#bbb',
    marginTop: 15,
  },
  signupLink: {
    color: '#4A90E2',
    fontWeight: 'bold',
  },
});
