import axios, { AxiosError, AxiosResponse } from 'axios'
import { Todo } from './types'
import { Comment } from './types'

const API_BASE_URL = 'http://localhost:3000/api'

const createTodoApiUrl = (path: string) => `${API_BASE_URL}/${path}`

const handleRequest = async <T>(request: Promise<AxiosResponse<T>>) => {
    try {
        const response = await request
        return response.data
    } catch (error: any) {
        const errorMessage = error.response?.data?.error || 'An error occurred'
        const errorStatus = error.response?.status || 500
        const errorWithStatus = new Error(errorMessage) as AxiosError
        errorWithStatus.status = errorStatus
        throw errorWithStatus
    }
}

// Todos
export const sendTodos = async (todo: Todo) => {
    if (!todo) return null
    const url = createTodoApiUrl('todo/todos')
    return handleRequest(axios.post(url, todo))
}

export const getTodos = async () => {
    const url = createTodoApiUrl('todo/todos')
    return handleRequest(axios.get(url))
}

export const deleteCompletedTodos = async () => {
    const url = createTodoApiUrl('todo/todos')
    return handleRequest(axios.delete(url))
}

export const updateAllToCompletedTodos = async () => {
    const url = createTodoApiUrl('todo/todos')
    return handleRequest(axios.put(url))
}

export const updateTodos = async (todo: Todo): Promise<AxiosResponse<Todo>> => {
    const url = createTodoApiUrl(`todo/todoUpdate/${todo.id}`)
    return handleRequest(axios.put(url, todo))
}

export const updateDragTodos = async (
    todo: any
): Promise<AxiosResponse<any>> => {
    const url = createTodoApiUrl('todo/todosReorder')
    return handleRequest(axios.patch(url, { todo }))
}

export const completeTodos = async (
    todo: Todo
): Promise<AxiosResponse<Todo>> => {
    const url = createTodoApiUrl(`todo/todoCompleted/${todo.id}`)
    return handleRequest(axios.put(url, todo))
}

export const deleteTodos = async (todo: Todo): Promise<AxiosResponse<Todo>> => {
    const url = createTodoApiUrl(
        `todo/todoDelete/${JSON.stringify({
            id: todo.id,
            userId: todo.userId,
        })}`
    )

    return handleRequest(axios.delete(url))
}

// user
export const getUsers = async () => {
    const url = createTodoApiUrl('user/getUsers')
    return handleRequest(axios.get(url))
}
export const getUsersWithPermissionsToView = async () => {
    const url = createTodoApiUrl('user/getUsersPermission')
    return handleRequest(axios.get(url))
}
export const getUser = async (userId: string) => {
    const url = createTodoApiUrl('user/getUser' + userId)
    return handleRequest(axios.get(url))
}

interface UserUpdates {
    password?: {
        oldPassword: string
        newPassword: string
    }
    name?: string
    image?: string
}

export const editUser = async (updates: UserUpdates) => {
    const url = createTodoApiUrl('user/userEdit')
    return handleRequest(axios.patch(url, updates))
}
export const deleteProfile = async (password: string) => {
    const url = createTodoApiUrl(
        // this is for delete profile with github or google
        `user/userDelete/${password === '' ? 'delete' : password}`
    )
    return handleRequest(axios.delete(url))
}

// Permissions
export const addUserPermissionActions = async (userId: string) => {
    const url = createTodoApiUrl('user/permissions/userPermissionActions')
    return handleRequest(axios.post(url, { userId }))
}

export const removeUserPermissionActions = async (userId: string) => {
    const url = createTodoApiUrl('user/permissions/userPermissionActions')
    return handleRequest(axios.delete(url, { data: { userId } }))
}

export const AddUserPermissionToViewTodos = async (userId: string) => {
    const url = createTodoApiUrl('user/permissions/userPermissionToViewTodos')
    return handleRequest(axios.post(url, { userId }))
}
export const getUserPermissionToViewTodos = async () => {
    const url = createTodoApiUrl('user/permissions/userPermissionToViewTodos')
    return handleRequest(axios.get(url))
}

export const acceptPermissionRequest = async (requestId: string) => {
    const url = createTodoApiUrl('user/permissions/acceptPermissionRequest')
    return handleRequest(axios.post(url, { requestId }))
}

export const declinePermissionRequest = async (requestId: string) => {
    if (!requestId) throw new Error('requestId is undefined or null')
    const url = createTodoApiUrl('user/permissions/declinePermissionRequest')
    console.log(`Sending request to ${url} with requestId: ${requestId}`)
    return handleRequest(axios.post(url, { requestId }))
}

// Notification
export const getNotification = async () => {
    const url = createTodoApiUrl('notification')
    return handleRequest(axios.get(url))
}

export const deleteNotification = async (id: string) => {
    const url = createTodoApiUrl(`notification/${id}`)
    return handleRequest(axios.delete(url))
}

// Comments
export const getComments = async (id: string) => {
    const url = createTodoApiUrl(`todo/comments/getComments/${id}`) // Adjust according to your route
    return handleRequest(axios.get(url))
}

export const sendComment = async (comment: Comment, id: string) => {
    if (!comment) return null
    const url = createTodoApiUrl(`todo/comments/addComment/${id}`)
    return handleRequest(axios.post(url, comment))
}

export const deleteComment = async (id: string) => {
    const url = createTodoApiUrl(`todo/comments/deleteComment/${id}`)
    return handleRequest(axios.delete(url))
}

export const updateComment = async (comment: Comment) => {
    const url = createTodoApiUrl(`todo/comments/updateComment/${comment.id}`)
    return handleRequest(axios.put(url, comment))
}
