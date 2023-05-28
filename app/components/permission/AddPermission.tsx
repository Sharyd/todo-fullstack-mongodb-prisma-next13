'use client'
import React, { useState } from 'react'
import { Modal } from '../ui/modals/Modal'
import SelectUser from '../users/SelectUser'
import { userType } from '@/app/utils/types'
import { HighlightButton } from '../ui/Button'

import { errorToast, successToast } from '@/app/utils/toast'
import { getUsers } from '@/app/utils/endpoints'
import { useQuery } from 'react-query'

interface Props {
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
    text: string
    addPermission: (id: string) => Promise<void>
}

const AddPermission = ({ setIsOpen, text, addPermission }: Props) => {
    const [selected, setSelected] = useState<userType>({ name: 'Select User' })
    const { data, isLoading, isError } = useQuery('users', getUsers)
    const submitPermission = async () => {
        try {
            if (!selected?.id) return
            await addPermission(selected?.id)
            successToast('Permission sent')
            setIsOpen(false)
        } catch (error: any) {
            errorToast(error.message)
        }
    }

    return (
        <div className="p-2 flex flex-col relative gap-6">
            <div className="">
                <p>{text}</p>
                <SelectUser
                    data={data}
                    isLoading={isLoading}
                    isError={isError}
                    selected={selected}
                    setSelected={setSelected}
                />
            </div>

            <div className="flex mt-auto py-4 justify-around items-center">
                <HighlightButton
                    onClick={submitPermission}
                    type="submit"
                    label={'submit'}
                    className=" bg-primaryBlue capitalize px-4 py-2 rounded-md"
                />

                <button
                    onClick={() => setIsOpen(false)}
                    className="capitalize hover:outline outline-1 px-4 py-2 rounded-md outline-red-500"
                >
                    close
                </button>
            </div>
        </div>
    )
}

export default AddPermission
