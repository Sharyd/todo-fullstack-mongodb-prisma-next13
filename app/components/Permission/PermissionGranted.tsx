import { NotificationType } from '@/app/utils/types'
import { AxiosResponse } from 'axios'
import React from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import { UseMutationResult, useQueryClient } from 'react-query'
import { PuffLoader } from 'react-spinners'
import Loader from '../ui/Loader'

interface Props {
    notification: NotificationType[] | undefined
    deleteNotificationMutation: UseMutationResult<
        AxiosResponse<any, any> | null,
        unknown,
        any,
        any
    >
}

const PermissionGranted = ({
    notification,
    deleteNotificationMutation,
}: Props) => {
    const queryClient = useQueryClient()

    const handleDelete = (notificationId: string) => {
        deleteNotificationMutation.mutate(notificationId, {
            onSuccess: () => {
                queryClient.invalidateQueries('notification')
            },
        })
    }

    return (
        <>
            <div className="flex flex-col gap-4">
                {notification?.length === 0 ? (
                    <p className="text-start bg-red-600 rounded-md p-2">
                        No notifications found ! 🤷
                    </p>
                ) : (
                    <>
                        {notification?.map((notification) => (
                            <div
                                key={notification.id}
                                className="flex items-center rounded-md p-2 bg-primaryBlue justify-between"
                            >
                                <p className="">{notification.message}</p>
                                {!deleteNotificationMutation.isLoading ? (
                                    <button
                                        onClick={() =>
                                            handleDelete(notification?.id ?? '')
                                        }
                                    >
                                        <AiOutlineClose className="w-5 h-5" />
                                    </button>
                                ) : (
                                    <Loader size={25} />
                                )}
                            </div>
                        ))}
                    </>
                )}
            </div>
        </>
    )
}

export default PermissionGranted
