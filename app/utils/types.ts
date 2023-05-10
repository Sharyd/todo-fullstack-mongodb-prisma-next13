export interface Todo {
    todoId: string
    title: string | undefined
    completed: boolean
}

export const ItemTypes = {
    TODO: 'todo',
}
