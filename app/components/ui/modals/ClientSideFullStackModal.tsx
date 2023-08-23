import React from 'react'
import { Modal } from './Modal'
import ClientSideOrFullStack from '../ClientSideOrFullStack'
import { HighlightButton } from '../Button'
import { BsChevronRight } from 'react-icons/bs'

interface Props {
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
    isOpen: boolean
    isFullstackWay: boolean
    setIsFullstackWay: React.Dispatch<React.SetStateAction<boolean>>
}

const ClientSideFullStackModal = ({
    setIsOpen,
    isOpen,
    isFullstackWay,
    setIsFullstackWay,
}: Props) => {
    return (
        <>
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
        </>
    )
}

export default ClientSideFullStackModal
