'use client'
import React, { useState } from 'react'
import SelectUser from '../users/SelectUsers'
import { userType } from '@/app/utils/types'
import { CloseButton, HighlightButton } from '../ui/Button'
import { errorToast, successToast } from '@/app/utils/toast'
import { getUsers } from '@/app/utils/endpoints'
import { useQuery } from 'react-query'

import Loader from '../ui/Loader'

interface Props {
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
    text: string
    addPermission: (id: string) => Promise<void>
}

const AddPermission = ({ setIsOpen, text, addPermission }: Props) => {
    const [selected, setSelected] = useState<userType>({ name: 'Select User' })

    const { data, isLoading, isError } = useQuery('users', getUsers)
    const [isLoadingAddPermission, setIsLoadingAddPermission] = useState(false)

    const submitPermission = async () => {
        if (!selected?.id) return
        setIsLoadingAddPermission(true)
        try {
            await addPermission(selected?.id)
            successToast('Permission sent')
            setIsOpen(false)
        } catch (error: any) {
            errorToast(error.message)
        }

        setIsLoadingAddPermission(false)
    }

    return (
        <div className="p-2 flex flex-col relative gap-6">
            <div className="flex flex-col gap-8">
                <p>{text}</p>
                <SelectUser
                    data={data}
                    isLoading={isLoading}
                    isError={isError}
                    selected={selected}
                    setSelected={setSelected}
                />
            </div>

            <div className="flex mt-auto  py-4 justify-around items-center">
                {!isLoadingAddPermission ? (
                    <HighlightButton
                        onClick={submitPermission}
                        type="submit"
                        label={'submit'}
                        className="bg-primaryBlue capitalize px-4 py-2 rounded-md"
                    />
                ) : (
                    <Loader size={20} />
                )}

                <CloseButton onClick={() => setIsOpen(false)} />
            </div>
        </div>
    )
}

export default AddPermission
