import { NextRequest, NextResponse } from 'next/server'
import prisma from '../../../../../utils/prismadb'
import getLoggedUser from '@/app/sessions/getLoggedUser'

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const commentId = params.id

    try {
        const loggedUser = await getLoggedUser()

        if (!loggedUser) {
            return NextResponse.json(
                { error: 'You must be logged in to like/unlike a comment' },
                { status: 401 }
            )
        }

        const existingLike = await prisma.like.findUnique({
            where: {
                userId_commentId: {
                    userId: loggedUser.id,
                    commentId: commentId,
                },
            },
            include: {
                comment: true,
            },
        })

        if (existingLike) {
            await prisma.like.delete({
                where: {
                    userId_commentId: {
                        userId: loggedUser.id,
                        commentId: commentId,
                    },
                },
            })

            return NextResponse.json(
                { message: 'Successfully unliked the comment' },
                { status: 200 }
            )
        } else {
            await prisma.like.create({
                data: {
                    userId: loggedUser.id,
                    commentId: commentId,
                },
            })

            return NextResponse.json(
                { message: 'Successfully liked the comment' },
                { status: 201 }
            )
        }
    } catch (error) {
        console.error(error)
        return NextResponse.json(
            { error: 'An error occurred while managing the like' },
            { status: 500 }
        )
    }
}
