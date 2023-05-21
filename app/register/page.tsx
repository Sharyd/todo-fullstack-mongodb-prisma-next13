import React from 'react'
import Register from './Register'
import Container from '../components/Container'
import { getSession } from '../sessions/getLoggedUser'
import { redirect } from 'next/navigation'

const page = async () => {
    const session = await getSession()

    return (
        <>
            {!session ? (
                <Container>
                    <div className="w-[400px]  z-20 sm:w-[550px] animate-bounce hover:animate-none focus:animate-none">
                        <Register />
                    </div>
                </Container>
            ) : (
                redirect('/')
            )}
        </>
    )
}

export default page
