export const sideAnimation = {
    hidden: {
        opacity: 0,
        x: '-100%',
    },
    visible: {
        x: 0,
        opacity: 1,
    },
    exit: {
        x: '-100%',
        opacity: 0,
    },
    transition: {
        type: 'spring',
        bounce: 0,
        duration: 0.6,
    },
}
