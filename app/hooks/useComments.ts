import { useMutation, useQuery, useQueryClient } from 'react-query'
import { Comment, userType } from '../utils/types'
import {
    getComments,
    sendComment,
    deleteComment,
    getUsers,
} from '../utils/endpoints'

export const useComments = (todoId: string) => {
    const queryClient = useQueryClient()

    const { data: comments, isLoading: commentsLoading } = useQuery<Comment[]>(
        ['comments', todoId],
        () => getComments(todoId),
        {
            select: (data) =>
                data.map((comment) => ({ ...comment, id: comment.id })),
        }
    )

    // Fetch user information for each comment
    const usersQuery = useQuery<userType[]>('users', getUsers)

    // Recursive function to fetch replies
    const getReplies = (commentId: string): any => {
        const replies = comments?.filter(
            (comment) => comment.parentId === commentId
        )
        return replies?.map((reply) => ({
            ...reply,
            user: usersQuery.data?.find((user) => user.id === reply.userId),
            replies: getReplies(reply.id),
        }))
    }

    const commentsWithData = comments
        ?.filter((comment) => comment.parentId === null)
        .map((comment) => ({
            ...comment,
            user: usersQuery.data?.find((user) => user.id === comment.userId),
            replies: getReplies(comment.id),
        }))

    return {
        comments: commentsWithData,
        isLoading: commentsLoading || usersQuery.isLoading,
    }
}

export const useAddComment = (id: string) => {
    const queryClient = useQueryClient()
    return useMutation(
        'addComment',
        (comment: Comment) => sendComment(comment, id),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['comments', id])
            },
        }
    )
}

export const useDeleteComment = () => {
    const queryClient = useQueryClient()
    return useMutation('deleteComment', deleteComment, {
        onSuccess: () => {
            queryClient.invalidateQueries('comments')
        },
    })
}
