import React from 'react'
import { Todo } from '../utils/types'
import { QueryClient, useMutation } from 'react-query'
import { AxiosResponse } from 'axios'

const useTodosMutation = (
    mutationKey: string,
    restFunction: (todo: Todo) => Promise<AxiosResponse<any, any> | null>,
    queryClient: QueryClient
) => {
    const todosMutation = useMutation(restFunction, {
        mutationKey: mutationKey,
        onMutate: async (newTodo) => {
            await queryClient.cancelQueries({ queryKey: ['todos'] })
            const previousTodos = queryClient.getQueryData(['todos'])
            queryClient.setQueryData(['todos'], (old: Todo | any) => [
                ...old,
                newTodo,
            ])
            return { previousTodos }
        },

        onError: (err, newTodo, context) => {
            queryClient.setQueryData(['todos'], context?.previousTodos)
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['todos'] })
        },
    })

    return {
        todosMutation,
    }
}

export default useTodosMutation
