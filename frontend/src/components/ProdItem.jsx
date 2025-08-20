import React from 'react'
import { Link } from 'react-router-dom'

function ProdItem({id, img, name, price}) {
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }

    return (
        <Link 
            className='text-gray-700 cursor-pointer' 
            to={`/product/${id}`}
            onClick={scrollToTop}
        >
            <div className='overflow-hidden'>
                <img 
                    src={img[0]} 
                    className='hover:scale-110 transition ease-in-out duration-300' 
                    alt={name} 
                />
            </div>
            <p className='pt-4 pb-3 text-sm'>
                {name}
            </p>
            <p className='text-sm font-medium'>₹ {price}</p>
        </Link>
    )
}

export default ProdItem