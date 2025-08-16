import React, { useContext, useState } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { useNavigate } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import { toast } from 'react-toastify'
import axios from 'axios'

function PlaceOrder() {
    const navigate = useNavigate()
    const [data, setdata] = useState({
        firstName: '',
        lastName: '',
        email: '',
        street: '',
        city: '',
        state: '',
        phone: ''
    })

    const { backendUrl, token, cartItems, setCartitems, getcartamount, delivery_fee, products } = useContext(ShopContext)

    const changehandle = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setdata((item) => ({...item, [name]: value}))
    }

    const onsubmitHandler = async (e) => {
        e.preventDefault()
        try {
            let orderItems = []
            for(const itemId in cartItems) {
                if(cartItems[itemId] > 0) {
                    const itemInfo = products.find(product => product._id === itemId)
                    if(itemInfo) {
                        orderItems.push({
                            _id: itemId,
                            quantity: cartItems[itemId],
                            price: itemInfo.price,
                            name: itemInfo.name,
                            image: itemInfo.image
                        })
                    }
                }
            }

            let orderData = {
                address: data,
                items: orderItems,
                amount: getcartamount() + delivery_fee,
            }

            const response = await axios.post(backendUrl + `/api/order/place`, orderData, { headers: { token } })
            if(response.data.success) {
                setCartitems({})
                toast.success("Order placed")
                navigate('/orders')
            } else {
                toast.error(response.data.message)
            }
        } catch(error) {
            toast.error(error.message)
        }
    }

    return (
        <form onSubmit={onsubmitHandler} className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'>
            {/* Left side - Delivery Information */}
            <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
                <div className='text-xl sm:text-2xl my-3'>
                    <Title txt1={'Delivery'} txt2={"Information"}/>
                </div>
                <div className='flex gap-3'>
                    <input onChange={changehandle} name='firstName' value={data.firstName} type="text" placeholder='Enter First Name' className='border border-gray-300 rounded py-1.5 px-3 w-full' required />
                    <input onChange={changehandle} name='lastName' value={data.lastName} type="text" placeholder='Enter Last Name' className='border border-gray-300 rounded py-1.5 px-3 w-full' required />
                </div>
                <input type="email" onChange={changehandle} name='email' value={data.email} placeholder='Enter Your Email' className='border border-gray-300 rounded py-1.5 px-3 w-full' required />
                <div className='flex gap-3'>
                    <input type="text" onChange={changehandle} name='state' value={data.state} placeholder='Enter State' className='border border-gray-300 rounded py-1.5 px-3 w-full' required />
                    <input type="text" onChange={changehandle} name='city' value={data.city} placeholder='Enter City' className='border border-gray-300 rounded py-1.5 px-3 w-full' required />
                </div>
                <input type="text" onChange={changehandle} name='street' value={data.street} placeholder='Enter Street' className='border border-gray-300 rounded py-1.5 px-3 w-full' required />
                <input type="number" placeholder='Enter Contact Number:' onChange={changehandle} value={data.phone} name='phone' className='border border-gray-300 rounded py-1.5 px-3 w-full' required />
            </div>

            {/* Right side - Order Summary */}
            <div className="mt-8">
                <div className="mt-8 min-w-80">
                    <CartTotal/>
                </div>
                <div className='mt-12'>
                    <Title txt1={'Payment'} txt2={'Method'}/>
                    <div className='mt-5'>
                        <p className='text-gray-500 text-sm font-medium'>Cash On Delivery (COD) only</p>
                    </div>
                    <div className='w-full text-end mt-5'>
                        <button type='submit' className='bg-red-500 px-4 py-4 text-black text-2xl rounded-lg'>
                            Place Order
                        </button>
                    </div>
                </div>
            </div>
        </form>
    )
}

export default PlaceOrder