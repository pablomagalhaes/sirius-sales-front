import instance from '../instance'

const getContainerType = async (): Promise<any> => {
  try {
    const res = await instance.get('/sirius-master-data-api/container/type/')
    return res.data
  } catch (error) {
    console.error(error)
  }
}

const getCurrencies = async (): Promise<any> => {
  try {
    const res = await instance.get('/sirius-master-data-api/currencies/')
    return res.data
  } catch (error) {
    console.error(error)
  }
}

const getIncoterm = async (): Promise<any> => {
  try {
    const res = await instance.get('/sirius-master-data-api/incoterms/')
    return res.data
  } catch (error) {
    console.error(error)
  }
}

const getPackaging = async (): Promise<any> => {
  try {
    const res = await instance.get('/sirius-master-data-api/packaging/')
    return res.data
  } catch (error) {
    console.error(error)
  }
}

const getTransport = async (): Promise<any> => {
  try {
    const res = await instance.get('/sirius-master-data-api/transport/')
    return res.data
  } catch (error) {
    console.error(error)
  }
}

const getOriginDestination = async (): Promise<any> => {
  try {
    const res = await instance.get('/sirius-master-data-api/origins/destinations/resumo')
    return res.data
  } catch (error) {
    console.error(error)
  }
}

const getFrequency = async (): Promise<any> => {
  try {
    const res = await instance.get('/sirius-master-data-api/frequency')
    return res.data
  } catch (error) {
    console.error(error)
  }
}

const newProposal = {
  getContainerType,
  getCurrencies,
  getIncoterm,
  getPackaging,
  getTransport,
  getOriginDestination,
  getFrequency
}

export default newProposal
