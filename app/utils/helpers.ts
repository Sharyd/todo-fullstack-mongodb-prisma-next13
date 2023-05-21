import { errorToast } from './toast'
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

export const handleTodoErrorMessage = (
    statusCode: number,
    message: string,
    processMessage: 'delete' | 'update' | 'complete' | 'reorder'
) => {
    if (statusCode === 401) {
        errorToast(`You must be logged in to ${processMessage} a todo`)
    } else if (statusCode === 403) {
        errorToast(`You must be the owner of the todo to ${processMessage} it`)
    } else if (statusCode === 400) {
        errorToast('Invalid id! Must be a string type')
    } else {
        errorToast(`Something went wrong: ${message}`)
    }
}
