import React from 'react'
import { HighlightButton, MainButton } from './ui/Button'
import { BsChevronLeft } from 'react-icons/bs'

interface Props {
    isFullstackWay: boolean
    setIsFullstackWay: React.Dispatch<React.SetStateAction<boolean>>
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const ClientSideOrFullStack = ({
    isFullstackWay,
    setIsFullstackWay,
    setIsOpen,
}: Props) => {
    return (
        <div className="flex flex-col gap-6">
            <p className="text-xl">
                Choose the version: <br /> 1. Full Stack Todo App: - Enjoy the
                complete functionality of Todo app. - Your data will be securely
                stored on the server. - Access your Todo list from anywhere.
                <br />
                <br />
                2. Client-Side Version with LocalStorage: - Experience a
                lightweight version of Todo app. - Your data will be stored
                locally in your browser's storage. - Ideal for quick usage and
                personal use.
            </p>
            <p className="text-green-600">
                {isFullstackWay ? 'fullStack active' : 'client side active'}
            </p>
            <MainButton
                onClick={() => setIsFullstackWay((prev) => !prev)}
                label={!isFullstackWay ? 'Fullstack' : 'Client side'}
            ></MainButton>
            <HighlightButton
                onClick={() => setIsOpen(false)}
                type="button"
                label={<BsChevronLeft />}
                className="bg-primaryBlue absolute top-0 md:-right-16 right-0 p-4 sm:p-6"
            />
        </div>
    )
}

export default ClientSideOrFullStack
