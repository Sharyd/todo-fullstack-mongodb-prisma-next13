import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { v2 as cloudinary } from 'cloudinary'
import { promises as fs } from 'fs'
import bcrypt from 'bcrypt'
import { Blob } from 'buffer'

const prisma = new PrismaClient()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
})

export async function POST(request: Request) {
    const body = await request.json()

    const { email, name, password, image } = body

    const hashedPassword = await bcrypt.hash(password, 12)

    let imageUrl: string | undefined
    console.log(image)
    if (image) {
        // Assume image is a base64 string
        const path = `/tmp/${Date.now()}.png`
        await fs.writeFile(path, image, 'base64')

        const result = await cloudinary.uploader.upload(path)
        imageUrl = result.secure_url

        await fs.unlink(path)
    }

    const user = await prisma.user.create({
        data: {
            email,
            name,
            hashedPassword,
            image: imageUrl,
        },
    })

    return NextResponse.json(user)
}
