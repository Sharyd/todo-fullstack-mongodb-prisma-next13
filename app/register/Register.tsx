'use client'

import axios from 'axios'
import React, { useState } from 'react'
import { FieldValues, SubmitHandler, set, useForm } from 'react-hook-form'
import { errorToast, successToast } from '../utils/toast'
import Input from '../components/ui/Input'
import Card from '../components/ui/Card'
import Link from 'next/link'
import Providers from '../components/auth/Providers'
import ThemeToggler from '../components/theme/ThemeToggler'
import { clear } from 'console'
import { useRouter } from 'next/navigation'
import ImageInput from '../components/ui/ImageInput'

const Register = () => {
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
            email: '',
            password: '',
        },
    })

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true)

        axios
            .post('/api/register', { ...data, image })
            .then(() => {
                successToast('Registered successfully. Login to your account')
            })
            .catch((error) => {
                errorToast(error)
            })
            .finally(() => {
                setIsLoading(false)
            })

        reset()
        router.push('/login')
    }

    return (
        <Card>
            <form className="relative" onSubmit={handleSubmit(onSubmit)}>
                <h2 className="text-center text-xl py-2">
                    Create your account
                </h2>
                <ThemeToggler className="absolute top-3 right-4 bg-darkGrayishBlue p-2 rounded-full" />
                <div className="flex flex-col items-start w-full p-5">
                    <Input
                        id="email"
                        register={register}
                        placeholderText="JaneDoe@gmail.com"
                        label="Email"
                        errors={errors}
                        type="email"
                        required
                    />
                    <Input
                        id="name"
                        register={register}
                        label="Name"
                        type="text"
                        placeholderText="Jane Doe"
                        errors={errors}
                        required
                    />
                    <Input
                        id="password"
                        register={register}
                        label="Password"
                        errors={errors}
                        type="password"
                        placeholderText="********"
                        required
                    />
                    <div className="flex mt-2  flex-col gap-4 w-full">
                        <ImageInput onImageChange={setImage} />
                        <Input id="submit" type="submit" label="Register" />
                    </div>
                    <div className="flex flex-col gap-6 w-full">
                        <p className="flex py-3 justify-center items-center gap-2 p-2">
                            Do you already have account?
                            <Link
                                href="/login"
                                className="hover:text-primaryBlue"
                            >
                                Login
                            </Link>
                        </p>

                        <Providers />
                    </div>
                </div>
            </form>
        </Card>
    )
}

export default Register
