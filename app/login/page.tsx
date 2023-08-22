import React from 'react'
import Container from '../components/ui/Container'
import Login from './Login'

import getLoggedUser from '../sessions/getLoggedUser'
import { getSession } from '../sessions/getLoggedUser'
import { redirect } from 'next/navigation'

const page = async () => {
    const session = await getSession()

    return (
        <>
            {!session ? (
                <Container>
                    <div className="w-[400px]  z-20 sm:w-[550px] animate-bounce hover:animate-none focus:animate-none">
                        <Login />
                    </div>
                </Container>
            ) : (
                redirect('/')
            )}
        </>
    )
}

export default page
