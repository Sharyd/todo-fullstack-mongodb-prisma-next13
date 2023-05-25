'use client'
import React, { useState } from 'react'
import { Modal } from '../ui/modals/Modal'
import SelectUser from '../users/SelectUser'
import { userType } from '@/app/utils/types'
import { HighlightButton } from '../ui/Button'
import { addUserPermission } from '@/app/utils/endpoints'
import { errorToast, successToast } from '@/app/utils/toast'

interface Props {
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const AddPermission = ({ setIsOpen }: Props) => {
    const [selected, setSelected] = useState<userType>({ name: 'Select User' })

    const submitPermission = async () => {
        try {
            // Call the new API function with the selected user's ID
            if (!selected?.id) return
            await addUserPermission(selected?.id)
            successToast('Permission added')
            setIsOpen(false)
        } catch (error) {
            console.error(error)
            errorToast('Error adding permission to user')
            // Handle error here, e.g., show error message to user
        }
    }

    return (
        <div className="p-2 flex flex-col gap-6">
            <p>Select user to add permission</p>
            <SelectUser selected={selected} setSelected={setSelected} />

            <div className="flex py-4 justify-around items-center ">
                <HighlightButton
                    onClick={submitPermission}
                    type="submit"
                    label={'submit'}
                    className="capitalize px-4 py-2 rounded-md"
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
