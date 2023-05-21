import { getServerSession } from 'next-auth/next'

import { authOptions } from '@/pages/api/auth/[...nextauth]'
import prisma from '@/app/utils/prismadb'

export async function getSession() {
    return await getServerSession(authOptions)
}

export default async function getLoggedUser() {
    try {
        const session = await getSession()

        if (!session?.user?.email) {
            return null
        }

        const loggedUser = await prisma.user.findUnique({
            where: {
                email: session.user.email as string,
            },
        })

        if (!loggedUser) {
            return null
        }

        return {
            ...loggedUser,
            createdAt: loggedUser.createdAt.toISOString(),
            updatedAt: loggedUser.updatedAt.toISOString(),
            emailVerified: loggedUser.emailVerified?.toISOString() || null,
        }
    } catch (error: unknown) {
        return null
    }
}
