'use client'
import Image from 'next/image'
import GradientImage from './components/GradientImage'
import Todo from './components/todo/Todos'

import { MouseEvent, Suspense, useEffect, useState } from 'react'
import useLocalStorage from './hooks/useLocalStorage'

import { BsChevronRight, BsChevronLeft } from 'react-icons/bs'
import { motion } from 'framer-motion'
import { successToast } from './utils/toast'
import Todos from './components/todo/Todos'
import { MdLogout } from 'react-icons/md'
import { HighlightButton } from './components/ui/Button'
import { signOut, useSession } from 'next-auth/react'
import SelectUser from './components/users/SelectUser'
import { loggedUserType } from './utils/types'
import { Modal } from './components/ui/modals/Modal'
import ClientSideOrFullStack from './components/ClientSideOrFullStack'
import { getFirstName } from './utils/helpers'
import { CustomMenu as UserMenu } from './components/Menu'

export default function Home() {
    const { data: session } = useSession()

    const user = session?.user as loggedUserType | undefined
    console.log(user)
    const [isFullstackWay, setIsFullstackWay] = useLocalStorage(
        'isFullStackWay',
        false
    )
    const [isOpen, setIsOpen] = useState(false)

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
            onClick: () => {
                ;() => {}
            },
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
        <>
            <div className="cursor-pointer gap-3 z-50 absolute right-6 top-6 md:right-20 md:top-16">
                <UserMenu buttons={menuUserButtons}>
                    <div className="flex gap-3 items-center">
                        <p>{getFirstName(user?.name ?? '')}</p>
                        <Image
                            width={300}
                            height={300}
                            className="w-10 rounded-full   h-10 object-cover"
                            src={user?.image ?? '/images/defaultProfile.jpg'}
                            alt="user image"
                        />
                    </div>
                </UserMenu>
            </div>

            <div className="fixed bottom-[50%] left-0">
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
                        className="fixed bottom-0 md:bottom-[50%] w-max left-0 p-4 sm:p-6"
                    />
                )}
            </div>
            <motion.div
                animate={{
                    scale: isOpen ? 0.9 : 1,
                    opacity: isOpen ? 0.7 : 1,
                }}
                transition={{ type: 'spring', bounce: 0, duration: 0.5 }}
                className="z-30"
            >
                <Todos
                    isFullstackWay={isFullstackWay}
                    setIsFullstackWay={setIsFullstackWay}
                />
            </motion.div>
        </>
    )
}
