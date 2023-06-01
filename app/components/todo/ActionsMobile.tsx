import React from 'react'
import { filtersArray } from './Actions'
import { useTodoContext } from '@/app/store/todoContextProvider'

const ActionsMobile = () => {
    const { filter, setFilter } = useTodoContext()

    return (
        <div className="text-darkGrayishBlue z-20 flex sm:hidden gap-5 justify-center font-bold items-center py-3 px-4 text-xs ">
            {filtersArray.map((filterName) => (
                <button
                    key={filterName}
                    onClick={() => setFilter(filterName)}
                    className={`${
                        filterName === filter ? 'text-primaryBlue' : ''
                    }  capitalize hover:text-secondaryText`}
                >
                    {filterName}
                </button>
            ))}
        </div>
    )
}

export default ActionsMobile
