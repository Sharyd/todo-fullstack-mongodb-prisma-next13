'use client'
import { IconType } from 'react-icons'

interface ButtonProps {
    label: string
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void
    disabled?: boolean
    outline?: boolean
    small?: boolean
    icon?: IconType
}

const Button: React.FC<ButtonProps> = ({
    label,
    onClick,
    disabled,
    outline,
    small,
    icon: Icon,
}) => {
    return (
        <button
            disabled={disabled}
            onClick={onClick}
            className={`relative inline-flex w-full flex-col items-center justify-start px-6 py-3 overflow-hidden font-medium transition-all bg-white rounded hover:bg-white group`}
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

export default Button
