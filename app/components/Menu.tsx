import { Fragment } from 'react'
import { Menu } from '@headlessui/react'
import { AiOutlineDelete } from 'react-icons/ai'

interface Props {
    children: React.ReactNode
    buttons: { label: string; onClick: () => void }[]
}

export function CustomMenu({ children, buttons }: Props) {
    return (
        <>
            <Menu as="div" className="relative inline-block text-left">
                <Menu.Button>{children}</Menu.Button>
                <Menu.Items
                    className={
                        'absolute right-0 mt-2 w-40 origin-top-right divide-y divide-gray-400 rounded-md bg-secondaryBackground shadow-lg ring-1  ring-opacity-5 focus:outline-none'
                    }
                >
                    <div className="p-2">
                        {buttons.map((button, idx) => (
                            /* Use the `active` state to conditionally style the active item. */
                            <Menu.Item key={idx} as={Fragment}>
                                {({ active }) => (
                                    <button
                                        type="button"
                                        onClick={button.onClick}
                                        className={`${
                                            active
                                                ? 'bg-primaryBlue text-white'
                                                : 'text-secondaryText'
                                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                    >
                                        {button.label}
                                    </button>
                                )}
                            </Menu.Item>
                        ))}
                    </div>
                </Menu.Items>
            </Menu>
        </>
    )
}
