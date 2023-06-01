import React, { useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import { useSession, signOut } from 'next-auth/react'
import axios from 'axios'
import Input from '../ui/Input'
import { deleteProfile } from '@/app/utils/endpoints'
import { errorToast, successToast } from '@/app/utils/toast'

interface DeleteProfileProps {
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

interface FormValues {
    password: string
}

const DeleteProfile = ({ setIsOpen }: DeleteProfileProps) => {
    const { data: session } = useSession()
    const [isLoading, setIsLoading] = useState(false)
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>()

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        setIsLoading(true)
        try {
            await deleteProfile(data.password)
            successToast('Profile deleted successfully')
            setIsOpen(false)
            signOut()
        } catch (error) {
            console.error(error)
            errorToast('Something went wrong')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div>
            <form
                className="flex flex-col gap-6"
                onSubmit={handleSubmit(onSubmit)}
            >
                <p>
                    If you logged with google or github you can delete your
                    account without providing a password
                </p>

                <Input
                    id="password"
                    register={register}
                    label="Password"
                    type="password"
                />
                <div className="flex flex-1 items-center justify-around">
                    <Input id="submit" type="submit" label="Delete" />
                    <div onClick={() => setIsOpen(false)} className="w-full">
                        <Input
                            id="button"
                            type="button"
                            label="Close"
                            className="border-red-600 hover:bg-red-600 hover:text-white"
                        />
                    </div>
                </div>
            </form>
        </div>
    )
}

export default DeleteProfile
