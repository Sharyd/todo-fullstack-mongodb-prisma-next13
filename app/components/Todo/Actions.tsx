'use client'

import useTodosMutation from '@/app/hooks/useTodosMutation'
import { useTodoContext } from '@/app/store/todoContextProvider'
import { deleteCompletedTodos } from '@/app/utils/endpoints'
import { isAllTodosCompleted } from '@/app/utils/helpers'
import { errorToast, successToast } from '@/app/utils/toast'
import React from 'react'
import { useMutation, useQueryClient } from 'react-query'
import Loader from '../ui/Loader'

export const filtersArray = ['all', 'active', 'completed']

interface Props {
    dbFilters: string
    setDbFilters: React.Dispatch<React.SetStateAction<string>>
    isFullstackWay: boolean
    activeTodosDbLength: number
}

const Actions = ({
    dbFilters,
    setDbFilters,
    isFullstackWay,

    activeTodosDbLength,
}: Props) => {
    const { filter, setFilter, clearCompleted, activeTodos } = useTodoContext()
    const queryClient = useQueryClient()

    const { mutate: clearCompletedMutation, isLoading } = useMutation(
        deleteCompletedTodos,
        {
            mutationKey: 'deleteCompletedTodos',
            onSuccess: () => {
                queryClient.invalidateQueries('todos')
                successToast('Completed deleted successfully')
            },
            onError: (error: any) => {
                errorToast(`${error.message}`, 5000)
            },
        }
    )

    return (
        <>
            <div className="text-darkGrayishBlue z-20 flex justify-between items-center py-3 px-4 text-xs">
                <span>
                    {isFullstackWay ? activeTodosDbLength : activeTodos} items
                    left
                </span>
                <div className=" hidden sm:flex gap-4 font-semibold ">
                    {filtersArray.map((filterName) => (
                        <button
                            key={filterName}
                            onClick={() =>
                                isFullstackWay
                                    ? setDbFilters(filterName)
                                    : setFilter(filterName)
                            }
                            className={`${
                                !isFullstackWay
                                    ? filterName === filter
                                        ? 'text-primaryBlue'
                                        : ''
                                    : filterName === dbFilters
                                    ? 'text-primaryBlue'
                                    : ''
                            }  capitalize hover:text-secondaryText`}
                        >
                            {filterName}
                        </button>
                    ))}
                </div>
                {isLoading ? (
                    <Loader size={30} />
                ) : (
                    <button
                        className="hover:text-secondaryText"
                        onClick={() => {
                            isFullstackWay
                                ? clearCompletedMutation()
                                : clearCompleted()
                        }}
                    >
                        Clear Completed
                    </button>
                )}
            </div>
        </>
    )
}

export default Actions
