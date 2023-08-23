'use client'
import { type } from 'os'
import { IconType } from 'react-icons'
import { BsX } from 'react-icons/bs'

interface MainButtonProps {
    label: string
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void
    disabled?: boolean
    outline?: boolean
    small?: boolean
    icon?: IconType
    className?: string
    type?: 'button' | 'submit' | 'reset'
}

export const MainButton: React.FC<MainButtonProps> = ({
    label,
    onClick,
    disabled,
    outline,
    small,
    type,
    className,
    icon: Icon,
}) => {
    return (
        <button
            disabled={disabled}
            onClick={onClick}
            type={type}
            className={`relative inline-flex w-full flex-col items-center justify-start px-6 py-3 overflow-hidden font-medium transition-all bg-white rounded hover:bg-white group ${className}`}
        >
            <span className="w-[88%] h-96 rounded rotate-[-75deg] bg-primaryBlue absolute bottom-0 left-0 -translate-x-full ease-out duration-500 transition-all translate-y-full mb-9 ml-9 group-hover:ml-0 group-hover:mb-32 group-hover:translate-x-0"></span>
            <span className="relative w-full transition-all  text-left text-black transition-colors duration-300 ease-in-out group-hover:text-white">
                <span className="flex gap-4 group-hover:justify-center transition-all relative">
                    {Icon && <Icon size={24} className="left-4 top-3" />}
                    {label}
                </span>
            </span>
        </button>
    )
}

interface HighLightButtonProps {
    label: string | JSX.Element
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
    type?: 'button' | 'submit' | 'reset'
    className?: string
    Icon?: IconType
}

export const HighlightButton = ({
    label,
    onClick,
    type,
    className,
    Icon: Icon,
}: HighLightButtonProps) => {
    return (
        <button
            onClick={onClick}
            type={type}
            className={`text-white z-50 cursor-pointer animate-pulse hover:animate-none ${className}`}
        >
            {Icon && <Icon size={24} className="left-4 top-3" />}
            {label}
        </button>
    )
}

export const CloseButton = ({ onClick }: { onClick: () => void }) => {
    return (
        <button
            onClick={onClick}
            className="capitalize hover:outline outline-1 px-4 py-2 rounded-md outline-red-500"
        >
            close
        </button>
    )
}
