'use client'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import ButtonChecked from '../ButtonChecked'
import { useTodoContext } from '@/app/store/todoContextProvider'

import { HiOutlinePencilAlt, HiCheck } from 'react-icons/hi'
import {
    addUserPermissionActions,
    deleteTodos,
    updateTodos,
} from '@/app/utils/endpoints'
import axios from 'axios'
import { Todo as TodoType, loggedUserType } from '@/app/utils/types'
import { useMutation, useQuery, useQueryClient } from 'react-query'

import useTodoMutation from '@/app/hooks/useTodoMutation'
import { errorToast, successToast } from '@/app/utils/toast'

import Loader from '../ui/Loader'
import { IoMdClose } from 'react-icons/io'
import type { Identifier, XYCoord } from 'dnd-core'
import { DropTargetMonitor, useDrag, useDrop } from 'react-dnd'
import { ItemTypes } from '@/app/utils/types'
import { handleTodoErrorMessage } from '@/app/utils/helpers'
import { useSession } from 'next-auth/react'
import { AiOutlineUserAdd } from 'react-icons/ai'

import { Modal } from '../ui/modals/Modal'
import { get } from 'http'
import AddPermissionActions from '../permission/AddPermission'
import AddPermission from '../permission/AddPermission'
import { HighlightButton } from '../ui/Button'

export interface DragItem {
    index: number
    todoId: string
    type: string
}

interface Props {
    isFullstackWay: boolean
    todo: TodoType
    moveTodo: (dragIndex: number, hoverIndex: number) => void
    index: number
}

