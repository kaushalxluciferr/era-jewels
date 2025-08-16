import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { hp, wp } from '@/helper/responsiveSize';
import { useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = 'https://era-jewels-backend.vercel.app'; 

  const handleLogin = async () => {
    if (!email || !password) {
      return Alert.alert('Error', 'Please enter both email and password');
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/user/admin`, {
        email,
        password,
      }, {
        timeout: 10000, // 10 second timeout
      });

      if (res.data.success) {
        await AsyncStorage.setItem('token', res.data.token);
        Alert.alert('Success', 'Login successful!');
        router.replace('/(admin)/');
      } else {
        Alert.alert('Error', res.data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      let errorMessage = 'An error occurred';
      
      if (err.response) {
        errorMessage = err.response.data?.message || 
                      err.response.statusText || 
                      `Server error: ${err.response.status}`;
      } else if (err.request) {
        errorMessage = 'No response from server - check your network connection';
      } else {
        errorMessage = err.message;
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Admin Login</Text>

        <View style={styles.inputWrapper}>
          <Ionicons
            name="mail-outline"
            size={hp(2.5)}
            color="#5e5e5e"
            style={styles.icon}
          />
          <TextInput
            style={styles.input}
            placeholder="Admin Email"
            placeholderTextColor="#888"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputWrapper}>
          <Ionicons
            name="lock-closed-outline"
            size={hp(2.5)}
            color="#5e5e5e"
            style={styles.icon}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#888"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity
          onPress={handleLogin}
          style={[styles.btn, loading && styles.disabledBtn]}
          disabled={loading}
        >
          <Text style={styles.btnText}>
            {loading ? 'Logging in...' : 'Login'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp(5),
  },
  innerContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#fff',
    padding: wp(5),
    borderRadius: wp(3),
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: wp(1.5),
    shadowOffset: { width: 0, height: hp(0.3) },
  },
  title: {
    fontSize: hp(3),
    fontWeight: 'bold',
    marginBottom: hp(3),
    textAlign: 'center',
    color: '#333',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: wp(2),
    paddingHorizontal: wp(3),
    marginBottom: hp(2),
    backgroundColor: '#fafafa',
  },
  icon: {
    marginRight: wp(2),
  },
  input: {
    flex: 1,
    height: hp(6),
    fontSize: hp(2),
    color: '#333',
  },
  btn: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#007bff',
    paddingVertical: hp(1.8),
    borderRadius: wp(3),
    marginTop: hp(1),
  },
  disabledBtn: {
    backgroundColor: '#6c757d',
  },
  btnText: {
    color: 'white',
    fontSize: hp(2.2),
    fontWeight: '600',
  },
});

export default Login;