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

    const deletedComment = await prisma.comment.delete({
        where: { id: commentId },
    })

    return NextResponse.json(deletedComment, { status: 200 })
}
