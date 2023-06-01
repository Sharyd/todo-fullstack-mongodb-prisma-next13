import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import { v2 as cloudinary } from 'cloudinary'
import { promises as fs } from 'fs'
import { getSession } from '@/app/sessions/getLoggedUser'

const prisma = new PrismaClient()

interface UpdateBody {
    password?: { oldPassword?: string; newPassword?: string }
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

    if (!userId) {
        return NextResponse.json('Not authenticated')
    }

    const body: UpdateBody = JSON.parse(await request.text())
    const { password, name, image } = body

    const user: any = await prisma.user.findUnique({
        where: { id: userId },
        include: { accounts: true }, // include accounts to check if user has logged in with a provider
    })

    if (!user) {
        return NextResponse.json('User not found')
    }

    let updates: { [key: string]: any } = {}
    let imageUrl: string | undefined

    // If user has logged in with a provider
    if (user.accounts.length > 0) {
        if (name) {
            updates.name = name
        }
        if (image) {
            const path = `${process.cwd()}/${Date.now()}.png`
            await fs.writeFile(path, image, 'base64')
            const result = await cloudinary.uploader.upload(path)
            imageUrl = result.secure_url
            await fs.unlink(path)
            updates.image = imageUrl
        }
    }
    // If user has not logged in with a provider, then password is required for updates
    else {
        if (password?.oldPassword) {
            const isCorrectPassword = await bcrypt.compare(
                password.oldPassword,
                user.hashedPassword
            )
            if (!isCorrectPassword) {
                return NextResponse.json('Old password does not match')
            }

            // If the new password is provided, hash it and add to updates.
            if (password.newPassword) {
                const hashedPassword = await bcrypt.hash(
                    password.newPassword,
                    12
                )
                updates.hashedPassword = hashedPassword
            }
        } else if (password?.newPassword) {
            // If only the new password is provided without the old one, return an error.
            return NextResponse.json('Old password must be provided')
        }

        if (name) {
            updates.name = name
        }

        if (image) {
            const path = `${process.cwd()}/${Date.now()}.png`
            await fs.writeFile(path, image, 'base64')
            const result = await cloudinary.uploader.upload(path)
            imageUrl = result.secure_url
            await fs.unlink(path)
            updates.image = imageUrl
        }
    }

    if (Object.keys(updates).length === 0) {
        return NextResponse.json('No updates provided')
    }

    await prisma.$transaction([
        prisma.user.update({
            where: { id: userId },
            data: updates,
        }),
        prisma.todo.updateMany({
            where: { userId },
            data: { userName: name },
        }),
    ])

    return NextResponse.json('user updated')
}
