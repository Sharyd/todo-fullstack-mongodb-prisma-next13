import { NextRequest, NextResponse } from 'next/server'
import prisma from '../../../../utils/prismadb'
import { NextApiRequest } from 'next'
import getLoggedUser from '@/app/sessions/getLoggedUser'
import { Todo } from '@prisma/client'

export async function PUT(
    request: NextRequest,
    {
        params,
    }: {
        params: { id: string }
    }
) {
    const id = params.id
    const body = await request.json()

    const loggedUser = await getLoggedUser()

    if (!loggedUser) {
        return NextResponse.json(
            { error: 'You must be logged in to update a todo' },
            { status: 401 }
        )
    }

    if (loggedUser.id !== body.userId) {
        // Fetch the user to check if they have permission to update the todo
        const user = await prisma.user.findUnique({
            where: { id: loggedUser.id },
            select: { permissionsActions: true },
        })

        // Check if the user has permission to update the todo
        const hasPermission = user?.permissionsActions?.includes(body.userId)
        if (!hasPermission) {
            return NextResponse.json(
                { error: 'You do not have permission to update this todo' },
                { status: 403 }
            )
        }
    }
    if (body.title === '' || body.title === undefined) {
        return NextResponse.json(
            { error: 'Your todos must not be empty' },
            { status: 403 }
        )
    }

    if (typeof id !== 'string' || !id) {
        return NextResponse.json(
            { error: 'Invalid todoID! It must be a string type' },
            { status: 400 }
        )
    }

    try {
        const todo = await prisma.todo.updateMany({
            where: {
                id: id,
                userId: body.userId,
            },
            data: {
                title: body.title, // Update only the title field
            },
        })

        return NextResponse.json(todo, { status: 200 })
    } catch (error) {
        console.error(error)
        return NextResponse.json(
            { error: 'Failed to update the todo' },
            { status: 500 }
        )
    }
}
