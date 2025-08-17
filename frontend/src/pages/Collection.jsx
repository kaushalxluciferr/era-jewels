import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets'
import Title from '../components/Title'
import ProdItem from '../components/ProdItem'
import axios from 'axios'

function Collection() {
  const {products, search, showsearch, backendUrl} = useContext(ShopContext)
  const [show, setshow] = useState(false)
  const [filterprod, setfilterprod] = useState(products || []) // Initialize with products
  const [category, setcategory] = useState([])
  const [sortType, setsortType] = useState('relevant')
  const [availableCategories, setAvailableCategories] = useState([])

  // Apply filters whenever products, search, or category changes
  useEffect(() => {
    if (products && products.length > 0) {
      applyfilter()
    } else {
      setfilterprod([])
    }
  }, [products, search, showsearch, category])

  // Fetch all categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/category`)
        if (response.data.success) {
          setAvailableCategories(response.data.categories.map(c => c.category))
        }
      } catch (error) {
        console.error("Error fetching categories:", error)
      }
    }
    fetchCategories()
  }, [backendUrl])

  const togglecategory = (e) => {
    const value = e.target.value
    setcategory(prev => 
      prev.includes(value) 
        ? prev.filter(item => item !== value) 
        : [...prev, value]
    )
  }

  const applyfilter = () => {
    let filtered = [...products]
    
    // Apply search filter if active
    if(showsearch && search) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(search.toLowerCase())
      )
    }
    
    // Apply category filter if any categories selected
    if(category.length > 0) {
      filtered = filtered.filter(item => category.includes(item.category))
    }
    
    setfilterprod(filtered)
  }

  // Sort products
  useEffect(() => {
    if (filterprod.length > 0) {
      const sorted = [...filterprod]
      if (sortType === 'low-high') {
        sorted.sort((a,b) => a.price - b.price)
      } else if (sortType === 'high-low') {
        sorted.sort((a,b) => b.price - a.price)
      }
      // Only update if sorting would actually change the order
      if (JSON.stringify(sorted) !== JSON.stringify(filterprod)) {
        setfilterprod(sorted)
      }
    }
  }, [sortType, filterprod])

  const clearAllFilters = () => {
    setcategory([])
    // If search is managed here, you would clear it too
    // But since it comes from context, you might need a way to clear it
  }

  // Check if any filters are active
  const hasActiveFilters = category.length > 0 || (showsearch && search)

  return (
    <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t'>
      {/* Filter sidebar */}
      <div className='min-w-60'>
        <p onClick={() => setshow(!show)} className='my-2 text-xl flex items-center cursor-pointer gap-2'>
          Filters
          <img src={assets.dropdown_icon} className={`h-3 sm:hidden ${show?'rotate-90':""}`} alt="" />
        </p>

        <div className={`border border-gray-300 pl-5 py-3 mt-6 ${show?'':"hidden"} sm:block`}>
          <p className='mb-3 text-sm font-medium'>Categories</p>
          {availableCategories.length > 0 ? (
            <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
              {availableCategories.map((cat, index) => (
                <label key={index} className='flex items-center gap-2 cursor-pointer'>
                  <input 
                    type="checkbox"
                    value={cat}
                    onChange={togglecategory}
                    checked={category.includes(cat)}
                    className='w-3 h-3'
                  />
                  {cat}
                </label>
              ))}
            </div>
          ) : (
            <p className='text-gray-500 text-sm'>Loading categories...</p>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className='flex-1'>
        <div className='flex justify-between text-base sm:text-2xl mb-4'>
          <Title txt1={"All"} txt2={'Collections'}/>
          <select 
            onChange={(e) => setsortType(e.target.value)} 
            className='border-2 border-gray-300 text-sm px-1'
            value={sortType}
          >
            <option value="relevant">Display By relevant</option>
            <option value="low-high">Display Low-High</option>
            <option value="high-low">Display by High-Low</option>
          </select>
        </div>
        
        {/* Show clear filters button only when filters are active */}
        {hasActiveFilters && (
          <div className="mb-4">
            <button 
              onClick={clearAllFilters}
              className='text-blue-500 text-sm'
            >
              Clear all filters
            </button>
          </div>
        )}
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
          {filterprod.length > 0 ? (
            filterprod.map((item) => (
              <ProdItem 
                key={item._id}
                id={item._id}
                img={item.image}
                name={item.name}
                price={item.price}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <p>No products found matching your filters</p>
              {hasActiveFilters && (
                <button 
                  onClick={clearAllFilters}
                  className='mt-2 text-blue-500'
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Collection