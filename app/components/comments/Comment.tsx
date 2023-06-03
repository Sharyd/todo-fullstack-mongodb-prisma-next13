import React, { useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import Loader from '../ui/Loader'
import { useAddComment, useDeleteComment } from '../../hooks/useComments'
import { Comment as CommentType, newCommentType } from '@/app/utils/types'
import { errorToast, successToast } from '@/app/utils/toast'
import { HighlightButton } from '../ui/Button'
import { AiOutlineLike, AiOutlineDislike } from 'react-icons/ai'
import { FaRegComment, FaRegTrashAlt } from 'react-icons/fa'
import { BiComment } from 'react-icons/bi'
interface CommentProps {
    id: string
    parentId?: string | null
    comments: CommentType[] | undefined
}

const Comment: React.FC<CommentProps> = ({ comments, parentId = null, id }) => {
    const [commentText, setCommentText] = useState<{ [key: string]: string }>(
        {}
    )
    const { data: session } = useSession() as any
    const [replyIds, setReplyIds] = useState<Set<string>>(new Set())
    const commentRefs = useRef(new Map()).current

    const addCommentMutation = useAddComment(id)
    const deleteCommentMutation = useDeleteComment()

    const handleAddComment = (parentId?: string) => {
        const newComment: newCommentType = {
            content: commentText[parentId || 'main'],
            userId: session?.user.userId,
            parentId: parentId || undefined,
        }

        addCommentMutation.mutate(newComment as CommentType, {
            onSuccess: () => {
                successToast('Comment added successfully')
            },
            onSettled: (data) => {
                // the backend should return the id of the new comment
                const newCommentId = data.id
                // scroll to the new comment
                commentRefs
                    .get(newCommentId)
                    ?.current?.scrollIntoView({ behavior: 'smooth' })
            },
            onError: (error: any) => {
                // Assuming errorToast is a function that shows the error message.
                errorToast(error.message)
            },
        })
        setCommentText((prev) => ({ ...prev, [parentId || 'main']: '' }))
        if (parentId) {
            setReplyIds((prev) => {
                const newSet = new Set(prev)
                newSet.delete(parentId)
                return newSet
            })
        }
    }

    const handleDeleteComment = (commentId: string) => {
        deleteCommentMutation.mutate(commentId, {
            onSuccess: () => {
                successToast('Comment deleted successfully')
            },
            onError: (error: any) => {
                errorToast(error.message)
            },
        })
    }

    const handleReply = (commentId: string) => {
        setReplyIds((prev) => new Set(prev).add(commentId))
    }

    const renderNestedComments = (comment: CommentType) => {
        if (comment.replies && comment.replies.length > 0) {
            return (
                <div className="border-l border-t p-2 rounded-md border-primaryBlue ml-4 mt-2">
                    {comment.replies.map((reply: CommentType) => (
                        <Comment
                            key={reply.id}
                            id={id}
                            parentId={reply.id}
                            comments={[reply]}
                        />
                    ))}
                </div>
            )
        }

        return null
    }
    const renderCommentForm = (parentId?: string) => {
        return (
            <div className="my-2 flex flex-col gap-2 ">
                <input
                    className="w-full text-black p-2 border border-gray-300 rounded"
                    value={commentText[parentId || 'main'] || ''}
                    onChange={(e) =>
                        setCommentText((prev) => ({
                            ...prev,
                            [parentId || 'main']: e.target.value,
                        }))
                    }
                />
                <div>
                    <HighlightButton
                        onClick={() => handleAddComment(parentId)}
                        type="submit"
                        label={'submit'}
                        className=" bg-primaryBlue w-max capitalize px-4 py-2 rounded-md"
                    />

                    {parentId && (
                        <button
                            className="mt-2 px-4 py-2 ml-2 bg-red-500 text-white rounded"
                            onClick={() => {
                                setReplyIds((prev) => {
                                    const newSet = new Set(prev)
                                    newSet.delete(parentId)
                                    return newSet
                                })
                            }}
                        >
                            Close
                        </button>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div className={`pl-4 ${parentId ? ' border-gray-400' : ''} `}>
            {!parentId && renderCommentForm()}
            <div className="overflow-y-auto max-h-[500px] p-2">
                {comments?.map((comment: CommentType) => (
                    <div key={comment.id} className="w-full flex flex-col">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1">
                            <div className="flex w-12 items-center flex-col-reverse gap-1 items-start">
                                <img
                                    src={
                                        comment.user?.image ??
                                        '/images/defaultProfile.jpg'
                                    }
                                    alt={comment.user?.name ?? "user's image"}
                                    className="h-10 w-10 object-cover  rounded-full"
                                />
                                <p className="font-bold text-secondaryText">
                                    {comment.user?.name}
                                </p>
                            </div>
                            <div className="my-2 bg-gray-200 p-2 px-4 rounded w-full">
                                <div className="flex justify-between items-center">
                                    <div className="flex flex-col flex-wrap gap-2 w-full">
                                        <p className="text-black">
                                            {comment.content}
                                        </p>
                                        <div className="flex items-center justify-between ">
                                            <div className="flex items-center gap-3">
                                                <button>
                                                    <AiOutlineLike className="block text-primaryBlue h-6 w-6 group-hover:block" />
                                                </button>
                                                <button className="relative">
                                                    {comment.replies &&
                                                        comment?.replies
                                                            ?.length >= 1 && (
                                                            <span className="absolute text-xs rounded-full -top-1 -right-1 w-4 h-4 bg-red-500">
                                                                {
                                                                    comment
                                                                        .replies
                                                                        ?.length
                                                                }
                                                            </span>
                                                        )}
                                                    <FaRegComment className="block text-primaryBlue h-5 w-5 group-hover:block" />
                                                </button>
                                                <button
                                                    className="px-2 py-1 w-max text-sm bg-primaryBlue text-white rounded"
                                                    onClick={() => {
                                                        handleReply(comment.id)
                                                    }}
                                                >
                                                    Reply
                                                </button>
                                            </div>
                                            {session.user.userId ===
                                                comment.userId && (
                                                <button
                                                    className="p-2.5 text-sm  bg-red-500 text-white rounded"
                                                    onClick={() =>
                                                        handleDeleteComment(
                                                            comment.id
                                                        )
                                                    }
                                                >
                                                    <FaRegTrashAlt />
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {deleteCommentMutation.isLoading && (
                                        <Loader size={25} />
                                    )}
                                </div>
                            </div>
                        </div>
                        {addCommentMutation.isLoading && <Loader size={25} />}
                        {replyIds.has(comment.id) &&
                            renderCommentForm(comment.id)}
                        {replyIds.has(comment.id) &&
                            renderNestedComments(comment)}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Comment
