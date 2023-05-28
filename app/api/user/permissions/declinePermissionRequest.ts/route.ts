import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import getLoggedUser from '@/app/sessions/getLoggedUser'

const prisma = new PrismaClient()

export async function POST(request: Request) {
    const body = request.json()
    const { requestId } = body as any

    // Get the logged-in user
    const loggedUser = await getLoggedUser()

    // Check if logged user was found
    if (!loggedUser) {
        return NextResponse.json(
            { message: 'No user currently logged in' },
            { status: 401 }
        )
    }

    // Update the permission request to Declined
    await prisma.permissionRequest.update({
        where: { id: requestId },
        data: { status: 'Declined' },
    })

    return NextResponse.json({ message: 'Permission request declined' })
}
