import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { hp, wp } from '@/helper/responsiveSize';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const API_BASE_URL = 'https://era-jewels-backend.vercel.app';

  const fetchProducts = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/product/list`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(response.data.products);
    } catch (error) {
      console.error('Fetch products error:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleDelete = async (id) => {
    Alert.alert(
      'Delete Product',
      'Are you sure you want to delete this product?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setDeletingId(id);
              const token = await AsyncStorage.getItem('token');
              await axios.post(
                `${API_BASE_URL}/api/product/remove`,
                { id },
                { headers: { Authorization: `Bearer ${token}` } }
              );
              fetchProducts();
              Alert.alert('Success', 'Product deleted successfully');
            } catch (error) {
              console.error('Delete error:', error);
              Alert.alert('Error', error.response?.data?.message || 'Failed to delete product');
            } finally {
              setDeletingId(null);
            }
          },
        },
      ]
    );
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image 
        source={{ uri: item.image[0] || 'https://via.placeholder.com/150' }} 
        style={styles.img} 
        resizeMode="cover"
      />
      <View style={styles.details}>
        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
        <View style={styles.categoryContainer}>
          <Text style={styles.category}>{item.category}</Text>
          {item.bestseller && (
            <View style={styles.bestsellerBadge}>
              <Text style={styles.bestsellerText}>Bestseller</Text>
            </View>
          )}
        </View>
        <Text style={styles.price}>${item.price.toFixed(2)}</Text>
      </View>
      <TouchableOpacity 
        style={styles.btn}
        onPress={() => handleDelete(item._id)}
        disabled={deletingId === item._id}
      >
        {deletingId === item._id ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.btnText}>Delete</Text>
        )}
      </TouchableOpacity>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#1976d2" />
        <Text>Loading products...</Text>
      </View>
    );
  }

  if (products.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>No products found</Text>
        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={fetchProducts}
        >
          <Text style={styles.refreshText}>Refresh</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Product List ({products.length})</Text>
      
      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshing={refreshing}
        onRefresh={() => {
          setRefreshing(true);
          fetchProducts();
        }}
        ListFooterComponent={<View style={{ height: hp(2) }} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(4),
    backgroundColor: '#f8f9fa',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  emptyText: {
    fontSize: wp(4.5),
    color: '#6c757d',
    marginBottom: hp(2)
  },
  refreshButton: {
    backgroundColor: '#1976d2',
    paddingHorizontal: wp(5),
    paddingVertical: hp(1.5),
    borderRadius: wp(2)
  },
  refreshText: {
    color: '#fff',
    fontSize: wp(4)
  },
  heading: {
    fontSize: wp(5.5),
    fontWeight: '700',
    marginVertical: hp(2),
    color: '#343a40',
  },
  listContent: {
    paddingBottom: hp(4),
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: wp(3),
    marginBottom: hp(1.5),
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  img: {
    width: wp(25),
    height: wp(25),
  },
  details: {
    flex: 1,
    padding: wp(3),
    justifyContent: 'center',
  },
  name: {
    fontSize: wp(4.2),
    fontWeight: '600',
    color: '#212529',
    marginBottom: hp(0.5),
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(0.5),
  },
  category: {
    fontSize: wp(3.8),
    color: '#6c757d',
    marginRight: wp(2),
  },
  bestsellerBadge: {
    backgroundColor: '#ffc107',
    borderRadius: wp(1),
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.3),
  },
  bestsellerText: {
    fontSize: wp(3.2),
    fontWeight: '500',
    color: '#212529',
  },
  price: {
    fontSize: wp(4),
    fontWeight: '700',
    color: '#28a745',
  },
  btn: {
    backgroundColor: '#dc3545',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp(4),
  },
  btnText: {
    color: '#fff',
    fontSize: wp(3.8),
    fontWeight: '500',
  },
});

export default ProductList;