'use client'

import axios from 'axios'
import React, { useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import { errorToast, successToast } from '../utils/toast'
import Input from '../components/ui/Input'
import Card from '../components/ui/Card'
import Link from 'next/link'
import Providers from '../components/auth/Providers'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import ThemeToggler from '../components/theme/ThemeToggler'

const Login = () => {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FieldValues>({
        defaultValues: {
            email: '',
            password: '',
        },
    })

    const getErrorMessage = (error: any): string => {
        if (error.status === 401) {
            return 'Invalid credentials. Please check your email and password.'
        } else if (error.status === 403) {
            return 'You do not have permission to sign in.'
        } else {
            return 'An error occurred during login.'
        }
    }

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true)

        signIn('credentials', {
            ...data,
            redirect: false,
        })
            .then((callback) => {
                setIsLoading(false)

                if (callback?.ok) {
                    successToast('Logged in')
                    router.push('/')
                }

                if (callback?.error) {
                    errorToast(getErrorMessage(callback.error))
                }
            })
            .catch((error) => {
                setIsLoading(false)
                console.error(error)
                errorToast('An error occurred during login.')
            })
    }
    return (
        <Card>
            <form className="relative" onSubmit={handleSubmit(onSubmit)}>
                <h2 className="text-center text-xl py-2">
                    Login to your account
                </h2>
                <ThemeToggler className="absolute top-3 right-4 bg-darkGrayishBlue p-2 rounded-full" />

                <div className="flex flex-col items-start w-full p-5">
                    <Input
                        id="email"
                        errors={errors}
                        register={register}
                        placeholderText="JaneDoe@gmail.com"
                        label="Email"
                        type="email"
                        required
                    />
                    <Input
                        id="password"
                        errors={errors}
                        register={register}
                        label="Password"
                        type="password"
                        placeholderText="********"
                        required
                    />
                    <Input id="submit" type="submit" label="Login" />

                    <div className="flex flex-col gap-6 w-full">
                        <p className="flex py-3 justify-center items-center gap-2 p-2">
                            Do not have an account?
                            <Link
                                href="/register"
                                className="hover:text-primaryBlue"
                            >
                                Register
                            </Link>
                        </p>
                        <Providers />
                    </div>
                </div>
            </form>
        </Card>
    )
}

export default Login
