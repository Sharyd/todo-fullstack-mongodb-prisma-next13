'use client'
import React, { useState } from 'react'
import {
    useComments,
    useAddComment,
    useDeleteComment,
} from '../../hooks/useComments'
import { Comment as CommentType } from '@/app/utils/types'
import { useSession } from 'next-auth/react'
import Loader from '../ui/Loader'
import { set } from 'react-hook-form'

interface CommentProps {
    id: string
    parentId?: string | null
    comments: CommentType[] | undefined
}

export interface newCommentType {
    content: string
    userId: string
    parentId?: string | null
}

const Comment: React.FC<CommentProps> = ({ comments, parentId = null, id }) => {
    const [mainCommentText, setMainCommentText] = useState('')
    const [nestedCommentText, setNestedCommentText] = useState('')
    const { data: session } = useSession() as any

    const [replyId, setReplyId] = useState<string | null>(null)
    const [showNestedComments, setShowNestedComments] = useState(false)

    const addCommentMutation = useAddComment(id)
    const deleteCommentMutation = useDeleteComment()

    const handleAddMainComment = () => {
        const newComment = {
            content: mainCommentText,
            userId: session?.user.userId,
        }

        addCommentMutation.mutate(newComment as any)
        setMainCommentText('')
    }

    const handleAddNestedComment = () => {
        const newComment = {
            content: nestedCommentText,
            userId: session?.user.userId,
            parentId: replyId || parentId, // new comment is a reply to the current comment
        }

        addCommentMutation.mutate(newComment as any)
        setNestedCommentText('')
    }

    const handleDeleteComment = (commentId: string) => {
        deleteCommentMutation.mutate(commentId)
    }
    const handleReply = (commentId: string) => {
        setShowNestedComments(true)
        setReplyId(commentId)
    }

    const renderNestedComments = (comment: CommentType) => {
        if (comment.replies && comment.replies.length > 0) {
            return (
                <div className="border-l border-t p-2 rounded-md border-primaryBlue ml-4 mt-2">
                    {comment.replies.map((reply: CommentType) => (
                        <div
                            key={reply.id}
                            className="bg-gray-100 p-2 rounded "
                        >
                            <div className="flex justify-between">
                                <div className="flex flex-col">
                                    <p className="text-black">
                                        {reply.content}
                                    </p>
                                    <div className="flex">
                                        <button
                                            className="px-2 py-1 text-sm  bg-red-500 text-white rounded"
                                            onClick={() =>
                                                handleDeleteComment(reply.id)
                                            }
                                        >
                                            Delete
                                        </button>
                                        {deleteCommentMutation.isLoading ||
                                            (reply.id === comment.id && (
                                                <Loader size={25} />
                                            ))}
                                        <button
                                            className="px-2 py-1 text-sm bg-blue-500 text-white rounded ml-2"
                                            onClick={() =>
                                                handleReply(reply.id)
                                            }
                                        >
                                            Reply
                                        </button>
                                    </div>
                                </div>
                                <div className="flex gap-3 items-center">
                                    <p className="font-bold text-black">
                                        {reply.user?.name}
                                    </p>
                                    <img
                                        src={
                                            reply.user?.image ??
                                            '/images/defaultProfile.jpg'
                                        }
                                        alt={reply.user?.name ?? "user's image"}
                                        className="h-8 w-8 rounded-full mr-2"
                                    />
                                </div>
                            </div>
                            {addCommentMutation.isLoading && (
                                <Loader size={25} />
                            )}
                            {replyId === reply.id && (
                                <div className="my-2">
                                    <textarea
                                        className="w-full text-black p-2 border border-gray-300 rounded"
                                        value={nestedCommentText}
                                        onChange={(e) =>
                                            setNestedCommentText(e.target.value)
                                        }
                                    />

                                    <button
                                        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
                                        onClick={handleAddNestedComment}
                                    >
                                        Submit
                                    </button>
                                    <button
                                        className="mt-2 px-4 py-2 ml-2 bg-red-500 text-white rounded"
                                        onClick={() => {
                                            setReplyId(null)
                                        }}
                                    >
                                        Close
                                    </button>
                                </div>
                            )}
                            {renderNestedComments(reply)}
                        </div>
                    ))}
                </div>
            )
        }

        return null
    }

    return (
        <div className={`pl-4 ${parentId ? 'border-l border-gray-400' : ''} `}>
            {!parentId && (
                <div className="my-2">
                    <textarea
                        className="w-full p-2 border text-black border-gray-300 rounded"
                        value={mainCommentText}
                        onChange={(e) => setMainCommentText(e.target.value)}
                    />
                    <button
                        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
                        onClick={handleAddMainComment}
                    >
                        Add Comment
                    </button>
                </div>
            )}
            <div className=" overflow-y-auto max-h-[500px] p-2">
                {comments?.map((comment: CommentType) => (
                    <div
                        key={comment.id}
                        className="my-2 bg-gray-200 p-2 rounded "
                    >
                        <div className="flex justify-between">
                            <div className="flex flex-col ">
                                <p className="text-black">{comment.content}</p>
                                <div className="flex">
                                    <button
                                        className="px-2 py-1 text-sm  bg-red-500 text-white rounded"
                                        onClick={() =>
                                            handleDeleteComment(comment.id)
                                        }
                                    >
                                        Delete
                                    </button>
                                    {deleteCommentMutation.isLoading && (
                                        <Loader size={25} />
                                    )}
                                    <button
                                        className="px-2 py-1 text-sm bg-blue-500 text-white rounded ml-2"
                                        onClick={() => {
                                            handleReply(comment.id)
                                        }}
                                    >
                                        Reply
                                    </button>
                                </div>
                            </div>
                            <div className="flex gap-3 items-center">
                                <p className="font-bold text-black">
                                    {comment.user?.name}
                                </p>
                                <img
                                    src={
                                        comment.user?.image ??
                                        '/images/defaultProfile.jpg'
                                    }
                                    alt={comment.user?.name ?? "user's image"}
                                    className="h-8 w-8 rounded-full mr-2"
                                />
                            </div>
                        </div>
                        {addCommentMutation.isLoading && <Loader size={25} />}
                        {replyId === comment.id && (
                            <div className="my-2">
                                <textarea
                                    className="w-full text-black p-2 border border-gray-300 rounded"
                                    value={nestedCommentText}
                                    onChange={(e) =>
                                        setNestedCommentText(e.target.value)
                                    }
                                />

                                <button
                                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
                                    onClick={handleAddNestedComment}
                                >
                                    Submit
                                </button>
                                <button
                                    className="mt-2 px-4 py-2 ml-2   bg-red-500 text-white rounded"
                                    onClick={() => {
                                        setReplyId(null)
                                        setShowNestedComments(false)
                                    }}
                                >
                                    Close
                                </button>
                            </div>
                        )}
                        {showNestedComments && (
                            <>{renderNestedComments(comment)}</>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Comment
