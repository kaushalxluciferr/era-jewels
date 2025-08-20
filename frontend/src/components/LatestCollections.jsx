import React, { useContext, useEffect, useState, useRef } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'
import ProdItem from './ProdItem'
import axios from 'axios'

function LatestCollections() {
    const [latestpd, setLatestpd] = useState([])
    const [filteredProducts, setFilteredProducts] = useState([])
    const [activeCategory, setActiveCategory] = useState('All Product')
    const { products, backendUrl } = useContext(ShopContext)
    const [categories, setCategories] = useState([])
    const categoriesContainerRef = useRef(null)

    // Fetch categories from backend API
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${backendUrl}/api/category`)
                if (response.data.success) {
                    // Extract category names and add "All" option
                    const categoryNames = ['All Product', ...response.data.categories.map(c => c.category)]
                    setCategories(categoryNames)
                }
            } catch (error) {
                console.error("Error fetching categories:", error)
                // Fallback: extract from products if API fails
                if (products && products.length > 0) {
                    const uniqueCategories = ['All Product', ...new Set(products.map(item => item.category))]
                    setCategories(uniqueCategories)
                }
            }
        }
        
        fetchCategories()
    }, [backendUrl, products])

    // Get latest products
    useEffect(() => {
        if (products && products.length > 0) {
            setLatestpd(products.slice(0, 10))
        }
    }, [products])

    // Filter products by category
    useEffect(() => {
        if (activeCategory === 'All Product') {
            setFilteredProducts(latestpd)
        } else {
            setFilteredProducts(latestpd.filter(item => item.category === activeCategory))
        }
    }, [activeCategory, latestpd])

    // Function to handle category click
    const handleCategoryClick = (category) => {
        setActiveCategory(category)
    }

    return (
        <div className='my-12'>
            <div className='text-center py-8 text-3xl'>
                <Title txt1={"Today's"} txt2={'Collections'}/>
                <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-black '>
                    Here you will see lastest today's Collections. The Collections are Best Branded and best made available in our store
                </p>
            </div>
            
            {/* Scrollable category filter */}
            <div className="mb-8 px-4">
                <div 
                    ref={categoriesContainerRef}
                    className="flex overflow-x-auto scrollbar-hide space-x-3 pb-2"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {categories.map((category, index) => (
                        <button
                            key={index}
                            onClick={() => handleCategoryClick(category)}
                            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm flex-shrink-0 ${
                                activeCategory === category 
                                ? 'bg-black text-white shadow-md' 
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            {/* Display products */}
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-6 gap-4'>
                {filteredProducts.map((item, index) => (
                    <ProdItem 
                        key={index} 
                        id={item._id} 
                        img={item.image} 
                        name={item.name} 
                        price={item.price}
                    />
                ))}
            </div>
            
            {/* Show message if no products in selected category */}
            {filteredProducts.length === 0 && latestpd.length > 0 && (
                <div className='text-center py-8'>
                    <p className='text-gray-500'>No products found in the "{activeCategory}" category.</p>
                </div>
            )}
        </div>
    )
}

export default LatestCollections