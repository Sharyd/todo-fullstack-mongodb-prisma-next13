import { NextRequest, NextResponse } from 'next/server'
import prisma from '../../../utils/prismadb'

export async function GET(
    request: NextRequest,
    {
        params,
    }: {
        params: { userId: string }
    }
) {
    const { userId } = params

    const user = await prisma.user.findUnique({
        where: { id: userId },
    })

    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(user, { status: 200 })
}
