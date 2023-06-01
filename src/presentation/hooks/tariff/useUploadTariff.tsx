import { useMutation } from '@tanstack/react-query'
import API from '../../../infrastructure/api'

const useUploadTariff = (): any => {
  const uploadTariff = async (params: any): Promise<any> => {
    const { type, modal, setProgress, formData, agent } = params
    const data = await API.uploadTariff(type, modal, setProgress, formData, agent)
    return data
  }

  return useMutation(async (params) => await uploadTariff(params))
}

export default useUploadTariff
