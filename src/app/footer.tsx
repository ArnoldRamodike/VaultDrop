import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <div className='h-40 bg-gray-100 mr-12 flex items-center'>
        <div className="container mx-auto flex justify-between items-center">
        <div className="riccoRDrop"></div>

    
        <Link className='text-blue-500 cursor-pointer' href={'/privacy'}>Privacy Policy</Link>
        <Link className='text-blue-500 cursor-pointer' href={'/terms'}>Terms of service</Link>
        <Link className='text-blue-500 cursor-pointer' href={'/about'}>about us</Link>
      </div>
          
    </div>
  )
}

export default Footer