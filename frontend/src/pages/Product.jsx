import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets'
import RelatedProduct from '../components/RelatedProduct'

function Product() {
    const {id} = useParams()
    const {products, addtochart} = useContext(ShopContext)
    const [prddata, setprddata] = useState(false)
    const [image, setimage] = useState("")

    useEffect(() => {
        const product = products.find(item => item._id === id)
        if(product) {
            setprddata(product)
            setimage(product.image[0])
        }
    }, [id, products])

    return prddata ? (
        <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100'>
            <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>
                {/* Product images */}
                <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
                    <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[19%] w-full">
                        {prddata.image.map((item,index) => (
                            <img 
                                onClick={() => setimage(item)} 
                                src={item} 
                                key={index} 
                                className='w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer' 
                                alt="" 
                            />
                        ))}
                    </div>
                    <div className='w-full sm:w-[80%]'>
                        <img src={image} className='w-full h-auto' alt="" />
                    </div>
                </div>

                {/* Product info */}
                <div className="flex-1">
                    <h1 className='font-medium text-2xl mt-2'>
                        {prddata.name}
                    </h1>
                    <div className='flex items-center gap-1 mt-2'>
                        <img className='w-3.5' src={assets.star_icon} alt="" />
                        <img className='w-3.5' src={assets.star_icon} alt="" />
                        <img className='w-3.5' src={assets.star_icon} alt="" />
                        <img className='w-3.5' src={assets.star_icon} alt="" />
                        <img className='w-3.5' src={assets.star_dull_icon} alt="" />
                        <p className='ml-3'>(122)</p>
                    </div>
                    <p className='mt-5 text-3xl font-medium'>$ {prddata.price}</p>
                    <p className='mt-5 text-gray-500 md:w-4/5'>{prddata.description}</p>
                    <div className='my-8'>
                        <button 
                            onClick={() => addtochart(prddata._id)} 
                            className='bg-black text-white rounded-lg px-8 py-3 text-sm active:bg-gray-700'
                        >
                            Add to Cart
                        </button>
                    </div>
                    <hr className='mt-8 sm:w-4/5' />
                    <div className='text-sm text-gray-500 mt-5 flex- flex-col gap-1'>
                        <p>100% Original Product</p>
                        <p>Cash On Delivery Is available</p>
                        <p>Easy return and Exchange Policy Under 7 days</p>
                    </div>
                </div>
            </div>

            {/* Description section */}
            <div className="mt-20">
                <div className="flex">
                    <b className='border px-5 py-3 text-sm'>
                        Description
                    </b>
                    <p className="border px-5 py-3 text-sm">Reviews (122)</p>
                </div>
                <div className='flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500'>
                    {prddata.description ? (
                        <p>{prddata.description}</p>
                    ) : (
                        <p>No detailed description available for this product.</p>
                    )}
                </div>
            </div>

            {/* Related products */}
            <RelatedProduct category={prddata.category} />
        </div>
    ) : <div className='opacity-0'></div>
}

export default Product