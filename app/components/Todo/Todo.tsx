'use client'
import update from 'immutability-helper'
import React, { Suspense, use, useCallback, useEffect, useState } from 'react'
import Container from '../Container'
import Heading from '../Heading'
import ThemeToggler from '../ThemeToggler'
import CreateTodo from './CreateTodo'
import Todos, { DragItem } from './Todos'
import Card from '../Card'
import Actions from './Actions'
import { useTodoContext } from '@/app/store/todoContextProvider'
import ActionsMobile from './ActionsMobile'
import { getTodos, updateDragTodos, updateTodos } from '@/app/utils/endpoints'

import { useMutation, useQuery, useQueryClient } from 'react-query'
import { Todo as TodoType } from '../../utils/types'
import Loader from '../Loader'
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

    const [dragTodosdb, setDragTodosdb] = useState<TodoType[]>(
        filteredDbTodos ?? []
    )
    // const [sortedTodos, setSortedTodos] = useState<TodoType[]>(dragTodosdb)

    const [order, setOrder] = useState(dbtodos?.map((item, index) => index))
    const queryClient = useQueryClient()
    console.log(filteredDbTodos)
    useEffect(() => {
        const cleanup = () => {
            // Update the todo orders in the database
            updateDragTodoMutation.mutate({
                todo: dragTodosdb,
            })
        }

        window.addEventListener('beforeunload', cleanup)

        return () => {
            window.removeEventListener('beforeunload', cleanup)
        }
    }, [dragTodosdb])
    // const sortedTodos = useCallback<any>(
    //     dragTodosdb?.sort((a: any, b: any) => a.order - b.order),
    //     []
    // )
    // console.log(sortedTodos)
    console.log(dragTodosdb)
    const updateDragTodoMutation = useMutation(updateDragTodos, {
        onSuccess: () => {
            queryClient.invalidateQueries('todos')
        },
    })
    // console.log(sortedTodos)
    useEffect(() => {
        if (isFullstackWay) {
            setDragTodosdb(filteredDbTodos)
        }
    }, [filteredDbTodos, isFullstackWay])
    const handleDrop = (item: DragItem, monitor: any) => {
        const dragIndex = monitor.getItem().index
        const dropIndex = order?.indexOf(dragIndex)
        const newOrder = [...(order || [])]
        newOrder.splice(dragIndex, 1)
        newOrder.splice(dropIndex!, 0, dragIndex)
        setOrder(newOrder)

        // updateDragTodoMutation.mutate({
        //     todo: item,
        // })
    }
    // useEffect(() => {
    //     setDragTodosdb(sortedTodos)
    // }, [])
    // useEffect(() => {
    //     if (!isFullstackWay) {
    //         setDragTodos(todos)
    //         localStorage.setItem('draggedTodos', JSON.stringify(todos))
    //     }
    // }, [todos, isFullstackWay])

    const activeTodosDbLength = activeTodos(dbtodos ?? [])
    const isAllCompletedDb = isAllTodosCompleted(dbtodos ?? [])

    const moveTodo = useCallback((dragIndex: number, hoverIndex: number) => {
        setDragTodosdb((prevCards: TodoType[] | undefined) =>
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
                            {dragTodosdb?.map((todo: TodoType, idx: number) => (
                                <Todos
                                    handleDrop={handleDrop}
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
