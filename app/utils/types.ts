export interface Todo {
    createdAt?: string
    updatedAt?: string
    userId?: string
    id: string
    todoId: string
    userName?: string | null | undefined
    title: string | undefined
    completed: boolean
    order?: number | undefined | null
}

export interface draggedTodo {
    todoId: string
    index: number
}

export interface loggedUserType {
    name?: string | null | undefined
    email?: string | null | undefined
    image?: string | null | undefined
    userId?: string | null | undefined
}

export const ItemTypes = {
    TODO: 'todo',
}
