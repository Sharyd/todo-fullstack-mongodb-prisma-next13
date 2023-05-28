import toast, { Renderable } from 'react-hot-toast'

export const successToast = (
    message: string,
    icon?: Renderable | undefined,
    duration?: number
) => {
    toast.success(message, {
        icon: icon,
        duration: duration ?? 3500,
        position: 'bottom-center',
        className: 'bg-green-500',
    })
}

export const errorToast = (message: string, duration?: number) => {
    toast.error(message, {
        duration: duration ?? 3500,
        position: 'bottom-center',
        className: 'bg-red-500',
    })
}
