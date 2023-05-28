import { NextApiRequest, NextApiResponse } from 'next'
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/app/utils/prismadb'
import getLoggedUser from '@/app/sessions/getLoggedUser'

export async function GET(request: NextRequest, response: NextApiResponse) {
    try {
        const loggedUser = await getLoggedUser() // Get the logged in user first

        if (!loggedUser) {
            return NextResponse.json({ error: 'User not logged in' })
        }

        const permissionUsersIds = await prisma.permissionRequest
            .findMany({
                where: {
                    AND: [
                        { fromUserId: loggedUser.id },
                        { status: 'Accepted' },
                    ],
                },
                select: { toUserId: true },
            })
            .then((permissions) =>
                permissions.map((permission) => permission.toUserId)
            )

        const users = await prisma.user.findMany({
            where: { id: { in: permissionUsersIds } },
            orderBy: { createdAt: 'desc' },
        })

        const mappedUsers = users.map((user) => {
            return {
                id: user.id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                image: user.image,
            }
        })

        if (!users || users.length === 0) {
            return NextResponse.json({ error: 'No users found' })
        }

        return NextResponse.json(mappedUsers)
    } catch (error: any) {
        return NextResponse.json({ error: error.message })
    }
}
