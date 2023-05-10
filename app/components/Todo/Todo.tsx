'use client'
import update from 'immutability-helper'
import React, { Suspense, useCallback, useEffect, useState } from 'react'
import Container from '../Container'
import Heading from '../Heading'
import ThemeToggler from '../ThemeToggler'
import CreateTodo from './CreateTodo'
import Todos from './Todos'
import Card from '../Card'
import Actions from './Actions'
import { useTodoContext } from '@/app/store/todoContextProvider'
import ActionsMobile from './ActionsMobile'
import { getTodos } from '@/app/utils/endpoints'

import { useQuery } from 'react-query'
import { Todo as TodoType } from '../../utils/types'
import Loader from '../Loader'
import { PuffLoader } from 'react-spinners'
import {
    activeTodos,
    isAllTodosCompleted,
    validateFilters,
} from '@/app/utils/helpers'

interface Props {
    isFullstackWay: boolean
    setIsFullstackWay: React.Dispatch<React.SetStateAction<boolean>>
}

const Todo = ({ isFullstackWay, setIsFullstackWay }: Props) => {
    const { todos, filter } = useTodoContext()
    const [dbFilters, setDbFilters] = useState('all')
    const {
        data: dbtodos,
        isLoading,
        isFetching,
    } = useQuery<TodoType[]>('todos', getTodos)
    const filteredDbTodos = useCallback<any>(
        dbtodos?.filter((todo) => {
            return validateFilters(dbFilters, todo.completed)
        }),
        [dbFilters, dbtodos] as const
    )
    const [dragTodos, setDragTodos] = useState(filteredDbTodos)

    useEffect(() => {
        if (isFullstackWay) {
            setDragTodos(filteredDbTodos)
        }
    }, [filteredDbTodos, isFullstackWay])

    useEffect(() => {
        if (!isFullstackWay) {
            setDragTodos(todos)
        }
    }, [todos, isFullstackWay])

    const activeTodosDbLength = activeTodos(dbtodos ?? [])
    const isAllCompletedDb = isAllTodosCompleted(dbtodos ?? [])

    const moveTodo = useCallback((dragIndex: number, hoverIndex: number) => {
        if (!dragTodos) return

        setDragTodos((prevCards: TodoType[] | undefined) =>
            update(prevCards as TodoType[], {
                $splice: [
                    [dragIndex, 1],
                    [hoverIndex, 0, prevCards?.[dragIndex] as TodoType],
                ],
            })
        )
    }, [])

    return (
        <Container>
            <div className="flex flex-col py-32 w-[400px] z-20    sm:w-[550px] min-h-[100vh] ">
                <div className="flex flex-col gap-10">
                    <div className="flex h-full justify-between items-start">
                        <Heading>Todo</Heading>
                        <ThemeToggler />
                    </div>
                    <CreateTodo
                        isAllCompletedDb={isAllCompletedDb}
                        isFullstackWay={isFullstackWay}
                    />
                    <div className="flex gap-4 flex-col sm:gap-0">
                        <Card>
                            {dragTodos?.map((todo: TodoType, idx: number) => (
                                <Todos
                                    key={todo.todoId}
                                    todo={todo}
                                    index={idx}
                                    isFullstackWay={isFullstackWay}
                                    moveTodo={moveTodo}
                                />
                            ))}
                            {isFetching && isFullstackWay && isLoading && (
                                <div className="flex items-center justify-center">
                                    <Loader size={50} />
                                </div>
                            )}
                            <Actions
                                isFullstackWay={isFullstackWay}
                                dbFilters={dbFilters}
                                setDbFilters={setDbFilters}
                                activeTodosDbLength={activeTodosDbLength}
                            />
                        </Card>

                        <div className="sm:hidden">
                            <Card>
                                <ActionsMobile />
                            </Card>
                        </div>
                    </div>

                    <p className="text-center text-xs font-semibold text-darkGrayishBlue">
                        Drag and drop to reorder list
                    </p>
                </div>
            </div>
        </Container>
    )
}

export default Todo
