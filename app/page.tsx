'use client'
import Image from 'next/image'
import GradientImage from './components/GradientImage'
import Todo from './components/todo/Todos'

import { MouseEvent, Suspense, useEffect, useState } from 'react'
import useLocalStorage from './hooks/useLocalStorage'

import { BsChevronRight, BsChevronLeft } from 'react-icons/bs'
import { motion } from 'framer-motion'
import { errorToast, successToast } from './utils/toast'
import Todos from './components/todo/Todos'
import { MdLogout } from 'react-icons/md'
import { HighlightButton } from './components/ui/Button'
import { signOut, useSession } from 'next-auth/react'
import SelectUser from './components/users/SelectUser'
import {
    NotificationType,
    loggedUserType,
    permissionRequestType,
    status,
} from './utils/types'
import { Modal } from './components/ui/modals/Modal'
import ClientSideOrFullStack from './components/ClientSideOrFullStack'
import { getFirstName } from './utils/helpers'
import { CustomMenu as UserMenu } from './components/Menu'
import {
    acceptPermissionRequest,
    declinePermissionRequest,
    deleteNotification,
    getNotification,
    getUserPermissionToViewTodos,
} from './utils/endpoints'
import { IoIosNotifications } from 'react-icons/io'
import { useQuery, useQueryClient } from 'react-query'
import { Notification } from './components/ui/Notification'
import { AiOutlineClose } from 'react-icons/ai'
import PermissionNotificationContentToView from './components/permission/PermissionNotificationContentToView'
import { set } from 'react-hook-form'
import useReusableMutation from './hooks/useReusableMutation'
import PermissionGranted from './components/permission/PermissionGranted'
import EditProfile from './components/users/EditProfile'

export default function Home() {
    const { data: session } = useSession()

    const user = session?.user as loggedUserType | undefined
    const {
        data: notification,
        isLoading,
        isFetching,
    } = useQuery<NotificationType[]>('notification', getNotification)

    const [isFullstackWay, setIsFullstackWay] = useLocalStorage(
        'isFullStackWay',
        false
    )
    const [isOpenNotification, setIsOpenNotification] = useState(false)
    const [isOpenProfile, setIsOpenProfile] = useState(false)
    const queryClient = useQueryClient()
    const {
        mutation: deleteNotificationMutation,
        isLoading: isLoadingDeleteNotification,
    } = useReusableMutation(
        'deleteNotification',
        deleteNotification, // This is the function that makes the delete request
        queryClient,
        ['notifications']
    )
    const [isOpen, setIsOpen] = useState(false)
    const [permissionRequests, setPermissionRequests] =
        useState<permissionRequestType>([])

    const isPending = permissionRequests.some(
        (request) => request.status === status.Pending
    )

    useEffect(() => {
        if (!user) return
        getUserPermissionToViewTodos()
            .then((data) => {
                setPermissionRequests(data)
            })
            .catch((err) => {
                console.log(err)
                errorToast(err.message)
            })
    }, [user])
    console.log(isOpenProfile)
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
            onClick: () => {
                ;() => {}
            },
        },
    ]

    useEffect(() => {
        isFullstackWay
            ? successToast('Fullstack is enabled')
            : successToast('Client side is enabled')
    }, [isFullstackWay])
    return (
        <div className="relative">
            <>
                {isPending && (
                    <PermissionNotificationContentToView
                        permissionRequests={permissionRequests}
                        declinePermissionRequest={declinePermissionRequest}
                        acceptPermissionRequest={acceptPermissionRequest}
                    />
                )}
            </>

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
                                alt="user image"
                            />
                        </div>
                    </UserMenu>
                </div>
                <button onClick={() => setIsOpenNotification(true)}>
                    <IoIosNotifications
                        className={`w-6 h-6 fill-white ${
                            notification?.length
                                ? 'fill-red-500 animate-ringBell'
                                : ''
                        }`}
                    />
                </button>
            </div>

            <div className="fixed bottom-[50%] z-50 left-0">
                <Modal
                    setIsOpen={setIsOpen}
                    isOpen={isOpen}
                    className="w-[450px] flex flex-col gap-4 p-4  bottom-[20%] left-0"
                    modalTitle={'Welcome in Todo application!'}
                    initial={{
                        x: '-100%',
                        opacity: 1,
                    }}
                    animate={{
                        x: 0,
                        opacity: 1,
                    }}
                    exit={{
                        x: '-100%',
                        opacity: 0,
                    }}
                >
                    <ClientSideOrFullStack
                        setIsFullstackWay={setIsFullstackWay}
                        isFullstackWay={isFullstackWay}
                        setIsOpen={setIsOpen}
                    />
                </Modal>

                {!isOpen && (
                    <HighlightButton
                        onClick={() => setIsOpen(true)}
                        type="button"
                        label={<BsChevronRight />}
                        className="fixed bg-primaryBlue bottom-0 md:bottom-[50%] w-max left-0 p-4 sm:p-6"
                    />
                )}
            </div>
            <motion.div
                animate={{
                    scale: isOpen ? 0.9 : 1,
                    opacity: isOpen ? 0.7 : 1,
                }}
                transition={{ type: 'spring', bounce: 0, duration: 0.5 }}
                className=" relative"
            >
                <Todos
                    isFullstackWay={isFullstackWay}
                    setIsFullstackWay={setIsFullstackWay}
                />
            </motion.div>
            {isOpenNotification && (
                <Modal
                    className="w-[450px] h-max  md:w-[600px] left-1/2 top-1/2 !-translate-y-1/2 !-translate-x-1/2 gap-4 overflow-y-auto"
                    setIsOpen={setIsOpenNotification}
                    isOpen={isOpenNotification}
                    modalTitle="My notifications"
                    initial={{
                        y: '-100%',
                        opacity: 1,
                    }}
                    animate={{
                        y: 0,
                        opacity: 1,
                    }}
                    exit={{
                        y: '-100%',
                        opacity: 0,
                    }}
                >
                    <div className="flex flex-col gap-4 max-h-[400px] p-2 overflow-y-auto">
                        <PermissionGranted
                            notification={notification}
                            deleteNotificationMutation={
                                deleteNotificationMutation
                            }
                        />
                    </div>
                    <div className="ml-auto mt-auto block">
                        <button
                            onClick={() => setIsOpenNotification(false)}
                            className="capitalize hover:outline outline-1 px-4 py-2 rounded-md outline-red-500"
                        >
                            close
                        </button>
                    </div>
                </Modal>
            )}

            {isOpenProfile && (
                <Modal
                    className="w-[450px] h-max  md:w-[600px] left-1/2 top-1/2 !-translate-y-1/2 !-translate-x-1/2 gap-4 overflow-y-auto"
                    setIsOpen={setIsOpenProfile}
                    isOpen={isOpenProfile}
                    modalTitle="My notifications"
                    initial={{
                        y: '-100%',
                        opacity: 1,
                    }}
                    animate={{
                        y: 0,
                        opacity: 1,
                    }}
                    exit={{
                        y: '-100%',
                        opacity: 0,
                    }}
                >
                    <EditProfile setIsOpen={setIsOpenProfile} />
                </Modal>
            )}
        </div>
    )
}
