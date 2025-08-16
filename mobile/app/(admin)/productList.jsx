import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { hp, wp } from '@/helper/responsiveSize';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const API_BASE_URL = 'http://10.5.232.134:4000'; // Replace with your server IP

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/product/list`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(response.data.products);
    } catch (error) {
      console.error('Fetch products error:', error);
      Alert.alert('Error', 'Failed to fetch products');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Delete product
  const handleDelete = async (id) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/api/product/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProducts(); // Refresh the list
      Alert.alert('Success', 'Product deleted successfully');
    } catch (error) {
      console.error('Delete error:', error);
      Alert.alert('Error', 'Failed to delete product');
    }
  };

  // Initial load
  useEffect(() => {
    fetchProducts();
  }, []);

  // Render each product item
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
      >
        <Text style={styles.btnText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  // Loading state
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading products...</Text>
      </View>
    );
  }

  // Empty state
  if (products.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No products found</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: wp(4.5),
    color: '#6c757d',
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