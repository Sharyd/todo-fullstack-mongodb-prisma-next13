'use client'
import { Fragment, useContext, useState } from 'react'
import { Dialog } from '@headlessui/react'
import { BsChevronLeft } from 'react-icons/bs'
import { ThemeContext } from '../../../store/themeContext'
import { AnimatePresence, motion } from 'framer-motion'

import { HighlightButton, MainButton } from '../Button'
import { sideAnimation } from '@/app/utils/animation'

interface Props {
    isFullstackWay: boolean
    setIsFullstackWay: React.Dispatch<React.SetStateAction<boolean>>
    isOpen: boolean
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export function SideModal({
    setIsFullstackWay,
    isFullstackWay,
    isOpen,
    setIsOpen,
}: Props) {
    const { theme } = useContext(ThemeContext)

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <Dialog
                        key={'modal'}
                        as={motion.div}
                        initial={{ x: '-100%', opacity: 0 }}
                        animate={{
                            x: 0,
                            opacity: 1,
                        }}
                        exit={{
                            x: '-100%',
                            opacity: 0,
                        }}
                        transition={{
                            type: 'spring',
                            bounce: 0,
                            duration: 0.6,
                        }}
                        static
                        className={`fixed w-[450px] flex flex-col gap-4 p-4 ${
                            theme === 'theme-light'
                                ? 'bg-white text-[#777a92]'
                                : 'bg-[#25273c] text-white'
                        } bottom-[20%] left-0 z-50`}
                        open={isOpen}
                        onClose={() => setIsOpen(false)}
                    >
                        <Dialog.Panel className="flex flex-col gap-5">
                            <Dialog.Title className="text-2xl">
                                Welcome in Todo application!
                            </Dialog.Title>

                            <p className="text-xl">
                                Choose the version: <br /> 1. Full Stack Todo
                                App: - Enjoy the complete functionality of Todo
                                app. - Your data will be securely stored on the
                                server. - Access your Todo list from anywhere.
                                <br /> 2. Client-Side Version with LocalStorage:
                                - Experience a lightweight version of Todo app.
                                - Your data will be stored locally in your
                                browser's storage. - Ideal for quick usage and
                                personal use.
                            </p>
                            <p className="text-green-600">
                                {isFullstackWay
                                    ? 'fullStack active'
                                    : 'client side active'}
                            </p>
                            <MainButton
                                onClick={() =>
                                    setIsFullstackWay((prev) => !prev)
                                }
                                label={
                                    isFullstackWay ? 'Fullstack' : 'Client side'
                                }
                            ></MainButton>

                            <HighlightButton
                                onClick={() => setIsOpen(false)}
                                type="button"
                                label={<BsChevronLeft />}
                                className="absolute top-0 md:-right-16 right-0 p-4 sm:p-6"
                            />
                        </Dialog.Panel>
                    </Dialog>
                </>
            )}
        </AnimatePresence>
    )
}
