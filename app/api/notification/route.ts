import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import getLoggedUser from '@/app/sessions/getLoggedUser'
import { NextApiResponse } from 'next/types'

const prisma = new PrismaClient()

export async function GET(request: NextRequest, response: NextApiResponse) {
    const loggedUser = await getLoggedUser()

    if (!loggedUser) {
        return NextResponse.json(
            { message: 'No user currently logged in' },
            { status: 401 }
        )
    }

    const notifications = await prisma.notification.findMany({
        where: { userId: loggedUser.id },
    })

    return NextResponse.json(notifications)
}

export async function DELETE(request: NextRequest, response: NextApiResponse) {
    if (!request.body) {
        return NextResponse.json({ message: 'No data sent' }, { status: 400 })
    }
    const body = await request.json()
    const { id } = JSON.parse(body)
    const loggedUser = await getLoggedUser()
    console.log(id)
    if (!loggedUser) {
        return NextResponse.json(
            { message: 'No user currently logged in' },
            { status: 401 }
        )
    }

    const notification = await prisma.notification.findUnique({
        where: { id: id },
    })

    if (!notification || notification.userId !== loggedUser.id) {
        return NextResponse.json(
            { message: 'Notification not found or you are not the owner' },
            { status: 404 }
        )
    }

    await prisma.notification.delete({
        where: { id: id },
    })

    return NextResponse.json({ message: 'Notification deleted successfully' })
}
