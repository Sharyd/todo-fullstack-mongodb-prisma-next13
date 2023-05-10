'use client'
import { Fragment, useContext, useState } from 'react'
import { Dialog } from '@headlessui/react'
import { BsChevronLeft } from 'react-icons/bs'
import { ThemeContext } from '../store/themeContext'
import { AnimatePresence, motion } from 'framer-motion'

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
                        } bottom-[40%] left-0 z-50`}
                        open={isOpen}
                        onClose={() => setIsOpen(false)}
                    >
                        <Dialog.Panel className="flex flex-col gap-5">
                            <Dialog.Title className="text-2xl">
                                Switch to approach
                            </Dialog.Title>

                            <h2 className="text-xl">
                                Do you want full stack todo app? Or just client
                                side version with localStorage
                            </h2>
                            <p className="text-green-600">
                                {isFullstackWay
                                    ? 'fullStack active'
                                    : 'client side active'}
                            </p>
                            <button
                                onClick={() =>
                                    setIsFullstackWay((prev) => !prev)
                                }
                                className="bg-primaryBlue text-white p-4 font-bold uppercase text-lg py-3 px-5"
                            >
                                {!isFullstackWay ? 'Fullstack' : 'Client side'}
                            </button>

                            <button
                                onClick={() => setIsOpen(false)}
                                className="bg-primaryBlue absolute text-white top-0 right-0 md:-right-16 cursor-pointer p-4  sm:p-6 animate-pulse"
                            >
                                <BsChevronLeft />
                            </button>
                        </Dialog.Panel>
                    </Dialog>
                </>
            )}
        </AnimatePresence>
    )
}
