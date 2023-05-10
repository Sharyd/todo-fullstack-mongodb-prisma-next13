'use client'

import React from 'react'
import Image from 'next/image'
const GradientImage = () => {
    return (
        <div className="absolute w-full h-[40%]">
            <Image
                className="w-full h-full object-cover"
                src="/images/bg-desktop-dark.jpg"
                alt="background-image"
                width={1440}
                height={400}
            />
        </div>
    )
}

export default GradientImage
