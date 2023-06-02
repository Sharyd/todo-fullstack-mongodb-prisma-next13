// api/comments/[id].ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '../../../../../utils/prismadb'
import getLoggedUser from '@/app/sessions/getLoggedUser'

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const commentId = params.id
    const body = await request.json()

    const loggedUser = await getLoggedUser()

    if (!loggedUser) {
        return NextResponse.json(
            { error: 'You must be logged in to update a comment' },
            { status: 401 }
        )
    }

    const comment = await prisma.comment.findUnique({
        where: { id: commentId },
        select: { userId: true },
    })

    if (!comment || loggedUser.id !== comment.userId) {
        return NextResponse.json(
            { error: 'You do not have permission to update this comment' },
            { status: 403 }
        )
    }

    if (body.content === '' || body.content === undefined) {
        return NextResponse.json(
            { error: 'Your comment must not be empty' },
            { status: 403 }
        )
    }

    try {
        const updatedComment = await prisma.comment.update({
            where: {
                id: commentId,
            },
            data: {
                content: body.content, // Update only the content field
            },
        })

        return NextResponse.json(updatedComment, { status: 200 })
    } catch (error) {
        console.error(error)
        return NextResponse.json(
            { error: 'Failed to update the comment' },
            { status: 500 }
        )
    }
}
