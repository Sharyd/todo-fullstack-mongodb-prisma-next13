import { NextRequest, NextResponse } from 'next/server'
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
    if (loggedUser.id === userId) {
        return NextResponse.json(
            { error: 'You cannot add permission to yourself' },
            { status: 400 }
        )
    }

    // Check for previous permission requests
    const existingPermissionRequest = await prisma.permissionRequest.findUnique(
        {
            where: {
                fromUserId_toUserId: {
                    fromUserId: loggedUser.id,
                    toUserId: userId,
                },
            },
        }
    )

    if (existingPermissionRequest) {
        return NextResponse.json(
            { error: 'You already sent a permission request to this user' },
            { status: 400 }
        )
    }

    // Add the permission request
    await prisma.permissionRequest.create({
        data: {
            fromUserId: loggedUser.id,
            toUserId: userId,
        },
    })

    return NextResponse.json({
        message: 'Permission request sent successfully',
    })
}
export async function GET(request: NextRequest, response: NextResponse) {
    const loggedUser = await getLoggedUser()

    // If the user isn't logged in, we can't get their requests
    if (!loggedUser) {
        return NextResponse.json(
            { message: 'You must be logged in to get permission requests' },
            { status: 401 }
        )
    }

    // Get all permission requests for the logged-in user
    const permissionRequests = await prisma.permissionRequest.findMany({
        where: { toUserId: loggedUser.id },
    })
    console.log(permissionRequests)

    // Send the permission requests back to the client
    return NextResponse.json(permissionRequests)
}
