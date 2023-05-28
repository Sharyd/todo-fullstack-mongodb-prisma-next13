import { QueryClient, useMutation } from 'react-query'
import { AxiosResponse } from 'axios'

const useReusableMutation = (
    mutationKey: string,
    restFunction: (data: any) => Promise<AxiosResponse<any, any> | null>,
    queryClient: QueryClient,
    queryKey: string[]
) => {
    const mutation = useMutation(restFunction, {
        mutationKey: mutationKey,

        onMutate: async (newData: any) => {
            await queryClient.cancelQueries({
                queryKey: [...queryKey, newData.id],
            })

            const previousData = queryClient.getQueryData<any>([
                ...queryKey,
                newData.id,
            ])
            queryClient.setQueryData([...queryKey, newData.id], newData)
            return { previousData, newData }
        },

        onError: (err, newData, context: any) => {
            queryClient.setQueryData(
                [...queryKey, context?.newData.id],
                context?.previousData
            )
        },

        onSettled: (newData: any) => {
            queryClient.invalidateQueries({
                queryKey: [...queryKey, newData?.id],
            })
        },
    })

    return {
        mutation,
        isLoading: mutation.isLoading,
    }
}

export default useReusableMutation
