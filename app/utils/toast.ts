import toast, { Renderable } from 'react-hot-toast'

export const successToast = (
    message: string,
    icon?: Renderable | undefined
) => {
    toast.success(message, {
        icon: icon,
        duration: 2000,
        position: 'bottom-center',
        className: 'bg-green-500',
    })
}

export const errorToast = (message: string) => {
    toast.error(message, {
        duration: 2000,
        position: 'bottom-center',
        className: 'bg-red-500',
    })
}
