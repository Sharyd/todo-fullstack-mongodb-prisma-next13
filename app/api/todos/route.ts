import { NextApiRequest, NextApiResponse } from 'next'

import { Todo } from '../../utils/types'
import { NextRequest, NextResponse } from 'next/server'
import prisma from '../../utils/prismadb'
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
    const todos = await prisma.todo.findMany({
        orderBy: {
            createdAt: 'desc',
        },
    })
    if (!todos) return NextResponse.json({ error: 'No todos found' })

    const loggedUser = await getLoggedUser()

    const sortedTodos = todos?.sort((a: any, b: any) => a.order! - b.order!)

    return NextResponse.json(sortedTodos)
}

export async function DELETE(request: NextRequest, response: NextResponse) {
    const todo = await prisma.todo.deleteMany({ where: { completed: true } })

    return NextResponse.json(todo)
}

export async function PUT(request: NextRequest, response: NextResponse) {
    const todo = await prisma.todo.updateMany({
        where: { completed: false },
        data: { completed: true },
    })

    return NextResponse.json(todo)
}
