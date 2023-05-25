import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import getLoggedUser from '@/app/sessions/getLoggedUser'

const prisma = new PrismaClient()

export async function POST(request: Request) {
    const body = await request.json()
    const { userId } = body

    // Get the logged-in user
    const loggedUser = await getLoggedUser()

    // Check if logged user was found
    if (!loggedUser) {
        return NextResponse.json(
            { message: 'No user currently logged in' },
            { status: 401 }
        )
    }

    const selectedUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { permissions: true },
    })

    // Check if the selected user's permissions field includes the logged user's ID
    const hasPermission = selectedUser?.permissions?.includes(loggedUser.id)

    if (hasPermission) {
        return NextResponse.json(
            { error: 'The selected user already has permission' },
            { status: 400 }
        )
    }

    // Assuming you have a permissions field in your User model that accepts an array of userIds
    // If the permissions field does not exist, you will need to add it to your User model
    await prisma.user.update({
        where: { id: loggedUser.id },
        data: {
            permissions: {
                // Add the selected user's ID to the permissions array
                push: userId,
            },
        },
    })

    return NextResponse.json({ message: 'Permission added successfully' })
}
