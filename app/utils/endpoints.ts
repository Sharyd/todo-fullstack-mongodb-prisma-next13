import prisma from './prismadb'
import axios, { AxiosResponse } from 'axios'
import { Todo, draggedTodo } from './types'

export const sendTodos = async (todo: Todo) => {
    if (!todo) return null
    return axios.post(`http://localhost:3000/api/todos`, todo)
}

export const getTodos = async () => {
    return axios.get('http://localhost:3000/api/todos').then((res) => {
        return res.data
    })
}
export const deleteCompletedTodos = async () => {
    return axios.delete('http://localhost:3000/api/todos')
}

export const updateAllToCompletedTodos = async () => {
    return axios.put('http://localhost:3000/api/todos')
}

export const updateTodos = async (todo: Todo): Promise<AxiosResponse<Todo>> => {
    const response = await axios.put(
        `http://localhost:3000/api/todoUpdate/${todo.todoId}`,
        todo
    )
    return response.data
}

export const updateDragTodos = async (
    todo: any
): Promise<AxiosResponse<any>> => {
    const response = await axios.patch(
        `http://localhost:3000/api/todosReorder`,
        {
            todo,
        }
    )
    return response.data
}

export const completeTodos = async (
    todo: Todo
): Promise<AxiosResponse<Todo>> => {
    const { todoId } = todo

    return axios.put(`http://localhost:3000/api/todoCompleted/${todoId}`, todo)
}

export const deleteTodos = async (todo: Todo): Promise<AxiosResponse<Todo>> => {
    return axios.delete(`http://localhost:3000/api/todoDelete/${todo.todoId}`)
}
