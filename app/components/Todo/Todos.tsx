'use client'
import update from 'immutability-helper'
import React, { Suspense, use, useCallback, useEffect, useState } from 'react'
import Container from '../Container'
import Heading from '../ui/Heading'
import ThemeToggler from '../ThemeToggler'
import CreateTodo from './CreateTodo'
import Todo, { DragItem } from './Todo'
import Card from '../ui/Card'
import Actions from './Actions'
import { useTodoContext } from '@/app/store/todoContextProvider'
import ActionsMobile from './ActionsMobile'
import { getTodos, updateDragTodos, updateTodos } from '@/app/utils/endpoints'

import { useMutation, useQuery, useQueryClient } from 'react-query'
import { Todo as TodoType } from '../../utils/types'
import Loader from '../ui/Loader'
import { PuffLoader } from 'react-spinners'
import {
    activeTodos,
    isAllTodosCompleted,
    validateFilters,
} from '@/app/utils/helpers'
import useTodoMutation from '@/app/hooks/useTodoMutation'
import useTodosMutation from '@/app/hooks/useTodosMutation'
import useLocalStorage from '@/app/hooks/useLocalStorage'
import axios from 'axios'

interface Props {
    isFullstackWay: boolean
    setIsFullstackWay: React.Dispatch<React.SetStateAction<boolean>>
}

const Todos = ({ isFullstackWay, setIsFullstackWay }: Props) => {
    const { todos, filter, setTodos } = useTodoContext()
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

    const [dragTodosdb, setDragTodosdb] = useState<TodoType[]>(
        filteredDbTodos ?? []
    )
    const [dragTodos, setDragTodos] = useState<TodoType[]>(todos ?? [])
    const queryClient = useQueryClient()

    const updateDragTodoMutation = useMutation(updateDragTodos, {
        onSuccess: () => {
            queryClient.invalidateQueries('todos')
        },
    })

    useEffect(() => {
        let cleanup: any
        if (isFullstackWay) {
            cleanup = () => {
                // Update the todo orders in the database
                updateDragTodoMutation.mutate({
                    todo: dragTodosdb,
                })
            }
        } else {
            cleanup = () => {
                setTodos(dragTodos)
            }
        }

        window.addEventListener('beforeunload', cleanup)

        return () => {
            window.removeEventListener('beforeunload', cleanup)
        }
    }, [dragTodosdb, dragTodos, isFullstackWay, updateDragTodoMutation])

    useEffect(() => {
        if (isFullstackWay) {
            setDragTodosdb(filteredDbTodos)
        }
    }, [filteredDbTodos, isFullstackWay])

    const activeTodosDbLength = activeTodos(dbtodos ?? [])
    const isAllCompletedDb = isAllTodosCompleted(dbtodos ?? [])

    const moveTodo = useCallback(
        (dragIndex: number, hoverIndex: number) => {
            ;(isFullstackWay ? setDragTodosdb : setDragTodos)(
                (prevCards: TodoType[] | undefined) =>
                    update(prevCards as TodoType[], {
                        $splice: [
                            [dragIndex, 1],
                            [hoverIndex, 0, prevCards?.[dragIndex] as TodoType],
                        ],
                    })
            )
        },
        [isFullstackWay]
    )

    return (
        <Container>
            <div className="flex flex-col py-32 w-[400px] z-20 sm:w-[550px]  ">
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
                            {(isFullstackWay ? dragTodosdb : dragTodos)?.map(
                                (todo: TodoType, idx: number) => (
                                    <Todo
                                        key={todo.todoId}
                                        todo={todo}
                                        index={idx}
                                        isFullstackWay={isFullstackWay}
                                        moveTodo={moveTodo}
                                    />
                                )
                            )}
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

export default Todos
