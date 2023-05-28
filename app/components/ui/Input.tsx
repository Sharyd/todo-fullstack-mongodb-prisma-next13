import React, { useCallback, useEffect, useRef, useState } from 'react'
import { FieldErrors } from 'react-hook-form'

interface InputProps {
    id: string
    label?: string
    register?: any
    required?: boolean
    placeholderText?: string
    type: string
    errors?: FieldErrors
    className?: string
    value?: string | null | undefined
}

const Input = ({
    id,
    label,
    register,
    required,
    value,
    errors,
    placeholderText,
    type,
    className,
}: InputProps) => {
    const [placeholder, setPlaceholder] = useState(placeholderText?.slice(0, 0))
    const [placeholderIndex, setPlaceholderIndex] = useState(0)
    const ref = useRef(null)

    const handlePlaceholderText = useCallback(
        (placeholderIdx: number) => {
            if (!placeholderText) return
            if (placeholderIdx <= placeholderText?.length) {
                setPlaceholder(placeholderText?.slice(0, placeholderIdx))
                setPlaceholderIndex((prev) => prev + 1)
            }
        },
        [placeholderText]
    )

    useEffect(() => {
        const intr = setTimeout(() => {
            handlePlaceholderText(placeholderIndex)
        }, 100)
        return () => {
            clearTimeout(intr)
        }
    }, [handlePlaceholderText, placeholderIndex])

    return (
        <div className="flex flex-col gap-2 p-2  w-full">
            {register && type !== 'submit' ? (
                <>
                    <label className="px-2">{label}</label>
                    <input
                        id={id}
                        ref={ref}
                        type={type}
                        className={`
                        rounded-md p-2 text-black/70 placeholder:text-black/30 focus:outline-darkGrayishBlue
                         w-[95%] focus:w-[100%] m-auto  transition-all  appearance-none focus:border-none focus:ring-0 focus:outline-none
                         ${
                             errors?.[id]
                                 ? 'border-2 border-red-500 '
                                 : 'focus:outline-darkGrayishBlue'
                         }
                        `}
                        placeholder={placeholder}
                        {...register(id, { required })}
                    />
                </>
            ) : (
                <input
                    id={id}
                    value={label}
                    className={`cursor-pointer rounded-md mt-2 p-2
                    hover:text-primaryBlue
                    w-[95%] focus:w-[100%] m-auto border-2 border-primaryBlue ${className}  transition-all border-0 appearance-none focus:border-none outline-primaryBlue focus:ring-0 focus:outline-none
                    
                    `}
                    type={type}
                />
            )}
        </div>
    )
}

export default Input
