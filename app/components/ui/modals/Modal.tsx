'use client'
import { useContext } from 'react'
import { Dialog } from '@headlessui/react'
import { ThemeContext } from '../../../store/themeContext'
import { AnimatePresence, TargetAndTransition, motion } from 'framer-motion'

interface AnimationProps {
    initial: TargetAndTransition | any
    animate: TargetAndTransition
    exit: TargetAndTransition
}

interface Props extends AnimationProps {
    isOpen: boolean
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
    children: React.ReactNode
    modalTitle: string
    className?: string
}

export function Modal({
    isOpen,
    setIsOpen,
    children,
    modalTitle,
    className,
    animate,
    exit,
    initial,
}: Props) {
    const { theme } = useContext(ThemeContext)

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <div
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-black bg-opacity-50"
                    />
                    <Dialog
                        key={'modal'}
                        as={motion.div}
                        initial={initial}
                        animate={animate}
                        exit={exit}
                        transition={{
                            type: 'spring',
                            bounce: 0,
                            duration: 0.5,
                        }}
                        static
                        className={`fixed inset-0 z-50 p-5 ${className} ${
                            theme === 'theme-light'
                                ? 'bg-white text-[#777a92]'
                                : 'bg-[#25273c] text-white'
                        }`}
                        open={isOpen}
                        onClose={() => setIsOpen(false)}
                    >
                        <Dialog.Panel className="flex flex-col gap-5 ">
                            <Dialog.Title className="text-2xl">
                                {modalTitle}
                            </Dialog.Title>
                            {children}
                        </Dialog.Panel>
                    </Dialog>
                </>
            )}
        </AnimatePresence>
    )
}
