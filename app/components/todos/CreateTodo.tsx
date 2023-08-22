'use client'
import React, { useRef, useState } from 'react'
import ButtonChecked from '../ui/ButtonChecked'
import { useTodoContext } from '@/app/store/todoContextProvider'
import {
    AddUserPermissionToViewTodos,
    sendTodos,
    updateAllToCompletedTodos,
} from '@/app/utils/endpoints'
import { useMutation, useQueryClient } from 'react-query'
import { Todo } from '@/app/utils/types'
import { v4 as uuidv4 } from 'uuid'
import { AiOutlinePlus, AiOutlineUserAdd } from 'react-icons/ai'
import useTodosMutation from '@/app/hooks/useTodosMutation'
import { errorToast, successToast } from '@/app/utils/toast'
import { Modal } from '../ui/modals/Modal'
import AddPermission from '../permission/AddPermission'

interface Props {
    isFullstackWay: boolean
    isAllCompletedDb: boolean
}

const CreateTodo = ({ isFullstackWay, isAllCompletedDb }: Props) => {
    const { addTodo, setAllCompleted, isAllCompleted } = useTodoContext()
    const inputRef = useRef<HTMLInputElement | null>(null)
    const [openPermissionModal, setOpenPermissionModal] = useState(false)
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
            onError: (error: any) => {
                errorToast(error.message, 5000)
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
        <>
            <form
                onSubmit={handleSubmit}
                className="w-full p-4 relative rounded-md bg-secondaryBackground h-full gap-4 items-center flex"
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
                {isFullstackWay && (
                    <button
                        type="button"
                        onClick={() => setOpenPermissionModal(true)}
                        className="hover:text-primaryBlue block h-5 w-5 group-hover:block"
                    >
                        <AiOutlineUserAdd className="w-5 h-5 object-cover" />
                    </button>
                )}
                <button type="submit">
                    <AiOutlinePlus className="hover:scale-95 hover:text-primaryBlue text-2xl " />
                </button>
            </form>

            {openPermissionModal && (
                <Modal
                    className="w-[400px] md:w-[500px] h-max left-1/2 top-1/2 !-translate-y-1/2 !-translate-x-1/2 gap-4"
                    setIsOpen={setOpenPermissionModal}
                    isOpen={openPermissionModal}
                    modalTitle="Add permission"
                    initial={{
                        y: '-100%',
                        opacity: 1,
                    }}
                    animate={{
                        y: 0,
                        opacity: 1,
                    }}
                    exit={{
                        y: '-100%',
                        opacity: 0,
                    }}
                >
                    <div className="flex justify-center items-center h-full">
                        <AddPermission
                            text="With such a permission, the user will be able to view your todos and u can view his todos"
                            addPermission={AddUserPermissionToViewTodos}
                            setIsOpen={setOpenPermissionModal}
                        />
                    </div>
                </Modal>
            )}
        </>
    )
}

export default CreateTodo
