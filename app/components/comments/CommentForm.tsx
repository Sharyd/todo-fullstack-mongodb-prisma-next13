// CommentForm.tsx
import React from 'react'
import { HighlightButton } from '../ui/Button'

interface CommentFormProps {
    parentId?: string | null
    handleAddComment: (parentId?: string) => void
    commentText: { [key: string]: string }
    setCommentText: React.Dispatch<
        React.SetStateAction<{ [key: string]: string }>
    >
    setReplyIds: React.Dispatch<React.SetStateAction<Set<string>>>
}

const CommentForm: React.FC<CommentFormProps> = ({
    parentId,
    handleAddComment,
    commentText,
    setCommentText,
    setReplyIds,
}) => {
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
                    onClick={() => handleAddComment(parentId || undefined)}
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

export default CommentForm
