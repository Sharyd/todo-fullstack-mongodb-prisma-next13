import { useMutation, useQueryClient } from 'react-query'
import { toggleLike } from '../utils/endpoints'
import { Comment, likeType, loggedUserType } from '../utils/types' // import LikeType here
import { useSession } from 'next-auth/react'

export const useLikes = (todoId: string) => {
    const queryClient = useQueryClient()
    const session = useSession() as any

    const userId = session?.data?.user?.userId

    const toggleLikeMutation = useMutation(toggleLike, {
        onMutate: async (commentId: string) => {
            await queryClient.cancelQueries(['comments', todoId])

            const previousComments = queryClient.getQueryData([
                'comments',
                todoId,
            ])

            queryClient.setQueryData(['comments', todoId], (old: any) => {
                return old?.map((comment: Comment) => {
                    if (comment.id === commentId) {
                        // check if the current user has already liked the comment
                        const hasUserLiked = (comment.likes ?? []).some(
                            (like: likeType) => like.userId === userId
                        )

                        // if the user has already liked the comment, remove the like
                        // else add a new like
                        return {
                            ...comment,
                            likes: hasUserLiked
                                ? comment?.likes?.filter(
                                      (like: likeType) => like.userId !== userId
                                  )
                                : [
                                      ...(comment.likes ?? []),
                                      {
                                          id: '',
                                          userId: userId,
                                          commentId: comment.id,
                                      },
                                  ],
                        }
                    } else {
                        return comment
                    }
                })
            })

            return { previousComments }
        },

        onSuccess: (data, variables, context) => {
            queryClient.setQueryData(['comments', todoId], (old: any) => {
                return old?.map((comment: Comment) => {
                    if (comment.id === variables) {
                        return {
                            ...comment,
                            likes: comment?.likes?.map((like: likeType) =>
                                like.id === 'optimisticLike'
                                    ? { ...like, id: data.id }
                                    : like
                            ),
                        }
                    } else {
                        return comment
                    }
                })
            })
        },
        onError: (err, variables, context: any) => {
            queryClient.setQueryData(
                ['comments', todoId],
                context.previousComments
            )
        },
        onSettled: () => {
            queryClient.invalidateQueries(['comments', todoId])
            // After the mutation settles, update the specific comment as well (if you have a query for a single comment)
        },
    })

    return { toggleLikeMutation }
}
