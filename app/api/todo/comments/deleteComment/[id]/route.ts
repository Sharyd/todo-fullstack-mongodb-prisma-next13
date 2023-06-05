// api/comments/[id].ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '../../../../../utils/prismadb'
import getLoggedUser from '@/app/sessions/getLoggedUser'

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const commentId = params.id

    const loggedUser = await getLoggedUser()

    if (!loggedUser) {
        return NextResponse.json(
            { error: 'You must be logged in to delete a comment' },
            { status: 401 }
        )
    }

    const comment = await prisma.comment.findUnique({
        where: { id: commentId },
        select: { userId: true },
    })

    if (!comment || loggedUser.id !== comment.userId) {
        return NextResponse.json(
            { error: 'You do not have permission to delete this comment' },
            { status: 403 }
        )
    }

    await deleteCommentWithChildren(commentId)

    return NextResponse.json(
        { message: 'Comment and replies deleted successfully' },
        { status: 200 }
    )
}

async function deleteCommentWithChildren(commentId: string) {
    const childComments = await prisma.comment.findMany({
        where: { parentId: commentId },
    })

    for (let comment of childComments) {
        await deleteCommentWithChildren(comment.id)
    }

    await prisma.comment.delete({ where: { id: commentId } })
}
