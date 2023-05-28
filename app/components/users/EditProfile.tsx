'use client'

import axios from 'axios'
import React, { useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import { errorToast, successToast } from '../../utils/toast'
import Input from '../ui/Input'
import { useRouter } from 'next/navigation'
import ImageInput from '../ui/ImageInput'
import { editUser } from '../../utils/endpoints'

interface Props {
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const EditProfile = ({ setIsOpen }: Props) => {
    const [isLoading, setIsLoading] = useState(false)
    const [image, setImage] = useState<string | null>(null)

    const router = useRouter()
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FieldValues>({
        defaultValues: {
            name: '',
            oldPassword: '',
            newPassword: '',
        },
    })

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        setIsLoading(true)

        const updates: any = {}

        if (data.name) updates.name = data.name
        if (data.oldPassword && data.newPassword)
            updates.password = data.newPassword
        if (image) updates.image = image.split(',')[1]

        try {
            await editUser({ ...updates, oldPassword: data.oldPassword })
            successToast('Profile updated successfully')
            reset()
            setIsOpen(false)
        } catch (error: any) {
            errorToast(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div>
            <form className="relative" onSubmit={handleSubmit(onSubmit)}>
                <h2 className="text-center text-xl py-2">Edit Your Profile</h2>
                <div className="flex flex-col items-start w-full p-5">
                    <Input
                        id="name"
                        register={register}
                        label="New Name"
                        type="text"
                        placeholderText="Update Name"
                        errors={errors}
                    />
                    <Input
                        id="oldPassword"
                        register={register}
                        label="Old Password"
                        errors={errors}
                        type="password"
                        placeholderText="Enter Old Password"
                        required
                    />
                    <Input
                        id="newPassword"
                        register={register}
                        label="New Password"
                        errors={errors}
                        type="password"
                        placeholderText="Enter New Password"
                        required
                    />
                    <div className="flex mt-2 flex-col gap-4 w-full">
                        <ImageInput onImageChange={setImage} />
                        <div className="flex flex-1 items-center justify-around">
                            <Input id="submit" type="submit" label="Update" />
                            <div
                                onClick={() => setIsOpen(false)}
                                className="w-full"
                            >
                                <Input
                                    id="button"
                                    type="button"
                                    label="Close"
                                    className="border-red-600 hover:bg-red-600 hover:text-white"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default EditProfile
