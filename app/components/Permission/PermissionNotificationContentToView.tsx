import { permissionRequestType } from '@/app/utils/types'
import React, { useEffect, useState } from 'react'
import { HighlightButton } from '../ui/Button'
import { status } from '@/app/utils/types'
import { NotificationCard } from '../ui/NotificationCard'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import Loader from '../ui/Loader'

interface Props {
    permissionRequests: permissionRequestType | undefined
    acceptPermissionRequest: (id: string) => void
    declinePermissionRequest: (id: string) => void
    refetchPermissionRequests: () => void
}

const PermissionNotificationContentToView = ({
    acceptPermissionRequest,
    refetchPermissionRequests,
    declinePermissionRequest,
    permissionRequests,
}: Props) => {
    const data = useQuery('permissionRequests', () => permissionRequests)
    const queryClient = useQueryClient()

    const mutationAccept = useMutation(acceptPermissionRequest as any, {
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries('todos')
            refetchPermissionRequests()
        },
    })

    const mutationDecline = useMutation(declinePermissionRequest as any, {
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries('todos')
            refetchPermissionRequests()
        },
    })

    return (
        <NotificationCard>
            {data?.data?.map((request, index) => (
                <>
                    {request.status === status.Pending && (
                        <li
                            key={request.id + index}
                            className="p-2 w-full m-auto text-center border-t border-primaryBlue"
                        >
                            You have received a permission to see your todos
                            request from {request?.fromUserName}.
                            <div className="flex items-center justify-center gap-14 py-2">
                                {mutationAccept.isLoading ||
                                mutationDecline.isLoading ? (
                                    <Loader size={20} />
                                ) : (
                                    <>
                                        <HighlightButton
                                            type="button"
                                            label="Accept"
                                            onClick={() =>
                                                mutationAccept.mutate(
                                                    request.id
                                                )
                                            }
                                            className="bg-green-500 z-50 cursor-pointer hover:bg-green-600 px-5 py-2.5 rounded-md"
                                        />
                                        <button
                                            onClick={() =>
                                                mutationDecline.mutate(
                                                    request.id
                                                )
                                            }
                                            className="capitalize z-50 hover:outline outline-1 px-4 py-2 rounded-md outline-red-500"
                                        >
                                            Decline
                                        </button>
                                    </>
                                )}
                            </div>
                        </li>
                    )}
                </>
            ))}
        </NotificationCard>
    )
}

export default PermissionNotificationContentToView
