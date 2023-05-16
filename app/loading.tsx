import Loader from '@/app/components/ui/Loader'

const Loading = () => {
    return (
        <div className="h-[100vh] flex flex-col justify-center bg-black/90 items-center ">
            <div className="flex h-[30vh]">
                <Loader size={100} />
            </div>
        </div>
    )
}

export default Loading
