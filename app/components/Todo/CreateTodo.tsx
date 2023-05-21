'use client'
import React, { useRef } from 'react'
import ButtonChecked from '../ButtonChecked'
import { useTodoContext } from '@/app/store/todoContextProvider'
import { sendTodos, updateAllToCompletedTodos } from '@/app/utils/endpoints'
import { useMutation, useQueryClient } from 'react-query'
import { Todo } from '@/app/utils/types'
import { v4 as uuidv4 } from 'uuid'
import { AiOutlinePlus } from 'react-icons/ai'
import useTodosMutation from '@/app/hooks/useTodosMutation'
import toast from 'react-hot-toast'
import { errorToast, successToast } from '@/app/utils/toast'
import { error } from 'console'

interface Props {
    isFullstackWay: boolean
    isAllCompletedDb: boolean
}

const CreateTodo = ({ isFullstackWay, isAllCompletedDb }: Props) => {
    const { addTodo, setAllCompleted, isAllCompleted } = useTodoContext()
    const inputRef = useRef<HTMLInputElement | null>(null)
    const queryClient = useQueryClient()

    const { todosMutation: createTodoMutation } = useTodosMutation(
        'createTodo',
        sendTodos,
        queryClient
    )
    const updateAllToCompletedMutation = useMutation(
        updateAllToCompletedTodos,
        {
            mutationKey: 'updateAllToCompleted',
            onSuccess: () => {
                queryClient.invalidateQueries('todos')
                successToast(`succesfully All completed`)
            },
            onError: () => {
                toast.error('Something went wrong')
            },
        }
    )

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        let input = inputRef?.current?.value
        const title = input?.trim()

        if (title?.trim() === '')
            return errorToast('Empty todos are not allowed')
        const newTodo: Todo | any = {
            todoId: uuidv4(),
            title: title,
            completed: false,
        }
        if (newTodo && !isFullstackWay) {
            addTodo(newTodo)
        }

        isFullstackWay && createTodoMutation.mutate(newTodo)

        inputRef.current!.value = ''
    }
    return (
        <form
            onSubmit={handleSubmit}
            className="w-full p-4 relative rounded-md bg-secondaryBackground h-full gap-4 flex"
        >
            <ButtonChecked
                setAllCompleted={setAllCompleted}
                isAllCompleted={isAllCompleted}
                updateAllToCompletedMutation={updateAllToCompletedMutation}
                isfullstackWay={isFullstackWay}
                isAllCompletedDb={isAllCompletedDb}
            />
            <input
                ref={inputRef}
                className="w-full cursor-text bg-transparent outline-none "
                placeholder="Create a new todo..."
                type="text"
            />
            <button type="submit">
                <AiOutlinePlus className="hover:scale-95 hover:text-primaryBlue text-2xl " />
            </button>
        </form>
    )
}

export default CreateTodo
