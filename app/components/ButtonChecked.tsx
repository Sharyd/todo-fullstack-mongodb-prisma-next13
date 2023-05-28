import React, { useState } from 'react'
import { useTodoContext } from '../store/todoContextProvider'
import { UseMutationResult, useQueryClient } from 'react-query'
import useTodoMutation from '../hooks/useTodoMutation'
import { completeTodos } from '../utils/endpoints'
import { Todo } from '../utils/types'
import Loader from './ui/Loader'
import { AxiosResponse } from 'axios'
import { errorToast, successToast } from '../utils/toast'
import { IoMdClose } from 'react-icons/io'
import useTodosMutation from '../hooks/useTodosMutation'
import { get } from 'http'
import getLoggedUser from '../sessions/getLoggedUser'

interface Props {
    todoId?: string | undefined
    completed?: boolean | undefined
    setAllCompleted?: () => void
    isAllCompleted?: boolean
    isfullstackWay?: boolean
    todo?: Todo
    isAllCompletedDb?: boolean
    updateAllToCompletedMutation?: UseMutationResult<
        AxiosResponse<any, any>,
        unknown,
        void,
        unknown
    >
}

const ButtonChecked = ({
    todoId,
    completed,
    setAllCompleted,
    isAllCompleted,
    isfullstackWay,
    todo,
    updateAllToCompletedMutation,
    isAllCompletedDb,
}: Props) => {
    const { completeTodo } = useTodoContext()
    const queryClient = useQueryClient()

    const {
        todoMutation: completedTodoMutation,
        isLoading: isLoadingCompleteTodo,
    } = useTodoMutation('completeTodo', completeTodos, queryClient)

    const handleCompleteTodo = (todo: Todo, title: string) => {
        if (isfullstackWay && todo) {
            completedTodoMutation.mutate(todo as Todo, {
                onSuccess: () => {
                    queryClient.invalidateQueries('todos')
                    successToast(`${title} succesfully completed`)
                },
                onError: (error: any) => {
                    errorToast(error.message)
                },
            })
        } else {
            completeTodo && completeTodo(todo?.todoId as string)
        }
    }
    const handleAllCompleted = () => {
        if (isfullstackWay) {
            updateAllToCompletedMutation?.mutate()
        } else {
            setAllCompleted && setAllCompleted()
        }
    }
    return (
        <>
            {isLoadingCompleteTodo ? (
                <Loader size={20} />
            ) : (
                <button
                    type="button"
                    onClick={() => {
                        handleCompleteTodo &&
                            handleCompleteTodo(
                                todo as Todo,
                                todo?.title as string
                            )
                        handleAllCompleted && handleAllCompleted()
                    }}
                    className={`${
                        completed || isAllCompleted || isAllCompletedDb
                            ? 'bg-gradient-to-br from-[#57DDFF] to-[#C058F3] rounded-full cursor-pointer '
                            : ' outline outline-1 outline-veryDarkGrayishBlue hover:outline-none'
                    } p-3 rounded-full z-10 relative hover:bg-gradient-to-br from-[#57DDFF] to-[#C058F3] `}
                >
                    {completed || isAllCompleted || isAllCompletedDb ? (
                        <img
                            className="absolute stroke-white top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                            src={`images/icon-check.svg`}
                        />
                    ) : (
                        ''
                    )}

                    {!completed ? (
                        <div
                            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${
                                isAllCompleted || isAllCompletedDb || completed
                                    ? 'bg-transparent'
                                    : ''
                            } bg-secondaryBackground rounded-full w-[23px] h-[23px]`}
                        ></div>
                    ) : (
                        ''
                    )}
                </button>
            )}
        </>
    )
}

export default ButtonChecked
