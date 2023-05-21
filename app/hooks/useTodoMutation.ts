import React from 'react'
import { Todo } from '../utils/types'
import { QueryClient, useMutation } from 'react-query'
import { AxiosResponse } from 'axios'

const useTodoMutation = (
    mutationKey: string,
    restFunction: (todo: Todo) => Promise<AxiosResponse<any, any> | null>,
    queryClient: QueryClient
) => {
    const todoMutation = useMutation(restFunction, {
        mutationKey: mutationKey,

        onMutate: async (newTodo: Todo) => {
            await queryClient.cancelQueries({
                queryKey: ['todos', newTodo.id],
            })

            const previousTodo = queryClient.getQueryData<Todo>([
                'todos',
                newTodo.id,
            ])
            queryClient.setQueryData(['todos', newTodo.id], newTodo)
            return { previousTodo, newTodo }
        },

        onError: (err, newTodo, context) => {
            queryClient.setQueryData(
                ['todos', context?.newTodo.id],
                context?.previousTodo
            )
        },

        onSettled: (newTodo: Todo | any) => {
            queryClient.invalidateQueries({
                queryKey: ['todos', newTodo?.id],
            })
        },
    })

    return {
        todoMutation,
        isLoading: todoMutation.isLoading,
    }
}

export default useTodoMutation
