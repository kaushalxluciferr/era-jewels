import { View, Text, Image, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { hp, wp } from "@/helper/responsiveSize";
import { TextInput } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

const AddProduct = () => {
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [bestseller, setBestseller] = useState(false);
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = 'https://era-jewels-backend.vercel.app'; // Replace with your server IP

  useEffect(() => {
    fetchCategories();
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'We need access to your photos to upload images');
    }
  };

  const fetchCategories = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/api/category`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategories(res.data.categories);
    } catch (error) {
      console.error('Fetch categories error:', error);
      Alert.alert('Error', 'Failed to fetch categories');
    }
  };

 const pickImage = async () => {
  try {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'We need access to your photos to upload an image');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false, // Set to false to select full image
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      const selected = result.assets[0];
      setImage(selected.uri);
    }
  } catch (error) {
    console.error('Image picker error:', error);
    Alert.alert('Error', 'Failed to pick image');
  }
};
  const handleAddProduct = async () => {
    if (!name || !description || !price || !selectedCategory || !image) {
      return Alert.alert('Error', 'Please fill all fields and select an image');
    }

    if (isNaN(price)) {
      return Alert.alert('Error', 'Please enter a valid price');
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      
      // Prepare the image for upload
      const fileInfo = await FileSystem.getInfoAsync(image);
      const fileType = fileInfo.uri.split('.').pop();
      
      const formData = new FormData();
      formData.append('image', {
        uri: image,
        name: `product-${Date.now()}.${fileType}`,
        type: `image/${fileType}`,
      });
      formData.append('name', name);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('category', selectedCategory);
      formData.append('bestseller', bestseller.toString());

      const response = await axios.post(
        `${API_BASE_URL}/api/product/add`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        Alert.alert('Success', 'Product added successfully');
        // Reset form
        setName('');
        setDescription('');
        setPrice('');
        setSelectedCategory('');
        setImage(null);
        setBestseller(false);
      } else {
        Alert.alert('Error', response.data.message);
      }
    } catch (error) {
      console.error('Add product error:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 
        error.message || 
        'Failed to add product'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Image Upload */}
      <View style={styles.imageContainer}>
        <Text style={styles.sectionTitle}>Product Image</Text>
        <TouchableOpacity onPress={pickImage} style={styles.imageButton}>
          <Image
            style={styles.image}
            source={{ uri: image || "https://i.pinimg.com/564x/aa/fd/ea/aafdea1e25408dc9e20307a7762f8c2f.jpg" }}
          />
          <Text style={styles.imageText}>
            {image ? 'Change Image' : 'Select Image'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Product Details */}
      <View style={styles.formContainer}>
        {/* Product Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Product Name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            style={styles.input}
            placeholder="Enter product name"
            placeholderTextColor="#888"
          />
        </View>

        {/* Description */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            style={[styles.input, { height: hp(10), textAlignVertical: 'top' }]}
            placeholder="Enter product description"
            placeholderTextColor="#888"
            multiline
          />
        </View>

        {/* Category */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Category</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedCategory}
              onValueChange={(itemValue) => setSelectedCategory(itemValue)}
              style={styles.picker}
              dropdownIconColor="#333"
            >
              <Picker.Item label="Select a category" value="" />
              {categories.map((category) => (
                <Picker.Item
                  key={category._id}
                  label={category.category}
                  value={category.category}
                />
              ))}
            </Picker>
          </View>
        </View>

        {/* Price */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Price ($)</Text>
          <TextInput
            value={price}
            onChangeText={setPrice}
            style={styles.input}
            placeholder="Enter price"
            placeholderTextColor="#888"
            keyboardType="numeric"
          />
        </View>

        {/* Bestseller */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Bestseller</Text>
          <View style={styles.bestsellerContainer}>
            <TouchableOpacity
              style={[
                styles.bestsellerButton,
                bestseller && styles.bestsellerActive
              ]}
              onPress={() => setBestseller(true)}
            >
              <Text style={bestseller ? styles.bestsellerActiveText : styles.bestsellerText}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.bestsellerButton,
                !bestseller && styles.bestsellerActive
              ]}
              onPress={() => setBestseller(false)}
            >
              <Text style={!bestseller ? styles.bestsellerActiveText : styles.bestsellerText}>No</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleAddProduct}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {loading ? 'Adding Product...' : 'Add Product'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: hp(5),
    backgroundColor: '#f5f5f5',
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: hp(2),
    marginBottom: hp(1),
  },
  sectionTitle: {
    fontSize: wp(4.5),
    fontWeight: '600',
    color: '#333',
    marginBottom: hp(1),
  },
  imageButton: {
    alignItems: 'center',
  },
  image: {
    height: hp(20),
    width: wp(40),
    borderRadius: wp(2),
    borderWidth: 1,
    borderColor: '#ddd',
  },
  imageText: {
    marginTop: hp(1),
    color: '#007bff',
    fontSize: wp(3.5),
  },
  formContainer: {
    paddingHorizontal: wp(5),
  },
  inputGroup: {
    marginBottom: hp(2),
  },
  label: {
    fontSize: wp(4),
    fontWeight: '500',
    color: '#333',
    marginBottom: hp(1),
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: wp(2),
    padding: wp(3),
    backgroundColor: '#fff',
    fontSize: wp(4),
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: wp(2),
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  picker: {
    width: '100%',
    height: hp(7),
    color: '#333',
  },
  bestsellerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp(1),
  },
  bestsellerButton: {
    flex: 1,
    padding: hp(1.5),
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: wp(2),
    alignItems: 'center',
    marginHorizontal: wp(1),
  },
  bestsellerActive: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  bestsellerText: {
    fontSize: wp(4),
    color: '#333',
  },
  bestsellerActiveText: {
    color: '#fff',
  },
  submitButton: {
    backgroundColor: '#007bff',
    padding: hp(2),
    borderRadius: wp(2),
    alignItems: 'center',
    marginTop: hp(3),
  },
  submitButtonDisabled: {
    backgroundColor: '#6c757d',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: wp(4.5),
    fontWeight: '600',
  },
});

export default AddProduct;