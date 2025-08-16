import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'
import ProdItem from './ProdItem'

function BestSeller() {
    const {products} = useContext(ShopContext)
    const [best, setbest] = useState([])

    useEffect(() => {
        const bestprdt = products.filter((item) => (item.bestseller))
        setbest(bestprdt.slice(0,5))
    }, [products])

    return (
        <div className='my-10'>
            <div className='text-center text-3xl py-8'>
                <Title txt1={'Best'} txt2={'Sellers'}/>
                <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
                    Our most loved pieces that customers can't get enough of. 
                    Each item is crafted to bring elegance to your style.
                </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
                {best.map((item,index) => (
                    <ProdItem key={index} id={item._id} img={item.image} name={item.name} price={item.price}/>
                ))}
            </div>
        </div>
    )
}

export default BestSeller