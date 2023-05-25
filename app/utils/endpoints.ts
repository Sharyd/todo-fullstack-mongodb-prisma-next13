import axios, { AxiosError, AxiosResponse } from 'axios'
import { Todo } from './types'

const API_BASE_URL = 'http://localhost:3000/api'

const createTodoApiUrl = (path: string) => `${API_BASE_URL}/${path}`

const handleRequest = async <T>(request: Promise<AxiosResponse<T>>) => {
    try {
        const response = await request
        return response.data
    } catch (error: any) {
        const errorMessage =
            error.response?.data?.message || 'An error occurred'
        const errorStatus = error.response?.status || 500
        const errorWithStatus = new Error(errorMessage) as AxiosError
        errorWithStatus.status = errorStatus
        throw errorWithStatus
    }
}

// Todos
export const sendTodos = async (todo: Todo) => {
    if (!todo) return null
    const url = createTodoApiUrl('todos')
    return handleRequest(axios.post(url, todo))
}

export const getTodos = async () => {
    const url = createTodoApiUrl('todos')
    return handleRequest(axios.get(url))
}

export const deleteCompletedTodos = async () => {
    const url = createTodoApiUrl('todos')
    return handleRequest(axios.delete(url))
}

export const updateAllToCompletedTodos = async () => {
    const url = createTodoApiUrl('todos')
    return handleRequest(axios.put(url))
}

export const updateTodos = async (todo: Todo): Promise<AxiosResponse<Todo>> => {
    const url = createTodoApiUrl(`todoUpdate/${todo.id}`)
    return handleRequest(axios.put(url, todo))
}

export const updateDragTodos = async (
    todo: any
): Promise<AxiosResponse<any>> => {
    const url = createTodoApiUrl('todosReorder')
    return handleRequest(axios.patch(url, { todo }))
}

export const completeTodos = async (
    todo: Todo
): Promise<AxiosResponse<Todo>> => {
    const url = createTodoApiUrl(`todoCompleted/${todo.todoId}`)
    return handleRequest(axios.put(url, todo))
}

export const deleteTodos = async (todo: Todo): Promise<AxiosResponse<Todo>> => {
    const url = createTodoApiUrl(
        `todoDelete/${JSON.stringify({ id: todo.id, userId: todo.userId })}`
    )

    return handleRequest(axios.delete(url))
}

// user
export const getUsers = async () => {
    const url = createTodoApiUrl('getUsers')
    return handleRequest(axios.get(url))
}
