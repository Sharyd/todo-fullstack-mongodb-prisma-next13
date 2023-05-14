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

    // const todos = await prisma.todo.findMany()
    // let order = todos.length === 0 ? 0 : todos.length

    const newTodo = await prisma.todo.create({
        data: {
            todoId: body.todoId,
            title: body.title,
            completed: body.completed,
        },
    })

    return NextResponse.json(newTodo)
}

export async function GET(request: NextRequest, response: NextApiResponse) {
    const catcher = (error: Error) => response.status(400).json({ error })
    const todos = await prisma.todo.findMany().catch(catcher)
    if (!todos) return NextResponse.json({ error: 'No todos found' })

    const mappedTodos = todos?.map((todo: Todo, index: number) => {
        return {
            todoId: todo.todoId,
            title: todo.title,
            completed: todo.completed,
            order: todo.order,
        }
    })
    const sortedTodos = mappedTodos?.sort((a, b) => a.order! - b.order!)

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
