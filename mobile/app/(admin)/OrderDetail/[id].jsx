import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  ActivityIndicator, 
  Image, 
  TouchableOpacity,
  Alert
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

const OrderDetail = () => {
  const router = useRouter();
  const { id: orderId, status: initialStatus } = useLocalSearchParams();
  const API_BASE_URL = 'https://era-jewels-backend.vercel.app';

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentStatus, setCurrentStatus] = useState(initialStatus || '');

  const fetchOrderDetails = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        router.push('/Login');
        return;
      }

      const response = await axios.post(
        `${API_BASE_URL}/api/order/details`,
        { orderId },
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 10000
        }
      );

      setOrder(response.data.order);
      setCurrentStatus(response.data.order.status);
      setError(null);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  useEffect(() => {
    if (initialStatus && initialStatus !== currentStatus) {
      setCurrentStatus(initialStatus);
      fetchOrderDetails();
    }
  }, [initialStatus]);

  const handleBack = () => {
    router.back();
  };

  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  const getImageSource = (item) => {
    if (Array.isArray(item.image) && item.image.length > 0) {
      return { uri: item.image[0] };
    } else if (typeof item.image === 'string' && item.image.trim() !== '') {
      return { uri: item.image };
    }
    return { uri: `https://via.placeholder.com/150?text=${encodeURIComponent(item.name || 'product')}` };
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#1976d2" />
        <Text style={styles.loadingText}>Loading order details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={fetchOrderDetails}
        >
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>Order not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Summary</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Order ID:</Text>
          <Text style={styles.summaryValue}>#{order._id.slice(-8).toUpperCase()}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Date:</Text>
          <Text style={styles.summaryValue}>{formatDate(order.date)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Status:</Text>
          <Text style={[styles.summaryValue, styles[`status${currentStatus.replace(/\s+/g, '')}`]]}>
            {currentStatus}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Payment Method:</Text>
          <Text style={styles.summaryValue}>{order.paymentMethod}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Amount:</Text>
          <Text style={[styles.summaryValue, styles.totalAmount]}>₹{order.amount.toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Shipping Address</Text>
        <Text style={styles.addressText}>{order.address?.name}</Text>
        <Text style={styles.addressText}>{order.address?.street}</Text>
        <Text style={styles.addressText}>
          {order.address?.city}, {order.address?.state} - {order.address?.pincode}
        </Text>
        <Text style={styles.addressText}>Phone: {order.address?.phone}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Items ({order.items.length})</Text>
        {order.items.map((item, index) => (
          <View key={index} style={styles.itemContainer}>
            <Image
              source={getImageSource(item)}
              style={styles.itemImage}
              resizeMode="cover"
            />
            <View style={styles.itemDetails}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>₹{item.price.toFixed(2)}</Text>
              <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  backButton: {
    padding: 4
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333'
  },
  section: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333'
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  summaryLabel: {
    color: '#666',
    fontSize: 14
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500'
  },
  totalAmount: {
    color: '#2e7d32',
    fontWeight: 'bold'
  },
  statusorderPlaced: {
    color: '#ff9800'
  },
  statusProcessing: {
    color: '#2196f3'
  },
  statusShipped: {
    color: '#673ab7'
  },
  statusDelivered: {
    color: '#4caf50'
  },
  statusCancelled: {
    color: '#f44336'
  },
  addressText: {
    fontSize: 14,
    marginBottom: 4,
    color: '#555'
  },
  itemContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'center'
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12
  },
  itemDetails: {
    flex: 1
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4
  },
  itemPrice: {
    fontSize: 14,
    color: '#2e7d32',
    fontWeight: 'bold'
  },
  itemQuantity: {
    fontSize: 12,
    color: '#666'
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666'
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    marginBottom: 16,
    textAlign: 'center'
  },
  retryButton: {
    backgroundColor: '#1976d2',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    elevation: 2
  },
  retryText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500'
  },
  emptyText: {
    fontSize: 18,
    color: '#666'
  }
});

export default OrderDetail;