import { NextRequest, NextResponse } from 'next/server'
import prisma from '../../../utils/prismadb'
import getLoggedUser from '@/app/sessions/getLoggedUser'

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
        // Fetch the user to check if they have permission to delete the todo
        const user = await prisma.user.findUnique({
            where: { id: loggedUser.id },
            select: { permissions: true },
        })

        // Check if the user has permission to delete the todo
        const hasPermission = user?.permissions?.includes(userId)

        if (!hasPermission && loggedUser.id !== userId) {
            return NextResponse.json(
                { error: 'You do not have permission to delete this todo' },
                { status: 403 }
            )
        }
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
