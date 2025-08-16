import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator, Image, RefreshControl } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const OrderList = () => {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const API_BASE_URL = 'https://era-jewels-backend.vercel.app';

  const fetchOrders = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        router.push('/Login');
        return;
      }

      const response = await axios.post(`${API_BASE_URL}/api/order/list`, {}, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000
      });

      const formattedOrders = response.data.orders.map(order => ({
        id: order._id,
        userId: order.userId,
        items: order.items.map(item => ({
          name: item.name || 'Product',
          quantity: item.quantity || 1,
          price: item.price || 0,
          image: item.image?.[0] || `https://via.placeholder.com/150?text=${encodeURIComponent(item.name || 'product')}`
        })),
        address: order.address || {},
        date: order.date || new Date().toISOString(),
        amount: order.amount || 0,
        status: order.status || 'order Placed',
        paymentMethod: order.paymentMethod || 'COD',
        payment: order.payment || false
      }));

      setOrders(formattedOrders);
      setError(null);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load orders');
      if (err.response?.status === 401) {
        router.push('/Login');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.post(
        `${API_BASE_URL}/api/order/status`,
        { orderId, status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        setOrders(prev => prev.map(o => o.id === orderId ? {...o, status: newStatus} : o));
        Alert.alert('Success', 'Order status updated successfully');
      } else {
        throw new Error(response.data.message || 'Failed to update status');
      }
    } catch (err) {
      console.error('Update error:', err);
      Alert.alert('Error', err.message || 'Failed to update status');
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const renderOrderItem = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity 
        style={styles.orderTouchable}
        onPress={() => router.push({
          pathname: `/(admin)/OrderDetail/${item.id}`,
          params: { status: item.status }
        })}
        activeOpacity={0.8}
      >
        <View style={styles.itemPreview}>
          {item.items.slice(0, 3).map((product, idx) => (
            <Image
              key={`${item.id}-${idx}`}
              source={{ uri: product.image }}
              style={styles.productImage}
              resizeMode="cover"
            />
          ))}
          {item.items.length > 3 && (
            <View style={styles.moreItems}>
              <Text style={styles.moreItemsText}>+{item.items.length - 3}</Text>
            </View>
          )}
        </View>

        <View style={styles.orderInfo}>
          <Text style={styles.orderId}>ORDER #{item.id.slice(-6).toUpperCase()}</Text>
          <Text style={styles.orderTotal}>₹{item.amount.toFixed(2)}</Text>
          <Text style={styles.orderDate}>
            {new Date(item.date).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })}
          </Text>
          <Text style={[
            styles.orderStatus,
            item.status === 'Cancelled' && styles.statusCancelled,
            item.status === 'Delivered' && styles.statusDelivered,
            item.status === 'order Placed' && styles.statusPlaced,
            item.status === 'Processing' && styles.statusProcessing,
            item.status === 'Shipped' && styles.statusShipped,
          ]}>
            {item.status}
          </Text>
        </View>
      </TouchableOpacity>

      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={item.status}
          style={styles.statusPicker}
          onValueChange={value => updateOrderStatus(item.id, value)}
          dropdownIconColor="#333"
          mode="dropdown"
        >
          {['order Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(status => (
            <Picker.Item key={status} label={status} value={status} />
          ))}
        </Picker>
      </View>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#1976d2" />
        <Text style={styles.loadingText}>Loading orders...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={fetchOrders}
        >
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.header}>Order Management</Text>
        <TouchableOpacity onPress={fetchOrders}>
          <Ionicons name="refresh" size={24} color="#1976d2" />
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#1976d2']}
            tintColor="#1976d2"
          />
        }
        ListEmptyComponent={
          <View style={styles.centerContainer}>
            <Text style={styles.emptyText}>No orders found</Text>
            <TouchableOpacity 
              style={[styles.retryButton, { marginTop: 16 }]}
              onPress={fetchOrders}
            >
              <Text style={styles.retryText}>Refresh</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', paddingTop: 16 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  headerContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingHorizontal: 16 },
  backButton: { padding: 4 },
  header: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  card: { backgroundColor: 'white', borderRadius: 8, padding: 16, marginBottom: 16, marginHorizontal: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 2 },
  orderTouchable: { flexDirection: 'row', alignItems: 'center' },
  itemPreview: { flexDirection: 'row', marginRight: 16 },
  productImage: { width: 48, height: 48, borderRadius: 24, marginLeft: -12, borderWidth: 2, borderColor: 'white' },
  moreItems: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center', marginLeft: -12, borderWidth: 2, borderColor: 'white' },
  moreItemsText: { fontSize: 14, color: '#666' },
  orderInfo: { flex: 1, marginLeft: 8 },
  orderId: { fontSize: 14, color: '#666', fontWeight: '500' },
  orderTotal: { fontSize: 18, fontWeight: 'bold', color: '#2e7d32', marginVertical: 4 },
  orderDate: { fontSize: 14, color: '#666', marginBottom: 4 },
  orderStatus: { fontSize: 14, fontWeight: '500' },
  statusPlaced: { color: '#ff9800' },
  statusProcessing: { color: '#2196f3' },
  statusShipped: { color: '#673ab7' },
  statusDelivered: { color: '#4caf50' },
  statusCancelled: { color: '#f44336' },
  pickerWrapper: { marginTop: 12 },
  statusPicker: { width: '100%', height: 48, backgroundColor: '#f5f5f5', borderRadius: 4 },
  loadingText: { marginTop: 16, fontSize: 16, color: '#666' },
  errorText: { fontSize: 16, color: '#d32f2f', marginBottom: 16, textAlign: 'center', paddingHorizontal: 20 },
  retryButton: { backgroundColor: '#1976d2', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8, elevation: 2 },
  retryText: { color: 'white', fontSize: 16, fontWeight: '500' },
  emptyText: { fontSize: 18, color: '#666', marginBottom: 16, textAlign: 'center' },
  listContent: { paddingBottom: 16 }
});

export default OrderList;