import { permissionRequestType } from '@/app/utils/types'
import React from 'react'
import { HighlightButton } from '../ui/Button'
import { status } from '@/app/utils/types'
import { Notification } from '../ui/Notification'
import { useRouter } from 'next/navigation'
import { useMutation, useQueryClient } from 'react-query'
import { errorToast, successToast } from '@/app/utils/toast'

interface Props {
    permissionRequests: permissionRequestType
    acceptPermissionRequest: (id: string) => void
    declinePermissionRequest: (id: string) => void
}

const PermissionNotificationContentToView = ({
    acceptPermissionRequest,
    declinePermissionRequest,
    permissionRequests,
}: Props) => {
    return (
        <Notification>
            {permissionRequests.map((request, index) => (
                <>
                    {request.status === status.Pending && (
                        <li key={request.id} className="p-2">
                            You have received a permission to see your todos
                            request from {request?.fromUser?.name}.
                            <div className="flex items-center justify-center gap-14 py-2">
                                <HighlightButton
                                    type="button"
                                    label="Accept"
                                    onClick={() => {
                                        acceptPermissionRequest(request.id)
                                        location.reload()
                                    }}
                                    className="bg-green-500 z-50 cursor-pointer hover:bg-green-600 px-5 py-2.5 rounded-md"
                                />

                                <button
                                    onClick={() => {
                                        declinePermissionRequest(request.id)
                                        location.reload()
                                    }}
                                    className="capitalize z-50 hover:outline outline-1 px-4 py-2 rounded-md outline-red-500"
                                >
                                    Decline
                                </button>
                            </div>
                        </li>
                    )}
                </>
            ))}
        </Notification>
    )
}

export default PermissionNotificationContentToView
