import { NextApiRequest, NextApiResponse } from 'next'

import { Todo } from '../../utils/types'
import { NextRequest, NextResponse } from 'next/server'
import prisma from '../../utils/prismadb'

export async function POST(request: NextRequest, response: NextApiResponse) {
    const body = await request.json()
    if (!body)
        return NextResponse.json({
            error: 'Invalid Data',
        })
    const newTodo = await prisma.todo.create({ data: body })
    console.log(newTodo)
    return NextResponse.json(newTodo)
}

export async function GET(request: NextRequest, response: NextApiResponse) {
    const catcher = (error: Error) => response.status(400).json({ error })
    const todos = await prisma.todo.findMany().catch(catcher)
    const mappedTodos = todos?.map((todo: Todo) => {
        return {
            todoId: todo.todoId,
            title: todo.title,
            completed: todo.completed,
        }
    })
    return NextResponse.json(mappedTodos)
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
