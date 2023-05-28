'use client'

import axios from 'axios'
import React, { useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import { errorToast, successToast } from '../../utils/toast'
import Input from '../ui/Input'
import { useRouter } from 'next/navigation'
import ImageInput from '../ui/ImageInput'
import { editUser } from '../../utils/endpoints'
import { useSession, getSession, signIn } from 'next-auth/react'

interface EditProfileProps {
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

interface FormValues {
    name?: string
    oldPassword?: string
    newPassword?: string
}

const EditProfile = ({ setIsOpen }: EditProfileProps) => {
    const { data: session, status } = useSession()
    const [isLoading, setIsLoading] = useState(false)
    const [image, setImage] = useState<string | null>(null)

    const router = useRouter()
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormValues>()

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        setIsLoading(true)

        const updates: any = {}

        if (data.name) updates.name = data.name
        if (data.oldPassword && data.newPassword)
            updates.password = {
                oldPassword: data.oldPassword,
                newPassword: data.newPassword,
            }
        if (image) updates.image = image.split(',')[1]
        try {
            await editUser(updates)
            successToast('Profile updated successfully')
            reset()

            // Here we're signing the user in again with their new credentials to refresh their session
            const { error } = (await signIn('credentials', {
                redirect: false,
                email: session?.user?.email,
                password: data.newPassword,
            })) as any

            if (error) {
                throw new Error(error)
            }

            router.push('/')
        } catch (error: any) {
            errorToast(error.message || 'An error occurred')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div>
            <form className="relative" onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col text-center gap-3 px-5">
                    <h2 className="text-center text-xl">Edit Your Profile</h2>
                    <p>
                        Please note that editing your name and image are
                        optional. However, if you wish to update either just
                        your name or image, you will also need to provide your
                        passwords(like old and new one you can write the old
                        password to both fields). This is a security measure
                        designed to confirm your identity and protect your
                        account
                    </p>
                </div>
                <div className="flex flex-col items-start w-full p-5">
                    <Input
                        id="name"
                        register={register}
                        label="New Name"
                        type="text"
                        placeholderText="Update Name"
                        errors={errors}
                        value={session?.user?.name}
                    />
                    <Input
                        id="oldPassword"
                        register={register}
                        label="Old Password *"
                        errors={errors}
                        type="password"
                        placeholderText="Enter Old Password"
                        required
                    />
                    <Input
                        id="newPassword"
                        register={register}
                        label="New Password *"
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
