import React from 'react';
import { assets } from '../assets/assets';

function OurPolicy() {
  return (
    <div className='flex flex-row flex-wrap justify-center sm:justify-around items-center gap-4 sm:gap-2 px-4 py-10 sm:py-20 text-xs sm:text-sm md:text-base text-gray-700 overflow-x-auto'>
      {/* Exchange Policy */}
      <div className='min-w-[120px] sm:min-w-0 px-2 sm:px-0'>
        <img 
          src={assets.exchange_icon} 
          className='w-8 sm:w-10 md:w-12 mx-auto mb-2 sm:mb-5' 
          alt="Exchange Policy" 
        />
        <p className='font-semibold whitespace-nowrap'>Easy Exchange</p>
        <p className='text-gray-400 text-[10px] sm:text-xs'>7-day exchange policy</p>
      </div>

      {/* Return Policy */}
      <div className='min-w-[120px] sm:min-w-0 px-2 sm:px-0'>
        <img 
          src={assets.quality_icon} 
          className='w-8 sm:w-10 md:w-12 mx-auto mb-2 sm:mb-5' 
          alt="Return Policy" 
        />
        <p className='font-semibold whitespace-nowrap'>7-Day Returns</p>
        <p className='text-gray-400 text-[10px] sm:text-xs'>Free return policy</p>
      </div>

      {/* Support Policy */}
      <div className='min-w-[120px] sm:min-w-0 px-2 sm:px-0'>
        <img 
          src={assets.support_img} 
          className='w-8 sm:w-10 md:w-12 mx-auto mb-2 sm:mb-5' 
          alt="Customer Support" 
        />
        <p className='font-semibold whitespace-nowrap'>24/7 Support</p>
        <p className='text-gray-400 text-[10px] sm:text-xs'>Dedicated customer care</p>
      </div>
    </div>
  );
}

export default OurPolicy;