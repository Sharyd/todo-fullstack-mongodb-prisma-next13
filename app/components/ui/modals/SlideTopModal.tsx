import React from 'react'
import { Modal } from './Modal'
import { AnimatePresence } from 'framer-motion'

interface Props {
    children: React.ReactNode
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
    title: string
    isOpen: boolean
}

const ProfileModal = ({ children, setIsOpen, isOpen, title }: Props) => {
    return (
        <Modal
            className="w-[450px]  md:w-[600px] h-max   m-auto  overflow-y-auto"
            setIsOpen={setIsOpen}
            isOpen={isOpen}
            modalTitle={title}
            initial={{
                y: '-100',
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
            {children}
        </Modal>
    )
}

export default ProfileModal
