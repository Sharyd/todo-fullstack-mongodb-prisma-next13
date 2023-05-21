'use client'
import Image from 'next/image'
import GradientImage from './components/GradientImage'
import Todo from './components/Todo/Todos'

import { MouseEvent, Suspense, useEffect, useState } from 'react'
import useLocalStorage from './hooks/useLocalStorage'
import { SideModal } from './components/ui/SideModal'
import { BsChevronRight, BsChevronLeft } from 'react-icons/bs'
import { motion } from 'framer-motion'
import { successToast } from './utils/toast'
import Todos from './components/Todo/Todos'
import { MdLogout } from 'react-icons/md'
import { HighlightButton } from './components/ui/Button'
import { signOut } from 'next-auth/react'

export default function Home() {
    const [isFullstackWay, setIsFullstackWay] = useLocalStorage(
        'isFullStackWay',
        false
    )
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        isFullstackWay
            ? successToast('Fullstack is enabled')
            : successToast('Client side is enabled')
    }, [isFullstackWay])

    return (
        <>
            <HighlightButton
                label={'Logout'}
                onClick={() => {
                    signOut({
                        callbackUrl: '/login',
                    })
                    successToast('Logged out')
                }}
                Icon={MdLogout}
                className="flex items-center w-max gap-1.5 absolute right-6 top-6 md:right-20 md:top-20 py-3 px-4 rounded-md"
            ></HighlightButton>

            <div className="fixed bottom-[50%] left-0">
                <SideModal
                    setIsFullstackWay={setIsFullstackWay}
                    isFullstackWay={isFullstackWay}
                    setIsOpen={setIsOpen}
                    isOpen={isOpen}
                />

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
                transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
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
