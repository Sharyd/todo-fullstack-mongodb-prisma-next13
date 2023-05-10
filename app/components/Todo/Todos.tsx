'use client'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import ButtonChecked from '../ButtonChecked'
import { useTodoContext } from '@/app/store/todoContextProvider'

import { HiOutlinePencilAlt, HiCheck } from 'react-icons/hi'
import { deleteTodos, updateTodos } from '@/app/utils/endpoints'
import axios from 'axios'
import { Todo } from '@/app/utils/types'
import { useMutation, useQuery, useQueryClient } from 'react-query'

import useTodoMutation from '@/app/hooks/useTodoMutation'
import { errorToast, successToast } from '@/app/utils/toast'

import Loader from '../Loader'
import { IoMdClose } from 'react-icons/io'
import type { Identifier, XYCoord } from 'dnd-core'
import { useDrag, useDrop } from 'react-dnd'
import { ItemTypes } from '@/app/utils/types'

interface Props {
    isFullstackWay: boolean
    todo: Todo
    moveTodo: (dragIndex: number, hoverIndex: number) => void
    index: number
}

interface DragItem {
    index: number
    todoId: string
    type: string
}
const Todos = ({ todo, isFullstackWay, moveTodo, index }: Props) => {
    const ref = useRef<HTMLDivElement>(null)
    const { removeTodo, updateTodo } = useTodoContext()
    const inputRef = useRef<HTMLInputElement | null>(null)
    const [isActiveUpdate, setIsActiveUpdate] = useState(false)
    const [newTitle, setNewTitle] = useState('')
    const { todoId, title, completed } = todo
    const queryClient = useQueryClient()

    const { todoMutation: updateTodoMutation, isLoading: updateLoading } =
        useTodoMutation('updateTodo', updateTodos, queryClient)
    const { todoMutation: deleteTodoMutation, isLoading: deleteLoading } =
        useTodoMutation('deleteTodo', deleteTodos, queryClient)

    const handleFocus = useCallback(() => {
        inputRef.current?.focus()
    }, [])

    useEffect(() => {
        handleFocus()
    }, [isActiveUpdate])

    const handleDelete = useCallback(
        async (todo: Todo) => {
            isFullstackWay
                ? deleteTodoMutation.mutate(todo, {
                      onSuccess: () => {
                          successToast(
                              `Succesfully removed`,
                              <IoMdClose className="bg-red-500 rounded-full w-4 h-4 text-white" />
                          )
                      },
                      onError: (err) => {
                          errorToast(`Something went wrong: ${err}`)
                      },
                  })
                : removeTodo(todo.todoId as string)
        },

        [todoId, removeTodo]
    )

    const handleUpdateTodo = () => {
        const newTodo: Todo = {
            todoId: todoId,
            title: newTitle,
            completed: completed,
        }

        isFullstackWay
            ? updateTodoMutation.mutate(newTodo, {
                  onSuccess: () => {
                      queryClient.invalidateQueries('todos')
                      successToast(`${newTodo.title} succesfully updated`)
                  },
                  onError: (err) => {
                      errorToast(`Something went wrong: ${err}`)
                  },
              })
            : updateTodo(todoId, newTitle)
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
            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return
            }

            // Dragging upwards
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return
            }

            // Time to actually perform the action
            moveTodo(dragIndex, hoverIndex)

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

    return (
        <div
            ref={ref}
            data-handler-id={handlerId}
            className="w-full group cursor-move justify-between border-b-[1px] border-veryDarkGrayishBlue p-4 relative items-center  bg-secondaryBackground h-full gap-4 flex"
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
                        <div
                            className="flex items-center"
                            onClick={() => {
                                handleFocus()
                            }}
                        >
                            {!isActiveUpdate ? (
                                <button onClick={() => setIsActiveUpdate(true)}>
                                    <HiOutlinePencilAlt className="hidden text-primaryBlue  h-5 w-5 group-hover:block" />
                                </button>
                            ) : (
                                <button>
                                    <HiCheck
                                        onClick={() => {
                                            handleUpdateTodo()
                                            setIsActiveUpdate(false)
                                        }}
                                        className="hidden text-primaryBlue  h-6 w-6 group-hover:block"
                                    />
                                </button>
                            )}
                        </div>
                        <button
                            onClick={() => {
                                handleDelete(todo)
                            }}
                            className="hidden cursor-pointer    group-hover:block"
                        >
                            <img
                                className="fill-blue-600"
                                src="images/icon-cross.svg"
                            />
                        </button>
                    </div>
                </>
            )}
        </div>
    )
}

export default Todos
