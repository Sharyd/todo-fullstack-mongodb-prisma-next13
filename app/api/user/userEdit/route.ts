import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import { v2 as cloudinary } from 'cloudinary'
import { promises as fs } from 'fs'
import { getSession } from '@/app/sessions/getLoggedUser'

const prisma = new PrismaClient()

interface UpdateBody {
    password?: { oldPassword: string; newPassword: string }
    name?: string
    image?: string
}

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
})

export async function PATCH(request: NextRequest) {
    const session: any = await getSession()
    const userId = session?.user?.userId
    console.log(userId)
    if (!userId) {
        return NextResponse.json('Not authenticated')
    }

    const body: UpdateBody = JSON.parse(await request.text())
    const { password, name, image } = body

    const user: any = await prisma.user.findUnique({ where: { id: userId } })

    if (!user) {
        return NextResponse.json('User not found')
    }

    let updates: { [key: string]: any } = {}

    if (password?.oldPassword && password?.newPassword) {
        const isCorrectPassword = bcrypt.compare(
            password.oldPassword,
            user.hashedPassword
        )
        if (!isCorrectPassword) {
            return NextResponse.json('Old password does not match')
        }

        const hashedPassword = await bcrypt.hash(password.newPassword, 12)
        updates.hashedPassword = hashedPassword
    }

    if (name) {
        updates.name = name
    }

    let imageUrl: string | undefined
    if (image) {
        const path = `${process.cwd()}/${Date.now()}.png`
        await fs.writeFile(path, image, 'base64')
        const result = await cloudinary.uploader.upload(path)
        imageUrl = result.secure_url
        await fs.unlink(path)
        updates.image = imageUrl
    }

    if (Object.keys(updates).length === 0) {
        return NextResponse.json('No updates provided')
    }

    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: updates,
    })

    return NextResponse.json(updatedUser)
}
