'use client'
import { Fragment, useContext, useState } from 'react'
import { Dialog } from '@headlessui/react'
import { BsChevronLeft } from 'react-icons/bs'
import { ThemeContext } from '../../../store/themeContext'
import { AnimatePresence, motion } from 'framer-motion'

import { HighlightButton, MainButton } from '../Button'
import SelectUser from '../../users/SelectUser'
import { transform } from 'typescript'

interface Props {
    isOpen: boolean
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
    children: React.ReactNode
    modalTitle: string
}

export function Modal({ isOpen, setIsOpen, children, modalTitle }: Props) {
    const { theme } = useContext(ThemeContext)

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <Dialog
                        key={'modal'}
                        as={motion.div}
                        initial={{ y: '-100%', opacity: 0 }}
                        animate={{
                            y: 0,
                            opacity: 1,
                        }}
                        exit={{
                            y: '-100%',
                            opacity: 0,
                        }}
                        transition={{
                            type: 'spring',
                            bounce: 0,
                            duration: 0.6,
                        }}
                        static
                        className={`fixed w-[500px] left-1/2 top-1/2 !-translate-y-1/2 !-translate-x-1/2 gap-4 p-4 ${
                            theme === 'theme-light'
                                ? 'bg-white text-[#777a92]'
                                : 'bg-[#25273c] text-white'
                        }  z-50`}
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
