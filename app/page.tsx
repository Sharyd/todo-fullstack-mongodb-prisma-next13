'use client'
import Image from 'next/image'
import GradientImage from './components/ui/GradientImage'

import { useEffect, useState } from 'react'
import useLocalStorage from './hooks/useLocalStorage'

import { BsChevronRight, BsChevronUp, BsChevronDown } from 'react-icons/bs'
import { AnimatePresence, motion } from 'framer-motion'
import { errorToast, successToast } from './utils/toast'
import Todos from './components/todos/Todos'
import { CloseButton, HighlightButton } from './components/ui/Button'
import { signOut, useSession } from 'next-auth/react'

import {
    NotificationType,
    loggedUserType,
    permissionRequestType,
    status,
} from './utils/types'
import { Modal } from './components/ui/modals/Modal'
import ClientSideOrFullStack from './components/ui/ClientSideOrFullStack'
import { getFirstName } from './utils/helpers'
import { CustomMenu as UserMenu } from './components/ui/Menu'
import {
    acceptPermissionRequest,
    declinePermissionRequest,
    deleteNotification,
    getNotification,
    getUserPermissionToViewTodos,
} from './utils/endpoints'
import { IoIosNotifications } from 'react-icons/io'
import { useQuery, useQueryClient } from 'react-query'
import PermissionNotificationContentToView from './components/permission/PermissionNotificationContentToView'
import useReusableMutation from './hooks/useReusableMutation'
import PermissionGranted from './components/permission/PermissionGranted'
import EditProfile from './components/users/EditUserProfile'
import DeleteProfile from './components/users/DeleteUserProfile'
import ProfileModal from './components/ui/modals/SlideTopModal'
import UserModal from './components/ui/modals/SlideTopModal'
import ClientSideFullStackModal from './components/ui/modals/ClientSideFullStackModal'
import SlideTopModal from './components/ui/modals/SlideTopModal'

