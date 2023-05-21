import { NextRequest, NextResponse } from 'next/server'
import prisma from '../../../utils/prismadb'
import { NextApiRequest } from 'next'
import { get } from 'http'
import getLoggedUser from '@/app/sessions/getLoggedUser'
import { Todo } from '@prisma/client'

export async function DELETE(
    request: NextRequest,
    {
        params,
    }: {
        params: { todo: string }
    }
) {
    const {
        id,
        userId,
    }: {
        id: string
        userId: string
    } = JSON.parse(params.todo)

    const loggedUser = await getLoggedUser()

    if (!loggedUser) {
        return NextResponse.json(
            { error: 'You must be logged in to delete a todo' },
            { status: 401 }
        )
    }

    if (loggedUser.id !== userId) {
        return NextResponse.json(
            { error: 'You must be the owner of the todo to delete it' },
            { status: 403 }
        )
    }

    if (typeof id !== 'string' || !id) {
        return NextResponse.json(
            { error: 'Invalid todoID! must be a string type' },
            { status: 400 }
        )
    }
    const todo = await prisma.todo.deleteMany({
        where: { userId: userId, id: id },
    })

    return NextResponse.json(todo, { status: 200 })
}
