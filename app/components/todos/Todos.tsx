'use client'
import update from 'immutability-helper'
import React, { useCallback, useEffect, useState } from 'react'
import Container from '../ui/Container'
import Heading from '../ui/Heading'
import ThemeToggler from '../themes/ThemesToggler'
import CreateTodo from './CreateTodo'
import Todo, { DragItem } from './Todo'
import Card from '../ui/Card'
import Actions from './Actions'
import { useTodoContext } from '@/app/store/todoContextProvider'
import ActionsMobile from './ActionsMobile'
import { getTodos, updateDragTodos } from '@/app/utils/endpoints'

import { useMutation, useQuery, useQueryClient } from 'react-query'
import { Todo as TodoType, userType } from '../../utils/types'
import Loader from '../ui/Loader'
import {
    activeTodos,
    isAllTodosCompleted,
    validateFilters,
} from '@/app/utils/helpers'

interface Props {
    isFullstackWay: boolean
    setIsFullstackWay: React.Dispatch<React.SetStateAction<boolean>>
}

const Todos = ({ isFullstackWay, setIsFullstackWay }: Props) => {
    const { todos, filter, setTodos } = useTodoContext()
    const [dbFilters, setDbFilters] = useState('all')
    const [selected, setSelected] = useState<userType>({ name: 'Select User' })

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
        }

        window.addEventListener('beforeunload', cleanup)

        return () => {
            window.removeEventListener('beforeunload', cleanup)
        }
    }, [dragTodosdb, todos, isFullstackWay, updateDragTodoMutation])

    useEffect(() => {
        if (isFullstackWay) {
            setDragTodosdb(filteredDbTodos)
        }
    }, [filteredDbTodos, isFullstackWay])

    const activeTodosDbLength = activeTodos(dbtodos ?? [])
    const isAllCompletedDb = isAllTodosCompleted(dbtodos ?? [])

    const moveTodo = useCallback(
        (dragIndex: number, hoverIndex: number) => {
            ;(isFullstackWay ? setDragTodosdb : setTodos)(
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

    const filterDBTodosBySelectedUser = dragTodosdb?.filter((todo) => {
        return todo.userId === selected.id
    })

    return (
        <Container>
            <div className="flex flex-col py-32 w-[400px] z-20 sm:w-[600px]  ">
                <div className="flex relative flex-col gap-10">
                    <div className="flex flex-col-reverse justify-center gap-4">
                        {/* {isFullstackWay && usersWithPermissions && (
                            <div className="md:absolute -top-2 right-16 w-40 z-30">
                                <SelectUser
                                    absolute={'absolute'}
                                    data={usersWithPermissions}
                                    isError={isError}
                                    isLoading={isLoadingUsers}
                                    selected={selected}
                                    setSelected={setSelected}
                                />
                            </div>
                        )} */}
                        <div className="flex h-full justify-between items-start">
                            <Heading>Todo</Heading>
                            <ThemeToggler />
                        </div>
                    </div>

                    <p className="text-white ">
                        If u want too see todos of a specific user, click on the
                        user plus icon and send a permission to the user
                    </p>

                    <CreateTodo
                        isAllCompletedDb={isAllCompletedDb}
                        isFullstackWay={isFullstackWay}
                    />
                    <div className="flex gap-4 flex-col sm:gap-0">
                        <Card>
                            <>
                                {(isFullstackWay
                                    ? selected.id
                                        ? filterDBTodosBySelectedUser
                                        : dragTodosdb
                                    : todos
                                )?.map((todo: TodoType, idx: number) => (
                                    <Todo
                                        key={todo.todoId}
                                        todo={todo}
                                        index={idx}
                                        isFullstackWay={isFullstackWay}
                                        moveTodo={moveTodo}
                                    />
                                ))}
                            </>

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
