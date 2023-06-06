import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { v2 as cloudinary } from 'cloudinary'
import { promises as fs } from 'fs'
import bcrypt from 'bcrypt'
import { uploadImageToCloudinary } from '@/app/utils/cloudinary'

const prisma = new PrismaClient()

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_API_KEY,
    api_secret: process.env.NEXT_PUBLIC_API_SECRET,
})


export async function POST(request: Request) {
    const body = await request.json()

    const { email, name, password, image } = body

    const hashedPassword = await bcrypt.hash(password, 12)

    let imageUrl: string | undefined
    console.log(imageUrl)
    if (image) {
        try {
            const result = await uploadImageToCloudinary(image);
            imageUrl = result.secure_url;
        } catch (error) {
            console.error('Error uploading image:', error)
        }
    }

    try {
        const user = await prisma.user.create({
            data: {
                email,
                name,
                hashedPassword,
                image: imageUrl,
            },
        })
        return NextResponse.json(user)
    } catch (error: any) {
        if (error.code === 'P2002' && error.meta.target.includes('email')) {
            return NextResponse.json({
                error: 'A user with this email already exists.',
            })
        } else {
            console.error('Error creating user:', error)
            return NextResponse.json({ error: 'An unexpected error occurred.' })
        }
    }
}
