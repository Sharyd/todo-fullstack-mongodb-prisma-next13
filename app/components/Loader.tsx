'use client'

import { PuffLoader } from 'react-spinners'

interface Props {
    size: number
}

const Loader = ({ size }: Props) => {
    return <PuffLoader size={size} color="blue" />
}

export default Loader
