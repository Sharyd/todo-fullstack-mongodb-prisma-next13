import { ReactNode, useContext, useState } from 'react'
import { TodoContext } from './todoContext'
import useLocalStorage from '../hooks/useLocalStorage'
import { Todo } from '../utils/types'
import {
    activeTodos,
    isAllTodosCompleted,
    validateFilters,
} from '../utils/helpers'
import { successToast } from '../utils/toast'

interface TodoProviderProps {
    children: ReactNode
}

const TodoProvider: React.FC<TodoProviderProps> = ({ children }) => {
    const [todos, setTodos] = useLocalStorage<Todo[]>('todos', [])
    const [filter, setFilter] = useLocalStorage<string>('filter', 'all')

    const activeTodosLength = activeTodos(todos)
    const isAllCompleted = isAllTodosCompleted(todos)

    const addTodo = async (todo: Todo) => {
        setTodos([...todos, todo])
        successToast(`${todo.title} succesfully added`)
    }

    const removeTodo = async (todoId: string) => {
        setTodos(todos.filter((todo) => todo.todoId !== todoId))
        successToast(`Succesfully removed`)
    }

    const completeTodo = (id: string) => {
        setTodos(
            todos.map((todo) =>
                todo.todoId === id
                    ? { ...todo, completed: !todo.completed }
                    : todo
            )
        )
        successToast(`Succesfully completed`)
    }

    const setAllCompleted = () => {
        setTodos(todos.map((todo) => ({ ...todo, completed: !isAllCompleted })))
        successToast(`Succesfully all completed`)
    }
    const clearCompleted = () => {
        setTodos(todos.filter((todo) => !todo.completed))
        successToast(`Succesfully clear completed`)
    }

    const updateTodo = (id: string, title: string) => {
        setTodos(
            todos.map((todo) =>
                todo.todoId === id ? { ...todo, title: title } : todo
            )
        )
        successToast(`Succesfully updated`)
    }

    const filteredTodos = todos.filter((todo) => {
        return validateFilters(filter, todo.completed)
    })

    return (
        <TodoContext.Provider
            value={{
                todos: filteredTodos,
                addTodo,
                removeTodo,
                completeTodo,
                filter,
                setFilter,
                clearCompleted,
                activeTodos: activeTodosLength,
                setAllCompleted,
                isAllCompleted,
                setTodos,
                updateTodo,
            }}
        >
            {children}
        </TodoContext.Provider>
    )
}

const useTodoContext = () => useContext(TodoContext)

export { TodoProvider, useTodoContext }
