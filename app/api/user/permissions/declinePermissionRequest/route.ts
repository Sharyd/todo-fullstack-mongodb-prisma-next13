import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import getLoggedUser from '@/app/sessions/getLoggedUser'

const prisma = new PrismaClient()

export async function POST(request: Request) {
    const body = await request.json()
    const { requestId } = body
    // Get the logged-in user
    const loggedUser = await getLoggedUser()

    // Check if logged user was found
    if (!loggedUser) {
        return NextResponse.json(
            { message: 'No user currently logged in' },
            { status: 401 }
        )
    }

    // Decline the permission request
    await prisma.permissionRequest.delete({
        where: { id: requestId },
    })
    // or but user dont have a chance send it again from both side better is just delete it
    // await prisma.permissionRequest.update({
    //     where: { id: requestId },
    //     data: { status: 'Accepted' },
    // })

    return NextResponse.json({
        message: 'Permission request declined successfully',
    })
}
