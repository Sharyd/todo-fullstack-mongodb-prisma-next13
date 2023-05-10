import { NextRequest, NextResponse } from 'next/server'
import prisma from '../../../utils/prismadb'
import { NextApiRequest } from 'next'

export async function DELETE(
    request: NextApiRequest,
    {
        params,
    }: {
        params: { todoId: string }
    }
) {
    const todoId = params.todoId
    console.log(todoId)
    if (typeof todoId !== 'string' || !todoId)
        return NextResponse.json({
            error: 'Invalid todoID! must be a string type',
        })
    const todo = await prisma.todo.deleteMany({ where: { todoId: todoId } })

    return NextResponse.json(todo)
}
