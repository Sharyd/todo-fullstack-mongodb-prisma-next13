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
                queryKey: ['todos', newTodo.todoId],
            })

            const previousTodo = queryClient.getQueryData<Todo>([
                'todos',
                newTodo.todoId,
            ])
            queryClient.setQueryData(['todos', newTodo.todoId], newTodo)
            return { previousTodo, newTodo }
        },

        onError: (err, newTodo, context) => {
            queryClient.setQueryData(
                ['todos', context?.newTodo.todoId],
                context?.previousTodo
            )
        },

        onSettled: (newTodo: Todo | any) => {
            queryClient.invalidateQueries({
                queryKey: ['todos', newTodo?.todoId],
            })
        },
    })

    return {
        todoMutation,
        isLoading: todoMutation.isLoading,
    }
}

export default useTodoMutation
