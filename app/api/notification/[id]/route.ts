import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import getLoggedUser from '@/app/sessions/getLoggedUser'
import { NextApiRequest, NextApiResponse } from 'next/types'

export async function DELETE(
    request: NextRequest,
    {
        params,
    }: {
        params: { id: string }
    }
) {
    const { id } = params

    const loggedUser = await getLoggedUser()

    if (!loggedUser) {
        return NextResponse.json(
            { message: 'No user currently logged in' },
            { status: 401 }
        )
    }

    const notification = await prisma?.notification.findUnique({
        where: { id: id },
    })

    if (!notification || notification.userId !== loggedUser.id) {
        return NextResponse.json(
            { message: 'Notification not found or you are not the owner' },
            { status: 404 }
        )
    }

    await prisma?.notification.delete({
        where: { id: id },
    })

    return NextResponse.json({ message: 'Notification deleted successfully' })
}
