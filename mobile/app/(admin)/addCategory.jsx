import { StyleSheet, Text, TouchableOpacity, View, TextInput, FlatList, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { hp, wp } from "@/helper/responsiveSize";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddCategory = () => {
  const [category, setCategory] = useState('');
  const [categoryList, setCategoryList] = useState([]);
  const [loading, setLoading] = useState(false);
  const API_BASE_URL = 'https://era-jewels-backend.vercel.app'; // Replace with your server IP

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/api/category`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategoryList(res.data.categories);
    } catch (error) {
      console.error('Fetch error:', error);
      Alert.alert('Error', 'Failed to fetch categories');
    }
  };

  const handleAddCategory = async () => {
    if (category.trim() === '') {
      return Alert.alert('Error', 'Please enter a category name');
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.post(
        `${API_BASE_URL}/api/category/add`,
        { category },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setCategory('');
        fetchCategories(); // Refresh the list
        Alert.alert('Success', 'Category added successfully');
      } else {
        Alert.alert('Error', res.data.message);
      }
    } catch (error) {
      console.error('Add error:', error);
      Alert.alert(
        'Error', 
        error.response?.data?.message || 
        error.message || 
        'Failed to add category'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.delete(
        `${API_BASE_URL}/api/category/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        fetchCategories(); // Refresh the list
        Alert.alert('Success', 'Category deleted successfully');
      } else {
        Alert.alert('Error', res.data.message);
      }
    } catch (error) {
      console.error('Delete error:', error);
      Alert.alert('Error', 'Failed to delete category');
    }
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.category}>
        <Text style={styles.title}>Manage Categories</Text>

        <View style={styles.inputContainer}>
          <TextInput
            value={category}
            onChangeText={setCategory}
            style={styles.input}
            placeholder='Enter Category name'
            placeholderTextColor="#888"
          />
          <TouchableOpacity 
            style={[styles.btn, loading && styles.disabledBtn]} 
            onPress={handleAddCategory}
            disabled={loading}
          >
            <Text style={styles.btnText}>
              {loading ? 'Adding...' : 'Add'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={categoryList}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text style={styles.listText}>{item.category}</Text>
            <TouchableOpacity onPress={() => handleDeleteCategory(item._id)}>
              <Ionicons name="trash-outline" size={24} color="red" />
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No categories found</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 15,
  },
  category: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    elevation: 2,
  },
  title: {
    fontSize: hp(2.8),
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    marginTop: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#375354",
    paddingHorizontal: 15,
    height: hp(5.5),
    fontSize: hp(2),
    backgroundColor: '#fff',
  },
  btn: {
    backgroundColor: '#007bff',
    paddingVertical: hp(1.5),
    paddingHorizontal: 15,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledBtn: {
    backgroundColor: '#6c757d',
  },
  btnText: {
    color: 'white',
    fontSize: hp(2),
    fontWeight: '600',
  },
  listContainer: {
    paddingBottom: 20,
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 1,
  },
  listText: {
    fontSize: hp(2.2),
    color: '#333',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: hp(2.2),
    color: '#666',
  },
});

export default AddCategory;