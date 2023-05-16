import React, { useEffect, useRef, useState } from 'react'

interface InputProps {
    label: string
    register: any
    required: boolean
    placeholderText: string
    type: string
}

const Input = ({
    label,
    register,
    required,
    placeholderText,
    type,
}: InputProps) => {
    const [placeholder, setPlaceholder] = useState(placeholderText.slice(0, 0))
    const [placeholderIndex, setPlaceholderIndex] = useState(0)
    const ref = useRef(null)
    console.log(ref)
    useEffect(() => {
        const intr = setTimeout(() => {
            setPlaceholder(placeholderText.slice(0, placeholderIndex))
            setPlaceholderIndex(placeholderIndex + 1)
        }, 100)
        return () => {
            clearTimeout(intr)
        }
    }, [placeholderText, placeholderIndex])

    return (
        <div className="flex flex-col gap-2 p-2  w-full">
            <label className="px-2">{label}</label>
            <input
                ref={ref}
                type={type}
                className="rounded-md p-2 text-darkGrayishBlue placeholder:text-black/30 focus:outline-darkGrayishBlue
                w-[95%] focus:w-[100%] m-auto  transition-all border-0 appearance-none focus:border-none focus:ring-0 focus:outline-none
                "
                placeholder={placeholder}
                {...register(label, { required })}
            />
        </div>
    )
}

export default Input
