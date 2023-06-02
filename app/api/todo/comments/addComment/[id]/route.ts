// api/todos/[id]/comments.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '../../../../../utils/prismadb'
import getLoggedUser from '@/app/sessions/getLoggedUser'

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const todoId = params.id
    const body = await request.json()
    if (!body)
        return NextResponse.json({
            error: 'Invalid Data',
        })
    const loggedUser = await getLoggedUser()

    const newComment = await prisma.comment.create({
        data: {
            ...body,
            userId: loggedUser?.id,
            todoId,
        },
    })

    return NextResponse.json(newComment)
}
