'use client'

import axios from 'axios'
import React, { useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import { errorToast, successToast } from '../utils/toast'
import Input from '../components/ui/Input'
import Card from '../components/ui/Card'
import Link from 'next/link'
import Providers from '../components/Auth/Providers'

const Register = () => {
    const [isLoading, setIsLoading] = useState(false)

    const {
        register,
        handleSubmit,
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
            .post('/api/register', data)
            .then(() => {
                successToast('Registered!')
            })
            .catch((error) => {
                errorToast(error)
            })
            .finally(() => {
                setIsLoading(false)
            })
    }
    return (
        <Card>
            <form onSubmit={handleSubmit(onSubmit)}>
                <h2 className="text-center text-xl py-2">
                    Create your account
                </h2>
                <div className="flex flex-col items-start w-full p-5">
                    <Input
                        register={register}
                        placeholderText="JaneDoe@gmail.com"
                        label="Email"
                        type="email"
                        required
                    />
                    <Input
                        register={register}
                        label="Name"
                        type="text"
                        placeholderText="Jane Doe"
                        required
                    />
                    <Input
                        register={register}
                        label="Password"
                        type="password"
                        placeholderText="********"
                        required
                    />

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