const Todo = ({ todo, isFullstackWay, moveTodo, index }: Props) => {
    const { data: session } = useSession()
    const ref = useRef<HTMLDivElement>(null)
    const { removeTodo, updateTodo } = useTodoContext()
    const inputRef = useRef<HTMLInputElement | null>(null)
    const [isActiveUpdate, setIsActiveUpdate] = useState(false)
    const [newTitle, setNewTitle] = useState('')
    const { todoId, title, completed, id, userId } = todo
    const queryClient = useQueryClient()

    const [openPermissionModal, setOpenPermissionModal] = useState(false)

    const user = session?.user as loggedUserType | undefined

    const { todoMutation: updateTodoMutation, isLoading: updateLoading } =
        useTodoMutation('updateTodo', updateTodos, queryClient)
    const { todoMutation: deleteTodoMutation, isLoading: deleteLoading } =
        useTodoMutation('deleteTodo', deleteTodos, queryClient)

    const handleFocus = useCallback(() => {
        inputRef.current?.focus()
    }, [])

    useEffect(() => {
        handleFocus()
    }, [isActiveUpdate, handleFocus])

    const handleDelete = useCallback(
        async (todo: TodoType) => {
            isFullstackWay
                ? deleteTodoMutation.mutate(todo, {
                      onSuccess: () => {
                          successToast(
                              `Successfully removed`,
                              <IoMdClose className="bg-red-500 rounded-full w-4 h-4 text-white" />
                          )
                      },
                      onError: (error: any) => {
                          errorToast(error.message)
                      },
                  })
                : removeTodo(todo.todoId as string)
        },
        [todoId, removeTodo, deleteTodoMutation, isFullstackWay]
    )

    const handleUpdateTodo = () => {
        const newTodo: TodoType = {
            ...todo,
            title: newTitle,
        }

        isFullstackWay
            ? updateTodoMutation.mutate(newTodo, {
                  onSuccess: () => {
                      queryClient.invalidateQueries('todos')
                      successToast(`${newTodo.title} succesfully updated`)
                  },
                  onError: (error: any) => {
                      errorToast(error.message)
                  },
              })
            : updateTodo(id, newTitle)
    }

    const [{ handlerId }, drop] = useDrop<
        DragItem,
        void,
        { handlerId: Identifier | null }
    >({
        accept: ItemTypes.TODO,
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId(),
            }
        },
        hover(item: DragItem, monitor) {
            if (!ref.current) {
                return
            }
            const dragIndex = item.index
            const hoverIndex = index

            // Don't replace items with themselves
            if (dragIndex === hoverIndex) {
                return
            }

            // Determine rectangle on screen
            const hoverBoundingRect = ref.current?.getBoundingClientRect()

            // Get vertical middle
            const hoverMiddleY =
                (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

            // Determine mouse position
            const clientOffset = monitor.getClientOffset()

            // Get pixels to the top
            const hoverClientY =
                (clientOffset as XYCoord).y - hoverBoundingRect.top

            // Only perform the move when the mouse has crossed half of the items height
            // When dragging downwards, only move when the cursor is below 50%
            // When dragging upwards, only move when the cursor is above 50%

            // Dragging downwards

            if (dragIndex! < hoverIndex! && hoverClientY < hoverMiddleY) {
                return
            }

            // Dragging upwards
            if (dragIndex! > hoverIndex! && hoverClientY > hoverMiddleY) {
                return
            }

            // Time to actually perform the action

            dragIndex || hoverIndex ? moveTodo(dragIndex, hoverIndex) : null

            // Note: we're mutating the monitor item here!
            // Generally it's better to avoid mutations,
            // but it's good here for the sake of performance
            // to avoid expensive index searches.
            item.index = hoverIndex
        },
    })

    const [{ isDragging }, drag] = useDrag({
        type: ItemTypes.TODO,
        item: () => {
            return { todoId, index }
        },
        collect: (monitor: any) => ({
            isDragging: monitor.isDragging(),
        }),
    })
    const opacity = isDragging ? 0 : 1

    drag(drop(ref))

    if (!user) return null

    return (
        <>
            <div
                ref={ref}
                data-handler-id={handlerId}
                className={`${
                    user?.userId === userId
                        ? 'border rounded-md border-primaryBlue'
                        : 'border-b-[1px] border-veryDarkGrayishBlue'
                } w-full group cursor-move justify-between  bg-secondaryBackground p-4 relative items-center h-full gap-4 flex`}
            >
                {updateLoading || deleteLoading ? (
                    <div className="flex justify-center w-full h-max">
                        <Loader size={30} />
                    </div>
                ) : (
                    <>
                        <div className="flex gap-4 items-center">
                            <ButtonChecked
                                todoId={todoId}
                                completed={completed}
                                todo={todo}
                                isfullstackWay={isFullstackWay}
                            />
                            {!isActiveUpdate && (
                                <p
                                    className={`bg-transparent w-full  ${
                                        completed
                                            ? 'line-through text-darkGrayishBlue'
                                            : ''
                                    }`}
                                >
                                    {title}
                                </p>
                            )}
                            {isActiveUpdate && (
                                <input
                                    ref={inputRef}
                                    onChange={(e) => {
                                        setNewTitle(e.target.value)
                                    }}
                                    type="text"
                                    className={`bg-transparent outline outline-primaryBlue w-full outline-none cursor-pointer ${
                                        completed
                                            ? 'line-through text-darkGrayishBlue'
                                            : ''
                                    }`}
                                    value={newTitle}
                                />
                            )}
                        </div>

                        <div className="flex gap-4 items-center">
                            {userId === user.userId && (
                                <button
                                    onClick={() => setOpenPermissionModal(true)}
                                    className="text-primaryBlue block md:hidden  h-5 w-5 group-hover:block"
                                >
                                    <AiOutlineUserAdd className="w-5 h-5 object-cover" />
                                </button>
                            )}
                            <div
                                className="flex items-center"
                                onClick={() => {
                                    handleFocus()
                                }}
                            >
                                {!isActiveUpdate ? (
                                    <button
                                        onClick={() => setIsActiveUpdate(true)}
                                    >
                                        <HiOutlinePencilAlt className="block md:hidden text-primaryBlue  h-5 w-5 group-hover:block" />
                                    </button>
                                ) : (
                                    <button>
                                        <HiCheck
                                            onClick={() => {
                                                handleUpdateTodo()
                                                setIsActiveUpdate(false)
                                            }}
                                            className="block md:hidden text-primaryBlue  h-6 w-6 group-hover:block"
                                        />
                                    </button>
                                )}
                            </div>
                            <button
                                onClick={() => {
                                    handleDelete(todo)
                                }}
                                className="block md:hidden cursor-pointer    group-hover:block"
                            >
                                <img
                                    alt="delete icon"
                                    className="fill-primaryBlue"
                                    src="images/icon-cross.svg"
                                />
                            </button>

                            {user.userId !== userId && (
                                <p className="capitalize">{todo.userName}</p>
                            )}
                        </div>
                    </>
                )}
            </div>
            {openPermissionModal && (
                <Modal
                    className="w-[400px] md:w-[500px] h-max  left-1/2 top-1/2 !-translate-y-1/2 !-translate-x-1/2 gap-4"
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
                    <AddPermission
                        text="With such a permission, the user will be able to edit your todos"
                        addPermission={addUserPermissionActions}
                        setIsOpen={setOpenPermissionModal}
                    />
                </Modal>
            )}
        </>
    )
}

export default Todo
