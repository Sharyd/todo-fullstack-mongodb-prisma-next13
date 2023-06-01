import { NextApiRequest, NextApiResponse } from 'next'

import { Todo } from '../../../utils/types'
import { NextRequest, NextResponse } from 'next/server'
import prisma from '../../../utils/prismadb'
import getLoggedUser from '@/app/sessions/getLoggedUser'

export async function POST(request: NextRequest, response: NextApiResponse) {
    const body = await request.json()
    if (!body)
        return NextResponse.json({
            error: 'Invalid Data',
        })
    const loggedUser = await getLoggedUser()

    const newTodo = await prisma.todo.create({
        data: {
            ...body,
            userName: loggedUser?.name,
            userId: loggedUser?.id,
        },
    })

    return NextResponse.json(newTodo)
}

export async function GET(request: NextRequest, response: NextApiResponse) {
    const loggedUser = await getLoggedUser()
    const loggedUserId = loggedUser?.id

    const todos = await prisma.todo.findMany({
        where: {
            OR: [
                {
                    userId: loggedUserId,
                },
                {
                    userId: {
                        in: await prisma.permissionRequest
                            .findMany({
                                where: {
                                    AND: [
                                        {
                                            fromUserId: loggedUserId,
                                        },
                                        {
                                            status: 'Accepted',
                                        },
                                    ],
                                },
                                select: {
                                    toUserId: true,
                                },
                            })
                            .then((res) =>
                                res.map((request) => request.toUserId)
                            ),
                    },
                },
                {
                    userId: {
                        in: await prisma.permissionRequest
                            .findMany({
                                where: {
                                    AND: [
                                        {
                                            toUserId: loggedUserId,
                                        },
                                        {
                                            status: 'Accepted',
                                        },
                                    ],
                                },
                                select: {
                                    fromUserId: true,
                                },
                            })
                            .then((res) =>
                                res.map((request) => request.fromUserId)
                            ),
                    },
                },
            ],
        },
    })

    if (!todos) return NextResponse.json({ error: 'No todos found' })

    const sortedTodosLoggedUserFirst = todos?.sort((a: any, b: any) =>
        a.userId === loggedUserId ? -1 : b.userId === loggedUserId ? 1 : 0
    )

    const sortedTodos = sortedTodosLoggedUserFirst?.sort((a: any, b: any) => {
        return a.order! - b.order!
    })

    return NextResponse.json(sortedTodos)
}

export async function DELETE(request: NextRequest, response: NextResponse) {
    const loggedUser = await getLoggedUser()

    if (!loggedUser) {
        return NextResponse.json(
            {
                error: 'You must be logged in to delete your completed todos or have permissions',
            },
            { status: 401 }
        )
    }

    const user = await prisma.user.findUnique({
        where: { id: loggedUser.id },
        select: { permissionsActions: true },
    })

    // Only the todos where the user is the owner or the user has permission are selected
    const permittedTodos = await prisma.todo.findMany({
        where: {
            completed: true,
            OR: [
                { userId: loggedUser.id },
                { userId: { in: user?.permissionsActions || [] } },
            ],
        },
    })

    if (!permittedTodos.length) {
        return NextResponse.json(
            {
                error: 'No todos to delete. You dont have completed todo or do not have permissions',
            },
            { status: 404 }
        )
    }

    // Delete the selected todos
    const deleteCount = await prisma.todo.deleteMany({
        where: {
            id: { in: permittedTodos.map((todo) => todo.id) },
        },
    })

    return NextResponse.json(deleteCount)
}
export async function PUT(request: NextRequest, response: NextResponse) {
    const loggedUser = await getLoggedUser()

    if (!loggedUser) {
        return NextResponse.json(
            {
                error: 'You must be logged in to completed your todos or have permissions',
            },
            { status: 401 }
        )
    }

    const user = await prisma.user.findUnique({
        where: { id: loggedUser.id },
        select: { permissionsActions: true },
    })

    // Get the todos that the user is the owner of or has permission to update
    const todos = await prisma.todo.findMany({
        where: {
            OR: [
                { userId: loggedUser.id },
                { userId: { in: user?.permissionsActions || [] } },
            ],
        },
    })

    // If no todos were found, send an appropriate response
    if (!todos.length) {
        return NextResponse.json(
            {
                error: 'No todos to completed. You dont have completed todo, or no granted permissions were added',
            },
            { status: 404 }
        )
    }

    // Update the todos
    const updateCount = await prisma.todo.updateMany({
        where: {
            id: { in: todos.map((todo) => todo.id) },
        },
        data: { completed: true },
    })

    return NextResponse.json(updateCount)
}
