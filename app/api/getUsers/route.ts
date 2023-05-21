import { NextApiRequest, NextApiResponse } from 'next'

import { NextRequest, NextResponse } from 'next/server'
import prisma from '../../utils/prismadb'

export async function GET(request: NextRequest, response: NextApiResponse) {
    try {
        const users = await prisma.user.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        })
        if (!users) return NextResponse.json({ error: 'No users found' })

        return NextResponse.json(users)
    } catch (error: any) {
        return NextResponse.json({ error: error.message })
    }
}
