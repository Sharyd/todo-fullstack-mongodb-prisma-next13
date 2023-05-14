export interface Todo {
    todoId: string
    title: string | undefined
    completed: boolean
    order?: number | undefined | null
}

export interface draggedTodo {
    todoId: string
    index: number
}

export const ItemTypes = {
    TODO: 'todo',
}
