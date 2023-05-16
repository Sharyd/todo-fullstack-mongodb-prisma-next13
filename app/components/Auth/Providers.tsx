import React from 'react'
import { FcGoogle } from 'react-icons/fc'
import { AiFillGithub } from 'react-icons/ai'
import { signIn } from 'next-auth/react'
import Button from '../ui/Button'
const Providers = () => {
    return (
        <div className="flex flex-col gap-4 w-full items-center text-veryDarkGrayishBlue">
            <Button
                outline
                label="Continue with Google"
                icon={FcGoogle}
                onClick={() => signIn('google')}
            />
            <Button
                outline
                label="Continue with Github"
                icon={AiFillGithub}
                onClick={() => signIn('github')}
            />
        </div>
    )
}

export default Providers
