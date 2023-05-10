import { NextRequest, NextResponse } from 'next/server'
import prisma from '../../../utils/prismadb'
import { NextApiRequest } from 'next'

export async function PUT(
    request: NextRequest,
    {
        params,
    }: {
        params: { todoId: string }
    }
) {
    const todoId = params.todoId
    const body = await request.json()

    if (typeof todoId !== 'string' || !todoId)
        return NextResponse.json({
            error: 'Invalid todoID! must be a string type',
        })
    const todo = await prisma.todo.update({
        where: { todoId: todoId },
        data: body,
    })

    return NextResponse.json(todo)
}
