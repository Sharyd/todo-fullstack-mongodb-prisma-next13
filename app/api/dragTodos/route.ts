import { NextApiRequest, NextApiResponse } from 'next'

import { NextRequest, NextResponse } from 'next/server'
import prisma from '../../utils/prismadb'
import { Todo } from '@prisma/client'

export async function PATCH(request: NextRequest, response: NextResponse) {
    const body = await request.json()
    if (!body)
        return NextResponse.json({
            error: 'Invalid Data',
        })

    const todos = body.todo.todo

    const updatedTodos = await Promise.all(
        todos.map(async (todo: Todo, index: number) => {
            return await prisma.todo.update({
                where: {
                    todoId: todo.todoId,
                },
                data: {
                    order: index,
                },
            })
        })
    )

    return NextResponse.json(updatedTodos)
}
