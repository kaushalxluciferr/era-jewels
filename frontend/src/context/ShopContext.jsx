import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export const ShopContext = createContext()

const ShopContextProvider = (props) => {
    const [token, settoken] = useState('')
    const delivery_fee = 10;
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [search, setsearch] = useState('')
    const [showsearch, setshowsearch] = useState(false)
    const [cartItems, setCartitems] = useState({})
    const [products, setproducts] = useState([])
    const navigate = useNavigate()

    const addtochart = async(itemId) => {
        let cartData = structuredClone(cartItems)
        if(cartData[itemId]) {
            cartData[itemId] += 1;
        } else {
            cartData[itemId] = 1;
        }
        setCartitems(cartData)
        
        if(token) {
            try {
                await axios.post(backendUrl + `/api/cart/add`, { itemId }, {
                    headers: { token }
                })
                toast.success("Item added successfully")
            } catch(error) {
                toast.error(error.message)
            }
        }
    }

    const getcartcount = () => {
        let total = 0;
        for(const itemId in cartItems) {
            if(cartItems[itemId] > 0) {
                total += cartItems[itemId]
            }
        }
        return total;
    }

    const updateQuantity = async (itemId, quantity) => {
        let cartData = structuredClone(cartItems)
        cartData[itemId] = quantity
        setCartitems(cartData)

        if(token) {
            try {
                await axios.post(backendUrl + `/api/cart/update`, { itemId, quantity }, {
                    headers: { token }
                })
                toast.success("Updated successfully")
            } catch(error) {
                toast.error(error.message)
            }
        }
    }

    const getCartUser = async (token) => {
        try {
            const response = await axios.post(backendUrl + `/api/cart/get`, {}, { headers: { token } })
            if(response.data.success) {
                setCartitems(response.data.cartData)
            }
        } catch(error) {
            toast.error(error.message)
        }
    }

    const getcartamount = () => {
        let total = 0
        for(const itemId in cartItems) {
            let iteminfo = products.find((product) => product._id === itemId)
            if(iteminfo && cartItems[itemId] > 0) {
                total += iteminfo.price * cartItems[itemId]
            }
        }
        return total;
    }

    const productData = async () => {
        try {
            const response = await axios.get(backendUrl + `/api/product/list`)
            if(response.data.success) {
                setproducts(response.data.products)
            } else {
                toast.error(response.data.message)
            }
        } catch(error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        productData()
    }, [])

    useEffect(() => {
        if((!token && localStorage.getItem('token'))) {
            settoken(localStorage.getItem('token'))
            getCartUser(localStorage.getItem('token'))
        }
    }, [])

    const value = {
        navigate,
        products,
        delivery_fee,
        search,
        setsearch,
        showsearch,
        setshowsearch,
        cartItems,
        addtochart,
        getcartcount,
        updateQuantity,
        getcartamount,
        backendUrl,
        settoken,
        token,
        setCartitems
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider