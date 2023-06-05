import { NextRequest, NextResponse } from 'next/server'
import prisma from '../../../../../utils/prismadb'

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const todoId = params.id

    try {
        const comments = await prisma.comment.findMany({
            where: { todoId },
            include: {
                replies: true,
                likes: true,
            },
        })

        return NextResponse.json(comments)
    } catch (error) {
        console.error(error)
        return NextResponse.json(
            { error: 'An error occurred while fetching the comments' },
            { status: 500 }
        )
    }
}
