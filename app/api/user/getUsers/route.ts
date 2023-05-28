import { NextApiRequest, NextApiResponse } from 'next'

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/app/utils/prismadb'
import { userType } from '@/app/utils/types'

export async function GET(request: NextRequest, response: NextApiResponse) {
    try {
        const users = await prisma.user.findMany({
            orderBy: {
                createdAt: 'desc',
            },
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

        if (!users) return NextResponse.json({ error: 'No users found' })

        return NextResponse.json(mappedUsers)
    } catch (error: any) {
        return NextResponse.json({ error: error.message })
    }
}
