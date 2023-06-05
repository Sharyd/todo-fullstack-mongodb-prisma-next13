// NestedComments.tsx
import React from 'react'
import Comment from './Comment'
import { Comment as CommentType } from '@/app/utils/types'

interface NestedCommentsProps {
    id: string
    comment: CommentType
}

const NestedComments: React.FC<NestedCommentsProps> = ({ comment, id }) => {
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

export default NestedComments
