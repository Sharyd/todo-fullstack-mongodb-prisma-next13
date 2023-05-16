import React, { createContext } from 'react'
import { Todo } from '../utils/types'

export interface TodoContextType {
    todos: Todo[]
    addTodo: (todo: Todo) => void
    removeTodo: (id: string) => void
    completeTodo: (id: string) => void
    filter: string
    setFilter: (filter: string) => void
    clearCompleted: () => void
    setAllCompleted: () => void
    activeTodos: number
    isAllCompleted: boolean
    updateTodo: (id: string, title: string) => void
    setTodos: React.Dispatch<React.SetStateAction<Todo[]>>
}

export const defaultTodoContext: TodoContextType = {
    todos: [],
    addTodo: () => {},
    removeTodo: () => {},
    completeTodo: () => {},
    filter: 'all',
    setFilter: () => {},
    clearCompleted: () => {},
    setAllCompleted: () => {},
    activeTodos: 0,
    isAllCompleted: false,
    updateTodo: () => {},
    setTodos: () => {},
}

export const TodoContext = createContext<TodoContextType>(defaultTodoContext)
