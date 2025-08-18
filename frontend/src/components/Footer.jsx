import React from 'react';
import { assets } from '../assets/assets';

function Footer() {
  return (
    <div className="px-4 sm:px-8 lg:px-16">
      <div className='flex flex-col sm:grid sm:grid-cols-[3fr_1fr_1fr] gap-8 sm:gap-14 my-8 sm:my-10 mt-20 sm:mt-40 text-xs sm:text-sm'>
        {/* Logo & Description */}
        <div className='mb-6 sm:mb-0'>
          <img 
            src={assets.logo} 
            className='mb-4 w-24 sm:w-32 rounded-[20px]' 
            alt="Era Jewelers Logo" 
          />
          <p className='text-gray-600 text-xs sm:text-sm'>
            Era Jewelers brings timeless elegance with modern charm, offering exquisite rings, necklaces, and accessories crafted to shine forever.
          </p>
        </div>

        {/* Company Links */}
        <div className='mb-6 sm:mb-0'>
          <p className='text-base sm:text-xl font-medium mb-3 sm:mb-5'>Company</p>
          <ul className='flex flex-row flex-wrap gap-x-4 gap-y-2 sm:flex-col sm:gap-1 text-gray-600'>
            <li className='whitespace-nowrap'>Home</li>
            <li className='whitespace-nowrap'>About Us</li>
            <li className='whitespace-nowrap'>Delivery</li>
            <li className='whitespace-nowrap'>Privacy Policy</li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <p className='text-base sm:text-xl font-medium mb-3 sm:mb-5'>Contact</p>
          <ul className='flex flex-row flex-wrap gap-x-4 gap-y-2 sm:flex-col sm:gap-1 text-gray-600'>
            <li className='whitespace-nowrap'>+91 89205 41284</li>
            <li className='whitespace-nowrap'>kaushalrauniyar1@gmail.com</li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className='mt-6 sm:mt-0'>
        <hr className='border-gray-200' />
        <p className='py-4 text-xs sm:text-sm text-center text-gray-500'>
          Copyright © 2025 Era-Jewels - All Rights Reserved
        </p>
      </div>
    </div>
  );
}

export default Footer;