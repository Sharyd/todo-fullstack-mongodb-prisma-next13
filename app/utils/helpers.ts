import { Todo } from './types'

export const validateFilters = (filters: string, completed: boolean) => {
    if (filters === 'active') {
        return !completed
    } else if (filters === 'completed') {
        return completed
    } else {
        return true
    }
}

export const activeTodos = (todos: Todo[]) => {
    return todos.filter((todo) => !todo.completed).length
}
export const isAllTodosCompleted = (todos: Todo[]) => {
    return todos.every((todo) => todo.completed)
}
