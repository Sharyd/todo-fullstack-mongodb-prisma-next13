'use client'
import { Fragment, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { AiOutlineCheck, AiOutlineClose } from 'react-icons/ai'
import { BsChevronExpand } from 'react-icons/bs'
import { useQuery } from 'react-query'
import { get } from 'http'
import { getUsers } from '@/app/utils/endpoints'
import { PuffLoader } from 'react-spinners'
import Loader from '../ui/Loader'
import { userType } from '@/app/utils/types'

interface Props {
    selected: any
    setSelected: React.Dispatch<React.SetStateAction<any>>
}

export default function SelectUser({ selected, setSelected }: Props) {
    const { data, isLoading, isError } = useQuery('users', getUsers)

    if (isLoading) {
        return (
            <>
                <Loader size={20} />
            </>
        )
    }

    if (isError) {
        return <div>Error loading users</div>
    }
    if (!data) return null
    return (
        <Listbox value={selected} onChange={setSelected}>
            <div>
                <Listbox.Button
                    onClick={() =>
                        selected.id
                            ? setSelected({ name: 'Select User' })
                            : setSelected
                    }
                    className="relative w-full cursor-default rounded-lg bg-secondaryBackground py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm"
                >
                    <span className="block truncate">{selected?.name}</span>
                    <span className="absolute cursor-pointer inset-y-0 right-0 flex items-center pr-2">
                        {!selected.id ? (
                            <BsChevronExpand
                                className="h-5 w-5 text-gray-400"
                                aria-hidden="true"
                            />
                        ) : (
                            <AiOutlineClose className="h-5 w-5  text-gray-400" />
                        )}
                    </span>
                </Listbox.Button>
                <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <Listbox.Options className="mt-1 max-h-60 w-full overflow-auto rounded-md bg-secondaryBackground py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {data.map((person: userType, personIdx: number) => (
                            <Listbox.Option
                                key={personIdx}
                                className={({ active }) =>
                                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                        active &&
                                        'text-primaryBlue bg-primaryBlue/20'
                                    }`
                                }
                                value={person}
                            >
                                {({ selected }) => (
                                    <>
                                        <span
                                            className={`block truncate ${
                                                selected
                                                    ? 'font-medium'
                                                    : 'font-normal'
                                            }`}
                                        >
                                            {person.name}
                                        </span>
                                        {selected ? (
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primaryBlue">
                                                <AiOutlineCheck
                                                    className="h-5 w-5"
                                                    aria-hidden="true"
                                                />
                                            </span>
                                        ) : null}
                                    </>
                                )}
                            </Listbox.Option>
                        ))}
                    </Listbox.Options>
                </Transition>
            </div>
        </Listbox>
    )
}
