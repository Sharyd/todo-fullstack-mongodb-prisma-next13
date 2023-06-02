import { NextRequest, NextResponse } from 'next/server'
import prisma from '../../../../../utils/prismadb'

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const todoId = params.id

    const comments = await prisma.comment.findMany({
        where: { todoId },
        include: {
            replies: true,
        },
    })

    return NextResponse.json(comments)
}