export default function Home() {
    const { data: session } = useSession()

    const user = session?.user as loggedUserType | undefined
    const {
        data: notification,
        isLoading,
        isFetching,
    } = useQuery<NotificationType[]>('notification', getNotification)
    const { data: permissionRequests, refetch: refetchPermissionRequests } =
        useQuery<permissionRequestType[]>(
            'permissionRequests',
            getUserPermissionToViewTodos
        )
    const [isFullstackWay, setIsFullstackWay] = useLocalStorage(
        'isFullStackWay',
        true
    )
    const [isOpenNotification, setIsOpenNotification] = useState(false)
    const [isOpenProfile, setIsOpenProfile] = useState(false)
    const [isDeleteProfile, setIsDeleteProfile] = useState(false)

    const [isOpenViewNotification, setIsOpenViewNotification] = useState(true)

    const queryClient = useQueryClient()
    const {
        mutation: deleteNotificationMutation,
        isLoading: isLoadingDeleteNotification,
    } = useReusableMutation(
        'deleteNotification',
        deleteNotification,
        queryClient,
        ['notifications'],
        (data, variables) => {
            queryClient.setQueryData('notification', (old: any) =>
                old?.filter(
                    (notification: { id: string }) =>
                        notification.id !== variables.id
                )
            )
        }
    )
    const [isOpenClientFullstack, setIsOpenClientFullstack] = useState(false)

    const isPending = permissionRequests?.some(
        (request) => request.status === status.Pending
    )

    const menuUserButtons = [
        {
            label: 'Logout',
            onClick: () => {
                signOut({
                    callbackUrl: '/login',
                })
                successToast('Logged out')
            },
        },
        {
            label: 'Edit Profile',
            onClick: () => setIsOpenProfile(true),
        },
        {
            label: 'Delete Profile',
            onClick: () => setIsDeleteProfile(true),
        },
    ]

    useEffect(() => {
        isFullstackWay
            ? successToast('Fullstack is enabled')
            : successToast('Client side is enabled')
    }, [isFullstackWay])

    return (
        <div className="relative">
            {isPending && (
                <div className="relative">
                    <motion.div
                        initial={{ opacity: 1, y: 0 }}
                        animate={{
                            opacity: !isOpenViewNotification ? 0 : 1,
                            y: !isOpenViewNotification ? -100 : 0,
                        }}
                        transition={{ duration: 0.5 }}
                        exit={{ opacity: 0, y: -100 }}
                        className="flex flex-col absolute left-0 gap-4  w-full"
                    >
                        <PermissionNotificationContentToView
                            refetchPermissionRequests={
                                refetchPermissionRequests
                            }
                            permissionRequests={permissionRequests}
                            declinePermissionRequest={declinePermissionRequest}
                            acceptPermissionRequest={acceptPermissionRequest}
                        />
                    </motion.div>

                    <HighlightButton
                        onClick={() =>
                            setIsOpenViewNotification((prev) => !prev)
                        }
                        type="button"
                        label={
                            isOpenViewNotification ? (
                                <BsChevronUp />
                            ) : (
                                <BsChevronDown />
                            )
                        }
                        className="absolute transition-all bg-primaryBlue right-0 z-50 w-max  p-4"
                    />
                </div>
            )}

            <div className="cursor-pointer gap-3 z-50 absolute right-6 top-6 md:right-20 md:top-16">
                <div>
                    <UserMenu buttons={menuUserButtons}>
                        <div className="flex gap-3 items-center">
                            <p className="text-white">
                                {getFirstName(user?.name ?? '')}
                            </p>
                            <Image
                                width={300}
                                height={300}
                                className="w-10 rounded-full  h-10 object-cover"
                                src={
                                    user?.image ?? '/images/defaultProfile.jpg'
                                }
                                alt="user profile image"
                            />
                        </div>
                    </UserMenu>
                </div>
                <button onClick={() => setIsOpenNotification(true)}>
                    <IoIosNotifications
                        className={`w-6 h-6  ${
                            notification?.length
                                ? 'fill-red-500 animate-pulse animate-ringBell'
                                : 'fill-white'
                        }`}
                    />
                </button>
            </div>

            <div className="fixed bottom-[50%] z-50 left-0">
                <ClientSideFullStackModal
                    setIsOpen={setIsOpenClientFullstack}
                    isOpen={isOpenClientFullstack}
                    isFullstackWay={isFullstackWay}
                    setIsFullstackWay={setIsFullstackWay}
                />
            </div>
            <motion.div
                animate={{
                    scale: isOpenClientFullstack ? 0.9 : 1,
                    opacity: isOpenClientFullstack ? 0.7 : 1,
                }}
                transition={{ type: 'spring', bounce: 0, duration: 0.5 }}
                className=" relative"
            >
                <Todos
                    isFullstackWay={isFullstackWay}
                    setIsFullstackWay={setIsFullstackWay}
                />
            </motion.div>

            <SlideTopModal
                title="Notifications"
                setIsOpen={setIsOpenNotification}
                isOpen={isOpenNotification}
            >
                <div className="flex flex-col gap-4 max-h-[400px] p-2 overflow-y-auto">
                    <PermissionGranted
                        notification={notification}
                        deleteNotificationMutation={deleteNotificationMutation}
                    />
                </div>

                <div className="ml-auto mt-auto block">
                    <CloseButton onClick={() => setIsOpenNotification(false)} />
                </div>
            </SlideTopModal>

            <SlideTopModal
                title="Edit Profile"
                setIsOpen={setIsOpenProfile}
                isOpen={isOpenProfile}
            >
                <EditProfile setIsOpen={setIsOpenProfile} />
            </SlideTopModal>

            <SlideTopModal
                title="Delete Profile"
                setIsOpen={setIsDeleteProfile}
                isOpen={isDeleteProfile}
            >
                <DeleteProfile setIsOpen={setIsDeleteProfile} />
            </SlideTopModal>
        </div>
    )
}
