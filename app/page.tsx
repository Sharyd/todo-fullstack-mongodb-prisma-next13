'use client'
import Image from 'next/image'
import GradientImage from './components/GradientImage'
import Todo from './components/Todo/Todos'

import { Suspense, useEffect, useState } from 'react'
import useLocalStorage from './hooks/useLocalStorage'
import { SideModal } from './components/ui/SideModal'
import { BsChevronRight, BsChevronLeft } from 'react-icons/bs'
import { motion } from 'framer-motion'
import { successToast } from './utils/toast'
import Todos from './components/Todo/Todos'

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
        <div>
            <div className="fixed bottom-[50%] left-0">
                <SideModal
                    setIsFullstackWay={setIsFullstackWay}
                    isFullstackWay={isFullstackWay}
                    setIsOpen={setIsOpen}
                    isOpen={isOpen}
                />

                {!isOpen && (
                    <button
                        onClick={() => setIsOpen(true)}
                        className="bg-primaryBlue cursor-pointer p-4 z-30 fixed bottom-0 sm:bottom-[50%] sm:p-6 animate-pulse"
                    >
                        <BsChevronRight />
                    </button>
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
        </div>
    )
}
