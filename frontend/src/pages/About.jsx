import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsLater from '../components/NewsLater'

function About() {
  return (
    <div>
   <div className='text-2xl text-center pt-8 border-t'>
   <Title txt1={"About "} txt2={'Us'}/>
   </div>
   <div className='my-10 h-[50%] flex flex-col md:flex-row gap-16'>
         <img src={assets.about_img} className='w-full md:max-w-[450px]' alt="" />
         <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
        <p className='mt-[-100px]'>Era Jewels is where timeless elegance meets modern craftsmanship. We specialize in creating unique, high-quality jewelry pieces that blend sophistication with everyday style. From rings and necklaces to exclusive hair accessories, each design is carefully crafted to enhance your beauty and confidence. Our commitment goes beyond jewelry — we promise exceptional service, quick support, and a seamless shopping experience that makes every customer feel valued. With a growing family of happy customers, Era Jewels continues to shine as a trusted destination for those who seek elegance, quality, and style that lasts forever.</p>


         </div>
   </div>

   <div className='text-4xl py-4'>
    <Title txt1={'WHY TO'} txt2={'CHOOSE US'}/>
   </div>
   <div className='flex flex-col md:flex-row text-sm mb-20 gap-5'>
<div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
  <b>Quality Assurance:</b>
  <p className='text-blue-500'>At Era Jewels, every piece is crafted with precision and care using only the finest materials. Our jewelry undergoes strict quality checks to ensure durability, authenticity, and lasting brilliance.</p>

</div>
<div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
  <b>Convenience:</b>
<p className='text-blue-500'> We make shopping for jewelry simple and enjoyable with a seamless online experience, secure payments, and quick delivery to your doorstep. Whether browsing or purchasing, your comfort is our priority.</p>
</div>
<div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
  <b>Exceptionl Customer Service:</b>
<p className='text-blue-500'>Our customers are at the heart of everything we do. From personalized recommendations to after-sales support, we ensure every experience with Era Jewels is pleasant, reliable, and memorable.</p>
</div>

   </div>

   {/* <NewsLater/> */}
    </div>
  )
}

export default About
